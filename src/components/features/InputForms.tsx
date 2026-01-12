import { useState } from 'react';
import {
    Link, Type, Wifi, Contact, Mail, Phone, MessageSquare, Calendar, MessagesSquare
} from 'lucide-react';

import { UrlForm } from './forms/UrlForm';
import { TextForm } from './forms/TextForm';
import { EmailForm } from './forms/EmailForm';
import { PhoneForm } from './forms/PhoneForm';
import { WifiForm } from './forms/WifiForm';
import { VCardForm } from './forms/VCardForm';
import { EventForm } from './forms/EventForm';

type InputType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'whatsapp' | 'wifi' | 'vcard' | 'event';

type InputFormsProps = {
    onChange: (value: string) => void;
};

export const InputForms = ({ onChange }: InputFormsProps) => {
    const [activeType, setActiveType] = useState<InputType>('url');

    const handleTypeChange = (type: InputType) => {
        setActiveType(type);
        onChange(''); // Clear content on switch
    };

    const types = [
        { id: 'url', label: 'URL', icon: Link },
        { id: 'text', label: 'Text', icon: Type },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'phone', label: 'Phone', icon: Phone },
        { id: 'sms', label: 'SMS', icon: MessageSquare },
        { id: 'whatsapp', label: 'Whats...', icon: MessagesSquare },
        { id: 'wifi', label: 'WiFi', icon: Wifi },
        { id: 'vcard', label: 'VCard', icon: Contact },
        { id: 'event', label: 'Event', icon: Calendar },
    ] as const;

    return (
        <div className="w-full">
            {/* Type Switcher Pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 p-1">
                {types.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => handleTypeChange(t.id as InputType)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${activeType === t.id
                                ? 'bg-primary border-primary text-white font-medium shadow-lg shadow-primary/25'
                                : 'bg-surface border-white/10 text-slate-400 hover:text-white hover:bg-surface-hover'
                            }`}
                    >
                        <t.icon size={16} />
                        <span className="text-sm">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Form Rendering */}
            <div className="min-h-[300px]">
                {activeType === 'url' && <UrlForm onChange={onChange} />}
                {activeType === 'text' && <TextForm onChange={onChange} />}
                {activeType === 'email' && <EmailForm onChange={onChange} />}
                {activeType === 'phone' && <PhoneForm mode="phone" onChange={onChange} />}
                {activeType === 'sms' && <PhoneForm mode="sms" onChange={onChange} />}
                {activeType === 'whatsapp' && <PhoneForm mode="whatsapp" onChange={onChange} />}
                {activeType === 'wifi' && <WifiForm onChange={onChange} />}
                {activeType === 'vcard' && <VCardForm onChange={onChange} />}
                {activeType === 'event' && <EventForm onChange={onChange} />}
            </div>
        </div>
    );
};
