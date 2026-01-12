import { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';

type UrlFormProps = {
    onChange: (value: string) => void;
};

export const UrlForm = ({ onChange }: UrlFormProps) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const trimmed = url.trim();
        if (!trimmed) {
            onChange('');
            setError(null);
            return;
        }

        // Check for spaces (URLs shouldn't have spaces usually, though encodeURI handles them, for user input it's usually a mistake)
        if (/\s/.test(trimmed)) {
            setError('URL cannot contain spaces');
            onChange('');
            return;
        }

        try {
            let testUrl = trimmed;
            // Add protocol if missing
            if (!/^https?:\/\//i.test(trimmed) && !/^[a-z]+:/i.test(trimmed)) {
                testUrl = 'https://' + trimmed;
            }

            const urlObj = new URL(testUrl);
            const hostname = urlObj.hostname;

            // Strict check: Hostname must have a dot (TLD) unless it's localhost or an IP
            // We optimize for common use case: "google" is invalid, "google.com" is valid
            // IPs (1.1.1.1) have dots.
            if (!hostname.includes('.') && hostname !== 'localhost') {
                throw new Error('Missing TLD');
            }

            // If we got here, it's valid
            setError(null);
            onChange(testUrl);
        } catch (e) {
            setError('Please enter a valid URL (e.g. example.com)');
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
