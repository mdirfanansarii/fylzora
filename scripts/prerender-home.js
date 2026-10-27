import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { categories } from '../src/data/tools.js';

const root = process.cwd();

const routes = [
  {
    location: '/',
    output: path.join(root, 'dist', 'index.html'),
  },
  {
    location: '/blog/how-to-reduce-image-to-100kb',
    output: path.join(
      root,
      'dist',
      'blog',
      'how-to-reduce-image-to-100kb',
      'index.html'
    ),
  },

  ...Object.values(categories).map((category) => ({
    location: `/${category.slug}`,
    output: path.join(root, 'dist', category.slug, 'index.html'),
  })),
];

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');

  for (const route of routes) {
    if (!fs.existsSync(route.output)) {
      throw new Error(`HTML file not found: ${route.output}`);
    }

    const app = React.createElement(
      StaticRouter,
      { location: route.location },
      React.createElement(App)
    );

    const markup = renderToString(app);
    const html = fs.readFileSync(route.output, 'utf8');
    const emptyRoot = '<div id="root"></div>';

    if (!html.includes(emptyRoot)) {
      throw new Error(
        `Expected empty React root not found: ${route.output}`
      );
    }

    fs.writeFileSync(
      route.output,
      html.replace(emptyRoot, `<div id="root">${markup}</div>`)
    );

    console.log(`Prerendered: ${route.location}`);
  }
} finally {
  await vite.close();
}

