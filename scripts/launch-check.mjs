// `npm run build && npm run launch-check` – prints what is still missing before launch / AdSense application.
import './loadenv.js';
import fs from 'node:fs';
import path from 'node:path';
import { tools } from '../src/data/tools.js';

const e = process.env;
const dist = path.resolve('dist');
let bad = 0;
let warn = 0;
const ok = (m) => console.log(`✔ ${m}`);
const no = (m) => { bad++; console.log(`✘ ${m}`); };
const wn = (m) => { warn++; console.log(`⚠ ${m}`); };

const site = (e.VITE_SITE_URL || '').replace(/\/$/, '');
if (!/^https:\/\/.+\..+/.test(site) || site.includes('your-domain')) no('VITE_SITE_URL must be your real https domain (see .env.example)');
else ok(`Site URL: ${site}`);
if (!e.VITE_CONTACT_EMAIL || e.VITE_CONTACT_EMAIL.includes('your-domain')) no('VITE_CONTACT_EMAIL is still the placeholder. Use a real inbox you check');
else ok('Contact email set');

if (!fs.existsSync(dist)) no('dist/ not found. Run `npm run build` first');
else {
  const sm = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  if (site && sm.includes(site)) ok(`Sitemap uses your domain (${(sm.match(/<url>/g) || []).length} URLs)`); else no('sitemap.xml does not use your domain. Re-run the build after fixing .env');
  const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
  if (robots.includes('Sitemap: ' + site)) ok('robots.txt points to the sitemap'); else no('robots.txt sitemap line is wrong');
  for (const p of ['privacy-policy', 'terms-of-service', 'about', 'contact', 'disclaimer', 'cookie-and-advertising']) {
    if (!fs.existsSync(path.join(dist, p, 'index.html'))) no(`Missing page: /${p}`);
  }
  ok('Legal/info pages present');
  if (!fs.existsSync(path.join(dist, '404.html'))) no('404.html missing');
}

const unfinished = tools.filter((t) => !t.live);
if (unfinished.length && e.VITE_HIDE_UNFINISHED !== 'true') {
  wn(`${unfinished.length} unfinished tool(s) are still listed as "Coming soon": ${unfinished.map((t) => t.slug).join(', ')}. Finish them, or set VITE_HIDE_UNFINISHED=true before applying to AdSense`);
} else ok(unfinished.length ? 'Unfinished tools are hidden' : 'All listed tools are live');

const client = (e.VITE_ADSENSE_CLIENT || '').trim();
if (!client) console.log('ℹ Ads are OFF (VITE_ADSENSE_CLIENT empty). Right for the AdSense application stage.');
else {
  if (!/^ca-pub-\d{16}$/.test(client)) no('VITE_ADSENSE_CLIENT must look like ca-pub-1234567890123456 (copy it from AdSense)');
  else ok('AdSense publisher ID format looks right');
  if (!fs.existsSync(path.resolve('public/ads.txt'))) no('public/ads.txt missing'); else ok('ads.txt present. Compare it with the line AdSense shows you');
  if (!e.VITE_ADSENSE_SLOT_TOOL_BOTTOM) wn('No ad-unit ID (VITE_ADSENSE_SLOT_TOOL_BOTTOM). The AdSense script loads, but no manual ad appears');
  wn('Turn OFF "Auto ads" (or exclude tool pages) in AdSense, so no ad lands near upload/download buttons');
  wn('Publish a Google consent message (AdSense > Privacy & messaging) for EEA/UK/Switzerland visitors');
}
console.log(`\n${bad} blocking issue(s), ${warn} warning(s).`);
process.exit(bad ? 1 : 0);
