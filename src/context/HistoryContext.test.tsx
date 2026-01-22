import { render, screen, act } from '@testing-library/react';
import { HistoryProvider, useHistory } from './HistoryContext';

// Helper component to expose context methods
const TestHelper = () => {
    const { history, saved, addToHistory, togglePin, deleteItem, clearHistory } = useHistory();

    return (
        <div>
            <div data-testid="history-len">{history.length}</div>
            <div data-testid="saved-len">{saved.length}</div>

            {/* Display first item content for verification */}
            <div data-testid="recent-0">{history[0]?.content}</div>
            <div data-testid="saved-0">{saved[0]?.content}</div>

            <button onClick={() => addToHistory('test-content', 'text')}>Add Text</button>
            <button onClick={() => addToHistory('test-url', 'url')}>Add Url</button>

            <button onClick={() => {
                const item = history[0];
                if (item) togglePin(item);
            }}>Pin First Recent</button>

            <button onClick={() => {
                const item = saved[0];
                if (item) togglePin(item);
            }}>Unpin First Saved</button>

            <button onClick={() => {
                const item = saved[0];
                if (item) deleteItem(item.id);
            }}>Delete First Saved</button>

            <button onClick={clearHistory}>Clear History</button>
        </div>
    );
};

describe('HistoryContext', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('manages history and saved items correctly', async () => {
        render(
            <HistoryProvider>
                <TestHelper />
            </HistoryProvider>
        );

        // 1. Initial State
        expect(screen.getByTestId('history-len').textContent).toBe('0');

        // 2. Add Item
        await act(async () => {
            screen.getByText('Add Text').click();
        });
        expect(screen.getByTestId('history-len').textContent).toBe('1');
        expect(screen.getByTestId('recent-0').textContent).toBe('test-content');

        // 3. Pin Item
        await act(async () => {
            screen.getByText('Pin First Recent').click();
        });
        expect(screen.getByTestId('history-len').textContent).toBe('0');
        expect(screen.getByTestId('saved-len').textContent).toBe('1');
        expect(screen.getByTestId('saved-0').textContent).toBe('test-content');

        // 4. Persistence Check (Add same item again)
        // Should NOT add to history, but move/update saved (count remains 1 in saved)
        await act(async () => {
            screen.getByText('Add Text').click();
        });
        expect(screen.getByTestId('history-len').textContent).toBe('0');
        expect(screen.getByTestId('saved-len').textContent).toBe('1');

        // 5. Unpin Item
        await act(async () => {
            screen.getByText('Unpin First Saved').click();
        });
        expect(screen.getByTestId('history-len').textContent).toBe('1');
        expect(screen.getByTestId('saved-len').textContent).toBe('0');

        // 6. Delete Item
        await act(async () => {
            // First Move back to saved to test delete from saved
            screen.getByText('Pin First Recent').click();
        });
        expect(screen.getByTestId('saved-len').textContent).toBe('1');

        await act(async () => {
            screen.getByText('Delete First Saved').click();
        });
        expect(screen.getByTestId('saved-len').textContent).toBe('0');
        expect(screen.getByTestId('history-len').textContent).toBe('0');
    });

    it('clears history but keeps saved items', async () => {
        render(
            <HistoryProvider>
                <TestHelper />
            </HistoryProvider>
        );

        // Add item and pin it
        await act(async () => {
            screen.getByText('Add Text').click(); // Add
        });

        await act(async () => {
            screen.getByText('Pin First Recent').click(); // Pin (now in saved)
        });

        await act(async () => {
            screen.getByText('Add Url').click(); // Add another (now in history)
        });

        expect(screen.getByTestId('saved-len').textContent).toBe('1');
        expect(screen.getByTestId('history-len').textContent).toBe('1');

        // Clear History
        await act(async () => {
            screen.getByText('Clear History').click();
        });

        expect(screen.getByTestId('history-len').textContent).toBe('0');
        expect(screen.getByTestId('saved-len').textContent).toBe('1');
    });
});
