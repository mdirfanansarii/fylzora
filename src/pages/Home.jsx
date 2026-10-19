import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import { categories, categoryPath, toolsInCategory } from '../data/tools.js';
import { useSeo } from '../hooks/useSeo.js';
import SearchBox from '../components/SearchBox.jsx';
import ToolList from '../components/ToolList.jsx';

export default function Home() {
  useSeo({
    title: '',
    description: 'Free online tools for images, PDF, Word and Excel files, designed to run in your browser with no sign-up.',
    path: '/',
  });

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>Everyday file tools for images, PDFs, Word and Excel</h1>
          <p className="lead">
            Free and without sign-up. Our tools are being built to work on your own device wherever the browser allows,
            so your files don’t have to be sent to a server.
          </p>
          <SearchBox large />
          <ul className="chips" aria-label="Tool categories">
            {Object.entries(categories).map(([key, c]) => (
              <li key={key}><Link to={categoryPath(key)}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <div className="wrap">
        {Object.entries(categories).map(([key, c]) => (
          <section key={key} className="cat-block" aria-labelledby={`h-${key}`}>
            <div className="cat-head">
              <div>
                <h2 id={`h-${key}`}>{c.name}</h2>
                <p className="muted">{c.blurb}</p>
              </div>
              <Link to={categoryPath(key)} className="text-link">See all {c.short.toLowerCase()} tools</Link>
            </div>
            <ToolList items={toolsInCategory(key).slice(0, 6)} />
          </section>
        ))}

        <section className="principles" aria-labelledby="h-principles">
          <h2 id="h-principles">How {siteConfig.name} handles your files</h2>
          <div className="principle-grid">
            <div>
              <h3>On your device first</h3>
              <p>Wherever a browser can do the job, the tool processes the file locally. If a tool ever needs to upload a file, its page will say so before you start.</p>
            </div>
            <div>
              <h3>Honest about limits</h3>
              <p>Scanned PDFs need OCR, CSV can’t hold formulas, and conversions can shift layout. Each tool page lists what to expect.</p>
            </div>
            <div>
              <h3>Ads stay out of the way</h3>
              <p>If we show ads, they will sit apart from upload, processing and download buttons so you never click one by accident.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
