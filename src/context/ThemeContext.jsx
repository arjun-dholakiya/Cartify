import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  /* Initialize from localStorage, default to light */
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('cartify_theme') === 'dark';
  });

  /* Apply/remove class on <html> whenever isDark changes */
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cartify_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /* Toggle between light and dark */
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
