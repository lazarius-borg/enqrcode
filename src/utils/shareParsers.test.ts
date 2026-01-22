
import { describe, it, expect } from 'vitest';
import { detectShareType, parsePhone, parseSms, parseWhatsapp } from './shareParsers';

describe('shareParsers', () => {
    describe('detectShareType', () => {
        it('detects URLs', () => {
            expect(detectShareType('https://google.com')).toBe('url');
            expect(detectShareType('google.com')).toBe('url');
        });

        it('detects WiFi', () => {
            expect(detectShareType('WIFI:S:MyNet;T:WPA;P:pass;;')).toBe('wifi');
        });

        it('detects VCard', () => {
            expect(detectShareType('BEGIN:VCARD\nVN:John')).toBe('vcard');
        });

        it('detects Phone', () => {
            expect(detectShareType('+1234567890')).toBe('phone');
            expect(detectShareType('123-456-7890')).toBe('phone');
        });
    });

    describe('parsePhone', () => {
        it('extracts number from tel: URI', () => {
            expect(parsePhone('tel:+1234567890')).toBe('+1234567890');
        });

        it('handles plain numbers (fallback)', () => {
            expect(parsePhone('+1234567890')).toBe('+1234567890');
        });
    });

    describe('parseSms', () => {
        it('extracts number only', () => {
            expect(parseSms('sms:+1234567890')).toEqual({ number: '+1234567890', message: '' });
        });

        it('extracts number and body', () => {
            expect(parseSms('sms:+1234567890?body=Hello%20World')).toEqual({ number: '+1234567890', message: 'Hello World' });
        });
    });

    describe('parseWhatsapp', () => {
        it('extracts number only', () => {
            expect(parseWhatsapp('https://wa.me/1234567890')).toEqual({ number: '1234567890', message: '' });
        });

        it('extracts number and text', () => {
            expect(parseWhatsapp('https://wa.me/1234567890?text=Hello%20World')).toEqual({ number: '1234567890', message: 'Hello World' });
        });

        it('handles invalid URL gracefully', () => {
            expect(parseWhatsapp('invalid')).toEqual({ number: '', message: '' });
        });
    });
});
