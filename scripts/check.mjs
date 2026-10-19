// `npm test`: registry sanity checks + render every page once to catch runtime errors.
import fs from 'node:fs';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

let failed = 0;
const ok = (c, msg) => { console.log(`${c ? '✔' : '✘'} ${msg}`); if (!c) failed++; };

globalThis.document = { head: { querySelector: () => null }, documentElement: { getAttribute: () => 'light' }, getElementById: () => null };
globalThis.window = { scrollTo() {} };
const server = await createServer({ root: process.cwd(), server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(p);
const { tools, categories, toolsInCategory } = await load('/src/data/tools.js');
const { useCases } = await load('/src/data/toolContent.js');

const slugs = tools.map((t) => t.slug);
ok(new Set(slugs).size === slugs.length, `${tools.length} tools, slugs unique`);
const compSrc = fs.readFileSync('src/tools/components.js', 'utf8');
const wired = new Set([...compSrc.matchAll(/'([a-z0-9-]+)':/g)].map((m) => m[1]));
const live = tools.filter((t) => t.live).map((t) => t.slug);
ok(live.every((s) => wired.has(s)), 'every live tool has a component');
ok([...wired].every((s) => live.includes(s)), 'every component belongs to a live tool');
ok(live.every((s) => useCases[s]), 'every live tool has “when to use it” text');
ok(tools.every((t) => t.description.length > 20 && t.description.length <= 160), 'descriptions are 20–160 characters');
ok(Object.keys(categories).every((k) => toolsInCategory(k).length > 0), 'every category has tools');
console.log(`Live: ${live.length}/${tools.length}`);

const Home = (await load('/src/pages/Home.jsx')).default;
const AllTools = (await load('/src/pages/AllTools.jsx')).default;
const Cat = (await load('/src/pages/CategoryPage.jsx')).default;
const ToolPage = (await load('/src/pages/ToolPage.jsx')).default;
const Legal = await load('/src/pages/Legal.jsx');
const render = (el) => renderToString(React.createElement(MemoryRouter, { initialEntries: ['/'] }, el));
const els = [['Home', Home, {}], ['AllTools', AllTools, {}], ...Object.keys(categories).map((k) => [`Category ${k}`, Cat, { categoryKey: k }]),
  ...tools.map((t) => [`Tool ${t.slug}`, ToolPage, { tool: t }]), ...Object.keys(Legal).map((k) => [`Page ${k}`, Legal[k], {}])];
for (const [n, C, props] of els) {
  try { ok(render(React.createElement(C, props)).length > 200, `renders ${n}`); } catch (e) { ok(false, `renders ${n}: ${e.message}`); }
}
await server.close();
console.log(failed ? `\n${failed} check(s) FAILED` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
