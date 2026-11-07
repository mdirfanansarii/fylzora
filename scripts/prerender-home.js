import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { categories, tools } from '../src/data/tools.js';

const root = process.cwd();

const routes = [
  {
    location: '/',
    output: path.join(root, 'dist', 'index.html'),
  },
 
  {
    location: '/all-tools',
    output: path.join(root, 'dist', 'all-tools', 'index.html'),
  },
    ...[
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms-of-service',
      '/disclaimer',
      '/cookie-and-advertising',
      '/faq',
    ].map((location) => ({
    location,
    output: path.join(root, 'dist', location.slice(1), 'index.html'),
  })),

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
    {
    location: '/blog/how-to-convert-jpg-to-webp-online',
    output: path.join(root, 'dist', 'blog', 'how-to-convert-jpg-to-webp-online', 'index.html'),
  },
  {
    location: '/blog/how-to-merge-pdf-files-for-free',
    output: path.join(root, 'dist', 'blog', 'how-to-merge-pdf-files-for-free', 'index.html'),
  },
  {
    location: '/blog/compress-image-without-losing-quality',
    output: path.join(root, 'dist', 'blog', 'compress-image-without-losing-quality', 'index.html'),
  },

  // Prerender category pages
  ...Object.values(categories).map((category) => ({
    location: `/${category.slug}`,
    output: path.join(root, 'dist', category.slug, 'index.html'),
  })),

  // Prerender all live tool pages
  ...tools
    .filter((tool) => tool.live)
    .map((tool) => ({
      location: `/${tool.slug}`,
      output: path.join(root, 'dist', tool.slug, 'index.html'),
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
      React.StrictMode,
      null,
      React.createElement(
        StaticRouter,
        { location: route.location },
        React.createElement(
          React.Suspense,
          {
            fallback: React.createElement(
              'p',
              { style: { textAlign: 'center', padding: '40px' } },
              'Loading...'
            ),
          },
          React.createElement(App)
        )
      )
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

