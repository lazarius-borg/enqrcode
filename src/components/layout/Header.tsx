import { QrCode } from 'lucide-react';

export const Header = () => {
    return (
        <header className="glass-panel mb-8 flex items-center justify-between p-4 sticky top-4 z-50">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                    <QrCode className="text-primary w-8 h-8" style={{ color: 'var(--primary-color)' }} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight m-0" style={{ fontSize: '1.5rem', background: 'none', WebkitTextFillColor: 'var(--text-primary)' }}>
                    enqrcode
                </h1>
            </div>

            {/* Settings or other actions could go here */}
        </header>
    );
};
