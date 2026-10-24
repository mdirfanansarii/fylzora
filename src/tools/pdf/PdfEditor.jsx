import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';

const TOOLS = [
  ['edit', 'Edit text'],
  ['erase', 'Erase area'],
  ['text', 'Add text'],
  ['highlight', 'Highlight'],
  ['rect', 'Rectangle'],
  ['ellipse', 'Ellipse'],
  ['line', 'Line'],
];
const COLORS = [['#000000', 'Black'], ['#d32f2f', 'Red'], ['#1565c0', 'Blue'], ['#2e7d32', 'Green'], ['#ffeb3b', 'Yellow']];
const HINT = {
  edit: 'Click any existing text, change it, and press Enter. Clear the box and press Enter to remove that text.',
  erase: 'Click and drag over anything you want to remove (text, lines, pictures). The area turns white.',
  text: 'Click where you want new text, type it, then press Enter.',
  draw: 'Click and drag on the page to draw.',
};
const FONT = 'Helvetica, Arial, sans-serif';
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

let measureCtx = null;
const textWidth = (text, size) => {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  measureCtx.font = `${size}px ${FONT}`;
  return measureCtx.measureText(text).width;
};
// Shrink (never grow) so replacement text fits inside the box it covers.
const fitSize = (text, size, maxW) => {
  const w = textWidth(text, size);
  return w > maxW && w > 0 ? Math.max(4, (size * maxW) / w) : size;
};
const fitPdf = (font, text, size, maxW) => {
  const w = font.widthOfTextAtSize(text, size);
  return w > maxW && w > 0 ? Math.max(4, (size * maxW) / w) : size;
};

// Text items of a page, in the same "base" units the overlay uses:
// x from the left edge, y from the top edge, origin at the page's visible corner.
const readItems = (tc, page) => {
  const vx = page.view[0];
  const vt = page.view[3];
  return tc.items
    .filter((i) => typeof i.str === 'string' && i.str.trim() && Math.abs(i.transform[1]) < 0.01 && Math.abs(i.transform[2]) < 0.01)
    .map((i) => {
      const size = Math.abs(i.transform[3]) || i.height || 10;
      const base = vt - i.transform[5];
      return {
        s: i.str,
        size,
        base,
        x: i.transform[4] - vx,
        y: base - size * 0.85,
        w: i.width || size * i.str.length * 0.5,
        h: size * 1.1,
      };
    });
};

