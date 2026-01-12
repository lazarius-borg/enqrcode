import { Download, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';

type PreviewCardProps = {
    dataUrl: string | null;
    loading: boolean;
    onDownload: () => void;
    onShare: () => void;
};

export const PreviewCard = ({ dataUrl, loading, onDownload, onShare }: PreviewCardProps) => {
    return (
        <div className="w-full max-w-[320px] mx-auto mb-8">
            {/* White Container Card matching mockups */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl aspect-square flex items-center justify-center relative overflow-hidden mb-6">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {!dataUrl && !loading && (
                    <div className="text-center opacity-30 text-black">
                        <p>Preview</p>
                    </div>
                )}

                {dataUrl && (
                    <img
                        src={dataUrl}
                        alt="QR Code"
                        className="w-full h-full object-contain animate-in fade-in zoom-in duration-300"
                    />
                )}
            </div>

            <div className="flex gap-4">
                <Button variant="glass" className="flex-1 bg-surface border-white/10 text-white hover:bg-slate-700/80 justify-center h-12 rounded-xl" onClick={onShare}>
                    <Share2 size={18} /> Share
                </Button>
                <Button variant="primary" className="flex-1 bg-primary hover:bg-primary-hover text-white justify-center h-12 rounded-xl border-none" onClick={onDownload}>
                    <Download size={18} /> Export
                </Button>
            </div>
        </div>
    );
};
