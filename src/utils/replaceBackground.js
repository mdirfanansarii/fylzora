// Background replacement for the Image Background Color tool.
//
// Two methods, both run entirely in the browser (nothing is uploaded):
//
//   1. replaceByMask    - finds the person with a small on-device model
//      (MediaPipe selfie segmentation, files served from /mediapipe/), then
//      refines the rough mask against the real photo edges. Works on busy,
//      multi-colour backgrounds (walls, curtains, windows, trees ...).
//
//   2. replaceByColour  - colour matching. Learns the background colours from
//      the image corners and removes them where they connect to the border.
//      Best for product shots, logos and plain studio backgrounds.
//
// replaceBackground() runs the right one and returns a short note when it had
// to fall back, so the page can tell the user what happened.

export const DEFAULT_TOLERANCE = 28; // colour method sensitivity (5-70)
export const DEFAULT_EDGE = 0; // person method edge adjust (-10..10)

const MODEL_BASE = '/mediapipe/';

export function parseHex(hex) {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 255, 255];
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

// Colour distance (squared, "redmean" weighting), scaled so that a grey step of
// N levels is about N. Compare with tolerance * tolerance.
function dist2(r1, g1, b1, r2, g2, b2) {
  const rm = (r1 + r2) * 0.5;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return ((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db) / 9;
}

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

// Mean over a (2r+1) window, clamped at the borders. src/dst: Float32Array w*h.
function boxFilter(src, w, h, r, dst, tmp) {
  // horizontal
  for (let y = 0; y < h; y++) {
    const row = y * w;
    let sum = 0;
    const first = Math.min(r, w - 1);
    for (let x = 0; x <= first; x++) sum += src[row + x];
    for (let x = 0; x < w; x++) {
      const hi = Math.min(x + r, w - 1);
      const lo = Math.max(x - r, 0);
      tmp[row + x] = sum / (hi - lo + 1);
      if (x + r + 1 < w) sum += src[row + x + r + 1];
      if (x - r >= 0) sum -= src[row + x - r];
    }
  }
  // vertical (all columns at once for cache friendliness)
  const acc = new Float64Array(w);
  const firstY = Math.min(r, h - 1);
  for (let y = 0; y <= firstY; y++) for (let x = 0; x < w; x++) acc[x] += tmp[y * w + x];
  for (let y = 0; y < h; y++) {
    const hi = Math.min(y + r, h - 1);
    const lo = Math.max(y - r, 0);
    const inv = 1 / (hi - lo + 1);
    const o = y * w;
    for (let x = 0; x < w; x++) dst[o + x] = acc[x] * inv;
    if (y + r + 1 < h) {
      const a = (y + r + 1) * w;
      for (let x = 0; x < w; x++) acc[x] += tmp[a + x];
    }
    if (y - r >= 0) {
      const a = (y - r) * w;
      for (let x = 0; x < w; x++) acc[x] -= tmp[a + x];
    }
  }
}

// Area-average downscale of a multi-channel Float32 image.
function downscale(src, w, h, c, nw, nh) {
  const out = new Float32Array(nw * nh * c);
  const sx = w / nw;
  const sy = h / nh;
  for (let y = 0; y < nh; y++) {
    const y0 = Math.floor(y * sy);
    const y1 = Math.max(y0 + 1, Math.min(h, Math.ceil((y + 1) * sy)));
    for (let x = 0; x < nw; x++) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.max(x0 + 1, Math.min(w, Math.ceil((x + 1) * sx)));
      const n = (y1 - y0) * (x1 - x0);
      for (let k = 0; k < c; k++) {
        let s = 0;
        for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) s += src[(yy * w + xx) * c + k];
        out[(y * nw + x) * c + k] = s / n;
      }
    }
  }
  return out;
}

// Bilinear sample of a multi-channel Float32 image (pixel-centre aligned).
function sample(src, w, h, c, fx, fy, k) {
  const x = clamp(fx * w - 0.5, 0, w - 1);
  const y = clamp(fy * h - 0.5, 0, h - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, w - 1);
  const y1 = Math.min(y0 + 1, h - 1);
  const tx = x - x0;
  const ty = y - y0;
  const a = src[(y0 * w + x0) * c + k] * (1 - tx) + src[(y0 * w + x1) * c + k] * tx;
  const b = src[(y1 * w + x0) * c + k] * (1 - tx) + src[(y1 * w + x1) * c + k] * tx;
  return a * (1 - ty) + b * ty;
}

function resample(src, w, h, c, nw, nh) {
  if (w === nw && h === nh) return src;
  if (nw <= w && nh <= h) return downscale(src, w, h, c, nw, nh);
  const out = new Float32Array(nw * nh * c);
  for (let y = 0; y < nh; y++) {
    for (let x = 0; x < nw; x++) {
      for (let k = 0; k < c; k++) out[(y * nw + x) * c + k] = sample(src, w, h, c, (x + 0.5) / nw, (y + 0.5) / nh, k);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Method 1: person cut-out                                            */
/* ------------------------------------------------------------------ */

let segmenterPromise = null;
let segmenterQueue = Promise.resolve();
let pendingResult = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load the person-detection files.'));
    document.head.appendChild(s);
  });
}

function getSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      if (typeof window === 'undefined') throw new Error('Person detection needs a browser.');
      if (!window.SelfieSegmentation) await loadScript(`${MODEL_BASE}selfie_segmentation.js`);
      if (!window.SelfieSegmentation) throw new Error('Person detection could not start.');
      const seg = new window.SelfieSegmentation({ locateFile: (f) => `${MODEL_BASE}${f}` });
      seg.setOptions({ modelSelection: 0, selfieMode: false });
      seg.onResults((res) => {
        if (pendingResult) pendingResult.resolve(res);
      });
      await seg.initialize();
      return seg;
    })().catch((e) => {
      segmenterPromise = null; // allow a retry later
      throw e;
    });
  }
  return segmenterPromise;
}

// Returns { a: Uint8ClampedArray (person probability 0-255), w, h } or throws.
export async function segmentPerson(canvas) {
  const seg = await getSegmenter();
  const run = segmenterQueue.then(async () => {
    // The model works at 256px, so a small copy is enough (and much faster).
    const max = 512;
    const k = Math.min(1, max / Math.max(canvas.width, canvas.height));
    const sw = Math.max(1, Math.round(canvas.width * k));
    const sh = Math.max(1, Math.round(canvas.height * k));
    const small = document.createElement('canvas');
    small.width = sw;
    small.height = sh;
    small.getContext('2d').drawImage(canvas, 0, 0, sw, sh);

    const result = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pendingResult = null;
        reject(new Error('Person detection timed out.'));
      }, 60000);
      pendingResult = {
        resolve: (r) => {
          clearTimeout(timer);
          pendingResult = null;
          resolve(r);
        },
      };
      seg.send({ image: small }).catch((e) => {
        clearTimeout(timer);
        pendingResult = null;
        reject(e);
      });
    });

    const m = result.segmentationMask;
    const mw = m.width;
    const mh = m.height;
    const c = document.createElement('canvas');
    c.width = mw;
    c.height = mh;
    const cx = c.getContext('2d', { willReadFrequently: true });
    cx.drawImage(m, 0, 0);
    const px = cx.getImageData(0, 0, mw, mh).data;
    const a = new Uint8ClampedArray(mw * mh);
    for (let i = 0; i < a.length; i++) a[i] = px[i * 4 + 3];
    return { a, w: mw, h: mh };
  });
  segmenterQueue = run.catch(() => {});
  return run;
}

// Edge-aware refinement of a coarse mask against the photo (colour guided
// filter, fast version). guide: Float32 RGB 0-1, p: Float32 0-1.
function guidedFilter(guide, p, w, h, radius, eps) {
  const f = Math.max(1, Math.round(Math.max(w, h) / 480));
  const cw = Math.max(1, Math.ceil(w / f));
  const ch = Math.max(1, Math.ceil(h / f));
  const gI = f > 1 ? downscale(guide, w, h, 3, cw, ch) : guide;
  const gP = f > 1 ? downscale(p, w, h, 1, cw, ch) : p;
  const r = Math.max(1, Math.round(radius / f));
  const n = cw * ch;

  const tmp = new Float32Array(n);
  const ch1 = (arr, k) => {
    const o = new Float32Array(n);
    for (let i = 0; i < n; i++) o[i] = arr[i * 3 + k];
    return o;
  };
  const I = [ch1(gI, 0), ch1(gI, 1), ch1(gI, 2)];
  const box = (src) => {
    const o = new Float32Array(n);
    boxFilter(src, cw, ch, r, o, tmp);
    return o;
  };
  const mul = (a, b) => {
    const o = new Float32Array(n);
    for (let i = 0; i < n; i++) o[i] = a[i] * b[i];
    return o;
  };

  const mI = I.map(box);
  const mp = box(gP);
  const mIp = I.map((c) => box(mul(c, gP)));
  const vRR = box(mul(I[0], I[0]));
  const vRG = box(mul(I[0], I[1]));
  const vRB = box(mul(I[0], I[2]));
  const vGG = box(mul(I[1], I[1]));
  const vGB = box(mul(I[1], I[2]));
  const vBB = box(mul(I[2], I[2]));

  const a0 = new Float32Array(n);
  const a1 = new Float32Array(n);
  const a2 = new Float32Array(n);
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const m0 = mI[0][i], m1 = mI[1][i], m2 = mI[2][i];
    const c0 = mIp[0][i] - m0 * mp[i];
    const c1 = mIp[1][i] - m1 * mp[i];
    const c2 = mIp[2][i] - m2 * mp[i];
    const s00 = vRR[i] - m0 * m0 + eps;
    const s01 = vRG[i] - m0 * m1;
    const s02 = vRB[i] - m0 * m2;
    const s11 = vGG[i] - m1 * m1 + eps;
    const s12 = vGB[i] - m1 * m2;
    const s22 = vBB[i] - m2 * m2 + eps;
    const i00 = s11 * s22 - s12 * s12;
    const i01 = s02 * s12 - s01 * s22;
    const i02 = s01 * s12 - s02 * s11;
    const i11 = s00 * s22 - s02 * s02;
    const i12 = s02 * s01 - s00 * s12;
    const i22 = s00 * s11 - s01 * s01;
    const det = s00 * i00 + s01 * i01 + s02 * i02;
    const inv = det !== 0 ? 1 / det : 0;
    const x0 = (i00 * c0 + i01 * c1 + i02 * c2) * inv;
    const x1 = (i01 * c0 + i11 * c1 + i12 * c2) * inv;
    const x2 = (i02 * c0 + i12 * c1 + i22 * c2) * inv;
    a0[i] = x0;
    a1[i] = x1;
    a2[i] = x2;
    b[i] = mp[i] - x0 * m0 - x1 * m1 - x2 * m2;
  }
  const A0 = box(a0), A1 = box(a1), A2 = box(a2), B = box(b);

  const q = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const fx = (x + 0.5) / w;
      const fy = (y + 0.5) / h;
      const cx = clamp(fx * cw - 0.5, 0, cw - 1);
      const cy = clamp(fy * ch - 0.5, 0, ch - 1);
      const x0 = Math.floor(cx), y0 = Math.floor(cy);
      const x1 = Math.min(x0 + 1, cw - 1), y1 = Math.min(y0 + 1, ch - 1);
      const tx = cx - x0, ty = cy - y0;
      const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty;
      const i00 = y0 * cw + x0, i10 = y0 * cw + x1, i01 = y1 * cw + x0, i11 = y1 * cw + x1;
      const bi = (arr) => arr[i00] * w00 + arr[i10] * w10 + arr[i01] * w01 + arr[i11] * w11;
      const o = (y * w + x) * 3;
      q[y * w + x] = bi(A0) * guide[o] + bi(A1) * guide[o + 1] + bi(A2) * guide[o + 2] + bi(B);
    }
  }
  return q;
}

