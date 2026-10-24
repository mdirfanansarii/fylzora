import { useCallback, useEffect, useState } from 'react';

function getInitialTheme() {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);

    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage may be blocked.
    }

    setTheme(next);
  }, [theme]);

  return { theme, toggle };
}
