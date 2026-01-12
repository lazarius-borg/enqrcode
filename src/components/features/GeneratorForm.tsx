import { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Link, Mail, Type } from 'lucide-react';

type GeneratorFormProps = {
    value: string;
    onChange: (val: string) => void;
};

type InputType = 'url' | 'text' | 'email' | 'vcard';

export const GeneratorForm = ({ value, onChange }: GeneratorFormProps) => {
    const [type, setType] = useState<InputType>('url');
    // Local state to manage form fields before combining them into the single 'value' output if needed.
    // For now, let's keep it simple: direct mapping for URL/Text/Email. 
    // vCard would need a modal or expanded form.

    // We'll just clear the input when switching types for better UX, or keep it if it makes sense.
    // Let's keep it simple.

    const tabs = [
        { id: 'url', icon: Link, label: 'URL' },
        { id: 'email', icon: Mail, label: 'Email' },
        { id: 'text', icon: Type, label: 'Text' },
        // { id: 'vcard', icon: FileText, label: 'Contact' }, // TODO: Implement vCard form logic
    ] as const;

    useEffect(() => {
        // When switching types, we might want to validate or prefix the value
        // For this MVP, we just switch the UI context.
    }, [type]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <Card className="w-full max-w-md mx-auto flex flex-col gap-6">
            <div className="flex p-1 bg-black/10 rounded-xl overflow-hidden backdrop-blur-sm border border-white/5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setType(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium transition-all rounded-lg ${type === tab.id
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {type === 'url' && (
                    <Input
                        placeholder="https://example.com"
                        label="Website URL"
                        value={value}
                        onChange={handleInputChange}
                        autoFocus
                    />
                )}
                {type === 'email' && (
                    <Input
                        placeholder="name@example.com"
                        label="Email Address"
                        type="email"
                        value={value}
                        onChange={(e) => onChange(`mailto:${e.target.value}`)}
                    />
                )}
                {type === 'text' && (
                    <Input
                        placeholder="Enter your text here"
                        label="Plain Text"
                        value={value}
                        onChange={handleInputChange}
                    />
                )}
            </div>
        </Card>
    );
};