// Drops small stray blobs the model sometimes finds (posters, bags ...).
function keepMainPeople(p, w, h) {
  const n = w * h;
  const comp = new Int32Array(n).fill(-1);
  const stack = new Int32Array(n);
  const sizes = [];
  for (let s = 0; s < n; s++) {
    if (comp[s] !== -1 || p[s] <= 0.5) continue;
    const id = sizes.length;
    let top = 0;
    let count = 0;
    stack[top++] = s;
    comp[s] = id;
    while (top) {
      const i = stack[--top];
      count++;
      const x = i % w;
      if (x > 0 && comp[i - 1] === -1 && p[i - 1] > 0.5) { comp[i - 1] = id; stack[top++] = i - 1; }
      if (x + 1 < w && comp[i + 1] === -1 && p[i + 1] > 0.5) { comp[i + 1] = id; stack[top++] = i + 1; }
      if (i >= w && comp[i - w] === -1 && p[i - w] > 0.5) { comp[i - w] = id; stack[top++] = i - w; }
      if (i + w < n && comp[i + w] === -1 && p[i + w] > 0.5) { comp[i + w] = id; stack[top++] = i + w; }
    }
    sizes.push(count);
  }
  if (!sizes.length) return 0;
  const biggest = Math.max(...sizes);
  const minKeep = Math.max(biggest * 0.1, n * 0.002);
  let kept = 0;
  for (let i = 0; i < n; i++) {
    if (comp[i] === -1) continue;
    if (sizes[comp[i]] >= minKeep) kept++;
    else p[i] = 0;
  }
  return kept / n;
}


