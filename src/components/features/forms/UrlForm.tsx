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

            // Strict check: Hostname must have a dot (TLD) unless it's localhost
            // We optimize for common use case: "google" is invalid, "google.com" is valid.
            // "test." is invalid (trailing dot with empty TLD).
            // Regex checks for a dot followed by at least 2 alphanumeric chars for TLD (more realistic) or at least 1 as requested.
            // Using /\.[a-z0-9]+$/i ensures there is content after the last dot.
            if (hostname !== 'localhost' && !/\.[a-z0-9]+$/i.test(hostname)) {
                throw new Error('Invalid TLD');
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
