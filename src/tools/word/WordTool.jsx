import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';

const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);
const TEXT_MODES = ['txt2docx', 'counter', 'format'];

// Remove scripts, event handlers and other active content from converted HTML.
function sanitize(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,iframe,object,embed,link,meta,form').forEach((n) => n.remove());
  doc.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((a) => {
      if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
    });
  });
  return doc.body.innerHTML;
}

const inlineRuns = (node, d, st = {}) => {
  const out = [];
  node.childNodes.forEach((c) => {
    if (c.nodeType === 3) out.push(new d.TextRun({ text: c.textContent, bold: st.b, italics: st.i, underline: st.u ? {} : undefined }));
    else if (c.nodeType === 1) {
      const n = { ...st };
      if (['B', 'STRONG'].includes(c.tagName)) n.b = true;
      if (['I', 'EM'].includes(c.tagName)) n.i = true;
      if (c.tagName === 'U') n.u = true;
      if (c.tagName === 'BR') out.push(new d.TextRun({ break: 1 }));
      else out.push(...inlineRuns(c, d, n));
    }
  });
  return out;
};

function htmlToParagraphs(root, d) {
  const H = { H1: d.HeadingLevel.HEADING_1, H2: d.HeadingLevel.HEADING_2, H3: d.HeadingLevel.HEADING_3 };
  const out = [];
  root.childNodes.forEach((c) => {
    if (c.nodeType === 3) { if (c.textContent.trim()) out.push(new d.Paragraph({ children: [new d.TextRun(c.textContent)] })); return; }
    if (c.nodeType !== 1) return;
    if (H[c.tagName]) out.push(new d.Paragraph({ heading: H[c.tagName], children: inlineRuns(c, d) }));
    else if (c.tagName === 'UL' || c.tagName === 'OL') {
      c.querySelectorAll(':scope > li').forEach((li) => out.push(new d.Paragraph(
        c.tagName === 'UL' ? { bullet: { level: 0 }, children: inlineRuns(li, d) } : { numbering: { reference: 'num', level: 0 }, children: inlineRuns(li, d) })));
    } else out.push(new d.Paragraph({ children: inlineRuns(c, d) }));
  });
  return out.length ? out : [new d.Paragraph('')];
}

async function makeDocx(paragraphs, d) {
  const doc = new d.Document({
    numbering: { config: [{ reference: 'num', levels: [{ level: 0, format: d.LevelFormat.DECIMAL, text: '%1.', alignment: d.AlignmentType.START }] }] },
    sections: [{ children: paragraphs }],
  });
  return d.Packer.toBlob(doc);
}

async function textToPdf(text) {
  const { PDFDocument, StandardFonts } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const [W, H, M, FS, LH] = [595, 842, 56, 11, 15];
  let replaced = 0;
  const clean = text.replace(/[^\x09\x0A\x20-\x7E\xA0-\xFF]/g, () => { replaced++; return '?'; });
  let page = doc.addPage([W, H]);
  let y = H - M;
  const newLine = () => { y -= LH; if (y < M) { page = doc.addPage([W, H]); y = H - M; } };
  for (const para of clean.split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, FS) > W - 2 * M && line) { page.drawText(line, { x: M, y, size: FS, font }); newLine(); line = word; } else line = test;
    }
    if (line) page.drawText(line, { x: M, y, size: FS, font });
    newLine();
  }
  return { blob: new Blob([await doc.save()], { type: 'application/pdf' }), replaced };
}

