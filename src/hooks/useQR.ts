import { useState, useEffect } from 'react';
import { generateQRCode, type QRStyleOptions } from '../utils/qr';

export function useQR(content: string, options?: QRStyleOptions) {
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!content) {
            setQrCodeData(null);
            return;
        }

        let isMounted = true;
        setLoading(true);

        generateQRCode(content, options)
            .then((url) => {
                if (isMounted) setQrCodeData(url);
                setError(null);
            })
            .catch((err) => {
                if (isMounted) setError(err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [content, JSON.stringify(options)]);

    return { qrCodeData, error, loading };
}
