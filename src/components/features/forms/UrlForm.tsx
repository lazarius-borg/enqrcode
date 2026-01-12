import { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';

type UrlFormProps = {
    onChange: (value: string) => void;
};

export const UrlForm = ({ onChange }: UrlFormProps) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) {
            onChange('');
            setError(null);
            return;
        }

        // Basic URL validation
        try {
            // Try to construct URL to validate
            // If it doesn't start with http/https, we might prepend it for the check or just warn
            // But usually for QR code we want valid URI
            let testUrl = url;
            if (!/^https?:\/\//i.test(url) && !/^[a-z]+:/i.test(url)) {
                // If no protocol, it might be valid domain but invalid URL object
                testUrl = 'https://' + url;
            }
            new URL(testUrl);
            setError(null);
            onChange(testUrl);
        } catch (e) {
            setError('Invalid URL format');
            onChange('');
        }

    }, [url, onChange]);

    return (
        <div className="space-y-2 animate-fade-in">
            <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Website URL</label>
            <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={error || undefined}
                autoFocus
            />
        </div>
    );
};
