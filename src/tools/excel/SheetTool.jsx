import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const CSV_TYPES = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);
const MAXR = 200;
const MAXC = 30;

const plain = (v) => {
  if (v == null) return '';
  if (v instanceof Date) {
    const t = v.getUTCHours() || v.getUTCMinutes() || v.getUTCSeconds();
    return t ? v.toISOString().replace('T', ' ').slice(0, 19) : v.toISOString().slice(0, 10);
  }
  return String(v);
};
const cellVal = (v) => {
  if (v == null) return '';
  if (v instanceof Date) return v;
  if (typeof v === 'object') {
    if ('result' in v) return cellVal(v.result);
    if (v.richText) return v.richText.map((t) => t.text).join('');
    if (v.text !== undefined) return v.text;
    if (v.error) return v.error;
    return '';
  }
  return v;
};
const trimGrid = (rows) => {
  const r = rows.map((x) => [...x]);
  while (r.length && r[r.length - 1].every((c) => plain(c) === '')) r.pop();
  const w = Math.max(0, ...r.map((x) => { let n = x.length; while (n && plain(x[n - 1]) === '') n--; return n; }));
  return r.map((x) => Array.from({ length: w }, (_, i) => (x[i] === undefined ? '' : x[i])));
};

async function readXlsx(buf) {
  const mod = await import('exceljs');
  const wb = new (mod.default || mod).Workbook();
  await wb.xlsx.load(buf);
  return wb.worksheets.map((ws) => {
    const rows = [];
    for (let r = 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      rows.push(Array.from({ length: ws.columnCount }, (_, c) => cellVal(row.getCell(c + 1).value)));
    }
    return { name: ws.name, rows: trimGrid(rows) };
  });
}
async function readCsv(text, name) {
  const Papa = (await import('papaparse')).default;
  const res = Papa.parse(text.replace(/^\uFEFF/, ''), { skipEmptyLines: 'greedy' });
  return [{ name, rows: trimGrid(res.data) }];
}
function jsonToRows(data) {
  if (!Array.isArray(data)) throw new Error('The JSON must be an array, for example [{"name":"A","age":3}].');
  if (data.every(Array.isArray)) return data;
  const keys = [];
  data.forEach((o) => { if (o && typeof o === 'object') Object.keys(o).forEach((k) => { if (!keys.includes(k)) keys.push(k); }); });
  if (!keys.length) throw new Error('No objects with keys were found in this JSON.');
  const val = (v) => (v && typeof v === 'object' ? JSON.stringify(v) : v ?? '');
  return [keys, ...data.map((o) => keys.map((k) => val(o && o[k])))];
}
function rowsToObjects(rows) {
  const seen = {};
  const head = (rows[0] || []).map((h, i) => {
    let k = plain(h).trim() || `column_${i + 1}`;
    seen[k] = (seen[k] || 0) + 1;
    if (seen[k] > 1) k = `${k}_${seen[k]}`;
    return k;
  });
  return rows.slice(1).map((r) => Object.fromEntries(head.map((k, i) => [k, r[i] instanceof Date ? plain(r[i]) : r[i]])));
}

