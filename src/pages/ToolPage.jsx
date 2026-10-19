import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { categories, categoryPath, relatedTools, toolPath } from '../data/tools.js';
import { toolComponents } from '../tools/components.js';
import { useSeo } from '../hooks/useSeo.js';
import AdSlot from '../components/AdSlot.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { categoryTips, useCases } from '../data/toolContent.js';
import ToolList from '../components/ToolList.jsx';

export default function ToolPage({ tool }) {
  const cat = categories[tool.category];
  const Live = tool.live ? toolComponents[tool.slug] : null;
  const crumbs = [
    { name: 'Home', to: '/' },
    { name: cat.name, to: categoryPath(tool.category) },
    { name: tool.name, to: toolPath(tool) },
  ];

  useSeo({
    title: tool.name,
    description: tool.description,
    path: toolPath(tool),
    breadcrumbs: crumbs,
    noindex: !Live, // unfinished tools stay out of search results
  });

  const related = relatedTools(tool);

  return (
    <div className="wrap page tool-page">
      <Breadcrumbs items={crumbs} />
      <h1>{tool.name}</h1>
      <p className="lead">{tool.description}</p>

      {Live ? (
        // The tool UI. No ads inside or directly next to this block.
        <section className="tool-area" aria-label={`${tool.name} workspace`}>
          <Suspense fallback={<p role="status">Loading tool…</p>}>
            <Live />
          </Suspense>
        </section>
      ) : (
        <section className="status-panel" aria-labelledby="status-h">
          <h2 id="status-h">This tool isn’t available yet</h2>
          <p>
            {cat.name} are still being built, so there’s nothing to upload here for now.
            You can browse the <Link to={categoryPath(tool.category)}>{cat.name.toLowerCase()}</Link> or
            {' '}<Link to="/all-tools">the full tool list</Link> to see what is planned.
          </p>
        </section>
      )}

      {Live && tool.slug !== 'excel-formula-helper' && (
        <section aria-labelledby="how-h">
          <h2 id="how-h">How to use {tool.name}</h2>
          <ol className="plain-list">
            <li>Add your file with drag and drop or the Browse files button.</li>
            <li>Choose the options this tool offers.</li>
            <li>Check the result, then press Download.</li>
          </ol>
          <p className="muted">Your file is processed by your browser on your own device and is not uploaded. Files can be up to 25 MB each. Very large files may fail on devices with little memory.</p>
        </section>
      )}

      {Live && useCases[tool.slug] && (
        <section aria-labelledby="use-h">
          <h2 id="use-h">When to use it</h2>
          <p>{useCases[tool.slug]}</p>
          <h3>Tips for {cat.short.toLowerCase()} files</h3>
          <ul className="plain-list">{categoryTips[tool.category].map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
      )}

      {tool.notes.length > 0 && (
        <section aria-labelledby="notes-h">
          <h2 id="notes-h">Good to know</h2>
          <ul className="plain-list">{tool.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="rel-h">
          <h2 id="rel-h">Related tools</h2>
          <ToolList items={related} />
        </section>
      )}

      {/* Ads only on finished tool pages, away from upload/download controls. */}
      {Live && <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_TOOL_BOTTOM} />}
    </div>
  );
}
