import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';
import { downloadZip } from '../../utils/zip.js';

const MAX_MB = 25;
const NAMES = { 'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WebP' };
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const BASIC = ['image/jpeg', 'image/png', 'image/webp'];
const WIDE = [...BASIC, 'image/gif', 'image/bmp'];

const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);

async function sniff(file) {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const s = (a, z) => String.fromCharCode(...b.slice(a, z));
  if (b[0] === 0xff && b[1] === 0xd8) return 'JPEG';
  if (b[0] === 0x89 && s(1, 4) === 'PNG') return 'PNG';
  if (s(0, 4) === 'RIFF' && s(8, 12) === 'WEBP') return 'WebP';
  if (s(0, 3) === 'GIF') return 'GIF';
  if (s(0, 2) === 'BM') return 'BMP';
  return 'Unknown';
}

function outType(file, o, mode) {
  if (mode === 'convert' || mode === 'background') return o.fmt;
  if (o.fmt !== 'same') return o.fmt;
  return BASIC.includes(file.type) ? file.type : 'image/png';
}

function replaceEdgeBackground(ctx, width, height, color) {
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  const total = width * height;
  if (!total || !width || !height) return;

  // Find the dominant colour along the image border instead of treating
  // every corner as background (a corner can contain the person's clothes).
  const bins = new Map();
  const step = Math.max(1, Math.floor(Math.min(width, height) / 250));
  const addBorderSample = (index) => {
    const p = index * 4;
    if (data[p + 3] < 32) return;
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const key = `${r >> 5},${g >> 5},${b >> 5}`;
    const item = bins.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    item.count++;
    item.r += r;
    item.g += g;
    item.b += b;
    bins.set(key, item);
  };

  for (let x = 0; x < width; x += step) {
    addBorderSample(x);
    if (height > 1) addBorderSample((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += step) {
    addBorderSample(y * width);
    if (width > 1) addBorderSample(y * width + width - 1);
  }

  let sample = null;
  for (const item of bins.values()) {
    if (!sample || item.count > sample.count) sample = item;
  }

  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(
    color || '#ffffff'
  );
  const rgb = match
    ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
    : [255, 255, 255];

  // If the image has no opaque border pixels, only replace edge-connected
  // transparent pixels with the selected background colour.
  const background = sample
    ? [sample.r / sample.count, sample.g / sample.count, sample.b / sample.count]
    : null;

  const original = new Uint8ClampedArray(data);
  const visited = new Uint8Array(total);
  const stack = new Int32Array(total);
  let top = 0;

  // Tighter threshold reduces the chance of matching similarly coloured clothes.
  const tolerance = 26;
  const isBackgroundPixel = (index) => {
    const p = index * 4;
    if (original[p + 3] < 32) return true;
    if (!background) return false;

    const dr = original[p] - background[0];
    const dg = original[p + 1] - background[1];
    const db = original[p + 2] - background[2];
    return Math.max(Math.abs(dr), Math.abs(dg), Math.abs(db)) <= tolerance;
  };

  const push = (index) => {
    if (index < 0 || index >= total || visited[index]) return;
    if (!isBackgroundPixel(index)) return;
    visited[index] = 1;
    stack[top++] = index;
  };

  // Flood-fill only from the outer border. A shirt area inside the image
  // will not be selected just because its colour resembles the background.
  for (let x = 0; x < width; x++) {
    push(x);
    if (height > 1) push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    if (width > 1) push(y * width + width - 1);
  }

  while (top > 0) {
    const index = stack[--top];
    const p = index * 4;
    data[p] = rgb[0];
    data[p + 1] = rgb[1];
    data[p + 2] = rgb[2];
    data[p + 3] = 255;

    const x = index % width;
    if (x > 0) push(index - 1);
    if (x + 1 < width) push(index + 1);
    if (index >= width) push(index - width);
    if (index + width < total) push(index + width);
  }

  ctx.putImageData(image, 0, 0);
}

async function render(file, o, mode) {
  const bmp = await createImageBitmap(file);
  try {
    let w = bmp.width;
    let h = bmp.height;
    if (mode === 'resize') {
      if (o.unit === 'percent') { w = Math.max(1, Math.round(w * o.pct / 100)); h = Math.max(1, Math.round(h * o.pct / 100)); }
      else { w = Math.max(1, o.w || w); h = Math.max(1, o.h || h); }
    }
    if (w * h > 100e6) throw new Error('The result would be too large for your browser’s memory. Choose a smaller size.');
    const turn = mode === 'rotate' && o.rot % 180 !== 0;
    const cw = turn ? h : w;
    const ch = turn ? w : h;
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const ctx = c.getContext('2d');
    if (!ctx) throw new Error('Your browser could not create an image canvas. Try another browser.');
    const type = outType(file, o, mode);
    if (type === 'image/jpeg' && mode !== 'background') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cw, ch);
    }
    ctx.translate(cw / 2, ch / 2);
    if (mode === 'rotate') { ctx.rotate(o.rot * Math.PI / 180); ctx.scale(o.flipH ? -1 : 1, o.flipV ? -1 : 1); }
    ctx.drawImage(bmp, -w / 2, -h / 2, w, h);
    if (mode === 'background') {
      replaceEdgeBackground(ctx, cw, ch, o.bg);
    }
    const blob = await new Promise((r) => c.toBlob(r, type, o.q));
    if (!blob) throw new Error(`Your browser can’t create ${NAMES[type]} files. Try another output format.`);
    return { blob, w: cw, h: ch, type };
  } finally { bmp.close(); }
}

