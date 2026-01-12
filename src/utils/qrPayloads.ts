export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export const qrPayloads = {
    url: (url: string) => url,

    text: (text: string) => text,

    email: (email: string, subject: string = '', body: string = '') => {
        const params = new URLSearchParams();
        if (subject) params.append('subject', subject);
        if (body) params.append('body', body);
        const queryString = params.toString();
        return `mailto:${email}${queryString ? `?${queryString}` : ''}`;
    },

    phone: (number: string) => `tel:${number}`,

    sms: (number: string, message: string = '') => {
        // SMS format varies slightly by device, but this is generally supported
        const body = message ? `?body=${encodeURIComponent(message)}` : '';
        return `sms:${number}${body}`;
    },

    whatsapp: (number: string, message: string = '') => {
        // Remove non-digit chars for the API
        const cleanNumber = number.replace(/\D/g, '');
        const text = message ? `?text=${encodeURIComponent(message)}` : '';
        return `https://wa.me/${cleanNumber}${text}`;
    },

    wifi: (ssid: string, password: string, encryption: WifiEncryption, hidden: boolean) => {
        // WIFI:S:MySSID;T:WPA;P:MyPass;H:false;;
        return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};;`;
    },

    vcard: (data: any) => {
        // Minimal VCard 3.0 implementation
        // We'll expand this based on the full spec
        const parts = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${data.lastName};${data.firstName};;;`,
            `FN:${data.firstName} ${data.lastName}`,
        ];

        if (data.organization) parts.push(`ORG:${data.organization}`);
        if (data.title) parts.push(`TITLE:${data.title}`);
        if (data.mobile) parts.push(`TEL;TYPE=CELL:${data.mobile}`);
        if (data.phone) parts.push(`TEL;TYPE=WORK:${data.phone}`);
        if (data.email) parts.push(`EMAIL;TYPE=WORK:${data.email}`);
        if (data.website) parts.push(`URL:${data.website}`);

        if (data.street || data.city || data.zip || data.country) {
            parts.push(`ADR;TYPE=WORK:;;${data.street || ''};${data.city || ''};;${data.zip || ''};${data.country || ''}`);
        }

        parts.push('END:VCARD');
        return parts.join('\n');
    },

    event: (data: any) => {
        // Basic iCal VEVENT
        const formatTime = (isoString: string) => isoString.replace(/[-:]/g, '').split('.')[0] + 'Z';

        const parts = [
            'BEGIN:VEVENT',
            `SUMMARY:${data.title}`,
            `DTSTART:${formatTime(new Date(data.start).toISOString())}`,
            `DTEND:${formatTime(new Date(data.end).toISOString())}`,
        ];
        if (data.location) parts.push(`LOCATION:${data.location}`);
        if (data.description) parts.push(`DESCRIPTION:${data.description}`);

        parts.push('END:VEVENT');
        return parts.join('\n');
    }
};
