import { FileText, Palette, Settings, History } from 'lucide-react';
import { InstallButton } from '../common/InstallButton';
import type { TabId } from './TabNavigation';

type SidebarProps = {
    activeTab: TabId;
    onChange: (id: TabId) => void;
    className?: string; // Allow external layout control
};

export const Sidebar = ({ activeTab, onChange, className = '' }: SidebarProps) => {
    const navItems = [
        { id: 'content', icon: FileText, label: 'Content' },
        { id: 'style', icon: Palette, label: 'Style' },
        { id: 'history', icon: History, label: 'History' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ] as const;

    return (
        <aside className={`flex flex-col w-[260px] bg-surface border-r border-border h-full ${className}`}>
            {/* Logo Area */}
            <div className="p-6 mb-4">
                <span className="font-bold text-xl tracking-tight text-text-main">QR Code Generator</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onChange(item.id as TabId)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${activeTab === item.id
                            ? 'bg-primary text-white shadow-md shadow-primary/10'
                            : 'text-text-dim hover:text-text-main hover:bg-surface-hover'
                            }`}
                    >
                        <item.icon
                            size={18}
                            className={`transition-colors ${activeTab === item.id ? 'text-white' : 'group-hover:text-primary'
                                }`}
                        />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Install App Button */}
            <div className="px-3 pb-4">
                <InstallButton />
            </div>
        </aside>
    );
};
