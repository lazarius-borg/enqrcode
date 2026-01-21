import { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { qrPayloads } from '../../../utils/qrPayloads';

type Mode = 'phone' | 'sms' | 'whatsapp';

type PhoneFormProps = {
    mode: Mode;
    onChange: (value: string) => void;
    initialValue?: string;
};

export const PhoneForm = ({ mode, onChange, initialValue }: PhoneFormProps) => {
    const [number, setNumber] = useState(initialValue || '');
    const [message, setMessage] = useState('');

    const [error, setError] = useState<string | null>(null);

    // Allow +, -, space, (), digits. Must have at least 5 digits.
    const isValidPhone = (p: string) => /^[+]?[\d\s-().]{5,30}$/.test(p);

    useEffect(() => {
        if (!number) {
            onChange('');
            setError(null);
            return;
        }

        if (!isValidPhone(number)) {
            // Only show error if length is reasonable to start validating
            // or if it contains invalid chars immediately
            if (number.length > 2 && !/^[\d\s-().+]*$/.test(number)) {
                setError('Invalid characters');
            } else if (number.length > 5) {
                // If long enough but fails regex (unlikely with above check, but for stricter patterns)
                // Keeping it valid as long as chars are valid for now to avoid annoyance
            }
            // Actually, let's just enforce char set and min length for "validity"
        }

        if (!/^[\d\s-().+]+$/.test(number)) {
            setError('Invalid characters in phone number');
            onChange('');
            return;
        }

        // Min length check
        const digitCount = number.replace(/\D/g, '').length;
        if (digitCount < 3) {
            // Don't show error yet, just don't generate
            setError(null);
            onChange('');
            return;
        }

        setError(null);

        if (mode === 'phone') {
            onChange(qrPayloads.phone(number));
        } else if (mode === 'sms') {
            onChange(qrPayloads.sms(number, message));
        } else if (mode === 'whatsapp') {
            onChange(qrPayloads.whatsapp(number, message));
        }
    }, [number, message, mode, onChange]);

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
                <Input
                    label="Phone Number"
                    placeholder="+1 555 012 3456"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    error={error || undefined}
                />
            </div>

            {(mode === 'sms' || mode === 'whatsapp') && (
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Message</label>
                    <textarea
                        className="w-full bg-surface border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[100px] transition-all"
                        placeholder="Your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};
