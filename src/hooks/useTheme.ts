
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage first
        const saved = localStorage.getItem('enqrcode-theme');
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            return saved;
        }
        // Default to dark as requested
        return 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        localStorage.setItem('enqrcode-theme', theme);

        // Function to apply the detailed theme bits
        const applyTheme = (isDark: boolean) => {
            if (isDark) {
                root.classList.add('dark');
                root.setAttribute('data-theme', 'dark');
            } else {
                root.classList.remove('dark');
                root.setAttribute('data-theme', 'light');
            }
        };

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            applyTheme(mediaQuery.matches);

            const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            applyTheme(theme === 'dark');
        }
    }, [theme]);

    // Handle system change if we switch TO system from something else
    useEffect(() => {
        // This is covered by the dependency on [theme] above.
    }, [theme]);

    return { theme, setTheme };
}
