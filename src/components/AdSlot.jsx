import { useEffect, useRef } from 'react';
import { siteConfig } from '../config';

let scriptAdded = false;

// Renders NOTHING until VITE_ADSENSE_CLIENT is set. Never place it next to upload/download buttons.
// `slot` is the ad-unit ID that AdSense gives you for each unit.
export default function AdSlot({ slot }) {
  const ref = useRef(null);
  const client = siteConfig.adsenseClient;

  useEffect(() => {
    if (!client || !slot) return;
    if (!scriptAdded && !document.querySelector('script[src*="adsbygoogle.js"]')) {
      const s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
      document.head.appendChild(s);
      scriptAdded = true;
    }
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* ad blocked */ }
  }, [client, slot]);

  if (!client || !slot) return null;
  return (
    <aside className="ad-slot" aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      <ins ref={ref} className="adsbygoogle" style={{ display: 'block' }}
        data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
