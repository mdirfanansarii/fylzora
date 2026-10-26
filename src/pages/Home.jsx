import { Link } from 'react-router-dom';
import { siteConfig } from '../config';
import { categories, categoryPath, toolsInCategory } from '../data/tools.js';
import { useSeo } from '../hooks/useSeo.js';
import SearchBox from '../components/SearchBox.jsx';
import ToolList from '../components/ToolList.jsx';

const categoryIcons = {
  image: '▧',
  pdf: '▤',
  word: 'W',
  excel: '▦',
};

export default function Home() {
  useSeo({
    title: '',
    description:
      'Free online tools for images, PDF, Word and Excel files. Resize images, manage PDFs and work with documents online.',
    path: '/',
  });

  return (
    <>
      <section className="home-hero">
        <div className="wrap home-hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span className="eyebrow-dot" />
              SIMPLE TOOLS. LESS WORK.
            </span>

            <h1>
              All your file tools.
              <span className="hero-gradient"> One simple place.</span>
            </h1>

            <p className="lead">
              Resize images, manage PDFs and work with documents using
              free online tools. No account needed.
            </p>

            <div className="home-search">
              <SearchBox large />
            </div>

            <p className="search-hint">
              Try searching for image compressor, PDF tools or Word tools.
            </p>

            <div className="hero-actions">
              <Link to="/all-tools" className="home-primary-btn">
                Explore all tools <span aria-hidden="true">→</span>
              </Link>
              <span className="hero-note">Free to use · Easy to get started</span>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-glow" />
            <div className="file-card file-card-back">
              <span className="file-icon file-icon-green">X</span>
              <span className="file-lines"><i /><i /></span>
            </div>
            <div className="file-card file-card-middle">
              <span className="file-icon file-icon-blue">W</span>
              <span className="file-lines"><i /><i /></span>
            </div>
            <div className="file-card file-card-main">
              <div className="main-file-top">
                <span className="file-icon file-icon-purple">PDF</span>
                <span className="file-status">Ready to work</span>
              </div>
              <div className="file-preview">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="file-card-bottom">
                <span>YOUR FILES</span>
                <span className="file-check">✓</span>
              </div>
            </div>
            <div className="art-bubble bubble-one">✦</div>
            <div className="art-bubble bubble-two">↗</div>
          </div>
        </div>

        <div className="wrap hero-trust-row">
          <div><span className="trust-check">✓</span> No sign-up required</div>
          <div><span className="trust-check">✓</span> Simple to use</div>
          <div><span className="trust-check">✓</span> Browser-based tools</div>
        </div>
      </section>

      <div className="wrap home-content">
        <section className="home-categories" aria-labelledby="categories-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">FIND YOUR TOOL</span>
              <h2 id="categories-title">What do you want to work on?</h2>
              <p className="section-description">
                Choose a file type and find the right tool for your task.
              </p>
            </div>
            <Link to="/all-tools" className="section-link">
              View all tools <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="category-grid">
            {Object.entries(categories).map(([key, category]) => (
              <Link
                key={key}
                to={categoryPath(key)}
                className={`category-card category-${key}`}
              >
                <span className="category-icon" aria-hidden="true">
                  {categoryIcons[key] || '✦'}
                </span>
                <span className="category-card-title">{category.name}</span>
                <span className="category-card-description">
                  {category.blurb}
                </span>
                <span className="category-card-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        {Object.entries(categories).map(([key, category]) => (
          <section
            key={key}
            className="cat-block home-tool-section"
            aria-labelledby={`h-${key}`}
          >
            <div className="cat-head home-cat-head">
              <div>
                <span className="section-kicker">{category.short} COLLECTION</span>
                <h2 id={`h-${key}`}>{category.name}</h2>
                <p className="muted">{category.blurb}</p>
              </div>
              <Link to={categoryPath(key)} className="section-link">
                Explore {category.short} tools <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ToolList items={toolsInCategory(key).slice(0, 6)} />
          </section>
        ))}

        <section className="home-privacy" aria-labelledby="privacy-title">
          <div className="privacy-symbol" aria-hidden="true">⌁</div>
          <div>
            <span className="section-kicker">MADE FOR EVERYDAY WORK</span>
            <h2 id="privacy-title">Your files. Your workflow.</h2>
            <p>
              We aim to make everyday file tasks simple. Tools that support
              local processing work in your browser. If a tool needs to send
              data elsewhere, check its instructions before using it.
            </p>
          </div>
          <Link to="/about" className="privacy-link">
            Learn about {siteConfig.name} <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </>
  );
}