// Small details the model misses (a ribbon, a hair clip) and bits of wall it
// wrongly keeps. Both are decided from the photo's own colours, close to the
// person only, so clothes and skin are never swept away.
function tuneMask(p, guide, w, h) {
  const n = w * h;
  const maxDim = Math.max(w, h);
  const R = Math.max(4, Math.round(maxDim * 0.045)); // how far from the person to look
  const D = Math.max(3, Math.round(maxDim * 0.02)); // how deep into the person to trim

  // distance (in pixels, city-block) to the person, and into the person
  const out = new Int16Array(n).fill(32767);
  const inn = new Int16Array(n).fill(32767);
  let q = new Int32Array(n);
  let qi = 0;
  for (let i = 0; i < n; i++) if (p[i] > 0.5) { out[i] = 0; q[qi++] = i; }
  const bfs = (dist, limit, queue, count) => {
    let head = 0;
    while (head < count) {
      const i = queue[head++];
      const d = dist[i];
      if (d >= limit) continue;
      const x = i % w;
      const nb = [x > 0 ? i - 1 : -1, x + 1 < w ? i + 1 : -1, i >= w ? i - w : -1, i + w < n ? i + w : -1];
      for (const j of nb) if (j >= 0 && dist[j] > d + 1) { dist[j] = d + 1; queue[count++] = j; }
    }
  };
  // queue needs room to grow
  const qa = new Int32Array(n);
  let c = 0;
  for (let i = 0; i < n; i++) if (p[i] > 0.5) qa[c++] = i;
  bfs(out, R, qa, c);
  const qb = new Int32Array(n);
  c = 0;
  for (let i = 0; i < n; i++) if (p[i] <= 0.5) { inn[i] = 0; qb[c++] = i; }
  bfs(inn, D, qb, c);

  // palette of the background far from the person
  const bins = new Map();
  let total = 0;
  const step = Math.max(1, Math.floor(Math.sqrt(n / 30000)));
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = y * w + x;
      if (p[i] > 0.02 || out[i] <= R) continue;
      const r = guide[i * 3] * 255, g = guide[i * 3 + 1] * 255, b = guide[i * 3 + 2] * 255;
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      let it = bins.get(key);
      if (!it) { it = { n: 0, r: 0, g: 0, b: 0 }; bins.set(key, it); }
      it.n++; it.r += r; it.g += g; it.b += b; total++;
    }
  }
  if (total < 50) return;
  const pal = [...bins.values()].filter((b) => b.n >= total * 0.004).sort((a, b) => b.n - a.n).slice(0, 40)
    .map((b) => [b.r / b.n, b.g / b.n, b.b / b.n]);
  if (!pal.length) return;
  const nearest2 = (i) => {
    const r = guide[i * 3] * 255, g = guide[i * 3 + 1] * 255, b = guide[i * 3 + 2] * 255;
    let best = Infinity;
    for (const e of pal) { const d = dist2(r, g, b, e[0], e[1], e[2]); if (d < best) best = d; }
    return best;
  };

  // 0. hair: dark, colourless pixels touching the person (strands and curls the
  // model drops against a dark curtain). Skipped when the background itself is
  // dark and colourless, because then hair and background cannot be told apart.
  const isHair = (i) => {
    const r = guide[i * 3] * 255, g = guide[i * 3 + 1] * 255, b = guide[i * 3 + 2] * 255;
    const mx = Math.max(r, g, b);
    return mx <= 70 && mx - Math.min(r, g, b) <= 14;
  };
  let farTotal = 0;
  let farDark = 0;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = y * w + x;
      if (p[i] > 0.02 || out[i] <= R) continue;
      farTotal++;
      if (isHair(i)) farDark++;
    }
  }
  if (farTotal > 0 && farDark / farTotal < 0.15) {
    const Rh = Math.max(3, Math.round(maxDim * 0.022));
    const hd = new Int16Array(n).fill(32767);
    const hq = new Int32Array(n);
    let hc = 0;
    for (let i = 0; i < n; i++) if (p[i] > 0.5 && isHair(i)) { hd[i] = 0; hq[hc++] = i; }
    let head = 0;
    while (head < hc) {
      const i = hq[head++];
      const d = hd[i];
      if (d >= Rh) continue;
      const x = i % w;
      const nb = [x > 0 ? i - 1 : -1, x + 1 < w ? i + 1 : -1, i >= w ? i - w : -1, i + w < n ? i + w : -1];
      for (const j of nb) {
        if (j < 0 || hd[j] <= d + 1 || p[j] > 0.5 || !isHair(j)) continue;
        hd[j] = d + 1;
        hq[hc++] = j;
        p[j] = 1;
      }
    }
    // the person grew, so the distance map used below must follow
    out.fill(32767);
    let oc = 0;
    for (let i = 0; i < n; i++) if (p[i] > 0.5) { out[i] = 0; qa[oc++] = i; }
    bfs(out, R, qa, oc);
  }

  // 1. add: pixels beside the person that look like none of the background colours
  const Tadd2 = 34 * 34;
  const cand = new Uint8Array(n);
  for (let i = 0; i < n; i++) if (p[i] <= 0.5 && out[i] <= R && nearest2(i) > Tadd2) cand[i] = 1;
  const seen = new Uint8Array(n);
  const stack = new Int32Array(n);
  const rescued = new Uint8Array(n);
  const maxArea = Math.floor(n * 0.03);
  const list = [];
  for (let s = 0; s < n; s++) {
    if (!cand[s] || seen[s]) continue;
    list.length = 0;
    let top = 0;
    stack[top++] = s; seen[s] = 1;
    let touches = 0;
    while (top) {
      const i = stack[--top];
      list.push(i);
      if (out[i] <= 1) touches++;
      const x = i % w;
      if (x > 0 && cand[i - 1] && !seen[i - 1]) { seen[i - 1] = 1; stack[top++] = i - 1; }
      if (x + 1 < w && cand[i + 1] && !seen[i + 1]) { seen[i + 1] = 1; stack[top++] = i + 1; }
      if (i >= w && cand[i - w] && !seen[i - w]) { seen[i - w] = 1; stack[top++] = i - w; }
      if (i + w < n && cand[i + w] && !seen[i + w]) { seen[i + w] = 1; stack[top++] = i + w; }
    }
    if (touches >= 3 && list.length >= 3 && list.length <= maxArea) {
      for (const i of list) {
        rescued[i] = 1;
        p[i] = 1;
        // include the soft edge pixels around it too
        const x = i % w;
        if (x > 0 && p[i - 1] <= 0.5) p[i - 1] = Math.max(p[i - 1], 0.6);
        if (x + 1 < w && p[i + 1] <= 0.5) p[i + 1] = Math.max(p[i + 1], 0.6);
        if (i >= w && p[i - w] <= 0.5) p[i - w] = Math.max(p[i - w], 0.6);
        if (i + w < n && p[i + w] <= 0.5) p[i + w] = Math.max(p[i + w], 0.6);
      }
    }
  }

  // Close the small gap between a rescued detail (a ribbon) and the person, so
  // its darker half is kept too and it does not float.
  const g = Math.max(4, Math.round(maxDim * 0.016));
  const dr = new Int16Array(n).fill(32767);
  const rq = new Int32Array(n);
  let rc = 0;
  for (let i = 0; i < n; i++) if (rescued[i]) { dr[i] = 0; rq[rc++] = i; }
  if (rc) {
    bfs(dr, g, rq, rc);
    for (let i = 0; i < n; i++) {
      if (p[i] > 0.5 || dr[i] > g || out[i] > g) continue;
      if (dr[i] + out[i] <= g) { p[i] = 1; rescued[i] = 1; }
    }
  }

  // 2. trim: person pixels near the edge that are just the local background colour
  const bgw = new Float32Array(n);
  for (let i = 0; i < n; i++) bgw[i] = p[i] < 0.05 && out[i] > 2 ? 1 : 0;
  const tmp = new Float32Array(n);
  const wsum = new Float32Array(n);
  const rr = Math.max(3, Math.round(maxDim * 0.04));
  boxFilter(bgw, w, h, rr, wsum, tmp);
  const mean = new Float32Array(n * 3);
  const plane = new Float32Array(n);
  const res = new Float32Array(n);
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < n; i++) plane[i] = guide[i * 3 + k] * 255 * bgw[i];
    boxFilter(plane, w, h, rr, res, tmp);
    for (let i = 0; i < n; i++) mean[i * 3 + k] = wsum[i] > 0.05 ? res[i] / wsum[i] : -1;
  }
  const Ttrim2 = 22 * 22;
  for (let i = 0; i < n; i++) {
    if (p[i] <= 0.5 || inn[i] > D || mean[i * 3] < 0 || isHair(i) || rescued[i]) continue; // never trim dark hair or rescued details
    const d = dist2(guide[i * 3] * 255, guide[i * 3 + 1] * 255, guide[i * 3 + 2] * 255, mean[i * 3], mean[i * 3 + 1], mean[i * 3 + 2]);
    if (d <= Ttrim2) p[i] = 0;
  }
}

