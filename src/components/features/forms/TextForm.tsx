import { useState, useEffect } from 'react';

type TextFormProps = {
    onChange: (value: string) => void;
    initialValue?: string;
};

export const TextForm = ({ onChange, initialValue }: TextFormProps) => {
    const [text, setText] = useState(initialValue || '');
    const MAX_CHARS = 2000;

    // Sync initialValue
    useEffect(() => {
        if (initialValue) {
            setText(initialValue);
            // Trigger parent update immediately so preview is generated
            // Use setTimeout to avoid race conditions during mounting/switching
            const t = setTimeout(() => {
                if (initialValue.length <= MAX_CHARS) {
                    onChange(initialValue);
                } else {
                    onChange('');
                }
            }, 0);
            return () => clearTimeout(t);
        }
    }, [initialValue, onChange]);

    const handleChange = (val: string) => {
        setText(val);
        if (val.length <= MAX_CHARS) {
            onChange(val);
        } else {
            // Ideally passing empty or error state, for now we let it pass but show warning
            // Or stop updating parent to prevent generation of massive QRs
            onChange('');
        }
    };

    return (
        <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between items-end">
                <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Content</label>
                <span className={`text-xs font-mono transition-colors ${text.length > MAX_CHARS ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                    {text.length}/{MAX_CHARS}
                </span>
            </div>
            <textarea
                className={`w-full bg-surface border rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-primary/50 min-h-[120px] transition-all resize-none ${text.length > MAX_CHARS ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary'
                    }`}
                placeholder="Enter your text here..."
                value={text}
                onChange={(e) => handleChange(e.target.value)}
            />
            {text.length > MAX_CHARS && (
                <p className="text-xs text-red-500 pl-1 animate-in fade-in slide-in-from-top-1">
                    Text is too long for a reliable QR code.
                </p>
            )}
        </div>
    );
};
