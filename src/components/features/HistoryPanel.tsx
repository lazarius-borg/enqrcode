import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type HistoryItem = {
    id: string;
    content: string;
    type: 'url' | 'text' | 'email';
    timestamp: number;
};

type HistoryPanelProps = {
    onSelect: (content: string) => void;
    isOpen: boolean;
    onClose: () => void;
};

export const HistoryPanel = ({ onSelect, isOpen, onClose }: HistoryPanelProps) => {
    const [history, setHistory] = useLocalStorage<HistoryItem[]>('enqrcode-history', []);

    const clearHistory = () => setHistory([]);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-black/60 backdrop-blur-md border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <Clock size={20} /> History
                    </h2>
                    <Button variant="glass" size="sm" onClick={onClose}>Close</Button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center text-white/40 mt-10">
                            No history yet.
                        </div>
                    ) : (
                        history.map((item) => (
                            <Card key={item.id} padding="sm" className="bg-white/5 hover:bg-white/10 cursor-pointer group" >
                                <div onClick={() => { onSelect(item.content); onClose(); }}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs uppercase tracking-wider text-white/50">{item.type}</span>
                                        <span className="text-xs text-white/30">{new Date(item.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-white truncate mb-2">{item.content}</p>
                                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight size={14} className="text-primary" />
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {history.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <Button variant="glass" className="w-full text-red-300 hover:bg-red-500/10 hover:text-red-400" onClick={clearHistory}>
                            <Trash2 size={16} /> Clear History
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
