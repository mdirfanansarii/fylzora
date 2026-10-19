// Turns the text layer of a PDF into simple structured blocks (headings, paragraphs, bullets).
export async function extractBlocks(pdf, onPage) {
  const pages = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    onPage?.(p, pdf.numPages);
    const tc = await (await pdf.getPage(p)).getTextContent();
    const items = tc.items.filter((i) => typeof i.str === 'string' && i.str.length)
      .map((i) => ({ s: i.str, x: i.transform[4], y: i.transform[5], size: Math.hypot(i.transform[0], i.transform[1]) || i.height || 10, w: i.width || 0 }))
      .sort((a, b) => b.y - a.y || a.x - b.x);
    const lines = [];
    for (const it of items) {
      const last = lines[lines.length - 1];
      if (last && Math.abs(last.y - it.y) <= Math.max(2, it.size * 0.4)) last.items.push(it);
      else lines.push({ y: it.y, items: [it] });
    }
    pages.push(lines.map((l) => {
      l.items.sort((a, b) => a.x - b.x);
      let text = '';
      l.items.forEach((it, i) => {
        if (i) { const prev = l.items[i - 1]; const gap = it.x - (prev.x + prev.w); if (gap > prev.size * 0.15 && !text.endsWith(' ') && !it.s.startsWith(' ')) text += ' '; }
        text += it.s;
      });
      return { text: text.replace(/\s+/g, ' ').trim(), y: l.y, size: Math.max(...l.items.map((i) => i.size)) };
    }).filter((l) => l.text));
  }
  const sizes = pages.flat().flatMap((l) => Array(Math.min(l.text.length, 200)).fill(Math.round(l.size * 2) / 2)).sort((a, b) => a - b);
  const body = sizes[Math.floor(sizes.length / 2)] || 11;
  const blocks = [];
  pages.forEach((lines, pi) => {
    let prev = null; let cur = null;
    const flush = () => { if (cur) { blocks.push(cur); cur = null; } };
    lines.forEach((l) => {
      const heading = l.text.length < 120 && l.size >= body * 1.25 ? (l.size >= body * 1.5 ? 1 : 2) : 0;
      const bullet = /^[•▪●◦\-–*]\s+/.test(l.text);
      const gap = prev ? prev.y - l.y : 0;
      const newPara = !cur || heading || cur.heading || bullet || gap > prev.size * 1.8 || Math.abs(l.size - prev.size) > body * 0.2;
      if (newPara) {
        flush();
        cur = { text: bullet ? l.text.replace(/^[•▪●◦\-–*]\s+/, '') : l.text, heading, bullet, page: pi };
      } else cur.text = cur.text.endsWith('-') ? cur.text.slice(0, -1) + l.text : `${cur.text} ${l.text}`;
      prev = l;
    });
    flush();
  });
  return blocks;
}
