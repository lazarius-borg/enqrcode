import { FileText, Palette } from 'lucide-react';

export type TabId = 'content' | 'style' | 'history' | 'settings';

type TabNavigationProps = {
    activeTab: TabId;
    onChange: (id: TabId) => void;
};

export const TabNavigation = ({ activeTab, onChange }: TabNavigationProps) => {
    const tabs = [
        { id: 'content', icon: FileText, label: 'Content' },
        { id: 'style', icon: Palette, label: 'Style' },
        // { id: 'logo', icon: Image, label: 'Logo' }, // Future
        // { id: 'history', icon: Clock, label: 'History' },
    ] as const;

    return (
        <div className="w-full border-b border-white/5 mb-6">
            <div className="flex items-center gap-6 px-4 overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id as TabId)}
                        className={`py-4 relative flex items-center gap-2 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-primary'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <span className="text-sm tracking-wide uppercase">{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
