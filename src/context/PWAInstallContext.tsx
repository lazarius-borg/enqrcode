import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Platform = 'native' | 'ios' | 'web';

interface PWAInstallContextType {
    isInstallable: boolean;
    isAppInstalled: boolean;
    install: () => void;
    platform: Platform;
    showIOSInstructions: boolean;
    closeIOSInstructions: () => void;
}

// Use a module-level variable to capture the event if it fires before hydration
let globalDeferredPrompt: any = null;

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        globalDeferredPrompt = e;
    });
}

const PWAInstallContext = createContext<PWAInstallContextType | undefined>(undefined);

export const PWAInstallProvider = ({ children }: { children: ReactNode }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(globalDeferredPrompt);
    const [isAppInstalled, setIsAppInstalled] = useState(false);
    const [platform, setPlatform] = useState<Platform>('web');
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Detect Platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;



        if (isStandalone) {
            setIsAppInstalled(true);
            setPlatform('native');
        } else if (isIOS) {
            setPlatform('ios');
        } else {
            setPlatform('web');
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            globalDeferredPrompt = e;
        };

        const handleAppInstalled = () => {
            setIsAppInstalled(true);
            setDeferredPrompt(null);
            globalDeferredPrompt = null;
            console.log('PWA was installed');
        };

        // If it fired before component mount, the state is already initialized from globalDeferredPrompt
        // We still listen for future events (unlikely for beforeinstallprompt but good practice)
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const install = async () => {
        if (platform === 'ios') {
            setShowIOSInstructions(true);
            return;
        }

        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        globalDeferredPrompt = null;
    };

    const isInstallable = !!deferredPrompt || platform === 'ios';

    return (
        <PWAInstallContext.Provider
            value={{
                isInstallable,
                isAppInstalled,
                install,
                platform,
                showIOSInstructions,
                closeIOSInstructions: () => setShowIOSInstructions(false)
            }}
        >
            {children}
        </PWAInstallContext.Provider>
    );
};

export const usePWAContext = () => {
    const context = useContext(PWAInstallContext);
    if (context === undefined) {
        throw new Error('usePWAContext must be used within a PWAInstallProvider');
    }
    return context;
};
