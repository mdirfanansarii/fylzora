import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';

export default function PdfProtect() {
  const [file, setFile] = useState(null);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);
  const [lock, setLock] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [out, setOut] = useState(null);
  const url = useRef(null);
  useEffect(() => () => url.current && URL.revokeObjectURL(url.current), []);
  const reset = () => { if (url.current) URL.revokeObjectURL(url.current); url.current = null; setFile(null); setOut(null); setPw(''); setPw2(''); setErr(''); };

  const run = async () => {
    setErr(''); setOut(null);
    if (pw.length < 6) return setErr('Use a password of at least 6 characters.');
    if (pw !== pw2) return setErr('The two passwords don’t match.');
    setBusy(true);
    try {
      const { PDFDocument } = await import('@cantoo/pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.encrypt({ userPassword: pw, ownerPassword: `${pw}${crypto.getRandomValues(new Uint32Array(2)).join('')}`,
        permissions: lock ? { printing: false, copying: false, modifying: false, annotating: false } : { printing: 'highResolution', copying: true, modifying: false, annotating: true } });
      const bytes = await doc.save();
      // Safety check: the finished file must refuse to open without the password.
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      let protectedOk = false;
      try { await pdfjs.getDocument({ data: new Uint8Array(bytes.slice(0)) }).promise; } catch (e) { protectedOk = e && e.name === 'PasswordException'; }
      if (!protectedOk) throw new Error('verify');
      const blob = new Blob([bytes], { type: 'application/pdf' });
      url.current = URL.createObjectURL(blob);
      setOut({ blob, url: url.current });
    } catch {
      setErr('We couldn’t protect this PDF. It may already be password-protected or damaged.');
    } finally { setBusy(false); }
  };

  return (
    <div className="img-tool">
      {!file ? <DropZone accept={['application/pdf']} maxMB={25} kind="PDF" onFiles={([f]) => { setFile(f); setErr(''); }} /> : (
        <>
          <p><strong>{file.name}</strong></p>
          <div className="controls">
            <label>Password<input type={show ? 'text' : 'password'} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /></label>
            <label>Repeat password<input type={show ? 'text' : 'password'} autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></label>
            <label className="inline"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />Show passwords</label>
          </div>
          <label className="inline"><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Also block printing and copying text (viewers that respect PDF permissions)</label>
          <p className="notice" role="note">If you forget this password, nobody can recover the file, including us. Keep the original.</p>
          {err && <p role="alert" className="err">{err}</p>}
          {busy && <p role="status" className="muted">Encrypting…</p>}
          <div className="btn-row">
            <button type="button" className="btn btn-primary" disabled={busy} onClick={run}>Protect PDF</button>
            <button type="button" className="btn" onClick={reset}>Process another file</button>
          </div>
          {out && <div className="btn-row"><a className="btn btn-primary" href={out.url} download={`${file.name.replace(/\.[^.]+$/, '')}-protected.pdf`}>Download protected PDF</a></div>}
        </>
      )}
    </div>
  );
}
