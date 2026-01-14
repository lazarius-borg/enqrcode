
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeSelector = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Monitor size={16} className="text-primary" />
                <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Appearance</h3>
            </div>

            <div className="bg-surface rounded-xl p-1 border border-border flex">
                <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'light'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-dim hover:text-text-main hover:bg-surface-hover'
                        }`}
                >
                    <Sun size={16} />
                    <span>Light</span>
                </button>

                <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'dark'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-dim hover:text-text-main hover:bg-surface-hover'
                        }`}
                >
                    <Moon size={16} />
                    <span>Dark</span>
                </button>

                <button
                    onClick={() => setTheme('system')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'system'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-dim hover:text-text-main hover:bg-surface-hover'
                        }`}
                >
                    <Monitor size={16} />
                    <span>System</span>
                </button>
            </div>
        </div>
    );
};
