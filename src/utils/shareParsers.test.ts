import { describe, it, expect } from 'vitest';
import { detectShareType, parseVCard, parseEvent, parseWifi } from './shareParsers';

describe('shareParsers', () => {

    describe('detectShareType', () => {
        it('should detect URL from param', () => {
            expect(detectShareType('some text', 'https://example.com')).toBe('url');
        });

        it('should detect URL from text', () => {
            expect(detectShareType('https://google.com')).toBe('url');
            expect(detectShareType('www.google.com')).toBe('url');
            expect(detectShareType('google.com')).toBe('url');
        });

        it('should detect VCard', () => {
            const vcard = `BEGIN:VCARD
VERSION:3.0
N:Doe;John;;;
FN:John Doe
END:VCARD`;
            expect(detectShareType(vcard)).toBe('vcard');
        });

        it('should detect Event', () => {
            const vevent = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:Test Event
DTSTART:20230101T120000
END:VEVENT
END:VCALENDAR`;
            expect(detectShareType(vevent)).toBe('event');
        });

        it('should detect WiFi', () => {
            expect(detectShareType('WIFI:S:MyNet;T:WPA;P:1234;;')).toBe('wifi');
        });

        it('should detect Email', () => {
            expect(detectShareType('test@example.com')).toBe('email');
        });

        it('should detect Phone', () => {
            expect(detectShareType('+1-555-555-5555')).toBe('phone');
            expect(detectShareType('555-555-5555')).toBe('phone');
        });

        it('should fallback to text', () => {
            expect(detectShareType('Hello World')).toBe('text');
            expect(detectShareType('Just some random content')).toBe('text');
        });
    });

    describe('parseVCard', () => {
        it('should parse basic vcard fields', () => {
            const vcard = `BEGIN:VCARD
VERSION:3.0
N:Doe;John;;;
FN:John Doe
ORG:Acme Inc
TITLE:CEO
EMAIL:john@acme.com
TEL;TYPE=CELL:+1234567890
URL:https://acme.com
ADR;TYPE=WORK:;;123 Main St;Springfield;IL;62704;USA
END:VCARD`;
            const result = parseVCard(vcard);
            expect(result.firstName).toBe('John Doe'); // FN preferred
            expect(result.organization).toBe('Acme Inc');
            expect(result.title).toBe('CEO');
            expect(result.email).toBe('john@acme.com');
            expect(result.mobile).toBe('+1234567890');
            expect(result.website).toBe('https://acme.com');
            expect(result.street).toBe('123 Main St');
            expect(result.city).toBe('Springfield');
            expect(result.country).toBe('USA');
        });
    });

    describe('parseEvent', () => {
        it('should parse basic event fields', () => {
            const vevent = `BEGIN:VEVENT
SUMMARY:Meeting
LOCATION:Room 101
DTSTART:20231225T100000
DTEND:20231225T110000
DESCRIPTION:Discuss strategy
END:VEVENT`;
            const result = parseEvent(vevent);
            expect(result.title).toBe('Meeting');
            expect(result.location).toBe('Room 101');
            expect(result.start).toBe('2023-12-25T10:00');
            expect(result.end).toBe('2023-12-25T11:00');
            expect(result.description).toBe('Discuss strategy');
        });
    });

    describe('parseWifi', () => {
        it('should parse wifi string', () => {
            const wifi = 'WIFI:S:MyNetwork;T:WPA;P:secretpass;;';
            const result = parseWifi(wifi);
            expect(result.ssid).toBe('MyNetwork');
            expect(result.encryption).toBe('WPA');
            expect(result.password).toBe('secretpass');
        });
    });

});
