import { Palette } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

export type CustomizationOptions = {
    color: {
        dark: string;
        light: string;
    };
    margin: number;
    // New fields
    pattern: 'square' | 'dot' | 'rounded';
    eyeFrame?: 'square' | 'rounded' | 'circle'; // New
    eyeBall?: 'square' | 'rounded' | 'circle'; // New
    frame: 'none' | 'classic' | 'pill' | 'polaroid';
    frameText: string;
    frameColor?: string; // Optional override
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    width?: number; // Output resolution
    fileFormat?: 'png' | 'jpeg' | 'svg';
    logo?: string;
};

type CustomizationPanelProps = {
    options: CustomizationOptions;
    onChange: (options: CustomizationOptions) => void;
};

export const CustomizationPanel = ({ options, onChange }: CustomizationPanelProps) => {

    const handleColorChange = (key: 'dark' | 'light', value: string) => {
        onChange({
            ...options,
            color: {
                ...options.color,
                [key]: value
            }
        });
    };

    const handleMarginChange = (value: number) => {
        onChange({
            ...options,
            margin: value
        });
    };

    return (
        <Card className="w-full">
            <div className="flex items-center gap-2 mb-4 text-white/80">
                <Palette size={18} />
                <h3 className="font-semibold">Appearance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Colors */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-white/60 mb-1 block">Colors</label>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: options.color.dark }}></div>
                                <span className="text-xs text-white/50">Dots</span>
                            </div>
                            <Input
                                type="color"
                                className="h-10 p-1 w-full cursor-pointer"
                                value={options.color.dark}
                                onChange={(e) => handleColorChange('dark', e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: options.color.light }}></div>
                                <span className="text-xs text-white/50">Background</span>
                            </div>
                            <Input
                                type="color"
                                className="h-10 p-1 w-full cursor-pointer"
                                value={options.color.light} // Note: This might handle transparency poorly with standard color input
                                onChange={(e) => handleColorChange('light', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Layout */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-white/60 mb-1 block">Layout</label>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-white/50">
                                <span>Margin</span>
                                <span>{options.margin} blocks</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="1"
                                value={options.margin}
                                className="w-full accent-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                onChange={(e) => handleMarginChange(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
