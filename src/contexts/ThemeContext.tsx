'use client';

import {createContext, useContext, useEffect, useState, ReactNode, useMemo} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}: Readonly<{ children: ReactNode }>) {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        // ローカルストレージからテーマ設定を読み込む
        const savedTheme = typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme) : undefined;
        if (savedTheme) {
            setTheme(savedTheme);
            if (typeof window !== 'undefined') {
                document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            }
        } else {
            // システム設定を確認
            let systemTheme: Theme = 'light';
            if (typeof window !== 'undefined') {
                systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', systemTheme === 'dark');
            }
            setTheme(systemTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const value = useMemo(() => ({theme, toggleTheme}), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
