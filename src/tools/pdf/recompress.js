import { PDFName, PDFRawStream } from 'pdf-lib';

// Re-encodes the JPEG photos embedded in a PDF (text and vector content stay untouched).
// `reencode(bytes, width, height)` must return { bytes, width, height } or null. It is injected
// so the browser can use <canvas> while tests can use anything else.
export async function recompressImages(doc, reencode, minBytes = 15000) {
  const ctx = doc.context;
  const N = (s) => PDFName.of(s);
  let count = 0; let before = 0; let after = 0;
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    const d = obj.dict;
    if (d.get(N('Subtype')) !== N('Image')) continue;
    if (d.get(N('Filter')) !== N('DCTDecode')) continue; // plain JPEG only
    if (d.get(N('ColorSpace')) !== N('DeviceRGB')) continue; // skip gray/CMYK/ICC: canvas would change colours
    if (d.get(N('Mask')) || d.get(N('Decode')) || d.get(N('ImageMask'))) continue;
    const bytes = obj.getContents();
    if (bytes.length < minBytes) continue;
    const w = d.get(N('Width'))?.asNumber?.();
    const h = d.get(N('Height'))?.asNumber?.();
    if (!w || !h) continue;
    let res = null;
    try { res = await reencode(bytes, w, h); } catch { res = null; }
    if (!res || res.bytes.length >= bytes.length * 0.9) continue;
    const nd = d.clone(ctx);
    nd.set(N('Width'), ctx.obj(res.width));
    nd.set(N('Height'), ctx.obj(res.height));
    nd.set(N('Length'), ctx.obj(res.bytes.length));
    ctx.assign(ref, PDFRawStream.of(nd, res.bytes));
    count++; before += bytes.length; after += res.bytes.length;
  }
  return { count, before, after };
}
