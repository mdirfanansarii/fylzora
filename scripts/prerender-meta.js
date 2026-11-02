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
const site = (process.env.VITE_SITE_URL || (envFile.match(/^VITE_SITE_URL=(.*)$/m) || [])[1] || 'https://www.fylzora.online').trim().replace(/\/$/, '');
const client = (process.env.VITE_ADSENSE_CLIENT || '').trim();
const adScript = /^ca-pub-\d{16}$/.test(client)
  ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>\n` : '';
const tpl = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const pages = [
  { path: '/blog/how-to-reduce-image-to-100kb', title: 'How to Reduce an Image to 100KB Online', desc: 'Learn how to compress JPG and PNG images online, reduce image size to around 100KB, choose WebP, and balance file size with image quality.', index: true },
  { path: '/blog/how-to-convert-jpg-to-webp-online', title: 'How to Convert JPG to WebP Online Free', desc: 'Learn how to convert JPG images to WebP online, understand the benefits of WebP, and optimize images for faster website loading.', index: true },
  { path: '/blog/how-to-merge-pdf-files-for-free', title: 'How to Merge PDF Files for Free Online', desc: 'Learn how to merge multiple PDF files into one PDF online for free. Follow simple steps to combine PDF documents in the order you choose.', index: true },
  { path: '/blog/compress-image-without-losing-quality', title: 'How to Compress an Image Without Losing Quality', desc: 'Learn how to reduce image file size while keeping good visual quality. Understand image compression, choose suitable settings, and follow simple online steps.', index: true },
  { path: '/', title: '', desc: 'Use free online tools to compress images, manage PDFs, and work with Word and Excel files directly in your browser, with no sign-up required.', index: true },
  { path: '/all-tools', title: 'All Tools', desc: 'Explore free online image, PDF, Word and Excel tools in one place. Find tools to manage files directly in your browser without installing software.', index: true },
  ...Object.entries(categories).map(([k, c]) => ({ path: `/${c.slug}`, title: c.name,
    desc: `${c.blurb} Free ${c.short.toLowerCase()} tools that run in your browser.`,
    index: tools.some((t) => t.live && (t.category === k || t.alsoIn.includes(k))) })),
  ...[...companyLinks, ...legalLinks].map((l) => ({ path: l.to, title: l.label, desc: l.description, index: true })),
  ...tools.map((t) => ({ path: `/${t.slug}`, title: t.name, desc: t.description, index: t.live })),
];

const breadcrumbMap = {
  '/blog/how-to-reduce-image-to-100kb': [
    ['Home', '/'], ['Image Tools', '/image-tools'], ['Reduce Image to 100KB', '/blog/how-to-reduce-image-to-100kb']
  ],
  '/blog/how-to-convert-jpg-to-webp-online': [
    ['Home', '/'], ['Image Tools', '/image-tools'], ['JPG to WebP Guide', '/blog/how-to-convert-jpg-to-webp-online']
  ],
  '/blog/how-to-merge-pdf-files-for-free': [
    ['Home', '/'], ['PDF Tools', '/pdf-tools'], ['Merge PDF Guide', '/blog/how-to-merge-pdf-files-for-free']
  ],
  '/blog/compress-image-without-losing-quality': [
    ['Home', '/'], ['Image size guide', '/blog/how-to-reduce-image-to-100kb'], ['Compress Images Without Losing Quality', '/blog/compress-image-without-losing-quality']
  ],
};

function render(p, file404 = false) {
  const full = p.title ? `${p.title} | ${name}` : `${name} – ${tagline}`;
  const url = site + (p.path === '/' ? '/' : p.path);
  const crumbs = breadcrumbMap[p.path];
  const breadcrumbJsonLd = crumbs
    ? '<script type="application/ld+json" id="ld-breadcrumbs">' + JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map(([label, to], i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: label,
          item: site + to,
        })),
      }) + '</script>\n'
    : '';
  let h = tpl
    .replace(/<title>.*?<\/title>/, `<title>${esc(full)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/s, `<meta name="description" content="${esc(p.desc)}" />`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(full)}`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/s, `<meta property="og:description" content="${esc(p.desc)}" />`)
    .replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/gi, '')
   .replace('</head>', `${breadcrumbJsonLd}<link rel="canonical" href="${file404 ? site + '/' : url}">\n<meta property="og:url" content="${url}">\n<meta name="robots" content="${p.index ? 'index, follow' : 'noindex, follow'}">\n</head>`)

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
