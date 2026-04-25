import { useState, useEffect } from 'react';

export default function useDarkMode() {
  // Default to 'light' if no theme is saved
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Save the user's preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
}
