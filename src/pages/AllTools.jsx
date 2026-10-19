import { useSearchParams } from 'react-router-dom';
import { categories, searchTools, toolsInCategory } from '../data/tools.js';
import { useSeo } from '../hooks/useSeo.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ToolList from '../components/ToolList.jsx';

export default function AllTools() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const crumbs = [{ name: 'Home', to: '/' }, { name: 'All Tools', to: '/all-tools' }];

  useSeo({
    title: 'All Tools',
    description: 'Every image, PDF, Word and Excel tool in one list.',
    path: '/all-tools',
    breadcrumbs: crumbs,
  });

  const results = q ? searchTools(q) : null;

  return (
    <div className="wrap page">
      <Breadcrumbs items={crumbs} />
      <h1>All tools</h1>
      <div className="filter">
        <label htmlFor="filter-input">Filter tools</label>
        <input id="filter-input" type="search" value={q} placeholder="Type a tool or file type"
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} />
      </div>

      {results ? (
        results.length ? <ToolList items={results} /> : <p>No tool matches “{q}”. Try a file type like pdf, docx or csv.</p>
      ) : (
        Object.entries(categories).map(([key, c]) => (
          <section key={key} className="cat-block">
            <h2>{c.name}</h2>
            <ToolList items={toolsInCategory(key)} />
          </section>
        ))
      )}
    </div>
  );
}
