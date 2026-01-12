type TextFormProps = {
    onChange: (value: string) => void;
};

export const TextForm = ({ onChange }: TextFormProps) => {
    return (
        <div className="space-y-2 animate-fade-in">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Content</label>
            <textarea
                className="w-full bg-surface border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[120px] transition-all"
                placeholder="Enter your text here..."
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
