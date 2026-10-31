import { useEffect, useRef, useState } from 'react';
import DropZone from '../../components/DropZone.jsx';
import { recompressImages } from './recompress.js';

const size = (n) =>
  n >= 1048576
    ? `${(n / 1048576).toFixed(2)} MB`
    : `${(n / 1024).toFixed(1)} KB`;

const LEVELS = {
  high: { q: 0.78, dim: 2200, dpi: 150 },
  balanced: { q: 0.58, dim: 1600, dpi: 110 },
  strong: { q: 0.40, dim: 1200, dpi: 80 },
};

async function reencodeJpeg(bytes, level) {
  const bmp = await createImageBitmap(
    new Blob([bytes], { type: 'image/jpeg' }),
    { imageOrientation: 'none' }
  );

  try {
    const k = Math.min(
      1,
      level.dim / Math.max(bmp.width, bmp.height)
    );

    const c = document.createElement('canvas');

    c.width = Math.max(1, Math.round(bmp.width * k));
    c.height = Math.max(1, Math.round(bmp.height * k));

    const ctx = c.getContext('2d');

    if (!ctx) throw new Error('Canvas unavailable');

    ctx.drawImage(bmp, 0, 0, c.width, c.height);

    const blob = await new Promise((resolve) =>
      c.toBlob(resolve, 'image/jpeg', level.q)
    );

    c.width = 0;
    c.height = 0;

    if (!blob) throw new Error('Image compression failed');

    return {
      bytes: new Uint8Array(await blob.arrayBuffer()),
      width: Math.max(1, Math.round(bmp.width * k)),
      height: Math.max(1, Math.round(bmp.height * k)),
    };
  } finally {
    bmp.close();
  }
}

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('images');
  const [lv, setLv] = useState('balanced');
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [res, setRes] = useState(null);

  const url = useRef(null);

  useEffect(() => {
    return () => {
      if (url.current) URL.revokeObjectURL(url.current);
    };
  }, []);

  const reset = () => {
    if (url.current) URL.revokeObjectURL(url.current);

    url.current = null;
    setFile(null);
    setRes(null);
    setErr('');
    setBusy('');
  };

  const run = async () => {
    if (!file || busy) return;

    setErr('');
    setRes(null);
    setBusy('Preparing PDF...');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await file.arrayBuffer();
      const level = LEVELS[lv];

      let bytes;
      let detail = '';

      if (mode === 'images') {
        setBusy('Compressing embedded photos...');

        const doc = await PDFDocument.load(buf);

        const r = await recompressImages(
          doc,
          (b) => reencodeJpeg(b, level)
        );

        bytes = await doc.save({
          useObjectStreams: true,
        });

        detail = r.count
          ? `${r.count} embedded image(s) compressed. Image data reduced from ${size(r.before)} to ${size(r.after)}. Text and vector graphics remain selectable.`
          : 'No supported large JPEG images were found. This PDF may contain PNG images, scanned pages or already-compressed images.';

      } else {
        const pdfjs = await import('pdfjs-dist');

        pdfjs.GlobalWorkerOptions.workerSrc =
          (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;

        const pdf = await pdfjs.getDocument({
          data: new Uint8Array(buf.slice(0)),
        }).promise;

        try {
          const out = await PDFDocument.create();

          // Sequential processing supports PDFs above 100 pages.
          for (let p = 1; p <= pdf.numPages; p++) {
            setBusy(`Compressing page ${p} of ${pdf.numPages}...`);

            const page = await pdf.getPage(p);

            const base = page.getViewport({ scale: 1 });
            const vp = page.getViewport({
              scale: level.dpi / 72,
            });

            const c = document.createElement('canvas');

            c.width = Math.max(1, Math.round(vp.width));
            c.height = Math.max(1, Math.round(vp.height));

            const ctx = c.getContext('2d', { alpha: false });

            if (!ctx) throw new Error('Canvas unavailable');

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, c.width, c.height);

            await page.render({
              canvasContext: ctx,
              viewport: vp,
            }).promise;

            const blob = await new Promise((resolve) =>
              c.toBlob(resolve, 'image/jpeg', level.q)
            );

            if (!blob) throw new Error('Page compression failed');

            const image = await out.embedJpg(
              new Uint8Array(await blob.arrayBuffer())
            );

            const outputPage = out.addPage([
              base.width,
              base.height,
            ]);

            outputPage.drawImage(image, {
              x: 0,
              y: 0,
              width: base.width,
              height: base.height,
            });

            page.cleanup();

            c.width = 0;
            c.height = 0;
          }

          bytes = await out.save({
            useObjectStreams: true,
          });

          detail = `${pdf.numPages} pages processed. Every page was converted into a compressed image. Text is no longer selectable or searchable.`;
        } finally {
          await pdf.destroy();
        }
      }

      const blob = new Blob([bytes], {
        type: 'application/pdf',
      });

      const saved = Math.round(
        (1 - blob.size / file.size) * 100
      );

      if (url.current) URL.revokeObjectURL(url.current);

      url.current = blob.size < file.size
        ? URL.createObjectURL(blob)
        : null;

      setRes({
        blob,
        saved,
        detail,
        url: url.current,
      });

    } catch (e) {
      console.error('PDF compression error:', e);

      setErr(
        e?.message ||
        'We could not compress this PDF. It may be damaged, encrypted or too large for available memory.'
      );
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="img-tool">
      {!file ? (
        <DropZone
          accept={['application/pdf']}
          maxMB={25}
          kind="PDF"
          onFiles={([f]) => {
            setFile(f);
            setRes(null);
            setErr('');
          }}
        />
      ) : (
        <>
          <p>
            <strong>{file.name}</strong>{' '}
            <span className="muted small">
              ({size(file.size)})
            </span>
          </p>

          <fieldset className="opt-set">
            <legend>Method</legend>

            <label className="inline">
              <input
                type="radio"
                name="m"
                checked={mode === 'images'}
                onChange={() => setMode('images')}
              />
              Shrink photos inside the PDF (text stays selectable)
            </label>

            <label className="inline">
              <input
                type="radio"
                name="m"
                checked={mode === 'pages'}
                onChange={() => setMode('pages')}
              />
              Maximum: turn pages into pictures (text is no longer selectable)
            </label>
          </fieldset>

          <div className="controls">
            <label>
              Compression level

              <select
                value={lv}
                onChange={(e) => setLv(e.target.value)}
              >
                <option value="high">Light: best quality</option>
                <option value="balanced">Balanced</option>
                <option value="strong">Strong: smallest file</option>
              </select>
            </label>
          </div>

          {err && (
            <p role="alert" className="err">
              {err}
            </p>
          )}

          {busy && (
            <p role="status" className="muted">
              {busy}
            </p>
          )}

          <div className="btn-row">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!busy}
              onClick={run}
            >
              {busy ? 'Compressing...' : 'Compress PDF'}
            </button>

            <button
              type="button"
              className="btn"
              onClick={reset}
            >
              Process another file
            </button>
          </div>

          {res && (
            <div className="notice" role="status">
              <p>
                <strong>
                  {size(file.size)} → {size(res.blob.size)}
                </strong>

                {res.saved > 0
                  ? ` (${res.saved}% smaller)`
                  : ' (No size reduction achieved)'}
              </p>

              <p>{res.detail}</p>

              {res.url ? (
                <a
                  className="btn btn-primary"
                  href={res.url}
                  download={`${file.name.replace(/\.[^.]+$/, '')}-compressed.pdf`}
                >
                  Download compressed PDF
                </a>
              ) : (
                <p>
                  The compressed file is not smaller than the original.
                  Try Strong compression or another method.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
