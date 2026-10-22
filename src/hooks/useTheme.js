import { useCallback, useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }, []);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);

    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // Storage may be blocked.
    }

    setTheme(next);
  }, [theme]);

  return { theme, toggle };
}
