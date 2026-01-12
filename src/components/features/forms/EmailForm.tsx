import { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { qrPayloads } from '../../../utils/qrPayloads';

type EmailFormProps = {
    onChange: (value: string) => void;
};

export const EmailForm = ({ onChange }: EmailFormProps) => {
    const [state, setState] = useState({ email: '', subject: '', body: '' });

    useEffect(() => {
        if (!state.email) {
            onChange('');
            return;
        }
        onChange(qrPayloads.email(state.email, state.subject, state.body));
    }, [state, onChange]);

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
                <Input
                    label="Email Address"
                    placeholder="johndoe@example.com"
                    value={state.email}
                    onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                />
            </div>
            <div className="space-y-2">
                <Input
                    label="Subject"
                    placeholder="Inquiry"
                    value={state.subject}
                    onChange={(e) => setState(prev => ({ ...prev, subject: e.target.value }))}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Message</label>
                <textarea
                    className="w-full bg-surface border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[100px] transition-all"
                    placeholder="Brief message..."
                    value={state.body}
                    onChange={(e) => setState(prev => ({ ...prev, body: e.target.value }))}
                />
            </div>
        </div>
    );
};
