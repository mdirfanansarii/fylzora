import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';
import { downloadZip } from '../../utils/zip.js';

const PDF = ['application/pdf'];
const IMG = ['image/jpeg', 'image/png', 'image/webp'];
const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);
const MAX_RENDER_PAGES = 60;

const LABEL = { merge: 'Merge PDFs', split: 'Split PDF', extract: 'Extract pages', organize: 'Apply changes',
  numbers: 'Add page numbers', watermark: 'Add watermark', img2pdf: 'Create PDF', pdf2img: 'Convert to images' };

function parseRanges(text, total) {
  const groups = text.split(',').map((s) => s.trim()).filter(Boolean);
  if (!groups.length) throw new Error('Enter the pages you want, for example 1-3, 5, 8-10.');
  return groups.map((g) => {
    const m = g.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error(`“${g}” isn’t a valid page range. Use a format like 1-3, 5, 8-10.`);
    const a = +m[1];
    const b = +(m[2] || m[1]);
    if (a < 1 || b > total || a > b) throw new Error(`Pages must be between 1 and ${total}. “${g}” is out of range.`);
    return Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i);
  });
}

async function toPngBytes(file) {
  const bmp = await createImageBitmap(file);
  const c = document.createElement('canvas');
  c.width = bmp.width; c.height = bmp.height;
  c.getContext('2d').drawImage(bmp, 0, 0);
  bmp.close();
  const blob = await new Promise((r) => c.toBlob(r, 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

export default function PdfTool({ mode }) {
  const multi = mode === 'merge' || mode === 'img2pdf';
  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState(null);
  const [pages, setPages] = useState([]);
  const [out, setOut] = useState([]);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [o, setO] = useState({ ranges: '', pos: 'bc', start: 1, total: false, text: 'CONFIDENTIAL', fs: 48, op: 0.25, fmt: 'image/jpeg', scale: 2 });
  const urls = useRef([]);
  const set = (p) => setO((x) => ({ ...x, ...p }));

  const clearOut = () => { urls.current.forEach((u) => URL.revokeObjectURL(u)); urls.current = []; setOut([]); };
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);
  const addOut = (blob, name) => { const url = URL.createObjectURL(blob); urls.current.push(url); return { blob, name, url }; };

  const onFiles = async (list) => {
    setErr(''); clearOut();
    if (multi) { setFiles((p) => [...p, ...list.map((f) => ({ id: `${f.name}-${Math.random()}`, file: f }))].slice(0, 30)); return; }
    const file = list[0];
    setFiles([{ id: file.name, file }]);
    if (mode === 'pdf2img') { setInfo({}); return; }
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer(), mode === 'meta' ? { ignoreEncryption: true } : undefined);
      const n = doc.getPageCount();
      const { width, height } = doc.getPage(0).getSize();
      const d = (x) => (x ? x.toLocaleString() : '—');
      setInfo({ n, meta: [['Title', doc.getTitle() || '—'], ['Author', doc.getAuthor() || '—'], ['Subject', doc.getSubject() || '—'],
        ['Keywords', doc.getKeywords() || '—'], ['Creator', doc.getCreator() || '—'], ['Producer', doc.getProducer() || '—'],
        ['Created', d(doc.getCreationDate())], ['Modified', d(doc.getModificationDate())], ['Pages', n],
        ['First page size', `${Math.round(width)} × ${Math.round(height)} pt`], ['File size', size(file.size)],
        ['Encrypted', doc.isEncrypted ? 'Yes' : 'No']] });
      setPages(Array.from({ length: n }, (_, i) => ({ i, rot: 0, del: false })));
    } catch {
      setErr('We couldn’t open this PDF. It may be password-protected or damaged.');
      setFiles([]);
    }
  };

  const reset = () => { clearOut(); setFiles([]); setInfo(null); setPages([]); setErr(''); };
  const move = (i, d) => setFiles((f) => { const n = [...f]; const j = i + d; if (j < 0 || j >= n.length) return f; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const base = files[0] ? files[0].file.name.replace(/\.[^.]+$/, '') : 'file';

  const run = async () => {
    setErr(''); clearOut(); setBusy('Processing…');
    try {
      const { PDFDocument, StandardFonts, rgb, degrees } = await import('pdf-lib');
      const readDoc = async (f) => PDFDocument.load(await f.file.arrayBuffer());
      const results = [];
      if (mode === 'merge') {
        const doc = await PDFDocument.create();
        for (const [i, f] of files.entries()) {
          setBusy(`Adding file ${i + 1} of ${files.length}…`);
          const src = await readDoc(f);
          (await doc.copyPages(src, src.getPageIndices())).forEach((p) => doc.addPage(p));
        }
        results.push(addOut(new Blob([await doc.save()], { type: 'application/pdf' }), 'merged.pdf'));
      } else if (mode === 'split' || mode === 'extract') {
        const src = await readDoc(files[0]);
        const groups = parseRanges(o.ranges, info.n);
        const sets = mode === 'extract' ? [groups.flat()] : groups;
        for (const [i, idx] of sets.entries()) {
          const doc = await PDFDocument.create();
          (await doc.copyPages(src, idx)).forEach((p) => doc.addPage(p));
          results.push(addOut(new Blob([await doc.save()], { type: 'application/pdf' }),
            mode === 'extract' ? `${base}-extracted.pdf` : `${base}-part${i + 1}.pdf`));
        }
      } else if (mode === 'organize') {
        const keep = pages.filter((p) => !p.del);
        if (!keep.length) throw new Error('Keep at least one page.');
        const src = await readDoc(files[0]);
        const doc = await PDFDocument.create();
        const copied = await doc.copyPages(src, keep.map((p) => p.i));
        copied.forEach((pg, k) => { pg.setRotation(degrees((pg.getRotation().angle + keep[k].rot) % 360)); doc.addPage(pg); });
        results.push(addOut(new Blob([await doc.save()], { type: 'application/pdf' }), `${base}-organized.pdf`));
      } else if (mode === 'numbers' || mode === 'watermark') {
        const doc = await readDoc(files[0]);
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const all = doc.getPages();
        all.forEach((pg, i) => {
          const { width: w, height: h } = pg.getSize();
          if (mode === 'numbers') {
            const text = o.total ? `Page ${i + +o.start} of ${all.length + +o.start - 1}` : `${i + +o.start}`;
            const tw = font.widthOfTextAtSize(text, 11);
            const x = o.pos === 'bl' ? 36 : o.pos === 'br' ? w - tw - 36 : (w - tw) / 2;
            pg.drawText(text, { x, y: 24, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
          } else {
            const tw = font.widthOfTextAtSize(o.text, o.fs);
            const a = Math.PI / 4;
            pg.drawText(o.text, { x: w / 2 - (tw / 2) * Math.cos(a), y: h / 2 - (tw / 2) * Math.sin(a), size: o.fs, font,
              color: rgb(0.5, 0.5, 0.5), opacity: o.op, rotate: degrees(45) });
          }
        });
        results.push(addOut(new Blob([await doc.save()], { type: 'application/pdf' }), `${base}-${mode === 'numbers' ? 'numbered' : 'watermarked'}.pdf`));
      } else if (mode === 'img2pdf') {
        const doc = await PDFDocument.create();
        for (const [i, f] of files.entries()) {
          setBusy(`Adding image ${i + 1} of ${files.length}…`);
          const t = f.file.type;
          const img = t === 'image/jpeg' ? await doc.embedJpg(await f.file.arrayBuffer())
            : await doc.embedPng(t === 'image/png' ? await f.file.arrayBuffer() : await toPngBytes(f.file));
          const pg = doc.addPage([img.width * 0.75, img.height * 0.75]);
          pg.drawImage(img, { x: 0, y: 0, width: pg.getWidth(), height: pg.getHeight() });
        }
        results.push(addOut(new Blob([await doc.save()], { type: 'application/pdf' }), 'images.pdf'));
      } else if (mode === 'pdf2img') {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await files[0].file.arrayBuffer()) }).promise;
        const n = Math.min(pdf.numPages, MAX_RENDER_PAGES);
        for (let p = 1; p <= n; p++) {
          setBusy(`Rendering page ${p} of ${n}…`);
          const page = await pdf.getPage(p);
          const vp = page.getViewport({ scale: +o.scale });
          const c = document.createElement('canvas');
          c.width = Math.round(vp.width); c.height = Math.round(vp.height);
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          const blob = await new Promise((r) => c.toBlob(r, o.fmt, 0.9));
          results.push(addOut(blob, `${base}-page${p}.${o.fmt === 'image/png' ? 'png' : 'jpg'}`));
        }
        if (pdf.numPages > n) setErr(`Only the first ${n} pages were converted to keep your browser responsive.`);
      }
      setOut(results);
    } catch (e) {
      setErr(e.message && !/Failed to parse|Invalid|encrypted/i.test(e.message) ? e.message : 'We couldn’t process this file. It may be password-protected or damaged.');
    } finally { setBusy(''); }
  };

  const ready = mode === 'meta' ? false : multi ? files.length > 0 : files.length > 0 && (info || mode === 'pdf2img');
  const needRanges = mode === 'split' || mode === 'extract';

  return (
    <div className="img-tool">
      {!files.length || multi ? (
        <>
          {(!files.length || multi) && <DropZone accept={mode === 'img2pdf' ? IMG : PDF} maxMB={25} multiple={multi}
            kind={mode === 'img2pdf' ? 'image' : 'PDF'} onFiles={onFiles} />}
          {err && <p role="alert" className="err">{err}</p>}
        </>
      ) : null}

      {multi && files.length > 0 && (
        <ol className="file-order">
          {files.map((f, i) => (
            <li key={f.id}>
              <span>{f.file.name} <span className="muted small">({size(f.file.size)})</span></span>
              <span className="btn-row">
                <button type="button" className="btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${f.file.name} up`}>↑</button>
                <button type="button" className="btn" onClick={() => move(i, 1)} disabled={i === files.length - 1} aria-label={`Move ${f.file.name} down`}>↓</button>
                <button type="button" className="btn" onClick={() => setFiles((x) => x.filter((y) => y.id !== f.id))} aria-label={`Remove ${f.file.name}`}>Remove</button>
              </span>
            </li>
          ))}
        </ol>
      )}

      {!multi && files.length > 0 && (
        <>
          <p><strong>{files[0].file.name}</strong> <span className="muted small">({size(files[0].file.size)}{info && info.n ? ` · ${info.n} pages` : ''})</span></p>
          {mode === 'meta' && info && (
            <table className="meta-table"><tbody>{info.meta.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{String(v)}</td></tr>)}</tbody></table>
          )}
          {needRanges && info && (
            <div className="controls"><label>Pages ({info.n} total)
              <input type="text" value={o.ranges} placeholder="1-3, 5, 8-10" onChange={(e) => set({ ranges: e.target.value })} /></label>
              <p className="small muted">{mode === 'split' ? 'Each comma-separated range becomes its own PDF.' : 'All listed pages go into one new PDF.'}</p></div>
          )}
          {mode === 'organize' && info && (
            <ol className="file-order">
              {pages.map((p, k) => (
                <li key={p.i} className={p.del ? 'is-del' : ''}>
                  <span>Page {p.i + 1}{p.rot ? ` · rotated ${p.rot}°` : ''}{p.del ? ' · will be removed' : ''}</span>
                  <span className="btn-row">
                    <button type="button" className="btn" disabled={k === 0} aria-label={`Move page ${p.i + 1} up`}
                      onClick={() => setPages((a) => { const n = [...a]; [n[k - 1], n[k]] = [n[k], n[k - 1]]; return n; })}>↑</button>
                    <button type="button" className="btn" disabled={k === pages.length - 1} aria-label={`Move page ${p.i + 1} down`}
                      onClick={() => setPages((a) => { const n = [...a]; [n[k + 1], n[k]] = [n[k], n[k + 1]]; return n; })}>↓</button>
                    <button type="button" className="btn" aria-label={`Rotate page ${p.i + 1}`}
                      onClick={() => setPages((a) => a.map((x, j) => (j === k ? { ...x, rot: (x.rot + 90) % 360 } : x)))}>Rotate</button>
                    <button type="button" className="btn" aria-pressed={p.del} aria-label={`Remove page ${p.i + 1}`}
                      onClick={() => setPages((a) => a.map((x, j) => (j === k ? { ...x, del: !x.del } : x)))}>{p.del ? 'Keep' : 'Remove'}</button>
                  </span>
                </li>
              ))}
            </ol>
          )}
          {mode === 'numbers' && info && (
            <div className="controls">
              <label>Position<select value={o.pos} onChange={(e) => set({ pos: e.target.value })}>
                <option value="bl">Bottom left</option><option value="bc">Bottom centre</option><option value="br">Bottom right</option></select></label>
              <label>Start at<input type="number" min="1" value={o.start} onChange={(e) => set({ start: Math.max(1, +e.target.value || 1) })} /></label>
              <label className="inline"><input type="checkbox" checked={o.total} onChange={(e) => set({ total: e.target.checked })} />Show “Page X of Y”</label>
            </div>
          )}
          {mode === 'watermark' && info && (
            <div className="controls">
              <label>Watermark text<input type="text" maxLength="40" value={o.text} onChange={(e) => set({ text: e.target.value })} /></label>
              <label>Size: {o.fs}pt<input type="range" min="20" max="120" value={o.fs} onChange={(e) => set({ fs: +e.target.value })} /></label>
              <label>Opacity: {Math.round(o.op * 100)}%<input type="range" min="0.05" max="1" step="0.05" value={o.op} onChange={(e) => set({ op: +e.target.value })} /></label>
            </div>
          )}
          {mode === 'pdf2img' && (
            <div className="controls">
              <label>Format<select value={o.fmt} onChange={(e) => set({ fmt: e.target.value })}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label>
              <label>Quality<select value={o.scale} onChange={(e) => set({ scale: e.target.value })}>
                <option value="1">Standard (72 dpi)</option><option value="2">High (144 dpi)</option><option value="3">Very high (216 dpi)</option></select></label>
            </div>
          )}
        </>
      )}

      {err && files.length > 0 && <p role="alert" className="err">{err}</p>}
      {busy && <p role="status" className="muted">{busy}</p>}

      {files.length > 0 && (
        <div className="btn-row">
          {mode !== 'meta' && <button type="button" className="btn btn-primary" onClick={run} disabled={!ready || !!busy}>{LABEL[mode]}</button>}
          <button type="button" className="btn" onClick={reset}>Process another file</button>
        </div>
      )}

      {out.length > 1 && (
        <div className="btn-row"><button type="button" className="btn btn-primary" onClick={() => downloadZip(out, `${base}-files.zip`)}>Download all (ZIP)</button></div>
      )}
      {out.length > 0 && (
        <ul className="img-results">
          {out.map((r) => (
            <li key={r.name}>
              <p><strong>{r.name}</strong> <span className="muted small">{size(r.blob.size)}</span></p>
              {mode === 'pdf2img' && <div className="pair"><figure><img src={r.url} alt={r.name} /></figure></div>}
              <a className="btn btn-primary" href={r.url} download={r.name}>Download</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
