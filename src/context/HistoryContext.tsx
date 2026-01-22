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
    saved: HistoryItem[];
    addToHistory: (content: string, type?: HistoryItem['type']) => void;
    togglePin: (item: HistoryItem) => void;
    deleteItem: (id: string) => void;
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
    const [saved, setSaved] = useLocalStorage<HistoryItem[]>('enqrcode-saved-history', []);

    const addToHistory = (content: string, type: HistoryItem['type'] = 'text') => {
        // Check if exists in saved
        const existingSaved = saved.find(item => item.content === content && item.type === type);

        if (existingSaved) {
            // Move to top of saved
            setSaved(prev => {
                const filtered = prev.filter(item => item.id !== existingSaved.id);
                return [{ ...existingSaved, timestamp: Date.now() }, ...filtered];
            });
            return;
        }

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

    const togglePin = (item: HistoryItem) => {
        const isSaved = saved.some(i => i.id === item.id);

        if (isSaved) {
            // Unpin: Remove from saved, add to history top
            setSaved(prev => prev.filter(i => i.id !== item.id));
            setHistory(prev => [{ ...item, timestamp: Date.now() }, ...prev].slice(0, 50));
        } else {
            // Pin: Remove from history, add to saved top
            setHistory(prev => prev.filter(i => i.id !== item.id));
            setSaved(prev => [{ ...item, timestamp: Date.now() }, ...prev]);
        }
    };

    const deleteItem = (id: string) => {
        setHistory(prev => prev.filter(i => i.id !== id));
        setSaved(prev => prev.filter(i => i.id !== id));
    };

    const clearHistory = () => setHistory([]);

    return (
        <HistoryContext.Provider value={{ history, saved, addToHistory, togglePin, deleteItem, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
}
