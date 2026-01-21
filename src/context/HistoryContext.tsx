import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type HistoryItem = {
    id: string;
    content: string;
    type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard' | 'event' | 'sms' | 'whatsapp';
    timestamp: number;
};

type HistoryContextType = {
    history: HistoryItem[];
    addToHistory: (content: string, type?: HistoryItem['type']) => void;
    clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function useHistory() {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
}

export function HistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useLocalStorage<HistoryItem[]>('enqrcode-history', []);

    const addToHistory = (content: string, type: HistoryItem['type'] = 'text') => {
        setHistory((prev) => {
            // Remove any existing duplicate to "move to top"
            const filtered = prev.filter(item => item.content !== content || item.type !== type);

            const newItem: HistoryItem = {
                id: Date.now().toString(),
                content,
                type,
                timestamp: Date.now()
            };

            // Limit to 50 items
            return [newItem, ...filtered].slice(0, 50);
        });
    };

    const clearHistory = () => setHistory([]);

    return (
        <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
}
