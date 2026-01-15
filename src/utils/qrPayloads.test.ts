import { describe, it, expect } from 'vitest';
import { qrPayloads } from './qrPayloads';

describe('qrPayloads', () => {
    it('generates correct email payload', () => {
        const payload = qrPayloads.email('test@example.com', 'Hello', 'World');
        expect(payload).toBe('mailto:test@example.com?subject=Hello&body=World');
    });

    it('generates correct wifi payload', () => {
        const payload = qrPayloads.wifi('MyNetwork', 'password123', 'WPA', false);
        expect(payload).toBe('WIFI:S:MyNetwork;T:WPA;P:password123;H:false;;');
    });

    it('generates correct vcard payload', () => {
        const data = {
            firstName: 'John',
            lastName: 'Doe',
            organization: 'Acme Corp',
            email: 'john@example.com',
            mobile: '1234567890'
        };
        const payload = qrPayloads.vcard(data);
        expect(payload).toContain('BEGIN:VCARD');
        expect(payload).toContain('N:Doe;John;;;');
        expect(payload).toContain('ORG:Acme Corp');
        expect(payload).toContain('EMAIL;TYPE=WORK:john@example.com');
        expect(payload).toContain('TEL;TYPE=CELL:1234567890');
        expect(payload).toContain('END:VCARD');
    });
});
