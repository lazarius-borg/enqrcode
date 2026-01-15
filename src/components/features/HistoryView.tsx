import { Trash2, ArrowRight, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type HistoryItem = {
    id: string;
    content: string;
    type: 'url' | 'text' | 'email';
    timestamp: number;
};

type HistoryViewProps = {
    onSelect: (content: string) => void;
};

export const HistoryView = ({ onSelect }: HistoryViewProps) => {
    const [history, setHistory] = useLocalStorage<HistoryItem[]>('enqrcode-history', []);

    const clearHistory = () => setHistory([]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-text-main">
                    <Clock size={20} /> History
                </h2>
            </div>

            <div className="flex-1 space-y-3">
                {history.length === 0 ? (
                    <div className="text-center text-text-dim mt-10">
                        No history yet.
                    </div>
                ) : (
                    history.map((item) => (
                        <Card key={item.id} padding="sm" className="bg-surface hover:bg-surface-hover cursor-pointer group border-border">
                            <div onClick={() => onSelect(item.content)}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs uppercase tracking-wider text-text-dim">{item.type}</span>
                                    <span className="text-xs text-text-dim">{new Date(item.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-text-main truncate mb-2">{item.content}</p>
                                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight size={14} className="text-primary" />
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {history.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                    <Button variant="glass" className="w-full text-red-500 hover:bg-red-500/10" onClick={clearHistory}>
                        <Trash2 size={16} /> Clear History
                    </Button>
                </div>
            )}
        </div>
    );
};