// mask: { a, w, h } from segmentPerson. Returns the share of the image that was
// kept as "person" (0-1); writes the new background into data.
export function replaceByMask(data, w, h, mask, { color = '#ffffff', edge = 0 } = {}) {
  const total = w * h;
  const bg = parseHex(color);

  // Work at no more than 1600px on the long side.
  const s = Math.min(1, 1600 / Math.max(w, h));
  const ww = Math.max(1, Math.round(w * s));
  const hh = Math.max(1, Math.round(h * s));
  const n = ww * hh;

  // Guide image (0-1 RGB) at working size.
  let guide;
  if (s === 1) {
    guide = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      guide[i * 3] = data[i * 4] / 255;
      guide[i * 3 + 1] = data[i * 4 + 1] / 255;
      guide[i * 3 + 2] = data[i * 4 + 2] / 255;
    }
  } else {
    const full = new Float32Array(total * 3);
    for (let i = 0; i < total; i++) {
      full[i * 3] = data[i * 4] / 255;
      full[i * 3 + 1] = data[i * 4 + 1] / 255;
      full[i * 3 + 2] = data[i * 4 + 2] / 255;
    }
    guide = downscale(full, w, h, 3, ww, hh);
  }

  // Coarse mask at working size.
  const m0 = new Float32Array(mask.w * mask.h);
  for (let i = 0; i < m0.length; i++) m0[i] = mask.a[i] / 255;
  const p = resample(m0, mask.w, mask.h, 1, ww, hh).slice();
  // The model is unsure about hair curls, ears and thin straps (values around
  // 0.2-0.5), so count those as person; the colour clean-up below removes any
  // background that comes along.
  const lift = 0.5;
  for (let i = 0; i < p.length; i++) p[i] = Math.min(1, p[i] / lift);
  const share = keepMainPeople(p, ww, hh);
  if (share < 0.01) return share; // no person found; caller falls back
  tuneMask(p, guide, ww, hh);

  // Snap the mask to the real edges of the photo.
  const radius = Math.max(2, Math.round(Math.max(ww, hh) * 0.012));
  const q = guidedFilter(guide, p, ww, hh, radius, 4e-4);

  // Soft threshold. "edge" widens (+) or tightens (-) the cut-out.
  const centre = 0.5 - 0.035 * clamp(edge, -10, 10);
  const half = 0.16;
  const alpha = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = clamp((q[i] - (centre - half)) / (2 * half), 0, 1);
    alpha[i] = t * t * (3 - 2 * t);
  }

  // Colour of the person near the edge (to remove old-background tint).
  const conf = new Float32Array(n);
  for (let i = 0; i < n; i++) conf[i] = alpha[i] >= 0.97 ? 1 : 0;
  const tmp = new Float32Array(n);
  const wsum = new Float32Array(n);
  const fr = Math.max(2, Math.round(radius * 0.8));
  boxFilter(conf, ww, hh, fr, wsum, tmp);
  const fg = new Float32Array(n * 3);
  const plane = new Float32Array(n);
  const out = new Float32Array(n);
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < n; i++) plane[i] = guide[i * 3 + k] * conf[i];
    boxFilter(plane, ww, hh, fr, out, tmp);
    for (let i = 0; i < n; i++) fg[i * 3 + k] = wsum[i] > 0.02 ? out[i] / wsum[i] : guide[i * 3 + k];
  }

  // Composite at full size.
  for (let y = 0; y < h; y++) {
    const wy = Math.min(hh - 1, Math.floor(((y + 0.5) / h) * hh));
    for (let x = 0; x < w; x++) {
      let a;
      let useFg = false;
      let wx = 0;
      if (s === 1) {
        a = alpha[y * ww + x];
      } else {
        a = sample(alpha, ww, hh, 1, (x + 0.5) / w, (y + 0.5) / h, 0);
      }
      const p4 = (y * w + x) * 4;
      if (a >= 0.999) { data[p4 + 3] = 255; continue; }
      let r;
      let g;
      let b;
      if (a > 0.001) {
        // Edge pixel: use the cleaned-up person colour instead of the mixed colour.
        wx = Math.min(ww - 1, Math.floor(((x + 0.5) / w) * ww));
        const gi = (wy * ww + wx) * 3;
        r = fg[gi] * 255;
        g = fg[gi + 1] * 255;
        b = fg[gi + 2] * 255;
        useFg = true;
      }
      if (!useFg) {
        data[p4] = bg[0]; data[p4 + 1] = bg[1]; data[p4 + 2] = bg[2]; data[p4 + 3] = 255;
        continue;
      }
      const oa = data[p4 + 3] / 255;
      const A = a * oa;
      data[p4] = r * A + bg[0] * (1 - A);
      data[p4 + 1] = g * A + bg[1] * (1 - A);
      data[p4 + 2] = b * A + bg[2] * (1 - A);
      data[p4 + 3] = 255;
    }
  }
  return share;
}

