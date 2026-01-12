import { Ban, Square, Circle, LayoutGrid } from 'lucide-react';
import type { CustomizationOptions } from './CustomizationPanel';
import { Input } from '../ui/Input';

type StyleEditorProps = {
    options: CustomizationOptions;
    onChange: (options: CustomizationOptions) => void;
};

export const StyleEditor = ({ options, onChange }: StyleEditorProps) => {

    const handleColorChange = (key: 'dark' | 'light', value: string) => {
        onChange({ ...options, color: { ...options.color, [key]: value } });
    };

    const update = (key: keyof CustomizationOptions, value: any) => {
        onChange({ ...options, [key]: value });
    };

    const frames = [
        { id: 'none', label: 'None', icon: Ban },
        { id: 'classic', label: 'Classic', preview: 'border-2 border-white' },
        { id: 'pill', label: 'Pill', preview: 'rounded-full border-2 border-white' },
        { id: 'polaroid', label: 'Polaroid', preview: 'bg-white pb-4' },
    ];

    const patterns = [
        { id: 'square', label: 'Square', icon: Square },
        { id: 'dot', label: 'Dots', icon: Circle },
        { id: 'rounded', label: 'Rounded', icon: LayoutGrid },
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

            {/* Pattern Type */}
            <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Pattern</h3>
                <div className="grid grid-cols-3 gap-3">
                    {patterns.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => update('pattern', p.id)}
                            className={`py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${options.pattern === p.id
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface border-white/10 text-slate-400 hover:bg-surface-hover hover:text-white'
                                }`}
                        >
                            <p.icon size={20} className={options.pattern === p.id ? 'fill-current' : ''} />
                            <span className="text-xs font-medium">{p.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Frames Section */}
            <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Frames</h3>

                <div className="grid grid-cols-3 gap-3">
                    {frames.map((frame) => (
                        <button
                            key={frame.id}
                            onClick={() => update('frame', frame.id)}
                            className={`aspect-square bg-surface border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${options.frame === frame.id
                                ? 'bg-primary/10 border-primary text-white'
                                : 'border-white/10 text-slate-400 hover:bg-surface-hover hover:text-white'
                                }`}
                        >
                            {frame.icon
                                ? <frame.icon size={24} />
                                : <div className={`w-8 h-8 opacity-80 ${frame.preview}`}></div>
                            }
                            <span className="text-[10px] font-medium">{frame.label}</span>
                        </button>
                    ))}
                </div>

                {/* Frame Text Input (Only if frame is active) */}
                {options.frame !== 'none' && (
                    <div className="animate-fade-in mt-2">
                        <Input
                            label="Frame Text"
                            value={options.frameText}
                            onChange={(e) => update('frameText', e.target.value)}
                            placeholder="SCAN ME"
                        />
                    </div>
                )}
            </div>

        </div>
    );
};
