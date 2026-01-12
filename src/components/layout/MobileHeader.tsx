import { ArrowLeft, History } from 'lucide-react';

type MobileHeaderProps = {
    title?: string;
    onHistoryClick: () => void;
};

export const MobileHeader = ({ title = 'QR Creator', onHistoryClick }: MobileHeaderProps) => {
    return (
        <header className="flex items-center justify-between p-4 bg-bg/95 border-b border-white/5 sticky top-0 z-50 backdrop-blur-md">
            <button className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft size={24} />
            </button>

            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>

            <button
                onClick={onHistoryClick}
                className="p-2 -mr-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
                <History size={24} />
            </button>
        </header>
    );
};
