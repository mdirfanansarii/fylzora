import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';
import { recompressImages } from './recompress.js';

const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);
const LEVELS = { high: { q: 0.8, dim: 2000, dpi: 150 }, balanced: { q: 0.65, dim: 1600, dpi: 110 }, strong: { q: 0.5, dim: 1200, dpi: 80 } };
const MAX_PAGES = 100;

async function reencodeJpeg(bytes, level) {
  const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }), { imageOrientation: 'none' });
  const k = Math.min(1, level.dim / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); bmp.close();
  const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', level.q));
  return { bytes: new Uint8Array(await blob.arrayBuffer()), width: c.width, height: c.height };
}

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('images');
  const [lv, setLv] = useState('balanced');
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [res, setRes] = useState(null);
  const url = useRef(null);
  useEffect(() => () => url.current && URL.revokeObjectURL(url.current), []);
  const reset = () => { if (url.current) URL.revokeObjectURL(url.current); url.current = null; setFile(null); setRes(null); setErr(''); };

  const run = async () => {
    setErr(''); setRes(null); setBusy('Compressing…');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await file.arrayBuffer();
      const level = LEVELS[lv];
      let bytes; let detail = '';
      if (mode === 'images') {
        const doc = await PDFDocument.load(buf);
        const r = await recompressImages(doc, (b) => reencodeJpeg(b, level));
        doc.setProducer(''); doc.setCreator('');
        bytes = await doc.save({ useObjectStreams: true });
        detail = r.count ? `${r.count} embedded photo(s) were re-compressed. Text and vector graphics are unchanged.` : 'No large JPEG photos were found inside this PDF, so only its structure was optimised.';
      } else {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
        if (pdf.numPages > MAX_PAGES) throw new Error(`This mode supports up to ${MAX_PAGES} pages. Your PDF has ${pdf.numPages}.`);
        const out = await PDFDocument.create();
        for (let p = 1; p <= pdf.numPages; p++) {
          setBusy(`Compressing page ${p} of ${pdf.numPages}…`);
          const page = await pdf.getPage(p);
          const base = page.getViewport({ scale: 1 });
          const vp = page.getViewport({ scale: level.dpi / 72 });
          const c = document.createElement('canvas');
          c.width = Math.round(vp.width); c.height = Math.round(vp.height);
          const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', level.q));
          const im = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
          const pg = out.addPage([base.width, base.height]);
          pg.drawImage(im, { x: 0, y: 0, width: base.width, height: base.height });
        }
        bytes = await out.save({ useObjectStreams: true });
        detail = 'Every page was turned into a picture. The text can no longer be selected, searched or copied.';
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const saved = Math.round((1 - blob.size / file.size) * 100);
      if (blob.size < file.size) { url.current = URL.createObjectURL(blob); }
      setRes({ blob, saved, detail, url: blob.size < file.size ? url.current : null });
    } catch (e) {
      setErr(/pages\./.test(e.message || '') ? e.message : 'We couldn’t compress this PDF. It may be password-protected or damaged.');
    } finally { setBusy(''); }
  };

  return (
    <div className="img-tool">
      {!file ? (
        <DropZone accept={['application/pdf']} maxMB={25} kind="PDF" onFiles={([f]) => { setFile(f); setRes(null); setErr(''); }} />
      ) : (
        <>
          <p><strong>{file.name}</strong> <span className="muted small">({size(file.size)})</span></p>
          <fieldset className="opt-set">
            <legend>Method</legend>
            <label className="inline"><input type="radio" name="m" checked={mode === 'images'} onChange={() => setMode('images')} /> Shrink photos inside the PDF (text stays selectable)</label>
            <label className="inline"><input type="radio" name="m" checked={mode === 'pages'} onChange={() => setMode('pages')} /> Maximum: turn pages into pictures (text is no longer selectable)</label>
          </fieldset>
          <div className="controls"><label>Compression level
            <select value={lv} onChange={(e) => setLv(e.target.value)}>
              <option value="high">Light: best quality</option><option value="balanced">Balanced</option><option value="strong">Strong: smallest file</option></select></label></div>
          {err && <p role="alert" className="err">{err}</p>}
          {busy && <p role="status" className="muted">{busy}</p>}
          <div className="btn-row">
            <button type="button" className="btn btn-primary" disabled={!!busy} onClick={run}>Compress PDF</button>
            <button type="button" className="btn" onClick={reset}>Process another file</button>
          </div>
          {res && (
            <div className="notice" role="status">
              <p><strong>{size(file.size)} → {size(res.blob.size)}</strong>{res.saved > 0 ? ` (${res.saved}% smaller)` : ''}</p>
              <p>{res.detail}</p>
              {res.url ? <a className="btn btn-primary" href={res.url} download={`${file.name.replace(/\.[^.]+$/, '')}-compressed.pdf`}>Download compressed PDF</a>
                : <p>This method couldn’t make the file smaller, so there’s nothing to download. Try another method or a stronger level.</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
