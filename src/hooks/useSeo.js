import { useEffect } from 'react';
import { siteConfig } from '../config';

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

// Sets title, description, canonical, Open Graph, robots and BreadcrumbList JSON-LD per page.
export function useSeo({ title, description, path = '/', noindex = false, breadcrumbs }) {
  const crumbKey = JSON.stringify(breadcrumbs || []);
  useEffect(() => {
    const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} – ${siteConfig.tagline}`;
    const url = siteConfig.url + (path === '/' ? '/' : path);
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);

    let ld = document.getElementById('ld-breadcrumbs');
    if (breadcrumbs && breadcrumbs.length > 1) {
      if (!ld) {
        ld = document.createElement('script');
        ld.type = 'application/ld+json';
        ld.id = 'ld-breadcrumbs';
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: siteConfig.url + b.to,
        })),
      });
    } else if (ld) {
      ld.remove();
    }
  }, [title, description, path, noindex, crumbKey]); // eslint-disable-line react-hooks/exhaustive-deps
}
