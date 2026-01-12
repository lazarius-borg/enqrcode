import { Card } from '../ui/Card';

type AdSpaceProps = {
    slotId?: string;
    format?: 'horizontal' | 'vertical' | 'rectangle';
    className?: string;
};

export const AdSpace = ({ className = '', format = 'horizontal' }: AdSpaceProps) => {
    // In a real app, this would detect production env and render script tags.
    // For now, it renders a glassmorphic placeholder that looks nice.

    const heightClass = format === 'horizontal' ? 'h-24' : format === 'rectangle' ? 'h-64' : 'h-screen';

    return (
        <Card className={`flex items-center justify-center bg-white/5 border-dashed border-2 border-white/10 ${heightClass} ${className}`} padding="none">
            <div className="text-center opacity-50">
                <p className="text-xs uppercase tracking-widest mb-1">Advertisement</p>
                <p className="text-[10px]">Support us by disabling adblocker</p>
            </div>
        </Card>
    );
};
