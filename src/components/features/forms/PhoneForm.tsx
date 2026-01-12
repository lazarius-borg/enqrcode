import { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { qrPayloads } from '../../../utils/qrPayloads';

type Mode = 'phone' | 'sms' | 'whatsapp';

type PhoneFormProps = {
    mode: Mode;
    onChange: (value: string) => void;
};

export const PhoneForm = ({ mode, onChange }: PhoneFormProps) => {
    const [number, setNumber] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!number) {
            onChange('');
            return;
        }

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
