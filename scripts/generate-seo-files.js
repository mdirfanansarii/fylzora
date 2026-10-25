// Creates public/sitemap.xml and public/robots.txt from the tool registry.
// Runs automatically before `npm run build`.
import './loadenv.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, categories } from '../src/data/tools.js';
import { companyLinks, legalLinks } from '../src/data/pages.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readEnvFile() {
  const out = {};
  const file = path.join(root, '.env');
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const env = { ...readEnvFile(), ...process.env };
const site = (env.VITE_SITE_URL || 'https://your-domain.com').replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

const paths = [
  '/blog/how-to-reduce-image-to-100kb',
  '/',
  '/all-tools',
  // Category pages are noindex until at least one of their tools is live, so keep them out of the sitemap too.
  ...Object.keys(categories)
    .filter((k) => tools.some((x) => x.live && (x.category === k || x.alsoIn.includes(k))))
    .map((k) => `/${categories[k].slug}`),
  ...companyLinks.map((l) => l.to),
  ...legalLinks.map((l) => l.to),
  ...tools.filter((x) => x.live).map((x) => `/${x.slug}`), // only finished tools
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`;

fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), xml);
fs.writeFileSync(path.join(root, 'public', 'robots.txt'), robots);

// ads.txt: only when a real AdSense publisher ID is configured. Compare it with the line AdSense shows you.
const client = (env.VITE_ADSENSE_CLIENT || '').trim();
const adsPath = path.join(root, 'public', 'ads.txt');
if (/^ca-pub-\d{16}$/.test(client)) {
  fs.writeFileSync(adsPath, `google.com, ${client.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);
  console.log('ads.txt written from VITE_ADSENSE_CLIENT.');
} else if (fs.existsSync(adsPath) && fs.readFileSync(adsPath, 'utf8').includes('f08c47fec0942fa0') && !client) {
  fs.unlinkSync(adsPath); // stale file from an earlier build with a client ID
}
console.log(`SEO files written for ${site} (${paths.length} URLs in sitemap).`);
