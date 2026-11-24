import { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, categoryPath, relatedTools, toolPath } from '../data/tools.js';
import { toolComponents } from '../tools/components.js';
import { useSeo } from '../hooks/useSeo.js';
import AdSlot from '../components/AdSlot.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { toolSeoContent } from '../data/toolContent.js';
import { toolFaqs } from '../data/toolFaqs.js';
import { toolGuides } from '../data/toolGuides.js';
import { blogPosts, blogPath } from '../data/blogPosts.js';
import ToolList from '../components/ToolList.jsx';

export default function ToolPage({ tool }) {
  const cat = categories[tool.category];
  const Live = tool.live ? toolComponents[tool.slug] : null;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
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
  const seoContent = toolSeoContent[tool.slug];
  const faqs = toolFaqs[tool.slug] || [];
  const guide = toolGuides[tool.slug];
  const guides = blogPosts.filter((p) => p.tools.includes(tool.slug));

  return (
    <div className="wrap page tool-page">
      <Breadcrumbs items={crumbs} />
      <h1>{tool.name}</h1>
      <p className="lead">{guide?.summary || tool.description}</p>

      {Live ? (
        // The tool UI. No ads inside or directly next to this block.
        <section className="tool-area" aria-label={`${tool.name} workspace`}>
          {mounted ? (
            <Suspense fallback={<p role="status">Loading tool…</p>}>
              <Live />
            </Suspense>
          ) : (
            <p role="status">Loading tool…</p>
          )}
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

      {seoContent && (
        <section className="prose" aria-labelledby="seo-intro">
          <h2 id="seo-intro">About {tool.name}</h2>
          <p>{seoContent.intro}</p>
        </section>
      )}

      {Live && (seoContent?.steps || tool.slug !== 'excel-formula-helper') && (
        <section aria-labelledby="how-h">
          <h2 id="how-h">How to use {tool.name}</h2>
          <ol className="plain-list">
            {(seoContent?.steps || [
              'Add your file with drag and drop or the Browse files button.',
              'Choose the options this tool offers.',
              'Check the result, then press Download.',
            ]).map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="muted">Files are processed in your browser on your device. File size limits vary by tool, so check the limit shown in the tool instructions. Large files may use significant device memory.</p>
        </section>
      )}

      {Live && guide && (
        <section className="prose" aria-labelledby="use-h">
          <h2 id="use-h">When to use {tool.name}</h2>
          <p>{guide.when}</p>
          <h3>Tips for better results</h3>
          <ul className="plain-list">{guide.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
      )}

      {Live && faqs.length > 0 && (
        <section className="prose" aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          {faqs.map(([question, answer]) => (
            <details className="faq" key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      )}

      {tool.notes.length > 0 && (
        <section aria-labelledby="notes-h">
          <h2 id="notes-h">Good to know</h2>
          <ul className="plain-list">{tool.notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </section>
      )}

      {guides.length > 0 && (
        <section className="prose" aria-labelledby="guides-h">
          <h2 id="guides-h">Guides that help</h2>
          <ul className="guide-list">
            {guides.map((p) => (
              <li key={p.slug}>
                <Link to={blogPath(p)}>{p.title}</Link>
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
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