async function writeXlsx(sheets, style = false) {
  const mod = await import('exceljs');
  const wb = new (mod.default || mod).Workbook();
  const used = new Set();
  sheets.forEach((s, i) => {
    let nm = (s.name || `Sheet${i + 1}`).replace(/[\\/?*[\]:]/g, '_').slice(0, 31) || `Sheet${i + 1}`;
    while (used.has(nm.toLowerCase())) nm = `${nm.slice(0, 27)}_${i + 1}`;
    used.add(nm.toLowerCase());
    const ws = wb.addWorksheet(nm);
    ws.addRows(s.rows);
    if (style && s.rows.length) {
      ws.getRow(1).font = { bold: true };
      ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F0FE' } };
      ws.views = [{ state: 'frozen', ySplit: 1 }];
      ws.columns.forEach((col) => {
        let m = 8;
        col.eachCell({ includeEmpty: false }, (c) => { m = Math.max(m, plain(c.value).length + 2); });
        col.width = Math.min(m, 60);
      });
    }
  });
  return new Blob([await wb.xlsx.writeBuffer()], { type: XLSX });
}
async function writeCsv(rows) {
  const Papa = (await import('papaparse')).default;
  return new Blob([`\uFEFF${Papa.unparse(rows.map((r) => r.map(plain)))}`], { type: 'text/csv;charset=utf-8' });
}
async function writePdf(sheets) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [W, H, M, FS, LH] = [842, 595, 36, 9, 14];
  let lost = 0;
  const clean = (v) => plain(v).replace(/\s+/g, ' ').replace(/[^\x20-\x7E\xA0-\xFF]/g, () => { lost++; return '?'; });
  for (const s of sheets) {
    if (!s.rows.length) continue;
    const cols = s.rows[0].length;
    const widths = Array.from({ length: cols }, (_, c) => Math.min(160, Math.max(40, ...s.rows.slice(0, 200).map((r) => font.widthOfTextAtSize(clean(r[c]), FS) + 10))));
    const groups = [];
    let cur = []; let w = 0;
    widths.forEach((cw, c) => { if (w + cw > W - 2 * M && cur.length) { groups.push(cur); cur = []; w = 0; } cur.push(c); w += cw; });
    if (cur.length) groups.push(cur);
    for (const g of groups) {
      let page = doc.addPage([W, H]);
      let y = H - M;
      page.drawText(s.name.slice(0, 60), { x: M, y, size: 11, font: bold }); y -= 22;
      s.rows.forEach((row, ri) => {
        if (y < M) { page = doc.addPage([W, H]); y = H - M; }
        let x = M;
        g.forEach((c) => {
          let t = clean(row[c]);
          while (t.length > 1 && font.widthOfTextAtSize(t, FS) > widths[c] - 6) t = t.slice(0, -2);
          page.drawText(t, { x: x + 2, y, size: FS, font: ri === 0 ? bold : font, color: rgb(0.1, 0.1, 0.1) });
          x += widths[c];
        });
        y -= LH;
      });
    }
  }
  if (!doc.getPageCount()) throw new Error('This workbook has no data to put in a PDF.');
  return { blob: new Blob([await doc.save()], { type: 'application/pdf' }), lost };
}

const ACCEPT = {
  xlsx: { types: [XLSX], exts: ['.xlsx'], label: 'XLSX' },
  csv: { types: CSV_TYPES, exts: ['.csv'], label: 'CSV' },
  json: { types: ['application/json'], exts: ['.json'], label: 'JSON' },
  both: { types: [XLSX, ...CSV_TYPES], exts: ['.xlsx', '.csv'], label: 'XLSX, CSV' },
};
const SRC = { xlsx2csv: 'xlsx', xlsx2pdf: 'xlsx', xlsx2json: 'xlsx', csv2xlsx: 'csv', csvedit: 'csv', json2xlsx: 'json' };
const GRID = ['viewer', 'edit', 'csvedit', 'dupes', 'blanks', 'manage', 'format'];
const EDIT = ['edit', 'csvedit', 'manage'];