function formatText(t, f) {
  let s = t.replace(/\r\n?/g, '\n');
  if (f.trim) s = s.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n');
  if (f.quotes) s = s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  if (f.blank) s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

export default function WordTool({ mode }) {
  const isText = TEXT_MODES.includes(mode);
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [html, setHtml] = useState('');
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [f, setF] = useState({ trim: true, blank: true, quotes: false });
  const [q, setQ] = useState(0.7);
  const url = useRef(null);
  const editor = useRef(null);

  const revoke = () => { if (url.current) URL.revokeObjectURL(url.current); url.current = null; };
  useEffect(() => revoke, []);
  const makeOut = (blob, name) => { revoke(); url.current = URL.createObjectURL(blob); setOut({ blob, name, url: url.current }); };
  const base = file ? file.name.replace(/\.[^.]+$/, '') : 'document';

  const load = async (list) => {
    const fl = list[0];
    setErr(''); setNote(''); setOut(null); setBusy('Reading file…');
    try {
      if (fl.name.toLowerCase().endsWith('.txt') || fl.type === 'text/plain') { setFile(fl); setText(await fl.text()); setBusy(''); return; }
      const mammoth = (await import('@depup/mammoth/mammoth.browser.js')).default;
      const arrayBuffer = await fl.arrayBuffer();
      setFile(fl);
      const nm = fl.name.replace(/\.[^.]+$/, '');
      if (mode === 'viewer' || mode === 'editor') setHtml(sanitize((await mammoth.convertToHtml({ arrayBuffer })).value));
      else if (mode === 'html') {
        const h = sanitize((await mammoth.convertToHtml({ arrayBuffer })).value);
        setHtml(h);
        makeOut(new Blob([`<!doctype html><html><head><meta charset="utf-8"><title>${nm}</title></head><body>${h}</body></html>`], { type: 'text/html' }), `${nm}.html`);
      } else if (mode === 'md') {
        const md = (await mammoth.convertToMarkdown({ arrayBuffer })).value;
        setText(md); makeOut(new Blob([md], { type: 'text/markdown' }), `${nm}.md`);
      } else if (mode === 'txt' || mode === 'extract' || isText) {
        const t = (await mammoth.extractRawText({ arrayBuffer })).value;
        setText(t); if (!isText) makeOut(new Blob([t], { type: 'text/plain' }), `${nm}.txt`);
      } else if (mode === 'pdf') {
        setBusy('Building PDF…');
        const { blob, replaced } = await textToPdf((await mammoth.extractRawText({ arrayBuffer })).value);
        makeOut(blob, `${nm}.pdf`);
        setNote(`Text-only PDF: images, tables, fonts and styling aren’t kept.${replaced ? ` ${replaced} characters outside basic Latin were replaced with “?”.` : ''}`);
      } else if (mode === 'compress') {
        setBusy('Optimising images…');
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(arrayBuffer);
        const names = Object.keys(zip.files).filter((n) => /^word\/media\/.+\.jpe?g$/i.test(n));
        for (const n of names) {
          const orig = await zip.file(n).async('blob');
          const bmp = await createImageBitmap(orig);
          const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
          const c = document.createElement('canvas');
          c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
          c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); bmp.close();
          const nb = await new Promise((r) => c.toBlob(r, 'image/jpeg', q));
          if (nb && nb.size < orig.size) zip.file(n, nb);
        }
        const blob = await zip.generateAsync({ type: 'blob', mimeType: DOCX, compression: 'DEFLATE', compressionOptions: { level: 9 } });
        const saved = Math.round((1 - blob.size / fl.size) * 100);
        setNote(`${names.length} JPG image(s) checked. Original ${size(fl.size)} → ${size(blob.size)}${saved > 0 ? ` (${saved}% smaller)` : ''}. PNG images and text are left unchanged, so text-only documents rarely shrink.`);
        if (blob.size < fl.size) makeOut(blob, `${nm}-compressed.docx`);
      }
    } catch (e) {
      setFile(null);
      setErr('We couldn’t read this file. Make sure it’s a valid .docx (not an older .doc or a renamed file).');
    } finally { setBusy(''); }
  };

  useEffect(() => { if (mode === 'editor' && editor.current && html) editor.current.innerHTML = html; }, [html, mode]);

  const exportDocx = async (name, paragraphsFrom) => {
    setBusy('Creating DOCX…'); setErr('');
    try {
      const d = await import('docx');
      makeOut(await makeDocx(paragraphsFrom(d), d), `${name}.docx`);
    } catch { setErr('Couldn’t create the DOCX file.'); } finally { setBusy(''); }
  };

  const fmtText = mode === 'format' ? formatText(text, f) : text;
  const words = (text.match(/\S+/g) || []).length;
  const textDocx = () => exportDocx(file ? base : 'document', (d) => fmtText.split('\n').map((l) => new d.Paragraph({ children: [new d.TextRun(l)] })));
  const reset = () => { revoke(); setFile(null); setText(''); setHtml(''); setOut(null); setErr(''); setNote(''); };
  const cmd = (c, v) => { editor.current.focus(); document.execCommand(c, false, v); };
  const showDrop = !isText && !file && mode !== 'editor' || (mode === 'editor' && !file && !html);
  const dropEl = <DropZone accept={isText ? ['text/plain', DOCX] : [DOCX]} exts={isText ? ['.txt', '.docx'] : ['.docx']}
    formats={isText ? 'DOCX, TXT' : 'DOCX'} maxMB={25} kind="document" onFiles={load} />;

  return (
    <div className="img-tool">
      {(isText && !file) || showDrop ? dropEl : null}
      {mode === 'editor' && !file && !html && <p className="muted small">No file? <button type="button" className="btn" onClick={() => setHtml('<p></p>')}>Start a blank document</button></p>}
      {err && <p role="alert" className="err">{err}</p>}
      {busy && <p role="status" className="muted">{busy}</p>}
      {file && !isText && <p><strong>{file.name}</strong> <span className="muted small">({size(file.size)})</span></p>}

      {mode === 'compress' && !file && <div className="controls"><label>JPG image quality: {Math.round(q * 100)}%
        <input type="range" min="0.3" max="0.95" step="0.05" value={q} onChange={(e) => setQ(+e.target.value)} /></label></div>}

      {isText && (
        <>
          <label className="block-label">Text
            <textarea rows="10" value={text} onChange={(e) => { setText(e.target.value); setOut(null); }} placeholder="Paste or type text here" /></label>
          {mode === 'counter' && (
            <table className="meta-table"><tbody>
              <tr><th scope="row">Words</th><td>{words}</td></tr>
              <tr><th scope="row">Characters</th><td>{text.length} ({text.replace(/\s/g, '').length} without spaces)</td></tr>
              <tr><th scope="row">Sentences</th><td>{(text.match(/[^.!?]+[.!?]+/g) || []).length}</td></tr>
              <tr><th scope="row">Paragraphs</th><td>{text.split(/\n\s*\n/).filter((x) => x.trim()).length}</td></tr>
              <tr><th scope="row">Estimated pages</th><td>{(words / 500).toFixed(1)} (about 500 words per page)</td></tr>
              <tr><th scope="row">Reading time</th><td>{Math.max(words ? 1 : 0, Math.round(words / 200))} min</td></tr>
            </tbody></table>
          )}
          {mode === 'format' && (
            <>
              <div className="controls">
                <label className="inline"><input type="checkbox" checked={f.trim} onChange={(e) => setF({ ...f, trim: e.target.checked })} />Trim extra spaces</label>
                <label className="inline"><input type="checkbox" checked={f.blank} onChange={(e) => setF({ ...f, blank: e.target.checked })} />Collapse repeated blank lines</label>
                <label className="inline"><input type="checkbox" checked={f.quotes} onChange={(e) => setF({ ...f, quotes: e.target.checked })} />Straighten curly quotes</label>
              </div>
              <label className="block-label">Cleaned text<textarea rows="8" readOnly value={fmtText} /></label>
            </>
          )}
          {mode !== 'counter' && (
            <div className="btn-row">
              {mode === 'format' && <button type="button" className="btn" onClick={() => navigator.clipboard && navigator.clipboard.writeText(fmtText)}>Copy text</button>}
              <button type="button" className="btn btn-primary" disabled={!fmtText || !!busy} onClick={textDocx}>Create DOCX</button>
              {mode === 'format' && <button type="button" className="btn" disabled={!fmtText} onClick={() => makeOut(new Blob([fmtText], { type: 'text/plain' }), `${base}-clean.txt`)}>Create TXT</button>}
            </div>
          )}
          {file && <p className="small muted">Loaded {file.name}</p>}
        </>
      )}

      {mode === 'viewer' && html && <div className="doc-view" dangerouslySetInnerHTML={{ __html: html }} />}
      {mode === 'html' && html && <div className="doc-view" dangerouslySetInnerHTML={{ __html: html }} />}
      {(mode === 'md' || mode === 'txt' || mode === 'extract') && file && (
        <>
          <label className="block-label">Result<textarea rows="10" readOnly value={text} /></label>
          {mode === 'extract' && <button type="button" className="btn" onClick={() => navigator.clipboard && navigator.clipboard.writeText(text)}>Copy text</button>}
        </>
      )}

      {mode === 'editor' && (file || html) && (
        <>
          <div className="btn-row" role="toolbar" aria-label="Formatting">
            <button type="button" className="btn" onClick={() => cmd('bold')}><b>B</b></button>
            <button type="button" className="btn" onClick={() => cmd('italic')}><i>I</i></button>
            <button type="button" className="btn" onClick={() => cmd('underline')}><u>U</u></button>
            <button type="button" className="btn" onClick={() => cmd('formatBlock', 'h1')}>Heading 1</button>
            <button type="button" className="btn" onClick={() => cmd('formatBlock', 'h2')}>Heading 2</button>
            <button type="button" className="btn" onClick={() => cmd('formatBlock', 'p')}>Paragraph</button>
            <button type="button" className="btn" onClick={() => cmd('insertUnorderedList')}>Bullets</button>
            <button type="button" className="btn" onClick={() => cmd('insertOrderedList')}>Numbers</button>
            <button type="button" className="btn" onClick={() => cmd('undo')}>Undo</button>
          </div>
          <div ref={editor} className="doc-view editor" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Document editor" />
          <div className="btn-row">
            <button type="button" className="btn btn-primary" disabled={!!busy}
              onClick={() => exportDocx(file ? `${base}-edited` : 'document', (d) => htmlToParagraphs(editor.current, d))}>Save as DOCX</button>
          </div>
          <p className="small muted">Basic formatting only: bold, italic, underline, headings and lists. Images, tables and complex layout in the original aren’t preserved when saving.</p>
        </>
      )}

      {note && <p className="notice" role="note">{note}</p>}
      {out && (
        <div className="btn-row"><a className="btn btn-primary" href={out.url} download={out.name}>Download {out.name}</a>
          <span className="muted small">{size(out.blob.size)}</span></div>
      )}
      {(file || html || text) && <div className="btn-row"><button type="button" className="btn" onClick={reset}>Process another file</button></div>}
    </div>
  );
}
