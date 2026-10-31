import { PDFName, PDFRawStream } from 'pdf-lib';

export async function recompressImages(doc, reencode, minBytes = 5000) {
  const ctx = doc.context;
  const N = (s) => PDFName.of(s);

  let count = 0;
  let before = 0;
  let after = 0;

  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;

    const d = obj.dict;

    if (d.get(N('Subtype'))?.toString() !== '/Image') continue;
    if (d.get(N('Filter'))?.toString() !== '/DCTDecode') continue;
    if (d.get(N('ColorSpace'))?.toString() !== '/DeviceRGB') continue;

    if (
      d.get(N('Mask')) ||
      d.get(N('SMask')) ||
      d.get(N('Decode')) ||
      d.get(N('ImageMask'))
    ) continue;

    const bytes = obj.getContents();
    if (bytes.length < minBytes) continue;

    const w = d.get(N('Width'))?.asNumber?.();
    const h = d.get(N('Height'))?.asNumber?.();

    if (!w || !h) continue;

    try {
      const result = await reencode(bytes, w, h);

      if (!result?.bytes?.length) continue;

      // Replace only when the new image is actually smaller.
      if (result.bytes.length >= bytes.length) continue;

      const nd = d.clone(ctx);

      nd.set(N('Width'), ctx.obj(result.width));
      nd.set(N('Height'), ctx.obj(result.height));
      nd.set(N('Length'), ctx.obj(result.bytes.length));

      ctx.assign(ref, PDFRawStream.of(nd, result.bytes));

      count++;
      before += bytes.length;
      after += result.bytes.length;
    } catch (error) {
      console.warn('Skipping an unsupported PDF image:', error);
    }
  }

  return { count, before, after };
}
