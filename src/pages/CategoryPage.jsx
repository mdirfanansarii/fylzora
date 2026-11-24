import { Link } from 'react-router-dom';
import { bySlug, categories, categoryPath, toolPath, toolsInCategory } from '../data/tools.js';
import { categoryGuides } from '../data/categoryGuides.js';
import { blogPosts, blogPath } from '../data/blogPosts.js';
import { useSeo } from '../hooks/useSeo.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ToolList from '../components/ToolList.jsx';

export default function CategoryPage({ categoryKey }) {
  const c = categories[categoryKey];
  const crumbs = [{ name: 'Home', to: '/' }, { name: c.name, to: categoryPath(categoryKey) }];
  const list = toolsInCategory(categoryKey);
  const anyLive = list.some((x) => x.live);
  const guide = categoryGuides[categoryKey];
  const posts = blogPosts.filter((p) => p.category === categoryKey);

  useSeo({
    title: c.name,
    description: `${c.blurb} Free ${c.short.toLowerCase()} tools that run in your browser.`,
    path: categoryPath(categoryKey),
    breadcrumbs: crumbs,
    noindex: !anyLive, // don't ask Google to index an empty category
  });

  return (
    <div className="wrap page">
      <Breadcrumbs items={crumbs} />
      <h1>{c.name}</h1>
      <p className="lead">{c.blurb}</p>
      {!anyLive && (
        <p className="notice" role="note">
          These tools aren’t open yet. We’re releasing them one category at a time.
        </p>
      )}
      <ToolList items={list} />

      {anyLive && guide && (
        <section className="prose" aria-labelledby="cat-start">
          <h2 id="cat-start">Before you start</h2>
          {guide.intro.map((p) => <p key={p}>{p}</p>)}
          <h2>Which {c.short.toLowerCase()} tool do I need?</h2>
          <ul className="plain-list">
            {guide.choose.map(([slug, text]) => {
              const tool = bySlug(slug);
              if (!tool) return null;
              return (
                <li key={slug}>
                  <Link to={toolPath(tool)}>{tool.name}</Link>: {text}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {posts.length > 0 && (
        <section className="prose" aria-labelledby="cat-guides">
          <h2 id="cat-guides">{c.short} guides</h2>
          <ul className="guide-list">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link to={blogPath(p)}>{p.title}</Link>
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="muted"><Link to="/all-tools" className="text-link">Browse all tools</Link></p>
    </div>
  );
}