export default function SheetTool({ mode }) {
  const src = ACCEPT[SRC[mode] || 'both'];
  const multi = mode === 'merge';
  const [files, setFiles] = useState([]); // merge: [{name, sheets}]
  const [sheets, setSheets] = useState([]);
  const [act, setAct] = useState(0);
  const [name, setName] = useState('workbook');
  const [out, setOut] = useState([]);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [o, setO] = useState({ all: true, fmt: 'xlsx', stack: false, hdr: true, ci: false, cols: false, trim: true, num: true });
  const [dup, setDup] = useState(new Set());
  const urls = useRef([]);
  const set = (p) => setO((x) => ({ ...x, ...p }));

  const clearOut = () => { urls.current.forEach((u) => URL.revokeObjectURL(u)); urls.current = []; setOut([]); };
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);
  const add = (blob, fname) => { const url = URL.createObjectURL(blob); urls.current.push(url); return { blob, name: fname, url }; };
  const sheet = sheets[act];
  const setRows = (fn) => { setSheets((s) => s.map((x, i) => (i === act ? { ...x, rows: fn(x.rows) } : x))); setOut([]); setDup(new Set()); };

  const parse = async (f) => {
    const nm = f.name.replace(/\.[^.]+$/, '');
    const low = f.name.toLowerCase();
    if (low.endsWith('.xlsx')) return readXlsx(await f.arrayBuffer());
    if (low.endsWith('.json')) return [{ name: nm, rows: jsonToRows(JSON.parse(await f.text())) }];
    return readCsv(await f.text(), nm);
  };

  const onFiles = async (list) => {
    setErr(''); setNote(''); clearOut(); setBusy('Reading file…');
    try {
      const parsed = [];
      for (const f of list) parsed.push({ name: f.name, sheets: await parse(f) });
      if (multi) setFiles((p) => [...p, ...parsed].slice(0, 20));
      else { setSheets(parsed[0].sheets); setName(list[0].name.replace(/\.[^.]+$/, '')); setAct(0); }
    } catch (e) {
      setErr(/JSON|array|objects/.test(e.message) ? e.message : 'We couldn’t read this file. It may be damaged, password-protected or in an older format (.xls). Save it as .xlsx or .csv and try again.');
    } finally { setBusy(''); }
  };

  const run = async (kind) => {
    setErr(''); setNote(''); clearOut(); setBusy('Processing…');
    try {
      const res = [];
      if (mode === 'xlsx2csv' || (mode === 'export' && o.fmt === 'csv')) {
        const list = o.all ? sheets : [sheet];
        for (const s of list) res.push(add(await writeCsv(s.rows), `${name}${list.length > 1 ? `-${s.name}` : ''}.csv`));
        setNote('CSV keeps values only. Formulas (their last results are kept), formatting, colours and other sheets are not included.');
      } else if (mode === 'export') {
        for (const s of sheets) res.push(add(await writeXlsx([s]), `${name}-${s.name}.xlsx`));
      } else if (mode === 'csv2xlsx' || mode === 'json2xlsx') res.push(add(await writeXlsx(sheets), `${name}.xlsx`));
      else if (mode === 'xlsx2json') {
        const json = sheets.length === 1 ? rowsToObjects(sheets[0].rows) : Object.fromEntries(sheets.map((s) => [s.name, rowsToObjects(s.rows)]));
        res.push(add(new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }), `${name}.json`));
        setNote('The first row of each sheet is used as the field names.');
      } else if (mode === 'xlsx2pdf') {
        const { blob, lost } = await writePdf(sheets);
        res.push(add(blob, `${name}.pdf`));
        setNote(`Values only: colours, borders and fonts aren’t kept. Wide sheets continue on extra pages.${lost ? ` ${lost} unsupported characters became “?”.` : ''}`);
      } else if (mode === 'merge') {
        if (o.stack) {
          const rows = [];
          files.forEach((f, i) => f.sheets[0].rows.forEach((r, ri) => { if (!(o.hdr && i > 0 && ri === 0)) rows.push(r); }));
          const w = Math.max(...rows.map((r) => r.length));
          res.push(add(await writeXlsx([{ name: 'Merged', rows: rows.map((r) => Array.from({ length: w }, (_, i) => r[i] ?? '')) }]), 'merged.xlsx'));
          setNote('Only the first sheet of each file is stacked into one sheet.');
        } else {
          const all = files.flatMap((f) => f.sheets.map((s) => ({ ...s, name: f.sheets.length > 1 ? `${f.name.replace(/\.[^.]+$/, '')}-${s.name}` : f.name.replace(/\.[^.]+$/, '') })));
          res.push(add(await writeXlsx(all), 'merged.xlsx'));
        }
      } else if (mode === 'format') {
        const fixed = sheets.map((s) => ({ ...s, rows: s.rows.filter((r) => r.some((c) => plain(c) !== '')).map((r) => r.map((c) => {
          if (typeof c !== 'string') return c;
          const t = o.trim ? c.trim().replace(/\s+/g, ' ') : c;
          return o.num && t !== '' && /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : t;
        })) }));
        setSheets(fixed);
        res.push(add(await writeXlsx(fixed, true), `${name}-formatted.xlsx`));
        setNote('Applied: trimmed text, numbers stored as numbers, blank rows removed, bold header row, frozen header and auto column widths.');
      } else if (kind === 'csv') res.push(add(await writeCsv(sheet.rows), `${name}-edited.csv`));
      else {
        res.push(add(await writeXlsx(sheets), `${name}-edited.xlsx`));
        setNote('Saved as values: formulas from the original are stored as their last calculated results.');
      }
      setOut(res);
    } catch { setErr('Something went wrong while creating the file. Try a smaller file.'); } finally { setBusy(''); }
  };

  const findDupes = () => {
    const seen = new Set(); const d = new Set();
    sheet.rows.forEach((r, i) => {
      if (o.hdr && i === 0) return;
      const k = JSON.stringify(r.map((c) => { const t = plain(c).trim(); return o.ci ? t.toLowerCase() : t; }));
      if (seen.has(k)) d.add(i); else seen.add(k);
    });
    setDup(d); setNote(`${d.size} duplicate row(s) found${d.size ? ' (highlighted). The first copy of each row is kept.' : '.'}`);
  };
  const removeDupes = () => { const n = dup.size; setRows((rows) => rows.filter((_, i) => !dup.has(i))); setNote(`Removed ${n} duplicate row(s).`); };
  const removeBlanks = () => {
    const before = sheet.rows.length;
    setRows((rows) => {
      let r = rows.filter((x) => x.some((c) => plain(c).trim() !== ''));
      if (o.cols && r.length) { const keep = r[0].map((_, c) => r.some((x) => plain(x[c]).trim() !== '')); r = r.map((x) => x.filter((_, c) => keep[c])); }
      return r;
    });
    setNote(`Blank rows removed: ${before - sheet.rows.filter((x) => x.some((c) => plain(c).trim() !== '')).length}.`);
  };
  const edit = (r, c, v) => setRows((rows) => rows.map((x, i) => (i !== r ? x : x.map((y, j) => (j !== c ? y : (typeof y === 'number' && v.trim() !== '' && !Number.isNaN(+v) ? +v : v))))));
  const colMove = (c, d) => setRows((rows) => rows.map((r) => { const n = [...r]; [n[c], n[c + d]] = [n[c + d], n[c]]; return n; }));
  const reset = () => { clearOut(); setSheets([]); setFiles([]); setErr(''); setNote(''); setDup(new Set()); setAct(0); };

  const loaded = multi ? files.length > 0 : sheets.length > 0;
  const grid = GRID.includes(mode) && sheet;
  const cols = sheet ? Math.min(sheet.rows[0]?.length || 0, MAXC) : 0;
  const manage = mode === 'manage';

  return (
    <div className="img-tool">
      {(!loaded || multi) && (
        <DropZone accept={src.types} exts={src.exts} formats={src.label} maxMB={20} multiple={multi} maxFiles={20} kind="spreadsheet" onFiles={onFiles} />
      )}
      {!loaded && <p className="small muted">Older .xls files aren’t supported. Open them in Excel or LibreOffice and save as .xlsx.</p>}
      {err && <p role="alert" className="err">{err}</p>}
      {busy && <p role="status" className="muted">{busy}</p>}

      {multi && files.length > 0 && (
        <>
          <ol className="file-order">{files.map((f, i) => (
            <li key={f.name + i}><span>{f.name} <span className="muted small">({f.sheets.length} sheet{f.sheets.length > 1 ? 's' : ''})</span></span>
              <button type="button" className="btn" onClick={() => setFiles((x) => x.filter((_, j) => j !== i))}>Remove</button></li>))}</ol>
          <div className="controls">
            <label>Merge style<select value={o.stack ? 'stack' : 'wb'} onChange={(e) => set({ stack: e.target.value === 'stack' })}>
              <option value="wb">Put every sheet into one workbook</option><option value="stack">Stack rows into one sheet</option></select></label>
            {o.stack && <label className="inline"><input type="checkbox" checked={o.hdr} onChange={(e) => set({ hdr: e.target.checked })} />Skip the header row of later files</label>}
          </div>
          <div className="btn-row"><button type="button" className="btn btn-primary" disabled={files.length < 2 || !!busy} onClick={() => run()}>Merge files</button>
            {files.length < 2 && <span className="muted small">Add at least 2 files.</span>}</div>
        </>
      )}

      {!multi && loaded && (
        <>
          <p><strong>{name}</strong> <span className="muted small">· {sheets.length} sheet{sheets.length > 1 ? 's' : ''}{sheet ? ` · ${sheet.rows.length} rows × ${sheet.rows[0]?.length || 0} columns` : ''}</span></p>
          {sheets.length > 1 && GRID.concat(['xlsx2csv', 'xlsx2json']).includes(mode) && (
            <div className="btn-row" aria-label="Sheets">
              {sheets.map((s, i) => <button key={s.name + i} type="button" aria-pressed={i === act} className="btn" onClick={() => { setAct(i); setDup(new Set()); }}>{s.name}</button>)}
            </div>
          )}
          {(mode === 'xlsx2csv') && sheets.length > 1 && (
            <label className="inline controls"><input type="checkbox" checked={o.all} onChange={(e) => set({ all: e.target.checked })} />Export every sheet (one CSV each)</label>)}
          {mode === 'export' && (
            <div className="controls"><label>Save each sheet as<select value={o.fmt} onChange={(e) => set({ fmt: e.target.value, all: true })}>
              <option value="xlsx">XLSX (one workbook per sheet)</option><option value="csv">CSV</option></select></label></div>)}
          {mode === 'dupes' && <div className="controls">
            <label className="inline"><input type="checkbox" checked={o.hdr} onChange={(e) => set({ hdr: e.target.checked })} />First row is a header</label>
            <label className="inline"><input type="checkbox" checked={o.ci} onChange={(e) => set({ ci: e.target.checked })} />Ignore upper/lower case</label></div>}
          {mode === 'blanks' && <label className="inline controls"><input type="checkbox" checked={o.cols} onChange={(e) => set({ cols: e.target.checked })} />Also remove completely empty columns</label>}
          {mode === 'format' && <div className="controls">
            <label className="inline"><input type="checkbox" checked={o.trim} onChange={(e) => set({ trim: e.target.checked })} />Trim extra spaces</label>
            <label className="inline"><input type="checkbox" checked={o.num} onChange={(e) => set({ num: e.target.checked })} />Convert numbers stored as text</label></div>}

          <div className="btn-row">
            {mode === 'dupes' && <><button type="button" className="btn" onClick={findDupes}>Find duplicates</button>
              <button type="button" className="btn" disabled={!dup.size} onClick={removeDupes}>Remove duplicates</button></>}
            {mode === 'blanks' && <button type="button" className="btn" onClick={removeBlanks}>Remove blank rows</button>}
            {manage && <>
              <button type="button" className="btn" onClick={() => setRows((r) => [...r, Array.from({ length: r[0]?.length || 1 }, () => '')])}>Add row</button>
              <button type="button" className="btn" onClick={() => setRows((r) => (r.length ? r.map((x) => [...x, '']) : [['']]))}>Add column</button></>}
          </div>

          {grid && (
            <div className="grid-wrap">
              <table className="grid">
                <thead><tr><th aria-label="Row" />{Array.from({ length: cols }, (_, c) => (
                  <th key={c}>{manage ? (<span className="col-ops">
                    <button type="button" aria-label={`Move column ${c + 1} left`} disabled={c === 0} onClick={() => colMove(c, -1)}>←</button>
                    <button type="button" aria-label={`Move column ${c + 1} right`} disabled={c === cols - 1} onClick={() => colMove(c, 1)}>→</button>
                    <button type="button" aria-label={`Delete column ${c + 1}`} onClick={() => setRows((r) => r.map((x) => x.filter((_, j) => j !== c)))}>✕</button></span>) : null}
                    {c + 1}</th>))}</tr></thead>
                <tbody>{sheet.rows.slice(0, MAXR).map((r, ri) => (
                  <tr key={ri} className={dup.has(ri) ? 'is-dup' : ''}>
                    <th scope="row">{ri + 1}{manage && <button type="button" className="row-del" aria-label={`Delete row ${ri + 1}`} onClick={() => setRows((rows) => rows.filter((_, i) => i !== ri))}>✕</button>}</th>
                    {Array.from({ length: cols }, (_, c) => (
                      <td key={c}>{EDIT.includes(mode)
                        ? <input value={plain(r[c])} aria-label={`Row ${ri + 1} column ${c + 1}`} onChange={(e) => edit(ri, c, e.target.value)} />
                        : plain(r[c])}</td>))}
                  </tr>))}</tbody>
              </table>
            </div>
          )}
          {grid && (sheet.rows.length > MAXR || (sheet.rows[0]?.length || 0) > MAXC) && (
            <p className="small muted">Showing the first {MAXR} rows and {MAXC} columns. {EDIT.includes(mode) ? 'Edits apply to the shown cells; the rest of the sheet is saved unchanged.' : 'All rows are still processed.'}</p>)}

          <div className="btn-row">
            {['xlsx2csv', 'csv2xlsx', 'xlsx2pdf', 'xlsx2json', 'json2xlsx', 'export', 'format'].includes(mode) &&
              <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => run()}>
                {{ xlsx2csv: 'Convert to CSV', csv2xlsx: 'Convert to XLSX', xlsx2pdf: 'Convert to PDF', xlsx2json: 'Convert to JSON', json2xlsx: 'Convert to XLSX', export: 'Export sheets', format: 'Format and create file' }[mode]}</button>}
            {['edit', 'manage', 'dupes', 'blanks'].includes(mode) && <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => run('xlsx')}>Save as XLSX</button>}
            {['edit', 'manage', 'dupes', 'blanks', 'csvedit'].includes(mode) && <button type="button" className="btn btn-primary" disabled={!!busy} onClick={() => run('csv')}>Save as CSV</button>}
            {mode === 'csvedit' && <button type="button" className="btn" disabled={!!busy} onClick={() => run('xlsx')}>Save as XLSX</button>}
          </div>
        </>
      )}

      {note && <p className="notice" role="note">{note}</p>}
      {out.length > 0 && (
        <ul className="img-results">{out.map((r) => (
          <li key={r.name}><p><strong>{r.name}</strong> <span className="muted small">{size(r.blob.size)}</span></p>
            <a className="btn btn-primary" href={r.url} download={r.name}>Download</a></li>))}</ul>
      )}
      {(loaded || out.length > 0) && <div className="btn-row"><button type="button" className="btn" onClick={reset}>Process another file</button></div>}
    </div>
  );
}
