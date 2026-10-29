
import { useEffect } from 'react';
import { siteConfig } from '../config';

export default function AdSlot({ slot }) {
  const client = siteConfig.adsenseClient;

  useEffect(() => {
    if (!client || !slot) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense slot initialization failed:', error);
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside className="ad-slot" aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

