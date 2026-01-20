import { ArrowDownToLine } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IOSExecInstructions } from './IOSExecInstructions';
import { MD3Button } from './MD3Button';

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
                <MD3Button
                    onClick={install}
                    variant="text"
                    className={`rounded-full w-10 h-10 p-0 min-w-0 ${className}`}
                    title="Install App"
                >
                    <ArrowDownToLine size={24} />
                </MD3Button>
                {platform === 'ios' && (
                    <IOSExecInstructions isOpen={showIOSInstructions} onClose={closeIOSInstructions} />
                )}
            </>
        );
    }

    return (
        <>
            <MD3Button
                onClick={install}
                variant="tonal"
                className={`w-full justify-start mt-auto ${className}`}
                icon={<ArrowDownToLine size={18} />}
            >
                Install App
            </MD3Button>
            {platform === 'ios' && (
                <IOSExecInstructions isOpen={showIOSInstructions} onClose={closeIOSInstructions} />
            )}
        </>
    );
};