const defaults = (mode) => ({
  fmt: mode === 'convert' ? 'image/webp' : mode === 'background' ? 'image/png' : 'same',
  q: 0.75, unit: 'px', pct: 50, w: 0, h: 0, lock: true, rot: 0, flipH: false, flipV: false, bg: '#ffffff',
});

export default function ImageTool({ mode }) {
  const multi = mode === 'multi';
  const m = multi ? 'compress' : mode === 'quality' ? 'compress' : mode; // processing mode
  const [files, setFiles] = useState([]); // { id, file, url, w, h }
  const [results, setResults] = useState([]);
  const [info, setInfo] = useState([]);
  const [o, setO] = useState(defaults(m));
  const [busy, setBusy] = useState(false);
  const urls = useRef([]);
  const set = (patch) => setO((p) => ({ ...p, ...patch }));

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const addFiles = async (list) => {
    const next = [];
    for (const file of list) {
      try {
        const bmp = await createImageBitmap(file);
        const url = URL.createObjectURL(file);
        urls.current.push(url);
        next.push({ id: `${file.name}-${file.size}-${Math.random()}`, file, url, w: bmp.width, h: bmp.height });
        bmp.close();
      } catch { next.push({ id: file.name + Math.random(), file, bad: true }); }
    }
    let good = next.filter((n) => !n.bad);
    // In multi-file mode, enforce the limit and release previews for files not accepted.
    if (multi) {
      setFiles((prev) => {
        const room = Math.max(0, 20 - prev.length);
        const accepted = good.slice(0, room);
        const acceptedIds = new Set(accepted.map((f) => f.id));
        good.filter((f) => !acceptedIds.has(f.id)).forEach((f) => {
          URL.revokeObjectURL(f.url);
          urls.current = urls.current.filter((u) => u !== f.url);
        });
        return [...prev, ...accepted];
      });
      good = good.slice(0, Math.max(0, 20 - files.length));
    } else {
      setFiles(good);
    }
    if (m === 'resize' && good[0]) set({ w: good[0].w, h: good[0].h });
    if (mode === 'check') {
      setInfo(await Promise.all(good.map(async (g) => ({ id: g.id, real: await sniff(g.file) }))));
    }
    return next.filter((n) => n.bad).map((n) => n.file.name);
  };

  const [decodeErr, setDecodeErr] = useState('');
  const onFiles = async (list) => {
    const bad = await addFiles(list);
    setDecodeErr(bad.length ? `Couldn’t read ${bad.join(', ')}. The file may be damaged or not a real image.` : '');
  };

  useEffect(() => {
    if (!files.length || mode === 'check') {
      setResults((prev) => {
        prev.forEach((r) => r.url && URL.revokeObjectURL(r.url));
        return [];
      });
      setBusy(false);
      return undefined;
    }
    let dead = false;
    const t = setTimeout(async () => {
      setBusy(true);
      const next = [];
      for (const f of files) {
        try { const r = await render(f.file, o, m); next.push({ ...r, url: URL.createObjectURL(r.blob) }); }
        catch (e) { next.push({ error: e.message || 'Processing failed.' }); }
        if (dead) { next.forEach((n) => n.url && URL.revokeObjectURL(n.url)); return; }
      }
      setResults((prev) => { prev.forEach((r) => r.url && URL.revokeObjectURL(r.url)); return next; });
      setBusy(false);
    }, 300);
    return () => {
      dead = true;
      clearTimeout(t);
      setBusy(false);
    };
  }, [files, o, m, mode]);

  const reset = () => {
    urls.current.forEach((u) => URL.revokeObjectURL(u));
    urls.current = [];
    setResults((prev) => {
      prev.forEach((r) => r.url && URL.revokeObjectURL(r.url));
      return [];
    });
    setFiles([]);
    setInfo([]);
    setDecodeErr('');
    setBusy(false);
  };
  const lossy = (t) => t === 'image/jpeg' || t === 'image/webp';
  const first = files[0];
  const showQ = (m === 'compress' || m === 'convert') && (o.fmt === 'same' || lossy(o.fmt));
  const fileName = (f, r) => `${f.file.name.replace(/\.[^.]+$/, '')}-${mode}.${EXT[r.type]}`;

  return (
    <div className="img-tool">
      {!files.length ? (
        <>
          <DropZone accept={mode === 'convert' || mode === 'check' ? WIDE : BASIC} maxMB={MAX_MB} multiple={multi}
            onFiles={onFiles} />
          {decodeErr && <p role="alert" className="err">{decodeErr}</p>}
        </>
      ) : (
        <>
          <div className="controls">
            {(m === 'compress' || m === 'convert') && (
              <label>Output format
                <select value={o.fmt} onChange={(e) => set({ fmt: e.target.value })}>
                  {m === 'compress' && <option value="same">Keep original format</option>}
                  <option value="image/jpeg">JPG</option><option value="image/webp">WebP</option>
                  <option value="image/png">PNG (lossless)</option>
                </select>
              </label>
            )}
            {showQ && (
              <label>Quality: {Math.round(o.q * 100)}%
                <input type="range" min="0.1" max="1" step="0.05" value={o.q} onChange={(e) => set({ q: +e.target.value })} />
                {mode === 'quality' && (
                  <input type="number" min="10" max="100" value={Math.round(o.q * 100)} aria-label="Quality percent"
                    onChange={(e) => set({ q: Math.min(1, Math.max(0.1, (+e.target.value || 10) / 100)) })} />
                )}
              </label>
            )}
            {m === 'resize' && first && (
              <>
                <label>Unit
                  <select value={o.unit} onChange={(e) => set({ unit: e.target.value })}>
                    <option value="px">Pixels</option><option value="percent">Percentage</option>
                  </select>
                </label>
                {o.unit === 'percent' ? (
                  <label>Scale: {o.pct}%<input type="range" min="5" max="200" value={o.pct} onChange={(e) => set({ pct: +e.target.value })} /></label>
                ) : (
                  <>
                    <label>Width (px)<input type="number" min="1" value={o.w}
                      onChange={(e) => { const w = +e.target.value; set({ w, h: o.lock ? Math.round(w * first.h / first.w) : o.h }); }} /></label>
                    <label>Height (px)<input type="number" min="1" value={o.h}
                      onChange={(e) => { const h = +e.target.value; set({ h, w: o.lock ? Math.round(h * first.w / first.h) : o.w }); }} /></label>
                    <label className="inline"><input type="checkbox" checked={o.lock} onChange={(e) => set({ lock: e.target.checked })} />Keep proportions</label>
                  </>
                )}
              </>
            )}
            {m === 'rotate' && (
              <div className="btn-row">
                <button type="button" className="btn" onClick={() => set({ rot: (o.rot + 270) % 360 })}>Rotate left</button>
                <button type="button" className="btn" onClick={() => set({ rot: (o.rot + 90) % 360 })}>Rotate right</button>
                <button type="button" className="btn" aria-pressed={o.flipH} onClick={() => set({ flipH: !o.flipH })}>Flip horizontal</button>
                <button type="button" className="btn" aria-pressed={o.flipV} onClick={() => set({ flipV: !o.flipV })}>Flip vertical</button>
              </div>
            )}
            {m === 'background' && (
              <>
                <label>Background colour<input type="color" value={o.bg} onChange={(e) => set({ bg: e.target.value })} /></label>
                <label>Output format
                  <select value={o.fmt} onChange={(e) => set({ fmt: e.target.value })}>
                    <option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option>
                  </select>
                </label>
              </>
            )}
          </div>

          {busy && <p role="status" className="muted">Processing…</p>}

          <ul className="img-results">
            {files.map((f, i) => {
              const r = results[i];
              const saved = r && r.blob ? Math.round((1 - r.blob.size / f.file.size) * 100) : 0;
              return (
                <li key={f.id}>
                  <div className="pair">
                    <figure><img src={f.url} alt={`Original ${f.file.name}`} /><figcaption>Original</figcaption></figure>
                    {mode !== 'check' && r && r.url && <figure><img src={r.url} alt={`Result for ${f.file.name}`} /><figcaption>Result</figcaption></figure>}
                  </div>
                  <p className="small"><strong>{f.file.name}</strong></p>
                  <p className="small muted">
                    Original: {size(f.file.size)} · {f.w}×{f.h}px
                    {mode === 'check' && info.find((x) => x.id === f.id) && ` · real format: ${info.find((x) => x.id === f.id).real} (declared: ${f.file.type || 'none'})`}
                    {r && r.blob && ` → New: ${size(r.blob.size)} · ${r.w}×${r.h}px · ${NAMES[r.type]}`}
                  </p>
                  {r && r.blob && m === 'compress' && (
                    <p className={saved > 0 ? 'ok' : 'warn'}>
                      {saved > 0 ? `${saved}% smaller` : 'No saving for this file. Try WebP or JPG output, or a lower quality.'}
                    </p>
                  )}
                  {r && r.error && <p role="alert" className="err">{r.error}</p>}
                  {r && r.blob && <a className="btn btn-primary" href={r.url} download={fileName(f, r)}>Download {NAMES[r.type]}</a>}
                </li>
              );
            })}
          </ul>

          <div className="btn-row">
            {multi && results.length > 1 && results.every((r) => r.blob) && (
              <button type="button" className="btn btn-primary" onClick={() => downloadZip(files.map((f, i) => ({ name: fileName(f, results[i]), blob: results[i].blob })), 'compressed-images.zip')}>Download all (ZIP)</button>
            )}
            {multi && files.length < 20 && <DropZone accept={BASIC} maxMB={MAX_MB} multiple onFiles={onFiles} />}
            <button type="button" className="btn" onClick={reset}>Process another file</button>
          </div>
        </>
      )}
    </div>
  );
}

