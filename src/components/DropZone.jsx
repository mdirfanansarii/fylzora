import { useRef, useState } from 'react';

export default function DropZone({
  accept,
  maxMB,
  multiple = false,
  maxFiles = 20,
  onFiles,
  kind = 'image',
  exts = [],
  formats
}) {
  const [over, setOver] = useState(false);
  const [err, setErr] = useState('');
  const input = useRef(null);

  const handle = (list) => {
    const ok = [];
    const bad = [];

    for (const f of Array.from(list)) {
      const okType =
        accept.includes(f.type) ||
        exts.some((x) => f.name.toLowerCase().endsWith(x));

      if (/\.doc$/i.test(f.name) && exts.includes('.docx')) {
        bad.push(
          `${f.name}: old .doc files aren’t supported. Open it in Word or LibreOffice and save it as .docx first`
        );
      } else if (!okType) {
        bad.push(`${f.name}: this format isn’t supported`);
      } else if (f.size > maxMB * 1048576) {
        bad.push(`${f.name}: larger than ${maxMB} MB`);
      } else if (f.size === 0) {
        bad.push(`${f.name}: the file is empty`);
      } else {
        ok.push(f);
      }
    }

    if (multiple && ok.length > maxFiles) {
      bad.push(`Only the first ${maxFiles} files were added`);
    }

    setErr(bad.join(' · '));

    if (ok.length) {
      onFiles(multiple ? ok.slice(0, maxFiles) : ok.slice(0, 1));
    }
  };

  const formatText =
    formats ||
    accept
      .map((a) => {
        const type = a.split('/')[1] || a;
        return type.toUpperCase().replace('JPEG', 'JPG');
      })
      .join(', ');

  return (
    <div
      className={`drop fylzora-dropzone ${over ? 'is-over' : ''}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files);
      }}
    >
      <div className="fylzora-upload-icon" aria-hidden="true">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 31V8m0 0L15 17m9-9 9 9"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 29v8a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3v-8"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="fylzora-upload-heading">
        {over
          ? 'Drop your files here'
          : `Drag and drop ${
              multiple
                ? `${kind}s`
                : `${/^[aeiou]/i.test(kind) ? 'an' : 'a'} ${kind}`
            } here`}
      </p>

      <p className="fylzora-upload-subtitle">
        or select a file from your device
      </p>

      <button
        type="button"
        className="btn fylzora-browse-btn"
        onClick={() => input.current?.click()}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 13V3m0 0L6 7m4-4 4 4M4 12v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Choose files
      </button>

      <input
        ref={input}
        type="file"
        hidden
        accept={[...accept, ...exts].join(',')}
        multiple={multiple}
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = '';
        }}
      />

      <div className="fylzora-upload-meta">
        <span className="fylzora-meta-item">
          <span className="fylzora-meta-dot" />
          {formatText}
        </span>
        <span className="fylzora-meta-separator">·</span>
        <span>Up to {maxMB} MB each</span>
        {multiple && (
          <>
            <span className="fylzora-meta-separator">·</span>
            <span>Up to {maxFiles} files</span>
          </>
        )}
      </div>

      <p className="fylzora-privacy-note">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 2.5 16 5v4.5c0 3.8-2.5 6.4-6 8-3.5-1.6-6-4.2-6-8V5l6-2.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="m7.5 9.8 1.7 1.7 3.4-3.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Files are processed on your device
      </p>

      {err && (
        <p role="alert" className="err fylzora-upload-error">
          {err}
        </p>
      )}
    </div>
  );
}
