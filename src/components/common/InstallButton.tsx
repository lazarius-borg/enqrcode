import { ArrowDownToLine } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IOSExecInstructions } from './IOSExecInstructions';

type InstallButtonProps = {
    isMobile?: boolean;
    className?: string;
};

export const InstallButton = ({ isMobile = false, className = '' }: InstallButtonProps) => {
    const { isInstallable, isAppInstalled, install, platform, showIOSInstructions, closeIOSInstructions } = usePWAInstall();

    // If installed or not installable (and not iOS check implicitly handled by isInstallable), hide
    if (!isInstallable || isAppInstalled) {
        return null;
    }

    // Different render for Mobile Header vs Sidebar
    if (isMobile) {
        return (
            <>
                <button
                    onClick={install}
                    className={`p-2 text-primary hover:bg-primary/10 rounded-full transition-colors ${className}`}
                    title="Install App"
                >
                    <ArrowDownToLine size={24} />
                </button>
                {platform === 'ios' && (
                    <IOSExecInstructions isOpen={showIOSInstructions} onClose={closeIOSInstructions} />
                )}
            </>
        );
    }

    return (
        <>
            <button
                onClick={install}
                className={`w-full flex items-center gap-3 px-4 py-3.5 mt-auto rounded-xl text-sm font-medium transition-all duration-200 
                bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:border-primary ${className}`}
            >
                <ArrowDownToLine size={18} />
                <span>Install App</span>
            </button>
            {platform === 'ios' && (
                <IOSExecInstructions isOpen={showIOSInstructions} onClose={closeIOSInstructions} />
            )}
        </>
    );
};
