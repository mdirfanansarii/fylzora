import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';
import { extractBlocks } from './pdfText.js';

const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);
const MAX_PAGES = 150;

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [out, setOut] = useState(null);
  const url = useRef(null);
  useEffect(() => () => url.current && URL.revokeObjectURL(url.current), []);
  const reset = () => { if (url.current) URL.revokeObjectURL(url.current); url.current = null; setFile(null); setOut(null); setErr(''); };

  const run = async (f) => {
    setFile(f); setErr(''); setOut(null); setBusy('Reading PDF…');
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;
      if (pdf.numPages > MAX_PAGES) throw new Error(`This tool converts up to ${MAX_PAGES} pages. Your PDF has ${pdf.numPages}. Split it first with the PDF Splitter.`);
      const blocks = await extractBlocks(pdf, (p, n) => setBusy(`Reading page ${p} of ${n}…`));
      if (blocks.reduce((n, b) => n + b.text.length, 0) < 20) {
        throw new Error('No selectable text was found. This PDF is probably a scan (pictures of text). Converting scans needs OCR, which this tool doesn’t do.');
      }
      setBusy('Creating Word file…');
      const d = await import('docx');
      const H = [null, d.HeadingLevel.HEADING_1, d.HeadingLevel.HEADING_2];
      const seen = new Set();
      const paras = blocks.map((b) => {
        const pageBreakBefore = b.page > 0 && !seen.has(b.page);
        seen.add(b.page);
        const opts = { children: [new d.TextRun(b.text)], pageBreakBefore };
        if (b.heading) opts.heading = H[b.heading];
        else if (b.bullet) opts.bullet = { level: 0 };
        return new d.Paragraph(opts);
      });
      const blob = await d.Packer.toBlob(new d.Document({ sections: [{ children: paras }] }));
      url.current = URL.createObjectURL(blob);
      setOut({ blob, url: url.current, pages: pdf.numPages });
    } catch (e) {
      setErr(/pages|scan/.test(e.message || '') ? e.message : 'We couldn’t read this PDF. It may be password-protected or damaged.');
    } finally { setBusy(''); }
  };

  return (
    <div className="img-tool">
      {!file && <DropZone accept={['application/pdf']} maxMB={25} kind="PDF" onFiles={([f]) => run(f)} />}
      {file && <p><strong>{file.name}</strong> <span className="muted small">({size(file.size)})</span></p>}
      {err && <p role="alert" className="err">{err}</p>}
      {busy && <p role="status" className="muted">{busy}</p>}
      {out && (
        <>
          <p className="notice" role="note">Converted {out.pages} page(s) to editable text. Headings, paragraphs and bullet lists are detected; images, tables, columns and exact fonts are not recreated. Please proofread the result.</p>
          <div className="btn-row"><a className="btn btn-primary" href={out.url} download={`${file.name.replace(/\.[^.]+$/, '')}.docx`}>Download DOCX</a>
            <span className="muted small">{size(out.blob.size)}</span></div>
        </>
      )}
      {file && !busy && <div className="btn-row"><button type="button" className="btn" onClick={reset}>Process another file</button></div>}
    </div>
  );
}
