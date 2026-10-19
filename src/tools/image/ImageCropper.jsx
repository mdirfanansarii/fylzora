import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';

const BASIC = ['image/jpeg', 'image/png', 'image/webp'];
const NAMES = { 'image/jpeg': 'JPG', 'image/png': 'PNG', 'image/webp': 'WebP' };
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const RATIOS = { free: 0, '1:1': 1, '4:3': 4 / 3, '3:2': 3 / 2, '16:9': 16 / 9, '9:16': 9 / 16 };
const MIN = 16;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);

export default function ImageCropper() {
  const [img, setImg] = useState(null); // { file, url, w, h }
  const [crop, setCrop] = useState(null);
  const [ratio, setRatio] = useState('free');
  const [fmt, setFmt] = useState('same');
  const [q, setQ] = useState(0.9);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const imgEl = useRef(null);
  const drag = useRef(null);
  const urls = useRef([]);
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const onFiles = async ([file]) => {
    setErr(''); setRes(null);
    try {
      const bmp = await createImageBitmap(file);
      const url = URL.createObjectURL(file); urls.current.push(url);
      setImg({ file, url, w: bmp.width, h: bmp.height });
      setCrop({ x: Math.round(bmp.width * 0.1), y: Math.round(bmp.height * 0.1), w: Math.round(bmp.width * 0.8), h: Math.round(bmp.height * 0.8) });
      setRatio('free'); bmp.close();
    } catch { setErr('We couldn’t read this image. The file may be damaged.'); }
  };

  const fit = (r, c = crop) => { // largest box of ratio r inside the current box, centred
    if (!r) return c;
    let w = c.w; let h = w / r;
    if (h > c.h) { h = c.h; w = h * r; }
    return { x: Math.round(c.x + (c.w - w) / 2), y: Math.round(c.y + (c.h - h) / 2), w: Math.round(w), h: Math.round(h) };
  };
  const pickRatio = (k) => { setRatio(k); setRes(null); if (RATIOS[k]) setCrop((c) => fit(RATIOS[k], c)); };
  const setField = (key, v) => {
    setRes(null);
    setCrop((c) => {
      const n = { ...c, [key]: Math.round(+v || 0) };
      n.w = clamp(n.w, MIN, img.w); n.h = clamp(n.h, MIN, img.h);
      if (RATIOS[ratio] && key === 'w') n.h = Math.round(n.w / RATIOS[ratio]);
      if (RATIOS[ratio] && key === 'h') n.w = Math.round(n.h * RATIOS[ratio]);
      n.w = clamp(n.w, MIN, img.w); n.h = clamp(n.h, MIN, img.h);
      n.x = clamp(n.x, 0, img.w - n.w); n.y = clamp(n.y, 0, img.h - n.h);
      return n;
    });
  };

  const down = (e, mode) => {
    e.preventDefault(); e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { mode, sx: e.clientX, sy: e.clientY, s: { ...crop }, k: img.w / imgEl.current.clientWidth };
  };
  const move = (e) => {
    const d = drag.current; if (!d) return;
    const dx = (e.clientX - d.sx) * d.k; const dy = (e.clientY - d.sy) * d.k;
    let { x, y, w, h } = d.s;
    if (d.mode === 'move') { x = clamp(x + dx, 0, img.w - w); y = clamp(y + dy, 0, img.h - h); }
    else {
      let x2 = x + w; let y2 = y + h;
      if (d.mode.includes('w')) x = clamp(x + dx, 0, x2 - MIN); else x2 = clamp(x2 + dx, x + MIN, img.w);
      if (d.mode.includes('n')) y = clamp(y + dy, 0, y2 - MIN); else y2 = clamp(y2 + dy, y + MIN, img.h);
      w = x2 - x; h = y2 - y;
      const r = RATIOS[ratio];
      if (r) {
        h = w / r;
        const hMax = d.mode.includes('n') ? d.s.y + d.s.h : img.h - y;
        if (h > hMax) { h = hMax; w = h * r; }
        if (d.mode.includes('w')) x = d.s.x + d.s.w - w;
        if (d.mode.includes('n')) y = d.s.y + d.s.h - h;
      }
    }
    setRes(null);
    setCrop({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) });
  };
  const up = () => { drag.current = null; };

  const run = async () => {
    setErr('');
    try {
      const bmp = await createImageBitmap(img.file);
      const type = fmt === 'same' ? (BASIC.includes(img.file.type) ? img.file.type : 'image/png') : fmt;
      const c = document.createElement('canvas');
      c.width = crop.w; c.height = crop.h;
      const ctx = c.getContext('2d');
      if (type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
      ctx.drawImage(bmp, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h); bmp.close();
      const blob = await new Promise((r) => c.toBlob(r, type, q));
      if (!blob) throw new Error('encode');
      const url = URL.createObjectURL(blob); urls.current.push(url);
      setRes({ blob, url, type });
    } catch { setErr('Your browser couldn’t create the cropped image. Try another output format.'); }
  };

  const pct = (v, t) => `${(v / t) * 100}%`;
  const handles = ['nw', 'ne', 'sw', 'se'];

  if (!img) return (
    <div className="img-tool">
      <DropZone accept={BASIC} maxMB={25} onFiles={onFiles} />
      {err && <p role="alert" className="err">{err}</p>}
    </div>
  );

  return (
    <div className="img-tool">
      <div className="controls">
        <label>Shape
          <select value={ratio} onChange={(e) => pickRatio(e.target.value)}>
            {Object.keys(RATIOS).map((k) => <option key={k} value={k}>{k === 'free' ? 'Free' : k}</option>)}
          </select></label>
        <label>Output format
          <select value={fmt} onChange={(e) => { setFmt(e.target.value); setRes(null); }}>
            <option value="same">Same as original</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option>
          </select></label>
        {fmt !== 'image/png' && <label>Quality: {Math.round(q * 100)}%<input type="range" min="0.3" max="1" step="0.05" value={q} onChange={(e) => { setQ(+e.target.value); setRes(null); }} /></label>}
      </div>
      <p className="small muted">Drag the box to move it, drag a corner to resize it, or type exact numbers below.</p>

      <div className="crop-stage">
        <div className="crop-wrap" onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <img ref={imgEl} src={img.url} alt={`Preview of ${img.file.name} with the crop area`} draggable={false} />
          <div className="crop-box" style={{ left: pct(crop.x, img.w), top: pct(crop.y, img.h), width: pct(crop.w, img.w), height: pct(crop.h, img.h) }}
            onPointerDown={(e) => down(e, 'move')}>
            {handles.map((h) => <span key={h} className={`crop-h crop-${h}`} onPointerDown={(e) => down(e, h)} />)}
          </div>
        </div>
      </div>

      <div className="controls">
        {[['x', 'Left (px)'], ['y', 'Top (px)'], ['w', 'Width (px)'], ['h', 'Height (px)']].map(([k, l]) => (
          <label key={k}>{l}<input type="number" min="0" value={crop[k]} onChange={(e) => setField(k, e.target.value)} /></label>))}
      </div>
      <p className="small muted">Original: {img.w}×{img.h}px · {size(img.file.size)} · Crop: {crop.w}×{crop.h}px</p>

      {err && <p role="alert" className="err">{err}</p>}
      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={run}>Crop image</button>
        <button type="button" className="btn" onClick={() => { setImg(null); setRes(null); }}>Process another file</button>
      </div>
      {res && (
        <ul className="img-results"><li>
          <div className="pair"><figure><img src={res.url} alt="Cropped result" /><figcaption>Result</figcaption></figure></div>
          <p className="small muted">{crop.w}×{crop.h}px · {NAMES[res.type]} · {size(res.blob.size)}</p>
          <a className="btn btn-primary" href={res.url} download={`${img.file.name.replace(/\.[^.]+$/, '')}-cropped.${EXT[res.type]}`}>Download {NAMES[res.type]}</a>
        </li></ul>
      )}
    </div>
  );
}
