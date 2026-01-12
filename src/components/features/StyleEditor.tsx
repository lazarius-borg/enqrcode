import { Ban } from 'lucide-react';
import type { CustomizationOptions } from './CustomizationPanel'; // Reusing type for now or redefining

type StyleEditorProps = {
    options: CustomizationOptions;
    onChange: (options: CustomizationOptions) => void;
};

export const StyleEditor = ({ options, onChange }: StyleEditorProps) => {

    const handleColorChange = (key: 'dark' | 'light', value: string) => {
        onChange({
            ...options,
            color: {
                ...options.color,
                [key]: value
            }
        });
    };

    // Mock data for visual stubs
    const frames = [
        { id: 'none', label: 'No Frame', icon: Ban },
        { id: 'classic', label: 'Classic', preview: 'border-2 border-white' },
        { id: 'pill', label: 'Pill', preview: 'rounded-full border-2 border-white' },
    ];

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Colors Section */}
            <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface border border-white/10 p-3 rounded-2xl flex items-center justify-between">
                        <span className="text-sm">Dots</span>
                        <input
                            type="color"
                            value={options.color.dark}
                            onChange={(e) => handleColorChange('dark', e.target.value)}
                            className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 p-0 cursor-pointer"
                        />
                    </div>
                    <div className="bg-surface border border-white/10 p-3 rounded-2xl flex items-center justify-between">
                        <span className="text-sm">BG</span>
                        <input
                            type="color"
                            value={options.color.light}
                            onChange={(e) => handleColorChange('light', e.target.value)}
                            className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 p-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Frames Section (Visual Stub) */}
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Frames</h3>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Coming Soon</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {frames.map((frame, idx) => (
                        <div key={idx} className={`aspect-square bg-surface border ${idx === 0 ? 'border-primary bg-primary/10' : 'border-white/10'} rounded-xl flex flex-col items-center justify-center gap-2 opacity-${idx === 0 ? '100' : '50'}`}>
                            {frame.icon ? <frame.icon size={20} /> : <div className={`w-8 h-6 ${frame.preview}`}></div>}
                            <span className="text-[10px]">{frame.label}</span>
                            {idx === 0 && <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Patterns Section (Visual Stub) */}
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Patterns</h3>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Coming Soon</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-surface border border-white/10 rounded-xl opacity-50"></div>
                    ))}
                </div>
            </div>

        </div>
    );
};
