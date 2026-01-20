import { Sliders, Shield, Zap } from 'lucide-react';
import type { CustomizationOptions } from './CustomizationPanel';
import { ThemeSelector } from './ThemeSelector';

type SettingsPanelProps = {
    options: CustomizationOptions;
    onChange: (options: CustomizationOptions) => void;
};

export const SettingsPanel = ({ options, onChange }: SettingsPanelProps) => {

    const update = (key: keyof CustomizationOptions, value: any) => {
        onChange({ ...options, [key]: value });
    };

    const eccLevels = [
        { id: 'L', label: 'Low (7%)', desc: 'Best for clean/simple QRs' },
        { id: 'M', label: 'Medium (15%)', desc: 'Standard, good balance' },
        { id: 'Q', label: 'Quartile (25%)', desc: 'Good for complex data' },
        { id: 'H', label: 'High (30%)', desc: 'Best if adding logo/image' },
    ] as const;



    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Resolution Settings */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Sliders size={16} className="text-primary" />
                    <h3 className="text-xs uppercase font-bold text-md-outline tracking-wider">Resolution (Output Size)</h3>
                </div>

                <div className="bg-surface border border-md-outline-variant rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-text-main">Export Quality</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{options.width || 1000}px</span>
                    </div>

                    <input
                        type="range"
                        min="500"
                        max="2000"
                        step="100"
                        value={options.width || 1000}
                        onChange={(e) => update('width', parseInt(e.target.value))}
                        className="w-full accent-primary h-2 bg-md-surface-variant/50 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-md-outline mt-2">
                        <span>Low (500px)</span>
                        <span>High (2000px)</span>
                    </div>
                </div>
            </div>

            {/* Error Correction Level */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-primary" />
                    <h3 className="text-xs uppercase font-bold text-md-outline tracking-wider">Error Correction</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {eccLevels.map((level) => (
                        <button
                            key={level.id}
                            onClick={() => update('errorCorrectionLevel', level.id)}
                            className={`flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${(options.errorCorrectionLevel || 'M') === level.id
                                ? 'bg-primary border-primary shadow-lg shadow-primary/10'
                                : 'bg-surface border-md-outline-variant hover:bg-surface-hover hover:border-primary/50'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${(options.errorCorrectionLevel || 'M') === level.id
                                ? 'bg-white text-primary'
                                : 'bg-md-surface-variant text-md-outline'
                                }`}>
                                {level.id}
                            </div>
                            <div>
                                <div className={`text-sm font-medium ${(options.errorCorrectionLevel || 'M') === level.id ? 'text-white' : 'text-text-main'
                                    }`}>
                                    {level.label}
                                </div>
                                <div className="text-[11px] text-md-outline leading-tight">
                                    {level.desc}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* File Format */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    <h3 className="text-xs uppercase font-bold text-md-outline tracking-wider">File Format</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {['png', 'jpeg', 'svg'].map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => update('fileFormat', fmt)}
                            className={`py-3 rounded-xl border font-medium text-sm transition-all uppercase ${(options.fileFormat || 'png') === fmt
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface border-md-outline-variant text-md-outline hover:text-text-main hover:bg-surface-hover'
                                }`}
                        >
                            {fmt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Theme Selector */}
            <ThemeSelector />

        </div>
    );
};
