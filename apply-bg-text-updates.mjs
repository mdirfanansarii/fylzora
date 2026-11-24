// Updates ONLY the 'image-background-color' entries in your data files, so the
// text matches the new tool. Your other entries (image-enhancer etc.) are not touched.
// Run once from the project root:   node apply-bg-text-updates.mjs
import fs from 'node:fs';
import path from 'node:path';

const KEY = "'image-background-color'";

const FAQ = `[
    ['Can I change the background of a photo of a person?', 'Yes. Choose “Photo of a person”. The tool finds the person in your browser and replaces the whole background, including walls, curtains and windows, with the colour you pick. Check the edges in the preview, especially around hair, and use “Cut-out edge” to make the outline tighter or looser.'],
    ['Can I use it for a logo, signature or product photo?', 'Yes. Choose “Plain colour background”. It removes background colours that touch the edges of the picture. If a part is left behind, click it in the Original picture or raise Sensitivity.'],
    ['Is my picture uploaded to a server?', 'No. The picture and the person detection run in your browser. The small detection files are loaded from this website, and your image stays on your device.'],
    ['Will every part of the background always be replaced?', 'Most of the time, but not always. Fine hair, thin straps, transparent objects and backgrounds that match the subject’s colours can leave small mistakes, so check the preview before you download.']
  ]`;

const CONTENT_STRING = `'Change image background colours online for free with Fylzora Image Background Color tool. For photos of people, it finds the person in your browser and replaces the whole background with a colour of your choice, even when the background has several colours. For logos, signatures and product images, a colour-matching mode removes plain backgrounds. Choose PNG, JPG or WebP as the output format. Fine hair and thin details may need a quick check in the preview before you download.'`;

const CONTENT_OBJECT = `{
    intro: 'Change image background colours online for free with Fylzora Image Background Color Tool. Upload a photo of a person and the tool finds the person in your browser, then replaces the entire background with a solid colour, including walls, curtains and windows. For logos, signatures and product images there is a Plain colour mode that removes background colours touching the edges of the picture. Export the result as PNG, JPG or WebP. Results depend on the picture, so check the preview, especially around hair, before downloading. Supports images up to 25 MB.',
    steps: [
      'Upload a JPG, PNG or WebP image.',
      'Choose a background colour. Keep “Photo of a person” for portraits, or switch to “Plain colour background” for logos, signatures and products.',
      'Check the preview, adjust “Cut-out edge” or “Sensitivity” if needed, then download the result as PNG, JPG or WebP.'
    ]
  }`;

const GUIDE_OBJECT = `{
    summary: 'Replace the background of a photo with a solid colour of your choice and save the result as PNG, JPG or WebP.',
    when: 'Useful for profile pictures, ID-style photos and application forms that ask for a plain background, and for putting a logo, signature or product on a clean colour. For portraits the tool finds the person first, so busy walls and curtains are replaced as well.',
    tips: [
      'For photos of people, keep “Photo of a person”. If the outline looks too tight or cuts into hair, move “Cut-out edge” towards + (wider); if a little of the old background shows, move it towards − (tighter).',
      'For logos, signatures and products on a plain background, switch to “Plain colour background”. If a patch is left, click it in the Original picture to remove that colour, or raise Sensitivity.',
      'Good light and a sharp photo give the cleanest edges. Fine hair, thin straps and see-through objects are the hardest parts, so zoom in on the preview before you download.',
      'Choose PNG or WebP to keep edges crisp. JPG is lossy and can leave faint halos around the subject.'
    ],
  }`;

// ---- tiny scanner: end index (exclusive) of the value that starts at `start`
function valueEnd(src, start) {
  const open = src[start];
  if (open === "'" || open === '"' || open === '`') {
    for (let i = start + 1; i < src.length; i++) {
      if (src[i] === '\\') { i++; continue; }
      if (src[i] === open) return i + 1;
    }
    return -1;
  }
  if (open !== '{' && open !== '[') return -1;
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (c === "'" || c === '"' || c === '`') {
      const e = valueEnd(src, i);
      if (e < 0) return -1;
      i = e - 1;
      continue;
    }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '{' || c === '[') depth++;
    if (c === '}' || c === ']') { depth--; if (depth === 0) return i + 1; }
  }
  return -1;
}

// replace every `'image-background-color': <value>` whose value starts with one of the kinds
function patch(src, kinds) {
  let out = '';
  let pos = 0;
  let count = 0;
  while (true) {
    const k = src.indexOf(KEY, pos);
    if (k < 0) break;
    let v = k + KEY.length;
    while (/\s/.test(src[v])) v++;
    if (src[v] !== ':') { out += src.slice(pos, k + KEY.length); pos = k + KEY.length; continue; }
    v++;
    while (/\s/.test(src[v])) v++;
    const end = valueEnd(src, v);
    const replacement = kinds[src[v]];
    if (end < 0 || !replacement) { out += src.slice(pos, end < 0 ? k + KEY.length : end); pos = end < 0 ? k + KEY.length : end; continue; }
    out += src.slice(pos, v) + replacement;
    pos = end;
    count++;
  }
  return { text: out + src.slice(pos), count };
}

const jobs = [
  { file: 'src/data/toolFaqs.js', kinds: { '[': FAQ } },
  { file: 'src/data/toolContent.js', kinds: { "'": CONTENT_STRING, '{': CONTENT_OBJECT } },
  { file: 'src/data/toolGuides.js', kinds: { '{': GUIDE_OBJECT } },
];

const backup = path.join('.bg-backup');
let problems = 0;
for (const job of jobs) {
  if (!fs.existsSync(job.file)) { console.log(`SKIP   ${job.file} (not found - run this from the project root)`); problems++; continue; }
  const before = fs.readFileSync(job.file, 'utf8');
  const { text, count } = patch(before, job.kinds);
  if (!count) { console.log(`NOTHING ${job.file}: no 'image-background-color' entry found`); problems++; continue; }
  if (text === before) { console.log(`OK     ${job.file} (already up to date)`); continue; }
  fs.mkdirSync(path.join(backup, path.dirname(job.file)), { recursive: true });
  fs.writeFileSync(path.join(backup, job.file), before);
  fs.writeFileSync(job.file, text);
  console.log(`UPDATED ${job.file} (${count} entr${count === 1 ? 'y' : 'ies'}; backup in ${backup}/)`);
}

// optional: short description in tools.js
const toolsFile = 'src/data/tools.js';
if (fs.existsSync(toolsFile)) {
  const t = fs.readFileSync(toolsFile, 'utf8');
  const oldText = 'Change connected image background areas to a solid colour. Export as PNG, JPG or WebP.';
  const newText = 'Replace the background of a photo with a solid colour. Finds the person in portraits; also removes plain backgrounds from logos and products. Export as PNG, JPG or WebP.';
  if (t.includes(oldText)) {
    fs.mkdirSync(path.join(backup, 'src/data'), { recursive: true });
    fs.writeFileSync(path.join(backup, toolsFile), t);
    fs.writeFileSync(toolsFile, t.replace(oldText, newText));
    console.log(`UPDATED ${toolsFile}`);
  } else console.log(`OK     ${toolsFile} (nothing to change)`);
}
console.log(problems ? '\nSome files were not updated - see above.' : '\nDone. Now run: npm run build');
