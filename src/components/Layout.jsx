import { Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { siteConfig } from '../config';
import { categories } from '../data/tools.js';
import { companyLinks, legalLinks } from '../data/pages.js';
import { useTheme } from '../hooks/useTheme.js';
import Logo from './Logo.jsx';
import SearchBox from './SearchBox.jsx';

export default function Layout() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const first = useRef(true);
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
    if (first.current) first.current = false;
    else document.getElementById('main')?.focus({ preventScroll: true }); // helps screen-reader and keyboard users after navigation
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="wrap header-row">
          <Link to="/" className="brand" aria-label={`${siteConfig.name} home`}>
            <img src="/fylzora-logo.webp" alt="Fylzora logo" className="site-logo" />
            <span>{siteConfig.name}</span>
          </Link>

          <nav id="main-nav" className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
            {Object.values(categories).map((c) => (
              <NavLink key={c.slug} to={`/${c.slug}`}>{c.short}</NavLink>
            ))}
            <NavLink to="/all-tools">All tools</NavLink>
          </nav>

          <div className="header-tools">
            <div className="header-search"><SearchBox /></div>
            <button type="button" className="icon-btn" onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <button type="button" className="icon-btn menu-btn" aria-expanded={menuOpen}
              aria-controls="main-nav" onClick={() => setMenuOpen((o) => !o)}>
              <span className="sr-only">Menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="wrap page-loading" role="status">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <Link to="/" className="brand">
              <img
                src="/fylzora-logo.webp"
                alt="Fylzora logo"
                className="site-logo"
              />
              <span>{siteConfig.name}</span>
            </Link>
            <p className="muted small">{siteConfig.tagline} for images, PDF, Word and Excel files. Not affiliated with Adobe, Microsoft or Google.</p>
          </div>
          <div>
            <h2 className="foot-h">Tools</h2>
            <ul>
              {Object.values(categories).map((c) => <li key={c.slug}><Link to={`/${c.slug}`}>{c.name}</Link></li>)}
              <li><Link to="/all-tools">All Tools</Link></li>
              <li><Link to="/blog/how-to-reduce-image-to-100kb">Image size guide</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="foot-h">Company</h2>
            <ul>{companyLinks.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="foot-h">Legal</h2>
            <ul>{legalLinks.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
          </div>
        </div>
        <div className="wrap small muted footer-base">© {new Date().getFullYear()} {siteConfig.name}</div>
      </footer>
    </>
  );
}
