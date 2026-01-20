import { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import type { WifiEncryption } from '../../../utils/qrPayloads';
import { qrPayloads } from '../../../utils/qrPayloads';
import { Eye, EyeOff } from 'lucide-react';

type WifiFormProps = {
    onChange: (value: string) => void;
    initialData?: any;
};

export const WifiForm = ({ onChange, initialData }: WifiFormProps) => {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState<WifiEncryption>('WPA');
    const [hidden, setHidden] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (initialData) {
            if (initialData.ssid) setSsid(initialData.ssid);
            if (initialData.password) setPassword(initialData.password);
            if (initialData.encryption) setEncryption(initialData.encryption as WifiEncryption);
            if (initialData.hidden !== undefined) setHidden(!!initialData.hidden);
        }
    }, [initialData]);

    useEffect(() => {
        if (!ssid) {
            onChange('');
            return;
        }
        onChange(qrPayloads.wifi(ssid, password, encryption, hidden));
    }, [ssid, password, encryption, hidden, onChange]);

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
                <Input
                    label="Network Name (SSID)"
                    placeholder="MyWiFi"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                />
            </div>

            <div className="space-y-2 relative">
                <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Password</label>
                <div className="relative">
                    <input
                        className="w-full bg-surface text-white border border-white/10 rounded-xl px-4 py-3 placeholder:text-slate-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all pr-12"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={encryption === 'nopass'}
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        type="button"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Encryption</label>
                    <div className="flex bg-surface border border-white/10 rounded-xl p-1">
                        {(['WPA', 'WEP', 'nopass'] as const).map(enc => (
                            <button
                                key={enc}
                                onClick={() => setEncryption(enc)}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${encryption === enc
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {enc === 'nopass' ? 'None' : enc}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase font-bold text-slate-500 tracking-wider ml-1">Visibility</label>
                    <button
                        onClick={() => setHidden(!hidden)}
                        className={`w-full py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${hidden
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-surface border-white/10 text-slate-400 hover:bg-surface-hover hover:text-white'
                            }`}
                    >
                        {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span className="text-sm font-medium">{hidden ? 'Hidden' : 'Visible'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
