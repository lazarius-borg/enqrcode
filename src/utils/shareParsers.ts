export type ShareType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard' | 'event';

export const detectShareType = (text: string, urlParam?: string): ShareType => {
    const trimmed = text.trim();

    // 1. Explicit URL param or Text looks like URL
    if (urlParam) return 'url';
    if (/^https?:\/\//i.test(trimmed)) return 'url';
    if (/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(trimmed)) return 'url';

    // 2. WiFi
    if (trimmed.startsWith('WIFI:')) return 'wifi';

    // 3. VCard
    if (trimmed.includes('BEGIN:VCARD')) return 'vcard';

    // 4. Event
    if (trimmed.includes('BEGIN:VEVENT')) return 'event';

    // 5. Email (simple regex)
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'email';

    // 6. Phone
    // More permissive check for International numbers
    // Must strictly contain only phone-related characters: + digits space - . ( )
    // Must have reasonable digit count (7-15)
    // Must NOT look like an ISO date (YYYY-MM-DD)
    const validPhoneChars = /^[+\d\s\-\.\(\)]+$/.test(trimmed);
    const digitCount = trimmed.replace(/\D/g, '').length;
    const isDate = /^\d{4}[-\/]\d{2}[-\/]\d{2}$/.test(trimmed);

    if (validPhoneChars && !isDate && digitCount >= 7 && digitCount <= 15) return 'phone';

    // 7. Fallback
    return 'text';
};

export const parseVCard = (text: string) => {
    // Simple parser for VCard 3.0/4.0 text
    // Extract key fields: FN, N, ORG, TITLE, TEL, EMAIL, URL, ADR

    const getValue = (key: string) => {
        // Match KEY:VALUE or KEY;TYPE=...:VALUE
        const regex = new RegExp(`^${key}(?:;[^:]*)*:(.*)$`, 'mi');
        const match = text.match(regex);
        return match ? match[1].trim() : '';
    };

    const nParts = getValue('N').split(';');
    const lastName = nParts[0] || '';
    const firstName = nParts[1] || '';

    const adrParts = getValue('ADR').split(';');
    // ADR:;;123 Main St;City;State;Zip;Country
    // Standard varies, often: box;extended;street;city;region;zip;country

    return {
        firstName: getValue('FN') || firstName, // Prefer FN if available
        lastName: lastName,
        organization: getValue('ORG'),
        title: getValue('TITLE'),
        mobile: getValue('TEL;TYPE=CELL') || getValue('TEL'), // Naive preference
        phone: getValue('TEL;TYPE=WORK'),
        email: getValue('EMAIL'),
        website: getValue('URL'),
        street: adrParts[2] || '',
        city: adrParts[3] || '',
        zip: adrParts[5] || '',
        country: adrParts[6] || ''
    };
};

export const parseEvent = (text: string) => {
    // Simple parser for VEvent
    // First, isolate the VEVENT block to avoid matching VTIMEZONE or other components
    const eventBlockMatch = text.match(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/i);
    const eventText = eventBlockMatch ? eventBlockMatch[1] : text;

    const getValue = (key: string) => {
        // Match KEY:VALUE or KEY;TYPE=...:VALUE
        // Use eventText instead of raw text
        const regex = new RegExp(`^${key}(?:;[^:]*)*:(.*)$`, 'mi');
        const match = eventText.match(regex);
        return match ? match[1].trim() : '';
    };

    // Format YYYYMMDDThhmmssZ to YYYY-MM-DDThh:mm (local for input)
    // Ignoring timezones for simplicity in this V1
    const formatTime = (icalTime: string) => {
        if (!icalTime) return '';
        // 20230101T120000
        const m = icalTime.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
        if (m) {
            return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}`;
        }
        return '';
    };

    return {
        title: getValue('SUMMARY'),
        location: getValue('LOCATION'),
        start: formatTime(getValue('DTSTART')),
        end: formatTime(getValue('DTEND')),
        description: getValue('DESCRIPTION')
    };
};

export const parseWifi = (text: string) => {
    // WIFI:T:WPA;S:MyNetwork;P:MyPassword;;
    const getParam = (key: string) => {
        const regex = new RegExp(`${key}:([^;]+)`);
        const match = text.match(regex);
        return match ? match[1] : '';
    };

    return {
        ssid: getParam('S'),
        password: getParam('P'),
        encryption: getParam('T'),
        hidden: text.includes('H:true')
    };
};
