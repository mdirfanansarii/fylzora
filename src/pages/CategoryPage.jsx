import { Link } from 'react-router-dom';
import { categories, categoryPath, toolsInCategory } from '../data/tools.js';
import { useSeo } from '../hooks/useSeo.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ToolList from '../components/ToolList.jsx';

export default function CategoryPage({ categoryKey }) {
  const c = categories[categoryKey];
  const crumbs = [{ name: 'Home', to: '/' }, { name: c.name, to: categoryPath(categoryKey) }];
  const list = toolsInCategory(categoryKey);
  const anyLive = list.some((x) => x.live);

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
      <p className="muted"><Link to="/all-tools" className="text-link">Browse all tools</Link></p>
    </div>
  );
}
