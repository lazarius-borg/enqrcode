import QRCode from 'qrcode';

export type QRStyleOptions = {
    color: {
        dark: string;
        light: string;
    };
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
};

export const generateQRCode = async (text: string, options?: QRStyleOptions): Promise<string> => {
    try {
        return await QRCode.toDataURL(text, {
            width: options?.width || 400,
            margin: options?.margin ?? 1,
            color: options?.color || { dark: '#000000', light: '#ffffff00' }, // Transparent background default
            errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        });
    } catch (err) {
        console.error('Failed to generate QR code', err);
        throw err;
    }
};
