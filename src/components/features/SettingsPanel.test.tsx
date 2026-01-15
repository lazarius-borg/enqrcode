import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsPanel } from './SettingsPanel';
import type { CustomizationOptions } from './CustomizationPanel';

const mockOptions: CustomizationOptions = {
    color: { dark: '#000000', light: '#ffffff' },
    margin: 1,
    pattern: 'square',
    frame: 'none',
    frameText: 'SCAN ME',
    errorCorrectionLevel: 'M',
    width: 1000,
    fileFormat: 'png'
};

describe('SettingsPanel', () => {
    it('renders all setting sections', () => {
        const handleChange = vi.fn();
        render(<SettingsPanel options={mockOptions} onChange={handleChange} />);

        expect(screen.getByText(/Resolution \(Output Size\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Error Correction/i)).toBeInTheDocument();
        expect(screen.getByText(/File Format/i)).toBeInTheDocument();
    });

    it('updates resolution when slider changes', () => {
        const handleChange = vi.fn();
        render(<SettingsPanel options={mockOptions} onChange={handleChange} />);

        // The slider input
        const slider = screen.getByDisplayValue('1000');
        fireEvent.change(slider, { target: { value: '1500' } });

        expect(handleChange).toHaveBeenCalledWith({
            ...mockOptions,
            width: 1500
        });
    });

    it('updates error correction level when clicked', () => {
        const handleChange = vi.fn();
        render(<SettingsPanel options={mockOptions} onChange={handleChange} />);

        // Click 'H' (High) level
        const highButton = screen.getByText('High (30%)').closest('button');
        fireEvent.click(highButton!);

        expect(handleChange).toHaveBeenCalledWith({
            ...mockOptions,
            errorCorrectionLevel: 'H'
        });
    });

    it('updates file format when clicked', () => {
        const handleChange = vi.fn();
        render(<SettingsPanel options={mockOptions} onChange={handleChange} />);

        // Click 'SVG'
        const svgButton = screen.getByRole('button', { name: /svg/i });
        fireEvent.click(svgButton);

        expect(handleChange).toHaveBeenCalledWith({
            ...mockOptions,
            fileFormat: 'svg'
        });
    });
});
