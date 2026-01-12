import { Input } from '../../ui/Input';

type UrlFormProps = {
    onChange: (value: string) => void;
};

export const UrlForm = ({ onChange }: UrlFormProps) => {
    return (
        <div className="space-y-2 animate-fade-in">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Website URL</label>
            <Input
                placeholder="https://example.com"
                onChange={(e) => onChange(e.target.value)}
                autoFocus
            />
        </div>
    );
};
