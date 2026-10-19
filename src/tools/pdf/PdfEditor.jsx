import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';

const TOOLS = [['text', 'Text'], ['highlight', 'Highlight'], ['rect', 'Rectangle'], ['ellipse', 'Ellipse'], ['line', 'Line']];
const COLORS = [['#d32f2f', 'Red'], ['#1565c0', 'Blue'], ['#2e7d32', 'Green'], ['#000000', 'Black'], ['#ffeb3b', 'Yellow']];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export default function PdfEditor() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [geom, setGeom] = useState(null);
  const [edits, setEdits] = useState([]);
  const [tool, setTool] = useState('text');
  const [color, setColor] = useState('#d32f2f');
  const [fs, setFs] = useState(16);
  const [draft, setDraft] = useState(null);
  const [typing, setTyping] = useState(null);
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [out, setOut] = useState(null);
  const pdfRef = useRef(null);
  const bufRef = useRef(null);
  const canvas = useRef(null);
  const wrap = useRef(null);
  const svg = useRef(null);
  const url = useRef(null);
  useEffect(() => () => url.current && URL.revokeObjectURL(url.current), []);

  const open = async ([f]) => {
    setErr(''); setBusy('Opening PDF…');
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      const buf = await f.arrayBuffer();
      bufRef.current = buf;
      pdfRef.current = await pdfjs.getDocument({ data: new Uint8Array(buf.slice(0)) }).promise;
      setFile(f); setNumPages(pdfRef.current.numPages); setPageNo(1); setEdits([]); setOut(null);
    } catch { setErr('We couldn’t open this PDF. It may be password-protected or damaged.'); }
    finally { setBusy(''); }
  };

  useEffect(() => {
    if (!pdfRef.current || !file) return undefined;
    let task; let dead = false;
    (async () => {
      const page = await pdfRef.current.getPage(pageNo);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(1.6, (wrap.current?.clientWidth || 800) / base.width);
      const vp = page.getViewport({ scale });
      const dpr = window.devicePixelRatio || 1;
      const c = canvas.current;
      c.width = Math.round(vp.width * dpr); c.height = Math.round(vp.height * dpr);
      c.style.width = `${vp.width}px`; c.style.height = `${vp.height}px`;
      if (dead) return;
      setGeom({ w: base.width, h: base.height, scale, vx: page.view[0], vt: page.view[3], rotated: page.rotate % 360 !== 0, cw: vp.width, ch: vp.height });
      task = page.render({ canvasContext: c.getContext('2d'), viewport: vp, transform: [dpr, 0, 0, dpr, 0, 0] });
      try { await task.promise; } catch { /* cancelled */ }
    })();
    return () => { dead = true; task?.cancel(); };
  }, [pageNo, file]);

  const pt = (e) => { const r = svg.current.getBoundingClientRect(); return { x: ((e.clientX - r.left) * geom.w) / r.width, y: ((e.clientY - r.top) * geom.h) / r.height }; };
  const add = (e) => setEdits((a) => [...a, { id: Math.random(), page: pageNo, color, fs, vx: geom.vx, vt: geom.vt, ...e }]);
  const commitText = () => { if (typing && typed.trim()) add({ type: 'text', x: typing.x, y: typing.y, text: typed.trim() }); setTyping(null); setTyped(''); setOut(null); };

  const down = (e) => {
    if (!geom || geom.rotated) return;
    const p = pt(e);
    if (tool === 'text') { if (typing) commitText(); setTyping(p); setTyped(''); return; }
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraft({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
  };
  const move = (e) => { if (draft) { const p = pt(e); setDraft({ ...draft, x1: p.x, y1: p.y }); } };
  const up = () => {
    if (!draft) return;
    const { x0, y0, x1, y1 } = draft;
    const big = Math.hypot(x1 - x0, y1 - y0) > 4;
    if (big) {
      if (tool === 'line') add({ type: 'line', x0, y0, x1, y1 });
      else add({ type: tool, x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) });
      setOut(null);
    }
    setDraft(null);
  };
  const pickTool = (t) => { if (typing) commitText(); setTool(t); if (t === 'highlight') setColor('#ffeb3b'); else if (color === '#ffeb3b') setColor('#d32f2f'); };

  const shape = (e, key) => {
    const c = e.color;
    switch (e.type) {
      case 'text': return <text key={key} x={e.x} y={e.y + e.fs * 0.85} fontSize={e.fs} fill={c} fontFamily="Helvetica, Arial, sans-serif">{e.text}</text>;
      case 'highlight': return <rect key={key} x={e.x} y={e.y} width={e.w} height={e.h} fill={c} opacity=".35" />;
      case 'rect': return <rect key={key} x={e.x} y={e.y} width={e.w} height={e.h} fill="none" stroke={c} strokeWidth="2" />;
      case 'ellipse': return <ellipse key={key} cx={e.x + e.w / 2} cy={e.y + e.h / 2} rx={e.w / 2} ry={e.h / 2} fill="none" stroke={c} strokeWidth="2" />;
      default: return <line key={key} x1={e.x0} y1={e.y0} x2={e.x1} y2={e.y1} stroke={c} strokeWidth="2" />;
    }
  };
  const draftEdit = draft && (tool === 'line' ? { type: 'line', color, ...draft }
    : { type: tool, color, x: Math.min(draft.x0, draft.x1), y: Math.min(draft.y0, draft.y1), w: Math.abs(draft.x1 - draft.x0), h: Math.abs(draft.y1 - draft.y0) });

  const save = async () => {
    setErr(''); setBusy('Saving…');
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const doc = await PDFDocument.load(bufRef.current);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      let lost = 0;
      for (const e of edits) {
        const pg = doc.getPage(e.page - 1);
        const col = rgb(...hex(e.color));
        const X = (x) => e.vx + x;
        const Y = (y) => e.vt - y;
        if (e.type === 'text') {
          const t = e.text.replace(/[^\x20-\x7E\xA0-\xFF]/g, () => { lost++; return '?'; });
          pg.drawText(t, { x: X(e.x), y: Y(e.y) - e.fs * 0.85, size: e.fs, font, color: col });
        } else if (e.type === 'highlight') pg.drawRectangle({ x: X(e.x), y: Y(e.y + e.h), width: e.w, height: e.h, color: col, opacity: 0.35 });
        else if (e.type === 'rect') pg.drawRectangle({ x: X(e.x), y: Y(e.y + e.h), width: e.w, height: e.h, borderColor: col, borderWidth: 2 });
        else if (e.type === 'ellipse') pg.drawEllipse({ x: X(e.x + e.w / 2), y: Y(e.y + e.h / 2), xScale: e.w / 2, yScale: e.h / 2, borderColor: col, borderWidth: 2 });
        else pg.drawLine({ start: { x: X(e.x0), y: Y(e.y0) }, end: { x: X(e.x1), y: Y(e.y1) }, thickness: 2, color: col });
      }
      const blob = new Blob([await doc.save()], { type: 'application/pdf' });
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(blob);
      setOut({ blob, url: url.current, lost });
    } catch { setErr('Couldn’t save the edited PDF.'); } finally { setBusy(''); }
  };
  const reset = () => { if (url.current) URL.revokeObjectURL(url.current); url.current = null; pdfRef.current = null; setFile(null); setEdits([]); setOut(null); setErr(''); };

  if (!file) return (
    <div className="img-tool">
      <DropZone accept={['application/pdf']} maxMB={25} kind="PDF" onFiles={open} />
      {busy && <p role="status" className="muted">{busy}</p>}
      {err && <p role="alert" className="err">{err}</p>}
    </div>
  );

  const here = edits.filter((e) => e.page === pageNo);
  return (
    <div className="img-tool">
      <div className="btn-row" role="toolbar" aria-label="Editing tools">
        {TOOLS.map(([k, l]) => <button key={k} type="button" className="btn" aria-pressed={tool === k} onClick={() => pickTool(k)}>{l}</button>)}
        <label className="inline">Colour <select value={color} onChange={(e) => setColor(e.target.value)}>{COLORS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        {tool === 'text' && <label className="inline">Size <select value={fs} onChange={(e) => setFs(+e.target.value)}>{[10, 12, 14, 16, 20, 24, 32].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>}
      </div>
      <div className="btn-row">
        <button type="button" className="btn" disabled={pageNo <= 1} onClick={() => { commitText(); setPageNo(pageNo - 1); }}>Previous page</button>
        <span aria-live="polite">Page {pageNo} of {numPages}</span>
        <button type="button" className="btn" disabled={pageNo >= numPages} onClick={() => { commitText(); setPageNo(pageNo + 1); }}>Next page</button>
        <button type="button" className="btn" disabled={!edits.length} onClick={() => { setEdits((a) => a.slice(0, -1)); setOut(null); }}>Undo last</button>
        <button type="button" className="btn" disabled={!here.length} onClick={() => { setEdits((a) => a.filter((e) => e.page !== pageNo)); setOut(null); }}>Clear this page</button>
      </div>
      <p className="small muted">{tool === 'text' ? 'Click where you want the text, type, then press Enter.' : 'Click and drag on the page to draw.'} Edits are added on top of the PDF, and existing text can’t be changed.</p>
      {geom?.rotated && <p role="alert" className="err">This page is rotated, so editing is turned off for it. Use the PDF Page Organizer to rotate it upright first.</p>}

      <div ref={wrap} className="pdf-stage">
        <div className="pdf-page" style={geom ? { width: geom.cw, height: geom.ch } : undefined}>
          <canvas ref={canvas} aria-label={`Page ${pageNo} preview`} />
          {geom && (
            <svg ref={svg} className="pdf-overlay" viewBox={`0 0 ${geom.w} ${geom.h}`} width={geom.cw} height={geom.ch}
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => setDraft(null)}>
              {here.map((e) => shape(e, e.id))}
              {draftEdit && shape(draftEdit, 'draft')}
            </svg>
          )}
          {typing && geom && (
            <input className="pdf-typing" autoFocus value={typed} aria-label="Text to add" style={{ left: typing.x * geom.scale, top: typing.y * geom.scale, fontSize: fs * geom.scale, color }}
              onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') commitText(); if (e.key === 'Escape') { setTyping(null); setTyped(''); } }} onBlur={commitText} />
          )}
        </div>
      </div>

      {err && <p role="alert" className="err">{err}</p>}
      {busy && <p role="status" className="muted">{busy}</p>}
      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={!edits.length || !!busy} onClick={save}>Apply edits ({edits.length})</button>
        {out && <a className="btn btn-primary" href={out.url} download={`${file.name.replace(/\.[^.]+$/, '')}-edited.pdf`}>Download edited PDF</a>}
        <button type="button" className="btn" onClick={reset}>Process another file</button>
      </div>
      {out?.lost > 0 && <p className="notice" role="note">{out.lost} character(s) outside basic Latin couldn’t be added as text and became “?”.</p>}
    </div>
  );
}
