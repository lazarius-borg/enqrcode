import { useState, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { qrPayloads } from '../../../utils/qrPayloads';

type VCardFormProps = {
    onChange: (value: string) => void;
};

export const VCardForm = ({ onChange }: VCardFormProps) => {
    const [data, setData] = useState({
        firstName: '', lastName: '', organization: '', title: '',
        mobile: '', phone: '', email: '', website: '',
        street: '', city: '', zip: '', country: ''
    });

    const [errors, setErrors] = useState<{ email?: string; website?: string }>({});

    useEffect(() => {
        const newErrors: { email?: string; website?: string } = {};
        let isValid = true;

        // Email Validation
        if (data.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                newErrors.email = 'Invalid email address';
                isValid = false;
            }
        }

        // Website Validation
        if (data.website) {
            try {
                let url = data.website;
                if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
                const urlObj = new URL(url);
                if (!urlObj.hostname.includes('.')) {
                    newErrors.website = 'Invalid URL';
                    isValid = false;
                }
            } catch (e) {
                newErrors.website = 'Invalid URL';
                isValid = false;
            }
        }

        setErrors(newErrors);

        if (!isValid) {
            onChange('');
            return;
        }

        if (!data.firstName && !data.lastName && !data.organization) {
            onChange('');
            return;
        }

        onChange(qrPayloads.vcard(data));
    }, [data, onChange]);

    const update = (key: string, value: string) => setData(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Name */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/10 pb-1">Personal</h4>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" value={data.firstName} onChange={e => update('firstName', e.target.value)} />
                    <Input label="Last Name" placeholder="Doe" value={data.lastName} onChange={e => update('lastName', e.target.value)} />
                </div>
            </div>

            {/* Work */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/10 pb-1">Work</h4>
                <Input label="Company" placeholder="Acme Inc." value={data.organization} onChange={e => update('organization', e.target.value)} />
                <Input label="Job Title" placeholder="CEO" value={data.title} onChange={e => update('title', e.target.value)} />
            </div>

            {/* Contact */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/10 pb-1">Contact</h4>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Mobile" placeholder="+1..." value={data.mobile} onChange={e => update('mobile', e.target.value)} />
                    <Input label="Phone" placeholder="+1..." value={data.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <Input
                    label="Email"
                    type="email"
                    placeholder="john@acme.com"
                    value={data.email}
                    onChange={e => update('email', e.target.value)}
                    error={errors.email}
                />
                <Input
                    label="Website"
                    type="url"
                    placeholder="https://acme.com"
                    value={data.website}
                    onChange={e => update('website', e.target.value)}
                    error={errors.website}
                />
            </div>

            {/* Location */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-white/10 pb-1">Location</h4>
                <Input label="Address" placeholder="123 Main St" value={data.street} onChange={e => update('street', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="City" placeholder="New York" value={data.city} onChange={e => update('city', e.target.value)} />
                    <Input label="Zip Code" placeholder="10001" value={data.zip} onChange={e => update('zip', e.target.value)} />
                </div>
                <Input label="Country" placeholder="USA" value={data.country} onChange={e => update('country', e.target.value)} />
            </div>
        </div>
    );
};
