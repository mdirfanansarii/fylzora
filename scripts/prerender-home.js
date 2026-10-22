import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const output = path.join(root, 'dist', 'index.html');

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');

  const app = React.createElement(
    StaticRouter,
    { location: '/' },
    React.createElement(App)
  );

  const markup = renderToString(app);
  const html = fs.readFileSync(output, 'utf8');

  if (!html.includes('<div id="root"></div>')) {
    throw new Error('Expected empty root not found in dist/index.html');
  }

  fs.writeFileSync(
    output,
    html.replace(
      '<div id="root"></div>',
      `<div id="root">${markup}</div>`
    )
  );

  console.log('Homepage prerendered successfully.');
} finally {
  await vite.close();
}
