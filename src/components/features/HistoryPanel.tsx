import { Clock, Trash2, ArrowRight, Pin, PinOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useHistory, type HistoryItem } from '../../context/HistoryContext';

type HistoryPanelProps = {
    onSelect: (item: HistoryItem) => void;
    isOpen: boolean;
    onClose: () => void;
};

export const HistoryPanel = ({ onSelect, isOpen, onClose }: HistoryPanelProps) => {
    const { history, saved, clearHistory, togglePin, deleteItem } = useHistory();

    if (!isOpen) return null;

    const renderItem = (item: HistoryItem, isSaved: boolean) => (
        <Card key={item.id} padding="sm" className="bg-white/5 hover:bg-white/10 cursor-pointer group relative">
            <div onClick={() => { onSelect(item); onClose(); }} className="pr-16">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs uppercase tracking-wider text-white/50">{item.type}</span>
                    <span className="text-xs text-white/30">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-white truncate mb-2">{item.content}</p>

                {/* Visual cue for selection */}
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bottom-2">
                    <ArrowRight size={14} className="text-primary/50" />
                </div>
            </div>

            {/* Actions */}
            <div className="absolute right-2 top-2 flex gap-1 z-50 bg-black/20 backdrop-blur-sm rounded-full p-1 opacity-100">
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); togglePin(item); }}
                    className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
                    title={isSaved ? "Unpin" : "Pin"}
                >
                    {isSaved ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    className="p-1.5 rounded-full hover:bg-red-500/20 text-red-100 hover:text-red-400 transition-colors"
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </Card>
    );

    return (
        <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-black/60 backdrop-blur-md border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <Clock size={20} /> History
                    </h2>
                    <Button variant="glass" size="sm" onClick={onClose}>Close</Button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6">
                    {/* Saved Items Section */}
                    {saved.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider px-1">Saved Items</h3>
                            <div className="space-y-3">
                                {saved.map(item => renderItem(item, true))}
                            </div>
                        </div>
                    )}

                    {/* Recent History Section */}
                    <div>
                        {saved.length > 0 && <h3 className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider px-1">Recent</h3>}

                        <div className="space-y-3">
                            {history.length === 0 ? (
                                <div className="text-center text-white/40 mt-4">
                                    {saved.length > 0 ? "No recent history." : "No history yet."}
                                </div>
                            ) : (
                                history.map(item => renderItem(item, false))
                            )}
                        </div>
                    </div>
                </div>

                {history.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <Button variant="glass" className="w-full text-red-300 hover:bg-red-500/10 hover:text-red-400" onClick={clearHistory}>
                            <Trash2 size={16} /> Clear Recent History
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
