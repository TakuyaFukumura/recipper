'use client';

import {Moon, Sun} from 'lucide-react';
import {useTheme} from '@/contexts/ThemeContext';

export default function ThemeToggle() {
    const {theme, toggleTheme} = useTheme();

    return (<button
        onClick={toggleTheme}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
        aria-label={theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
        title={theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
    >
        {theme === 'light' ? (<Moon className="w-5 h-5"/>) : (<Sun className="w-5 h-5"/>)}
    </button>);
}
