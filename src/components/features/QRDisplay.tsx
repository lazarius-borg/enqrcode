import { Download, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type QRDisplayProps = {
    dataUrl: string | null;
    loading: boolean;
    error: Error | null;
};

export const QRDisplay = ({ dataUrl, loading, error }: QRDisplayProps) => {

    const handleDownload = () => {
        if (!dataUrl) return;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (!dataUrl) return;
        try {
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'qrcode.png', { type: 'image/png' });
            if (navigator.share) {
                await navigator.share({
                    title: 'QR Code',
                    text: 'Here is my QR Code',
                    files: [file],
                });
            } else {
                alert('Sharing is not supported on this device');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <Card className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto relative overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 transition-all">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            )}

            {error && (
                <div className="text-red-400 text-center p-4">
                    <p>Error generating QR Code</p>
                    <p className="text-sm opacity-70">{error.message}</p>
                </div>
            )}

            {!dataUrl && !loading && !error && (
                <div className="text-center opacity-50 p-8">
                    <p>Enter text to generate QR code</p>
                </div>
            )}

            {dataUrl && (
                <div className="flex flex-col items-center gap-6 w-full animate-in fade-in zoom-in duration-300">
                    <div className="bg-white p-4 rounded-xl shadow-2xl">
                        <img src={dataUrl} alt="Generated QR Code" className="w-[250px] h-[250px] object-contain" />
                    </div>

                    <div className="flex gap-3 w-full justify-center">
                        <Button variant="primary" onClick={handleDownload}>
                            <Download size={18} />
                            Download
                        </Button>
                        <Button variant="glass" onClick={handleShare}>
                            <Share2 size={18} />
                            Share
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};
