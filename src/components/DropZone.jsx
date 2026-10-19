import { useRef, useState } from 'react';

// Drag-and-drop + Browse button. Validates type and size, then calls onFiles(validFiles).
export default function DropZone({ accept, maxMB, multiple = false, maxFiles = 20, onFiles, kind = 'image', exts = [], formats }) {
  const [over, setOver] = useState(false);
  const [err, setErr] = useState('');
  const input = useRef(null);

  const handle = (list) => {
    const ok = [];
    const bad = [];
    for (const f of Array.from(list)) {
      const okType = accept.includes(f.type) || exts.some((x) => f.name.toLowerCase().endsWith(x));
      if (/\.doc$/i.test(f.name) && exts.includes('.docx')) bad.push(`${f.name}: old .doc files aren’t supported. Open it in Word or LibreOffice and save it as .docx first`);
      else if (!okType) bad.push(`${f.name}: this format isn’t supported`);
      else if (f.size > maxMB * 1048576) bad.push(`${f.name}: larger than ${maxMB} MB`);
      else if (f.size === 0) bad.push(`${f.name}: the file is empty`);
      else ok.push(f);
    }
    if (multiple && ok.length > maxFiles) bad.push(`Only the first ${maxFiles} files were added`);
    setErr(bad.join(' · '));
    if (ok.length) onFiles(multiple ? ok.slice(0, maxFiles) : ok.slice(0, 1));
  };

  return (
    <div
      className={`drop ${over ? 'is-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}
    >
      <p className="drop-title">Drag and drop {multiple ? `${kind}s` : `${/^[aeiou]/i.test(kind) ? 'an' : 'a'} ${kind}`} here</p>
      <button type="button" className="btn" onClick={() => input.current.click()}>Browse files</button>
      <input ref={input} type="file" hidden accept={[...accept, ...exts].join(',')} multiple={multiple}
        onChange={(e) => { handle(e.target.files); e.target.value = ''; }} />
      <p className="small muted">
        {formats || accept.map((a) => a.split('/')[1].toUpperCase().replace('JPEG', 'JPG')).join(', ')} · up to {maxMB} MB each
        {multiple ? ` · up to ${maxFiles} files` : ''} · processed on your device
      </p>
      {err && <p role="alert" className="err">{err}</p>}
    </div>
  );
}