/* ------------------------------------------------------------------ */
/* Method 2: colour matching                                           */
/* ------------------------------------------------------------------ */

export function replaceByColour(data, w, h, { color = '#ffffff', tolerance = DEFAULT_TOLERANCE, picks = [] } = {}) {
  const total = w * h;
  if (!total) return 0;
  const bg = parseHex(color);
  const T = clamp(tolerance, 3, 90);
  const T2 = T * T;
  const G2 = Math.pow(clamp(T * 0.22, 3, 9), 2); // allowed step between neighbours
  const CAP2 = Math.pow(T * 1.5, 2); // how far a gradient may drift from its colour
  const src = new Uint8ClampedArray(data);
  const label = new Uint8Array(total); // 0 keep, 1..200 palette entry, 255 transparent
  const stack = new Int32Array(total);
  const pal = []; // [r,g,b]

  for (let i = 0; i < total; i++) if (src[i * 4 + 3] < 32) label[i] = 255;

  // ---- palette from the corner zones -------------------------------
  const zone = Math.max(3, Math.round(Math.min(w, h) * 0.08));
  const depth = Math.min(2, Math.max(1, Math.min(w, h) >> 1));
  const bins = new Map();
  let samples = 0;
  const addSample = (x, y) => {
    const p = (y * w + x) * 4;
    if (src[p + 3] < 32) return;
    const key = ((src[p] >> 3) << 10) | ((src[p + 1] >> 3) << 5) | (src[p + 2] >> 3);
    let it = bins.get(key);
    if (!it) { it = { n: 0, r: 0, g: 0, b: 0 }; bins.set(key, it); }
    it.n++; it.r += src[p]; it.g += src[p + 1]; it.b += src[p + 2];
    samples++;
  };
  for (const [cx, cy] of [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]]) {
    for (let t = 0; t < Math.min(zone, Math.max(w, h)); t++) {
      for (let d = 0; d < depth; d++) {
        const sx = cx === 0 ? t : w - 1 - t;
        const sy = cy === 0 ? d : h - 1 - d;
        if (sx >= 0 && sx < w && sy >= 0 && sy < h) addSample(sx, sy);
        const ux = cx === 0 ? d : w - 1 - d;
        const uy = cy === 0 ? t : h - 1 - t;
        if (ux >= 0 && ux < w && uy >= 0 && uy < h) addSample(ux, uy);
      }
    }
  }
  const sorted = [...bins.values()].sort((a, b) => b.n - a.n);
  const minCount = Math.max(2, samples * 0.04);
  for (const it of sorted) {
    if (it.n < minCount || pal.length >= 8) break;
    const c = [it.r / it.n, it.g / it.n, it.b / it.n];
    let near = false;
    for (const e of pal) if (dist2(c[0], c[1], c[2], e[0], e[1], e[2]) < (T * 0.5) * (T * 0.5)) { near = true; break; }
    if (!near) pal.push(c);
  }

  let top = 0;
  const seedFrom = (x, y) => {
    const i = y * w + x;
    if (label[i]) return;
    const p = i * 4;
    let best = -1;
    let bd = T2;
    for (let k = 0; k < pal.length; k++) {
      const e = pal[k];
      const d = dist2(src[p], src[p + 1], src[p + 2], e[0], e[1], e[2]);
      if (d <= bd) { bd = d; best = k; }
    }
    if (best >= 0) { label[i] = best + 1; stack[top++] = i; }
  };

  // ---- extra colours the user clicked on ---------------------------
  const pickSeeds = [];
  for (const pk of picks || []) {
    const px = clamp(Math.round(pk.x * (w - 1)), 0, w - 1);
    const py = clamp(Math.round(pk.y * (h - 1)), 0, h - 1);
    let r = 0, g = 0, b = 0, c = 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const x = clamp(px + dx, 0, w - 1);
        const y = clamp(py + dy, 0, h - 1);
        const p = (y * w + x) * 4;
        if (src[p + 3] < 32) continue;
        r += src[p]; g += src[p + 1]; b += src[p + 2]; c++;
      }
    }
    if (!c || pal.length >= 200) continue;
    pal.push([r / c, g / c, b / c]);
    pickSeeds.push([px, py, pal.length]);
  }

  // ---- grow ---------------------------------------------------------
  const grow = () => {
    while (top > 0) {
      const i = stack[--top];
      const k = label[i];
      const e = pal[k - 1];
      const p = i * 4;
      const pr = src[p], pg = src[p + 1], pb = src[p + 2];
      const x = i - ((i / w) | 0) * w;
      for (let dir = 0; dir < 4; dir++) {
        let q;
        if (dir === 0) { if (x === 0) continue; q = i - 1; }
        else if (dir === 1) { if (x + 1 >= w) continue; q = i + 1; }
        else if (dir === 2) { if (i < w) continue; q = i - w; }
        else { if (i + w >= total) continue; q = i + w; }
        if (label[q]) continue;
        const qp = q * 4;
        const qr = src[qp], qg = src[qp + 1], qb = src[qp + 2];
        const d = dist2(qr, qg, qb, e[0], e[1], e[2]);
        if (d <= T2 || (d <= CAP2 && dist2(qr, qg, qb, pr, pg, pb) <= G2)) {
          label[q] = k;
          stack[top++] = q;
        }
      }
    }
  };

  for (const [x, y, id] of pickSeeds) {
    if (!label[y * w + x]) { label[y * w + x] = id; stack[top++] = y * w + x; }
  }
  for (let x = 0; x < w; x++) { seedFrom(x, 0); seedFrom(x, h - 1); }
  for (let y = 0; y < h; y++) { seedFrom(0, y); seedFrom(w - 1, y); }
  grow();

  // ---- border colours that are not in the corners (a stripe, a frame) ----
  // They are only accepted when the area they cover is small and stays away
  // from the middle of the picture, so clothes and skin are never removed.
  const ring = [];
  for (let x = 0; x < w; x++) ring.push(x);
  for (let y = 1; y < h; y++) ring.push(y * w + w - 1);
  for (let x = w - 2; x >= 0 && h > 1; x--) ring.push((h - 1) * w + x);
  for (let y = h - 2; y >= 1 && w > 1; y--) ring.push(y * w);
  const runs = [];
  let cur = null;
  for (const i of ring) {
    if (label[i]) { cur = null; continue; }
    const p = i * 4;
    if (cur) {
      const l = cur.last * 4;
      if (dist2(src[p], src[p + 1], src[p + 2], src[l], src[l + 1], src[l + 2]) <= (T * 0.5) * (T * 0.5)) {
        cur.px.push(i); cur.last = i; continue;
      }
    }
    cur = { px: [i], last: i };
    runs.push(cur);
  }
  runs.sort((a, b) => b.px.length - a.px.length);
  const bx0 = Math.floor(w * 0.2), bx1 = Math.ceil(w * 0.8);
  const by0 = Math.floor(h * 0.2), by1 = Math.ceil(h * 0.8);
  const boxArea = Math.max(1, (bx1 - bx0) * (by1 - by0));
  const limit = Math.floor(total * 0.06);
  for (const run of runs.slice(0, 8)) {
    if (run.px.length < 3 || pal.length >= 200) continue;
    let r = 0, g = 0, b = 0;
    for (const i of run.px) { r += src[i * 4]; g += src[i * 4 + 1]; b += src[i * 4 + 2]; }
    pal.push([r / run.px.length, g / run.px.length, b / run.px.length]);
    const id = pal.length;
    const visited = [];
    top = 0;
    for (const i of run.px) { label[i] = id; stack[top++] = i; visited.push(i); }
    let aborted = false;
    // grow with bookkeeping so it can be undone
    while (top > 0 && !aborted) {
      const i = stack[--top];
      const e = pal[id - 1];
      const p = i * 4;
      const x = i - ((i / w) | 0) * w;
      for (let dir = 0; dir < 4; dir++) {
        let q;
        if (dir === 0) { if (x === 0) continue; q = i - 1; }
        else if (dir === 1) { if (x + 1 >= w) continue; q = i + 1; }
        else if (dir === 2) { if (i < w) continue; q = i - w; }
        else { if (i + w >= total) continue; q = i + w; }
        if (label[q]) continue;
        const qp = q * 4;
        const d = dist2(src[qp], src[qp + 1], src[qp + 2], e[0], e[1], e[2]);
        if (d <= T2 || (d <= CAP2 && dist2(src[qp], src[qp + 1], src[qp + 2], src[p], src[p + 1], src[p + 2]) <= G2)) {
          label[q] = id;
          stack[top++] = q;
          visited.push(q);
          if (visited.length > limit) { aborted = true; break; }
        }
      }
    }
    let inside = 0;
    if (!aborted) {
      for (const i of visited) {
        const y = (i / w) | 0;
        const x = i - y * w;
        if (x >= bx0 && x < bx1 && y >= by0 && y < by1) inside++;
      }
    }
    if (aborted || inside > boxArea * 0.02) {
      for (const i of visited) label[i] = 0;
      pal.pop();
    }
    top = 0;
  }

  // ---- clean-up ---------------------------------------------------------
  // 1. tiny unmatched specks completely inside the background
  const seen = new Uint8Array(total);
  const speck = Math.max(12, Math.floor(total * 0.0004));
  const list = [];
  for (let s = 0; s < total; s++) {
    if (label[s] || seen[s]) continue;
    list.length = 0;
    let t2 = 0;
    stack[t2++] = s; seen[s] = 1;
    let tooBig = false;
    while (t2 > 0) {
      const i = stack[--t2];
      if (!tooBig) { list.push(i); if (list.length > speck) tooBig = true; }
      const x = i - ((i / w) | 0) * w;
      if (x > 0 && !label[i - 1] && !seen[i - 1]) { seen[i - 1] = 1; stack[t2++] = i - 1; }
      if (x + 1 < w && !label[i + 1] && !seen[i + 1]) { seen[i + 1] = 1; stack[t2++] = i + 1; }
      if (i >= w && !label[i - w] && !seen[i - w]) { seen[i - w] = 1; stack[t2++] = i - w; }
      if (i + w < total && !label[i + w] && !seen[i + w]) { seen[i + w] = 1; stack[t2++] = i + w; }
    }
    if (!tooBig) for (const i of list) label[i] = 254;
  }

  // 2. the thin line where two background colours meet
  const near = new Uint8Array(total);
  for (let i = 0; i < total; i++) near[i] = label[i] ? 1 : 0;
  const nearX = new Uint8Array(total);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let dx = -2; dx <= 2 && !v; dx++) { const xx = x + dx; if (xx >= 0 && xx < w && near[y * w + xx]) v = 1; }
      nearX[y * w + x] = v;
    }
  }
  const near2 = new Uint8Array(total); // labelled pixel within 2px
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let dy = -2; dy <= 2 && !v; dy++) { const yy = y + dy; if (yy >= 0 && yy < h && nearX[yy * w + x]) v = 1; }
      near2[y * w + x] = v;
    }
  }
  const fill = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (label[i] || !near2[i]) continue;
      let first = 0;
      let two = false;
      for (let dy = -2; dy <= 2 && !two; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -2; dx <= 2; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w) continue;
          const l = label[yy * w + xx];
          if (!l || l >= 250) continue;
          if (!first) first = l;
          else if (l !== first) { two = true; break; }
        }
      }
      if (two) fill.push(i);
    }
  }
  for (const i of fill) label[i] = 253;

  // 3. soften the edge of what is kept (removes old-background tint)
  const isBg = (i) => label[i] !== 0;
  const band = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (isBg(i)) continue;
      let c = false;
      for (let dy = -1; dy <= 1 && !c; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx >= 0 && xx < w && isBg(yy * w + xx)) { c = true; break; }
        }
      }
      if (c) band.push(i);
    }
  }
  // "deep" subject pixels: not within 2px of the background
  const edits = new Map();
  for (const i of band) {
    const y = (i / w) | 0;
    const x = i - y * w;
    let br = 0, bgc = 0, bb = 0, bn = 0;
    for (let dy = -2; dy <= 2; dy++) {
      const yy = y + dy;
      if (yy < 0 || yy >= h) continue;
      for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx;
        if (xx < 0 || xx >= w) continue;
        const j = yy * w + xx;
        if (!isBg(j) || label[j] === 255) continue;
        br += src[j * 4]; bgc += src[j * 4 + 1]; bb += src[j * 4 + 2]; bn++;
      }
    }
    if (!bn) continue;
    br /= bn; bgc /= bn; bb /= bn;
    let sr = 0, sg = 0, sb = 0, sn = 0;
    for (let dy = -4; dy <= 4; dy++) {
      const yy = y + dy;
      if (yy < 0 || yy >= h) continue;
      for (let dx = -4; dx <= 4; dx++) {
        const xx = x + dx;
        if (xx < 0 || xx >= w) continue;
        const j = yy * w + xx;
        if (isBg(j) || near2[j]) continue;
        sr += src[j * 4]; sg += src[j * 4 + 1]; sb += src[j * 4 + 2]; sn++;
      }
    }
    if (!sn) continue;
    sr /= sn; sg /= sn; sb /= sn;
    const vr = sr - br, vg = sg - bgc, vb = sb - bb;
    const len2 = vr * vr + vg * vg + vb * vb;
    if (len2 < 144) continue; // subject and background look alike here
    const p = i * 4;
    const a = clamp(((src[p] - br) * vr + (src[p + 1] - bgc) * vg + (src[p + 2] - bb) * vb) / len2, 0, 1);
    if (a >= 0.98) continue;
    edits.set(i, [a, br, bgc, bb]);
  }

  // ---- write the result ----------------------------------------------
  let removed = 0;
  for (let i = 0; i < total; i++) {
    const p = i * 4;
    if (label[i]) {
      data[p] = bg[0]; data[p + 1] = bg[1]; data[p + 2] = bg[2]; data[p + 3] = 255;
      removed++;
    } else {
      const al = src[p + 3] / 255;
      if (al < 1) {
        data[p] = src[p] * al + bg[0] * (1 - al);
        data[p + 1] = src[p + 1] * al + bg[1] * (1 - al);
        data[p + 2] = src[p + 2] * al + bg[2] * (1 - al);
        data[p + 3] = 255;
      }
    }
  }
  for (const [i, e] of edits) {
    // The pixel is a mix of the person and the old background. Keep the person
    // part and swap only the old-background part for the new colour:
    //   out = pixel + (1 - alpha) * (new background - old background)
    const p = i * 4;
    const k = 1 - e[0];
    data[p] = clamp(src[p] + k * (bg[0] - e[1]), 0, 255);
    data[p + 1] = clamp(src[p + 1] + k * (bg[1] - e[2]), 0, 255);
    data[p + 2] = clamp(src[p + 2] + k * (bg[2] - e[3]), 0, 255);
  }
  return removed / total;
}

