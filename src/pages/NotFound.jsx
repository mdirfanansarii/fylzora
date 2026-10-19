import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo.js';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page does not exist.', path: '/404', noindex: true });
  return (
    <div className="wrap page">
      <h1>We can’t find that page</h1>
      <p className="lead">The link may be old or mistyped.</p>
      <p><Link to="/all-tools" className="text-link">Browse all tools</Link> or <Link to="/" className="text-link">go to the homepage</Link>.</p>
    </div>
  );
}
