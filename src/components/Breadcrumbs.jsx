import { Link } from 'react-router-dom';

// items: [{ name, to }]  – the last item is the current page.
export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.to}>
            {i < items.length - 1 ? <Link to={it.to}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
