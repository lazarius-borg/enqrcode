import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '../ui/Button';

type ExportDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (filename: string) => void;
    defaultFilename: string;
    format: string;
};

export const ExportDialog = ({ isOpen, onClose, onConfirm, defaultFilename, format }: ExportDialogProps) => {
    const [filename, setFilename] = useState(defaultFilename);

    useEffect(() => {
        if (isOpen) setFilename(defaultFilename);
    }, [isOpen, defaultFilename]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            ></div>

            {/* Dialog */}
            <div className="relative w-full max-w-sm bg-bg border border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="space-y-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Download size={24} />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Export QR Code</h2>
                        <p className="text-sm text-slate-400">Enter a name for your file</p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-16"
                            placeholder="filename"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && onConfirm(filename)}
                        />
                        <div className="absolute right-4 top-3.5 text-slate-500 font-medium select-none pointer-events-none">
                            .{format}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="glass"
                            className="flex-1 bg-surface border-white/10 text-white hover:bg-white/5"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 bg-primary text-white hover:bg-primary-hover border-none"
                            onClick={() => onConfirm(filename)}
                        >
                            Download
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
