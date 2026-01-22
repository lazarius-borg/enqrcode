import { Trash2, ArrowRight, Clock, Pin, PinOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useHistory, type HistoryItem } from '../../context/HistoryContext';

type HistoryViewProps = {
    onSelect: (item: HistoryItem) => void;
};

export const HistoryView = ({ onSelect }: HistoryViewProps) => {
    const { history, saved, clearHistory, togglePin, deleteItem } = useHistory();

    const renderItem = (item: HistoryItem, isSaved: boolean) => (
        <Card key={item.id} padding="sm" className="bg-surface hover:bg-surface-hover cursor-pointer group border-border relative">
            <div onClick={() => onSelect(item)} className="pr-16">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs uppercase tracking-wider text-text-dim">{item.type}</span>
                    <span className="text-xs text-text-dim">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-text-main truncate mb-2">{item.content}</p>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bottom-2">
                    <ArrowRight size={14} className="text-primary" />
                </div>
            </div>

            {/* Actions */}
            <div className="absolute right-2 top-2 flex gap-1 z-50 bg-surface/80 backdrop-blur-sm rounded-full p-1 opacity-100 border border-border">
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); togglePin(item); }}
                    className="p-1.5 rounded-full hover:bg-border text-text-main transition-colors"
                    title={isSaved ? "Unpin" : "Pin"}
                >
                    {isSaved ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </Card>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-text-main">
                    <Clock size={20} /> History
                </h2>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                {/* Saved Items Section */}
                {saved.length > 0 && (
                    <div>
                        <h3 className="text-xs font-semibold text-text-dim mb-3 uppercase tracking-wider">Saved Items</h3>
                        <div className="space-y-3">
                            {saved.map(item => renderItem(item, true))}
                        </div>
                    </div>
                )}

                {/* Recent History Section */}
                <div>
                    {saved.length > 0 && <h3 className="text-xs font-semibold text-text-dim mb-3 uppercase tracking-wider">Recent</h3>}

                    <div className="space-y-3">
                        {history.length === 0 ? (
                            <div className="text-center text-text-dim mt-4">
                                {saved.length > 0 ? "" : "No history yet."}
                            </div>
                        ) : (
                            history.map(item => renderItem(item, false))
                        )}
                    </div>
                </div>
            </div>

            {history.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                    <Button variant="glass" className="w-full text-red-500 hover:bg-red-500/10" onClick={clearHistory}>
                        <Trash2 size={16} /> Clear Recent History
                    </Button>
                </div>
            )}
        </div>
    );
};
