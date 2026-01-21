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
        if (initialValue !== undefined) {
            setText(initialValue);
            // Trigger parent update immediately so preview is generated
            // Use setTimeout to avoid race conditions during mounting/switching
            const t = setTimeout(() => {
                // Only update parent if valid, allowing clearing
                if (initialValue.length <= MAX_CHARS) {
                    // We don't need to call onChange if it matches? 
                    // If InputForms passes `content` back to us, calling `onChange` again is redundant but safe loop-wise if values match.
                    // Actually, if we just setText, the component state updates.
                    // If we don't call onChange, parent content remains same (which it is, since it passed it in).
                    // But if this is "initial" load from Share Target (which we removed from InputForms logic for TextForm mostly), 
                    // we might need it? 
                    // Wait, I removed `initialContent` usage for TextForm in InputForms.
                    // So `currentContent` comes in. `currentContent` IS the parent state.
                    // So calling `onChange(currentContent)` is redundant.
                    // So we can arguably skip `onChange` here if it matches?
                    // No, let's leave it for safety or remove it if problematic.
                    // If I leave it, it's a loop: App render -> InputForms render -> TextForm effect -> onChange -> App setContent -> App render ...
                    // React bails out if state doesn't change. `setContent` same value = no re-render.
                    onChange(initialValue);
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
