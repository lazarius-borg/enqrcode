import QRCode from 'qrcode';

export type QRStyleOptions = {
    color: {
        dark: string;
        light: string;
    };
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    pattern?: 'square' | 'dot' | 'rounded';
    frame?: 'none' | 'classic' | 'pill' | 'polaroid';
    frameText?: string;
    frameColor?: string;
};

// Helper: Draw a rounded rect
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export const generateQRCode = async (text: string, options?: QRStyleOptions): Promise<string> => {
    if (!text) return '';

    try {
        // 1. Generate Raw QR Data
        const qr = await QRCode.create(text, {
            errorCorrectionLevel: options?.errorCorrectionLevel || 'M'
        });

        const modules = qr.modules;
        const moduleCount = modules.size;
        const margin = options?.margin ?? 1;

        // Settings
        const size = options?.width || 1000;
        const fgColor = options?.color.dark || '#000000';
        const bgColor = options?.color.light || '#ffffff'; // We need a real bg for frames
        const pattern = options?.pattern || 'square';
        const frame = options?.frame || 'none';
        const frameText = options?.frameText || 'SCAN ME';

        // 2. Setup Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');

        // Dimensions
        // Standard QR size + margin
        let qrSize = size;
        let totalSize = size;
        let offsetX = 0;
        let offsetY = 0;

        // Adjust dimensions for frames
        if (frame !== 'none') {
            // Frames add padding around the QR code
            if (frame === 'classic' || frame === 'polaroid') {
                totalSize = size + 200;
                offsetX = 100;
                offsetY = 100;
                if (frame === 'polaroid') offsetY = 80; // slightly higher
            } else if (frame === 'pill') {
                totalSize = size + 200;
                offsetX = 100;
                offsetY = 100;
            }
            qrSize = size;
        }

        canvas.width = totalSize;
        canvas.height = totalSize;

        // 3. Draw Frame Background
        if (frame === 'none') {
            // For no frame, handle transparency if needed, or fill bg
            if (bgColor && !bgColor.endsWith('00')) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, totalSize, totalSize);
            }
        } else {
            ctx.fillStyle = bgColor; // Frame uses light color as background usually

            if (frame === 'classic') {
                ctx.strokeStyle = options?.frameColor || fgColor;
                ctx.lineWidth = 20;
                ctx.fillStyle = '#ffffff'; // Content bg
                // Outer BG
                ctx.fillRect(0, 0, totalSize, totalSize);
                // Border
                ctx.strokeRect(40, 40, totalSize - 80, totalSize - 80);

                // Text at bottom
                ctx.fillStyle = fgColor;
                ctx.font = 'bold 80px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(frameText.toUpperCase(), totalSize / 2, totalSize - 60);

            } else if (frame === 'polaroid') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, totalSize, totalSize);
                ctx.fillStyle = '#000000';
                ctx.font = 'italic 60px serif';
                ctx.textAlign = 'center';
                ctx.fillText(frameText, totalSize / 2, totalSize - 60);

            } else if (frame === 'pill') {
                ctx.fillStyle = options?.frameColor || fgColor;
                // Draw pill shape background
                ctx.beginPath();
                ctx.roundRect(20, 20, totalSize - 40, totalSize - 40, 100);
                ctx.fill();

                // White canvas for QR
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.roundRect(80, 80, qrSize + 40, qrSize + 40, 40);
                ctx.fill();

                // Text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 60px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(frameText.toUpperCase(), totalSize / 2, totalSize - 60);
            }
        }

        // 4. Draw QR Modules
        const cellSize = qrSize / (moduleCount + margin * 2);

        // Offset for margin inside the allocated QR area
        const finalOffsetX = offsetX + (margin * cellSize);
        const finalOffsetY = offsetY + (margin * cellSize);

        ctx.fillStyle = fgColor;

        for (let r = 0; r < moduleCount; r++) {
            for (let c = 0; c < moduleCount; c++) {
                // @ts-ignore - The types for node-qrcode are sometimes inconsistent with internal structure
                if (modules.get(c, r)) {
                    const x = finalOffsetX + c * cellSize;
                    const y = finalOffsetY + r * cellSize;

                    if (pattern === 'dot') {
                        ctx.beginPath();
                        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (pattern === 'rounded') {
                        // Check neighbors for connecting flow (simplified: just rounded corners)
                        const rRadius = cellSize * 0.4;
                        ctx.beginPath();
                        ctx.roundRect(x, y, cellSize, cellSize, rRadius);
                        ctx.fill();
                    } else {
                        // Square (Default)
                        // Slight overlap to avoid anti-aliasing gaps
                        ctx.fillRect(x, y, cellSize + 0.5, cellSize + 0.5);
                    }
                }
            }
        }

        return canvas.toDataURL();
    } catch (err) {
        console.error('Failed to generate QR code', err);
        throw err;
    }
};
