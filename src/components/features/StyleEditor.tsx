import { Ban, Square, Circle, LayoutGrid } from 'lucide-react';
import type { CustomizationOptions } from './CustomizationPanel';
import { Input } from '../ui/Input';

const RoundedSquare = ({ size, className }: { size?: number | string; className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="18" height="18" x="3" y="3" rx="5" ry="5" />
    </svg>
);

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
        { id: 'rounded', label: 'Rounded', icon: RoundedSquare },
        { id: 'dot', label: 'Dots', icon: Circle },
    ];

    const eyeShapes = [
        { id: 'square', label: 'Square', icon: Square },
        { id: 'rounded', label: 'Rounded', icon: RoundedSquare },
        { id: 'circle', label: 'Circle', icon: Circle },
    ];

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Colors Section */}
            <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-md-outline tracking-wider ml-1">Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface border border-md-outline-variant p-3 rounded-2xl flex items-center justify-between">
                        <span className="text-sm">Dots</span>
                        <input
                            type="color"
                            value={options.color.dark}
                            onChange={(e) => handleColorChange('dark', e.target.value)}
                            className="w-8 h-8 rounded-full overflow-hidden border-2 border-md-outline-variant p-0 cursor-pointer"
                        />
                    </div>
                    <div className="bg-surface border border-md-outline-variant p-3 rounded-2xl flex items-center justify-between">
                        <span className="text-sm">BG</span>
                        <input
                            type="color"
                            value={options.color.light}
                            onChange={(e) => handleColorChange('light', e.target.value)}
                            className="w-8 h-8 rounded-full overflow-hidden border-2 border-md-outline-variant p-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Eyes Section */}
            <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold text-md-outline tracking-wider ml-1">Eyes</h3>

                {/* Frame */}
                <div className="space-y-2">
                    <span className="text-[10px] uppercase text-md-outline ml-1">Properties</span>
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] text-md-outline block text-center">Frame</label>
                            <div className="grid grid-cols-3 gap-2">
                                {eyeShapes.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => update('eyeFrame', s.id)}
                                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${options.eyeFrame === s.id || (!options.eyeFrame && s.id === 'square')
                                            ? 'bg-primary border-primary text-white'
                                            : 'bg-surface border-md-outline-variant text-md-outline hover:bg-surface-hover hover:text-text-main'
                                            }`}
                                        title={s.label}
                                    >
                                        <s.icon size={16} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] text-md-outline block text-center">Ball</label>
                            <div className="grid grid-cols-3 gap-2">
                                {eyeShapes.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => update('eyeBall', s.id)}
                                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${options.eyeBall === s.id || (!options.eyeBall && s.id === 'square')
                                            ? 'bg-primary border-primary text-white'
                                            : 'bg-surface border-md-outline-variant text-md-outline hover:bg-surface-hover hover:text-text-main'
                                            }`}
                                        title={s.label}
                                    >
                                        <s.icon size={16} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pattern Type */}
            <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-md-outline tracking-wider ml-1">Pattern</h3>
                <div className="grid grid-cols-3 gap-3">
                    {patterns.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => update('pattern', p.id)}
                            className={`py-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${options.pattern === p.id
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-surface border-md-outline-variant text-md-outline hover:bg-surface-hover hover:text-text-main'
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
                <h3 className="text-xs uppercase font-bold text-md-outline tracking-wider ml-1">Frames</h3>

                <div className="grid grid-cols-3 gap-3">
                    {frames.map((frame) => (
                        <button
                            key={frame.id}
                            onClick={() => update('frame', frame.id)}
                            className={`aspect-square bg-surface border rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${options.frame === frame.id
                                ? 'bg-primary/10 border-primary text-white'
                                : 'border-md-outline-variant text-md-outline hover:bg-surface-hover hover:text-text-main'
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

            {/* Logo Section */}
            <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-md-outline tracking-wider ml-1">Logo</h3>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            className="hidden"
                            onClick={(e) => {
                                // Allow re-selecting the same file by resetting value
                                (e.target as HTMLInputElement).value = '';
                                console.log('StyleEditor: Input clicked, value reset');
                            }}
                            onChange={(e) => {
                                console.log('StyleEditor: File input changed');
                                const file = e.target.files?.[0];
                                if (file) {
                                    console.log(`StyleEditor: File selected: ${file.name}, size: ${file.size} bytes`);

                                    const reader = new FileReader();

                                    reader.onload = (evt) => {
                                        console.log('StyleEditor: FileReader loaded successfully');
                                        const result = evt.target?.result as string;
                                        if (!result) {
                                            console.error('StyleEditor: FileReader result is empty');
                                            return;
                                        }

                                        // Compress image to prevent UI freeze with large base64 strings
                                        const img = new Image();
                                        img.onload = () => {
                                            const canvas = document.createElement('canvas');
                                            const MAX_SIZE = 300; // Resize to max 300px for icon/logo usage
                                            let width = img.width;
                                            let height = img.height;

                                            if (width > height) {
                                                if (width > MAX_SIZE) {
                                                    height *= MAX_SIZE / width;
                                                    width = MAX_SIZE;
                                                }
                                            } else {
                                                if (height > MAX_SIZE) {
                                                    width *= MAX_SIZE / height;
                                                    height = MAX_SIZE;
                                                }
                                            }

                                            canvas.width = width;
                                            canvas.height = height;
                                            const ctx = canvas.getContext('2d');
                                            ctx?.drawImage(img, 0, 0, width, height);

                                            const compressedDataUrl = canvas.toDataURL('image/png');
                                            console.log(`StyleEditor: Image compressed. New size: ${compressedDataUrl.length} chars (approx ${Math.round(compressedDataUrl.length * 0.75 / 1024)}KB)`);

                                            onChange({
                                                ...options,
                                                logo: compressedDataUrl,
                                                errorCorrectionLevel: 'H'
                                            });
                                        };
                                        img.onerror = (err) => {
                                            console.error('StyleEditor: Error loading image for compression', err);
                                            // Fallback to original if compression fails
                                            onChange({
                                                ...options,
                                                logo: result,
                                                errorCorrectionLevel: 'H'
                                            });
                                        };
                                        img.src = result;
                                    };

                                    reader.onerror = (err) => {
                                        console.error('StyleEditor: FileReader error', err);
                                        alert('Failed to read file');
                                    };

                                    console.log('StyleEditor: Starting readAsDataURL...');
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <label
                            htmlFor="logo-upload"
                            className="flex flex-col items-center justify-center w-20 h-20 bg-surface border border-md-outline-variant rounded-xl cursor-pointer hover:bg-surface-hover transition-colors overflow-hidden"
                        >
                            {options.logo ? (
                                <img src={options.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-md-outline">
                                    <LayoutGrid size={20} />
                                    <span className="text-[10px]">Upload</span>
                                </div>
                            )}
                        </label>
                    </div>

                    {options.logo && (
                        <button
                            onClick={() => onChange({ ...options, logo: undefined })}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 text-xs font-medium transition-colors"
                        >
                            Remove Logo
                        </button>
                    )}

                    <div className="text-xs text-md-outline max-w-[150px]">
                        Upload a logo to place in the center (forces High error correction).
                    </div>
                </div>
            </div>
        </div>
    );
};
