import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import { categories } from '../data/tools.js';
import { blogPosts, blogPath } from '../data/blogPosts.js';
import { useSeo } from '../hooks/useSeo.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';

export default function Guides() {
  const crumbs = [{ name: 'Home', to: '/' }, { name: 'Guides', to: '/blog' }];
  useSeo({
    title: 'Guides',
    description: `Plain-language guides for everyday file problems: image upload limits, PDF size, Word and Excel conversions, from ${siteConfig.name}.`,
    path: '/blog',
    breadcrumbs: crumbs,
  });

  return (
    <div className="wrap page prose">
      <Breadcrumbs items={crumbs} />
      <h1>Guides</h1>
      <p className="lead">
        Short, practical explanations for the file problems people run into most
        often, with links to the tools that fix them.
      </p>

      {Object.entries(categories).map(([key, c]) => {
        const posts = blogPosts.filter((p) => p.category === key);
        if (!posts.length) return null;
        return (
          <section key={key} aria-labelledby={`guides-${key}`}>
            <h2 id={`guides-${key}`}>{c.short} guides</h2>
            <ul className="guide-list">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link to={blogPath(p)}>{p.title}</Link>
                  <p>{p.description}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="muted">
        Looking for a tool instead? <Link to="/all-tools" className="text-link">Browse all tools</Link>.
      </p>
    </div>
  );
}
