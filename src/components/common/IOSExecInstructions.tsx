import { Share, PlusSquare, X } from 'lucide-react';

type IOSExecInstructionsProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const IOSExecInstructions = ({ isOpen, onClose }: IOSExecInstructionsProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            ></div>

            {/* Dialog */}
            <div className="relative w-full max-w-sm bg-surface border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-white mb-2">Install App</h2>
                        <p className="text-sm text-slate-400">Install to your home screen for the best experience.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shrink-0">
                                <Share size={20} />
                            </div>
                            <div className="text-sm text-slate-300">
                                <span className="text-slate-500 block text-xs mb-0.5">Step 1</span>
                                Tap the <span className="text-white font-medium">Share</span> button in your browser menu.
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center shrink-0">
                                <PlusSquare size={20} />
                            </div>
                            <div className="text-sm text-slate-300">
                                <span className="text-slate-500 block text-xs mb-0.5">Step 2</span>
                                Scroll down and tap <span className="text-white font-medium">Add to Home Screen</span>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
