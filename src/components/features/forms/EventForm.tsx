import { useState, useEffect, useRef } from 'react';
import { Input } from '../../ui/Input';
import { qrPayloads } from '../../../utils/qrPayloads';
import { X } from 'lucide-react';

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

    const [dateError, setDateError] = useState<string | null>(null);
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    // Sync to parent logic (validation + generation)
    const syncToParent = () => {
        // Validation
        if (data.start && data.end) {
            if (new Date(data.start) >= new Date(data.end)) {
                setDateError('End time must be after start time');
                onChange(''); // Prevent generation
                return;
            }
        }
        setDateError(null);

        if (!data.title) {
            onChange('');
            return;
        }
        onChange(qrPayloads.event(data));
    };

    // Auto-sync for text fields (immediate)
    useEffect(() => {
        syncToParent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.title, data.location, data.description, onChange]);
    // NOTE: We exclude data.start/end to prevent picker closing on selection. 
    // Dates are synced onBlur.

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
                <div className="space-y-2 relative">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Starts</label>
                    <div className="relative">
                        <input
                            ref={startRef}
                            type="datetime-local"
                            className="w-full bg-surface text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-sans text-sm pr-10"
                            value={data.start}
                            onChange={e => update('start', e.target.value)}
                            onBlur={syncToParent}
                        />
                        <button
                            onClick={() => startRef.current?.blur()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            title="Close Picker"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
                <div className="space-y-2 relative">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Ends</label>
                    <div className="relative">
                        <input
                            ref={endRef}
                            type="datetime-local"
                            className={`w-full bg-surface text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-sans text-sm pr-10 ${dateError ? 'border-red-500' : ''}`}
                            value={data.end}
                            onChange={e => update('end', e.target.value)}
                            onBlur={syncToParent}
                        />
                        <button
                            onClick={() => endRef.current?.blur()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            title="Close Picker"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {dateError && <p className="text-xs text-red-500 ml-1">{dateError}</p>}

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
