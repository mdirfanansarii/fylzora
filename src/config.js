// Site-wide settings. Values come from .env (see .env.example).
const env = import.meta.env;

export const siteConfig = {
  name: 'Fylzora', // Rename here to rebrand the whole site.
  tagline: 'Free online file tools',
  url: (env.VITE_SITE_URL || 'https://your-domain.com').replace(/\/$/, ''),
  email: env.VITE_CONTACT_EMAIL || 'hello@your-domain.com',
  adsenseClient: env.VITE_ADSENSE_CLIENT || '', // empty = no ads are loaded
  lastUpdated: 'October 18, 2026',
};
