// After `vite build`: writes one HTML file per route with correct <title>, description,
// canonical, robots and a <noscript> summary, so crawlers and link previews don't depend on JavaScript.
// Also writes 404.html (noindex) so unknown URLs return a real 404 status on Cloudflare Pages.
import './loadenv.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, categories } from '../src/data/tools.js';
import { companyLinks, legalLinks } from '../src/data/pages.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const cfg = fs.readFileSync(path.join(root, 'src/config.js'), 'utf8');
const name = cfg.match(/name: '([^']+)'/)[1];
const tagline = cfg.match(/tagline: '([^']+)'/)[1];
const envFile = fs.existsSync(path.join(root, '.env')) ? fs.readFileSync(path.join(root, '.env'), 'utf8') : '';
const site = (process.env.VITE_SITE_URL || (envFile.match(/^VITE_SITE_URL=(.*)$/m) || [])[1] || 'https://your-domain.com').trim().replace(/\/$/, '');
const client = (process.env.VITE_ADSENSE_CLIENT || '').trim();
const adScript = /^ca-pub-\d{16}$/.test(client)
  ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>\n` : '';
const tpl = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const pages = [
  { path: '/blog/how-to-reduce-image-to-100kb', title: 'How to Reduce an Image to 100KB Online', desc: 'Learn how to reduce an image to 100KB online with compression, format selection, and quality settings. Get practical tips to keep images clear and lightweight.', index: true },
  { path: '/blog/how-to-convert-jpg-to-webp-online', title: 'How to Convert JPG to WebP Online Free | Fylzora', desc: 'Learn how to convert JPG images to WebP online, understand the benefits of WebP, and optimize images for faster website loading.', index: true },
  { path: '/', title: '', desc: 'Free online tools for images, PDF, Word and Excel files, designed to run in your browser with no sign-up.', index: true },
  { path: '/all-tools', title: 'All Tools', desc: 'Every image, PDF, Word and Excel tool in one list.', index: true },
  ...Object.entries(categories).map(([k, c]) => ({ path: `/${c.slug}`, title: c.name,
    desc: `${c.blurb} Free ${c.short.toLowerCase()} tools that run in your browser.`,
    index: tools.some((t) => t.live && (t.category === k || t.alsoIn.includes(k))) })),
  ...[...companyLinks, ...legalLinks].map((l) => ({ path: l.to, title: l.label, desc: l.description, index: true })),
  ...tools.map((t) => ({ path: `/${t.slug}`, title: t.name, desc: t.description, index: t.live })),
];

function render(p, file404 = false) {
  const full = p.title ? `${p.title} | ${name}` : `${name} – ${tagline}`;
  const url = site + (p.path === '/' ? '/' : p.path);
  let h = tpl
    .replace(/<title>.*?<\/title>/, `<title>${esc(full)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/s, `<meta name="description" content="${esc(p.desc)}" />`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(full)}`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/s, `<meta property="og:description" content="${esc(p.desc)}" />`)
    .replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/gi, '')
   .replace('</head>', `<link rel="canonical" href="${file404 ? site + '/' : url}">\n<meta property="og:url" content="${url}">\n<meta name="robots" content="${p.index ? 'index, follow' : 'noindex, follow'}">\n</head>`)

    .replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript><h1>${esc(p.title || name)}</h1><p>${esc(p.desc)}</p><p>${name} needs JavaScript enabled, because its tools run inside your browser.</p></noscript>`);
  return h;
}

for (const p of pages) {
  const dir = p.path === '/' ? dist : path.join(dist, p.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(p));
}
fs.writeFileSync(path.join(dist, '404.html'), render({ path: '/404', title: 'Page not found', desc: 'This page does not exist.', index: false }, true));
console.log(`Prerendered meta for ${pages.length} routes + 404.html`);
