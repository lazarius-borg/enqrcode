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
        <div className="w-full mb-6 px-1">
            <div className="flex bg-surface rounded-xl p-1 border border-white/10">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id as TabId)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {/* <tab.icon size={16} /> Optional icon hiding for cleaner look if preferred, but keeping for now */}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