// Draws one edit onto a canvas (used by Flatten mode). Coordinates are base units; k = pixels per unit.
const drawEditCanvas = (ctx, e, k) => {
  ctx.save();
  ctx.fillStyle = e.color;
  ctx.strokeStyle = e.color;
  ctx.lineWidth = 2 * k;
  ctx.textBaseline = 'alphabetic';
  if (e.type === 'erase' || e.type === 'replace') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(e.x * k, e.y * k, e.w * k, e.h * k);
  }
  if (e.type === 'replace' && e.text) {
    ctx.fillStyle = e.color;
    ctx.font = `${fitSize(e.text, e.size, e.w) * k}px ${FONT}`;
    ctx.fillText(e.text, e.x * k, e.base * k);
  } else if (e.type === 'text') {
    ctx.font = `${e.fs * k}px ${FONT}`;
    ctx.fillText(e.text, e.x * k, (e.y + e.fs * 0.85) * k);
  } else if (e.type === 'highlight') {
    ctx.globalAlpha = 0.35;
    ctx.fillRect(e.x * k, e.y * k, e.w * k, e.h * k);
  } else if (e.type === 'rect') {
    ctx.strokeRect(e.x * k, e.y * k, e.w * k, e.h * k);
  } else if (e.type === 'ellipse') {
    ctx.beginPath();
    ctx.ellipse((e.x + e.w / 2) * k, (e.y + e.h / 2) * k, (e.w / 2) * k, (e.h / 2) * k, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (e.type === 'line') {
    ctx.beginPath();
    ctx.moveTo(e.x0 * k, e.y0 * k);
    ctx.lineTo(e.x1 * k, e.y1 * k);
    ctx.stroke();
  }
  ctx.restore();
};

// Renders one page to a picture with its edits burned in, so the original content is really gone.
const flattenPage = async (pdf, n, edits) => {
  const page = await pdf.getPage(n);
  const base = page.getViewport({ scale: 1 });
  const k = Math.min(2, 3000 / base.width);
  const vp = page.getViewport({ scale: k });
  const c = document.createElement('canvas');
  c.width = Math.round(vp.width);
  c.height = Math.round(vp.height);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  edits.filter((e) => e.page === n).forEach((e) => drawEditCanvas(ctx, e, k));
  const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', 0.92));
  if (!blob) throw new Error('flatten failed');
  return { bytes: new Uint8Array(await blob.arrayBuffer()), w: base.width, h: base.height };
};

// Adds one edit on top of the original PDF page (non-flatten mode).
const addToPdf = (pg, e, font, rgb, tally) => {
  const X = (x) => e.vx + x;
  const Y = (y) => e.vt - y;
  const col = rgb(...hex(e.color));
  const clean = (t) => t.replace(/[^\x20-\x7E\xA0-\xFF]/g, () => { tally.lost++; return '?'; });
  if (e.type === 'erase' || e.type === 'replace') {
    pg.drawRectangle({ x: X(e.x), y: Y(e.y + e.h), width: e.w, height: e.h, color: rgb(1, 1, 1), borderWidth: 0 });
  }
  if (e.type === 'replace') {
    if (e.text) {
      const t = clean(e.text);
      pg.drawText(t, { x: X(e.x), y: Y(e.base), size: fitPdf(font, t, e.size, e.w), font, color: col });
    }
  } else if (e.type === 'text') {
    pg.drawText(clean(e.text), { x: X(e.x), y: Y(e.y) - e.fs * 0.85, size: e.fs, font, color: col });
  } else if (e.type === 'highlight') {
    pg.drawRectangle({ x: X(e.x), y: Y(e.y + e.h), width: e.w, height: e.h, color: col, opacity: 0.35, borderWidth: 0 });
  } else if (e.type === 'rect') {
    pg.drawRectangle({ x: X(e.x), y: Y(e.y + e.h), width: e.w, height: e.h, borderColor: col, borderWidth: 2 });
  } else if (e.type === 'ellipse') {
    pg.drawEllipse({ x: X(e.x + e.w / 2), y: Y(e.y + e.h / 2), xScale: e.w / 2, yScale: e.h / 2, borderColor: col, borderWidth: 2 });
  } else if (e.type === 'line') {
    pg.drawLine({ start: { x: X(e.x0), y: Y(e.y0) }, end: { x: X(e.x1), y: Y(e.y1) }, thickness: 2, color: col });
  }
};

export default function PdfEditor() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [geom, setGeom] = useState(null);
  const [items, setItems] = useState([]);
  const [edits, setEdits] = useState([]);
  const [tool, setTool] = useState('edit');
  const [color, setColor] = useState('#000000');
  const [fs, setFs] = useState(16);
  const [flatten, setFlatten] = useState(false);
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
      setFile(f); setNumPages(pdfRef.current.numPages); setPageNo(1);
      setEdits([]); setOut(null); setItems([]); setTyping(null); setTyped('');
    } catch { setErr('We couldn’t open this PDF. It may be password-protected or damaged.'); }
    finally { setBusy(''); }
  };

  useEffect(() => {
    if (!pdfRef.current || !file) return undefined;
    let task;
    let dead = false;
    (async () => {
      try {
        const page = await pdfRef.current.getPage(pageNo);
        if (dead || !canvas.current) return;
        const base = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(280, (wrap.current?.clientWidth || 800) - 24);
        const scale = Math.min(1.6, availableWidth / base.width);
        const vp = page.getViewport({ scale });
        const dpr = window.devicePixelRatio || 1;
        const c = canvas.current;
        c.width = Math.round(vp.width * dpr);
        c.height = Math.round(vp.height * dpr);
        c.style.width = `${vp.width}px`;
        c.style.height = `${vp.height}px`;
        setGeom({ w: base.width, h: base.height, scale, vx: page.view[0], vt: page.view[3], rotated: page.rotate % 360 !== 0, cw: vp.width, ch: vp.height });
        const tc = await page.getTextContent();
        if (dead) return;
        setItems(readItems(tc, page));
        task = page.render({ canvasContext: c.getContext('2d'), viewport: vp, transform: [dpr, 0, 0, dpr, 0, 0] });
        await task.promise;
      } catch (error) {
        if (!dead && error?.name !== 'RenderingCancelledException') {
          setErr('Could not render this PDF page. Try another PDF or reload the file.');
        }
      }
    })();
    return () => { dead = true; task?.cancel(); };
  }, [pageNo, file]);

  const pt = (e) => {
    const r = svg.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * geom.w) / r.width, y: ((e.clientY - r.top) * geom.h) / r.height };
  };
  const addEdit = (e) => {
    setEdits((a) => [...a, { id: Math.random(), page: pageNo, color, vx: geom.vx, vt: geom.vt, ...e }]);
    setOut(null);
  };
  const commitTyping = () => {
    if (typing) {
      const v = typed.trim();
      if (typing.kind === 'text' && v) addEdit({ type: 'text', x: typing.x, y: typing.y, fs: typing.size, text: v });
      if (typing.kind === 'edit' && v !== typing.original.trim()) {
        addEdit({ type: 'replace', x: typing.x, y: typing.y, w: typing.w, h: typing.h, base: typing.base, size: typing.size, text: v });
      }
    }
    setTyping(null); setTyped('');
  };
  const cancelTyping = () => { setTyping(null); setTyped(''); };

  const down = (e) => {
    if (!geom || geom.rotated) return;
    const p = pt(e);
    if (tool === 'edit') {
      const hit = items.find((it) => p.x >= it.x - 2 && p.x <= it.x + it.w + 2 && p.y >= it.y - 2 && p.y <= it.y + it.h + 2);
      if (hit) {
        commitTyping();
        setTyping({ kind: 'edit', x: hit.x, y: hit.y, w: hit.w, h: hit.h, base: hit.base, size: hit.size, original: hit.s });
        setTyped(hit.s);
      }
      return;
    }
    if (tool === 'text') {
      commitTyping();
      setTyping({ kind: 'text', x: p.x, y: p.y, size: fs });
      setTyped('');
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraft({ x0: p.x, y0: p.y, x1: p.x, y1: p.y });
  };
  const move = (e) => { if (draft) { const p = pt(e); setDraft({ ...draft, x1: p.x, y1: p.y }); } };
  const up = () => {
    if (!draft) return;
    const { x0, y0, x1, y1 } = draft;
    if (Math.hypot(x1 - x0, y1 - y0) > 4) {
      if (tool === 'line') addEdit({ type: 'line', x0, y0, x1, y1 });
      else addEdit({ type: tool, x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) });
    }
    setDraft(null);
  };
  const pickTool = (t) => {
    commitTyping();
    setTool(t);
    if (t === 'highlight') setColor('#ffeb3b');
    else if (color === '#ffeb3b') setColor('#000000');
  };
  const goPage = (n) => { commitTyping(); setPageNo(n); };

  const shape = (e, key, isDraft = false) => {
    const c = e.color;
    switch (e.type) {
      case 'replace':
        return (
          <g key={key}>
            <rect x={e.x} y={e.y} width={e.w} height={e.h} fill="#ffffff" />
            {e.text && <text x={e.x} y={e.base} fontSize={fitSize(e.text, e.size, e.w)} fill={c} fontFamily={FONT}>{e.text}</text>}
          </g>
        );
      case 'erase':
        return <rect key={key} x={e.x} y={e.y} width={e.w} height={e.h} fill={isDraft ? 'rgba(255,255,255,.7)' : '#ffffff'} stroke={isDraft ? '#888' : 'none'} strokeDasharray={isDraft ? '4 3' : undefined} />;
      case 'text': return <text key={key} x={e.x} y={e.y + e.fs * 0.85} fontSize={e.fs} fill={c} fontFamily={FONT}>{e.text}</text>;
      case 'highlight': return <rect key={key} x={e.x} y={e.y} width={e.w} height={e.h} fill={c} opacity=".35" />;
      case 'rect': return <rect key={key} x={e.x} y={e.y} width={e.w} height={e.h} fill="none" stroke={c} strokeWidth="2" />;
      case 'ellipse': return <ellipse key={key} cx={e.x + e.w / 2} cy={e.y + e.h / 2} rx={e.w / 2} ry={e.h / 2} fill="none" stroke={c} strokeWidth="2" />;
      default: return <line key={key} x1={e.x0} y1={e.y0} x2={e.x1} y2={e.y1} stroke={c} strokeWidth="2" />;
    }
  };
  const draftEdit = draft && (tool === 'line'
    ? { type: 'line', color, ...draft }
    : { type: tool, color, x: Math.min(draft.x0, draft.x1), y: Math.min(draft.y0, draft.y1), w: Math.abs(draft.x1 - draft.x0), h: Math.abs(draft.y1 - draft.y0) });

  const save = async () => {
    commitTyping();
    setErr(''); setBusy('Saving…');
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const tally = { lost: 0 };
      let doc;
      if (flatten) {
        doc = await PDFDocument.create();
        for (let n = 1; n <= numPages; n++) {
          setBusy(`Flattening page ${n} of ${numPages}…`);
          const shot = await flattenPage(pdfRef.current, n, edits);
          const img = await doc.embedJpg(shot.bytes);
          doc.addPage([shot.w, shot.h]).drawImage(img, { x: 0, y: 0, width: shot.w, height: shot.h });
        }
      } else {
        doc = await PDFDocument.load(bufRef.current);
        const font = await doc.embedFont(StandardFonts.Helvetica);
        for (const e of edits) addToPdf(doc.getPage(e.page - 1), e, font, rgb, tally);
      }
      const blob = new Blob([await doc.save()], { type: 'application/pdf' });
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(blob);
      const removed = edits.some((e) => e.type === 'erase' || e.type === 'replace');
      setOut({ url: url.current, lost: tally.lost, flat: flatten, hidden: !flatten && removed });
    } catch { setErr('Couldn’t save the edited PDF. Try again, or turn on “Flatten” and save again.'); }
    finally { setBusy(''); }
  };

  const reset = () => {
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = null;
    pdfRef.current = null;
    bufRef.current = null;
    setFile(null); setNumPages(0); setPageNo(1); setGeom(null); setItems([]);
    setEdits([]); setOut(null); setErr(''); setDraft(null); setTyping(null); setTyped('');
  };

  if (!file) return (
    <div className="img-tool">
      <DropZone accept={['application/pdf']} maxMB={25} kind="PDF" onFiles={open} />
      {busy && <p role="status" className="muted">{busy}</p>}
      {err && <p role="alert" className="err">{err}</p>}
    </div>
  );

  const here = edits.filter((e) => e.page === pageNo);
  const removing = edits.some((e) => e.type === 'erase' || e.type === 'replace');

  return (
    <div className="img-tool">
      <div className="btn-row">
        <span className="small"><strong>{file.name}</strong> · {numPages} {numPages === 1 ? 'page' : 'pages'}</span>
        <button type="button" className="btn" onClick={reset}>Remove this PDF</button>
      </div>

      <div className="btn-row" role="toolbar" aria-label="Editing tools">
        {TOOLS.map(([k, l]) => <button key={k} type="button" className="btn" aria-pressed={tool === k} onClick={() => pickTool(k)}>{l}</button>)}
        {tool !== 'erase' && <label className="inline">Colour <select value={color} onChange={(e) => setColor(e.target.value)}>{COLORS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>}
        {tool === 'text' && <label className="inline">Size <select value={fs} onChange={(e) => setFs(+e.target.value)}>{[10, 12, 14, 16, 20, 24, 32].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>}
      </div>

      <div className="btn-row">
        <button type="button" className="btn" disabled={pageNo <= 1} onClick={() => goPage(pageNo - 1)}>Previous page</button>
        <span aria-live="polite">Page {pageNo} of {numPages}</span>
        <button type="button" className="btn" disabled={pageNo >= numPages} onClick={() => goPage(pageNo + 1)}>Next page</button>
        <button type="button" className="btn" disabled={!edits.length} onClick={() => { setEdits((a) => a.slice(0, -1)); setOut(null); }}>Undo last</button>
        <button type="button" className="btn" disabled={!here.length} onClick={() => { setEdits((a) => a.filter((e) => e.page !== pageNo)); setOut(null); }}>Clear this page</button>
        <button type="button" className="btn" disabled={!edits.length} onClick={() => { setEdits([]); setOut(null); }}>Clear all edits</button>
      </div>

      <p className="small muted">{tool === 'edit' ? HINT.edit : tool === 'erase' ? HINT.erase : tool === 'text' ? HINT.text : HINT.draw}</p>
      {geom?.rotated && <p role="alert" className="err">This page is rotated, so editing is turned off for it. Use the PDF Page Organizer to rotate it upright first.</p>}
      {tool === 'edit' && geom && items.length === 0 && (
        <p className="notice" role="note">No editable text was found on this page. It may be a scanned picture. Use “Erase area” or “Add text” instead.</p>
      )}

      <div ref={wrap} className="pdf-stage">
        <div className="pdf-page" style={geom ? { width: geom.cw, height: geom.ch } : undefined}>
          <canvas ref={canvas} aria-label={`Page ${pageNo} preview`} />
          {geom && (
            <svg ref={svg} className="pdf-overlay" viewBox={`0 0 ${geom.w} ${geom.h}`} width={geom.cw} height={geom.ch}
              onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => setDraft(null)}>
              {tool === 'edit' && items.map((it, i) => (
                <rect key={`hit${i}`} x={it.x} y={it.y} width={it.w} height={it.h} fill="rgba(37,99,235,.08)" stroke="rgba(37,99,235,.55)" strokeWidth="0.75" strokeDasharray="3 2" />
              ))}
              {here.map((e) => shape(e, e.id))}
              {draftEdit && shape(draftEdit, 'draft', true)}
            </svg>
          )}
          {typing && geom && (
            <input className="pdf-typing" autoFocus value={typed}
              aria-label={typing.kind === 'edit' ? 'Replacement text (leave empty to remove)' : 'Text to add'}
              style={{ left: typing.x * geom.scale, top: typing.y * geom.scale, fontSize: typing.size * geom.scale, color, minWidth: typing.w ? Math.max(120, typing.w * geom.scale) : 120 }}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); commitTyping(); }
                if (e.key === 'Escape') { e.preventDefault(); cancelTyping(); }
              }} />
          )}
        </div>
      </div>

      {err && <p role="alert" className="err">{err}</p>}
      {busy && <p role="status" className="muted">{busy}</p>}

      <label className="inline small">
        <input type="checkbox" checked={flatten} onChange={(e) => { setFlatten(e.target.checked); setOut(null); }} />{' '}
        Flatten: permanently remove the original text and pictures (each page becomes a picture, text can’t be selected; Hindi and other scripts are supported)
      </label>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={!edits.length || !!busy} onClick={save}>Apply edits ({edits.length})</button>
        {out && <a className="btn btn-primary" href={out.url} download={`${file.name.replace(/\.[^.]+$/, '')}-edited.pdf`}>Download edited PDF</a>}
      </div>

      {out && (
        <section className="pdf-output-preview" aria-label="Edited PDF preview">
          <h3>Edited PDF preview</h3>
          <p className="small muted">Check the saved result here before downloading.</p>
          <iframe title="Preview of edited PDF" src={out.url}
            style={{ width: '100%', height: '640px', border: '1px solid #d1d5db', borderRadius: '12px', background: '#f3f4f6' }} />
        </section>
      )}
      {out?.hidden && removing && (
        <p className="notice" role="note">The erased or replaced text is hidden, but the original is still inside the file and can be copied. Turn on “Flatten” and apply again to remove it permanently.</p>
      )}
      {out?.lost > 0 && <p className="notice" role="note">{out.lost} character(s) outside basic Latin couldn’t be added as text and became “?”. Turn on “Flatten” to keep them.</p>}
    </div>
  );
}
