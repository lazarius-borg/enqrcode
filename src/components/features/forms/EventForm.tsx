import { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { qrPayloads } from '../../../utils/qrPayloads';

type EventFormProps = {
    onChange: (value: string) => void;
};

export const EventForm = ({ onChange }: EventFormProps) => {
    // Default to next hour
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

    // Format for datetime-local input: YYYY-MM-DDThh:mm
    const toLocalISO = (d: Date) => d.toISOString().slice(0, 16);

    const [data, setData] = useState({
        title: '',
        location: '',
        start: toLocalISO(now),
        end: toLocalISO(nextHour),
        description: ''
    });

    useEffect(() => {
        if (!data.title) {
            onChange('');
            return;
        }
        onChange(qrPayloads.event(data));
    }, [data, onChange]);

    const update = (key: string, value: string) => setData(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-4 animate-fade-in">
            <Input
                label="Event Title"
                placeholder="Product Launch"
                value={data.title}
                onChange={e => update('title', e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Starts</label>
                    <input
                        type="datetime-local"
                        className="w-full bg-surface text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-sans text-sm" // increased text size for better readability
                        value={data.start}
                        onChange={e => update('start', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Ends</label>
                    <input
                        type="datetime-local"
                        className="w-full bg-surface text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-sans text-sm"
                        value={data.end}
                        onChange={e => update('end', e.target.value)}
                    />
                </div>
            </div>

            <Input
                label="Location"
                placeholder="Conference Room A"
                value={data.location}
                onChange={e => update('location', e.target.value)}
            />

            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Description</label>
                <textarea
                    className="w-full bg-surface border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[100px] transition-all"
                    placeholder="Event details..."
                    value={data.description}
                    onChange={(e) => update('description', e.target.value)}
                />
            </div>
        </div>
    );
};