/* ------------------------------------------------------------------ */
/* Entry point used by the tool                                        */
/* ------------------------------------------------------------------ */

// canvas must already contain the picture. method: 'person' | 'colour'.
// Returns { method, note } - method is what was really used.
const maskCache = new WeakMap();

export async function replaceBackground(canvas, { key, method = 'person', color, tolerance, edge, picks } = {}) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const w = canvas.width;
  const h = canvas.height;
  let note = '';

  if (method === 'person') {
    try {
      let pending = key && typeof key === 'object' ? maskCache.get(key) : null;
      if (!pending) {
        pending = segmentPerson(canvas);
        if (key && typeof key === 'object') maskCache.set(key, pending);
        pending.catch(() => key && maskCache.delete(key));
      }
      const mask = await pending;
      const img = ctx.getImageData(0, 0, w, h);
      const share = replaceByMask(img.data, w, h, mask, { color, edge });
      if (share >= 0.01) {
        ctx.putImageData(img, 0, 0);
        return { method: 'person', note };
      }
      note = 'No person was found in this picture, so colour matching was used instead.';
    } catch (e) {
      note = 'Person detection could not start in this browser, so colour matching was used instead.';
    }
  }

  const img = ctx.getImageData(0, 0, w, h);
  replaceByColour(img.data, w, h, { color, tolerance, picks });
  ctx.putImageData(img, 0, 0);
  return { method: 'colour', note };
}
