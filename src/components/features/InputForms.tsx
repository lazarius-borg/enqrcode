import { useEffect, useRef } from 'react';
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

import { parseVCard, parseEvent, parseWifi, parsePhone, parseSms, parseWhatsapp, type ShareType } from '../../utils/shareParsers';

type InputFormsProps = {
    onChange: (value: string) => void;
    currentContent?: string;
    initialType?: ShareType;
    initialContent?: any;
    activeType: ShareType | 'sms' | 'whatsapp';
    onTypeChange: (type: ShareType | 'sms' | 'whatsapp') => void;
};

export const InputForms = ({ onChange, currentContent, initialType, initialContent, activeType, onTypeChange }: InputFormsProps) => {
    // const [activeType, setActiveType] = useState<ShareType | 'sms' | 'whatsapp'>('url'); // Lifted to App
    const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Sync active type when initialType provided (e.g. from Share Target)
    useEffect(() => {
        if (initialType) {
            onTypeChange(initialType);
        }
    }, [initialType, onTypeChange]);

    // Scroll active tab into view
    useEffect(() => {
        if (activeType && tabsRef.current[activeType]) {
            tabsRef.current[activeType]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [activeType]);

    const handleTypeChange = (type: ShareType | 'sms' | 'whatsapp') => {
        onTypeChange(type);
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

    // Helper data extractors for complex initial states
    const smsData = (activeType === 'sms' && currentContent) ? parseSms(currentContent) : { number: '', message: '' };
    const waData = (activeType === 'whatsapp' && currentContent) ? parseWhatsapp(currentContent) : { number: '', message: '' };

    return (
        <div className="w-full">
            {/* Type Switcher Pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-visible mb-6 p-1">
                {types.map((t) => (
                    <button
                        key={t.id}
                        ref={(el) => { tabsRef.current[t.id] = el }}
                        onClick={() => handleTypeChange(t.id as ShareType | 'sms' | 'whatsapp')}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all whitespace-nowrap ${activeType === t.id
                            ? 'bg-primary border-primary text-white font-medium shadow-lg shadow-primary/25'
                            : 'bg-surface border-md-outline-variant text-md-outline hover:text-text-main hover:bg-surface-hover'
                            }`}
                    >
                        <t.icon size={16} />
                        <span className="text-sm">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Form Rendering - With improved content syncing */}
            <div className="min-h-[300px]">
                {activeType === 'url' && <UrlForm onChange={onChange} initialValue={currentContent} />}
                {activeType === 'text' && <TextForm onChange={onChange} initialValue={currentContent} />}
                {activeType === 'email' && <EmailForm onChange={onChange} />}
                {activeType === 'phone' && (
                    <PhoneForm
                        mode="phone"
                        onChange={onChange}
                        initialValue={currentContent && activeType === 'phone' ? parsePhone(currentContent) : ''}
                    />
                )}
                {activeType === 'sms' && (
                    <PhoneForm
                        mode="sms"
                        onChange={onChange}
                        initialValue={smsData.number}
                        initialMessage={smsData.message || (initialType ? currentContent : '')} // fallback for simple text share
                    />
                )}
                {activeType === 'whatsapp' && (
                    <PhoneForm
                        mode="whatsapp"
                        onChange={onChange}
                        initialValue={waData.number}
                        initialMessage={waData.message}
                    />
                )}
                {activeType === 'wifi' && <WifiForm onChange={onChange} initialData={currentContent && activeType === 'wifi' ? parseWifi(currentContent) : (initialType === 'wifi' ? initialContent : null)} />}
                {activeType === 'vcard' && <VCardForm onChange={onChange} initialData={currentContent && activeType === 'vcard' ? parseVCard(currentContent) : (initialType === 'vcard' ? initialContent : null)} />}
                {activeType === 'event' && <EventForm onChange={onChange} initialData={currentContent && activeType === 'event' ? parseEvent(currentContent) : (initialType === 'event' ? initialContent : null)} />}
            </div>
        </div>
    );
};
