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
    eyeFrame?: 'square' | 'rounded' | 'circle';
    eyeBall?: 'square' | 'rounded' | 'circle';
    frame?: 'none' | 'classic' | 'pill' | 'polaroid';
    frameText?: string;
    frameColor?: string;
    fileFormat?: 'png' | 'jpeg' | 'svg';
    logo?: string; // Data URL
};

/* Unused helper removed */

// Helper for cross-browser rounded rectangles (since roundRect is new)
const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
};

export const generateQRCode = async (text: string, options?: QRStyleOptions): Promise<string> => {
    if (!text) return '';

    try {
        // 1. Generate Raw QR Data
        // If logo is present, force High error correction to ensure readability despite covered modules
        const ecc = options?.logo ? 'H' : (options?.errorCorrectionLevel || 'M');
        const qr = await QRCode.create(text, {
            errorCorrectionLevel: ecc
        });

        const modules = qr.modules;
        const moduleCount = modules.size;
        const margin = options?.margin ?? 1;

        // Settings
        const size = options?.width || 1000;
        const fgColor = options?.color.dark || '#000000';
        const bgColor = options?.color.light || '#ffffff'; // We need a real bg for frames
        const pattern = options?.pattern || 'square';
        const eyeFrame = options?.eyeFrame || 'square';
        const eyeBall = options?.eyeBall || 'square';
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
                drawRoundedRect(ctx, 20, 20, totalSize - 40, totalSize - 40, 100);
                ctx.fill();

                // White canvas for QR
                ctx.fillStyle = '#ffffff';
                drawRoundedRect(ctx, 80, 80, qrSize + 40, qrSize + 40, 40);
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

        // Helper to check if a module is part of the 3 finder patterns (Eyes)
        // Finder patterns are 7x7 squares at TL, TR, BL
        const isFinderPattern = (c: number, r: number) => {
            if (r < 7 && c < 7) return true; // Top-Left
            if (r < 7 && c >= moduleCount - 7) return true; // Top-Right
            if (r >= moduleCount - 7 && c < 7) return true; // Bottom-Left
            return false;
        };

        for (let r = 0; r < moduleCount; r++) {
            for (let c = 0; c < moduleCount; c++) {
                // @ts-ignore - The types for node-qrcode are sometimes inconsistent with internal structure
                if (modules.get(c, r)) {
                    // Skip if part of finder pattern (we draw them separately)
                    if (isFinderPattern(c, r)) continue;

                    const x = finalOffsetX + c * cellSize;
                    const y = finalOffsetY + r * cellSize;

                    if (pattern === 'dot') {
                        ctx.beginPath();
                        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (pattern === 'rounded') {
                        const rRadius = cellSize * 0.4;
                        drawRoundedRect(ctx, x, y, cellSize, cellSize, rRadius);
                        ctx.fill();
                    } else {
                        // Square (Default)- Slight overlap to avoid anti-aliasing gaps
                        ctx.fillRect(x, y, cellSize + 0.5, cellSize + 0.5);
                    }
                }
            }
        }

        // 5. Draw Custom Eyes (Finder Patterns)
        const drawEye = (r: number, c: number) => {
            const x = finalOffsetX + c * cellSize;
            const y = finalOffsetY + r * cellSize;
            const size = 7 * cellSize;

            // -- Eye Frame --
            // By default (square), it covers the 7x7 area but has a hole in the middle (5x5 white, then 3x3 black)
            // But manually drawing it is easier: Draw 7x7 outer, clear 5x5 inner.

            // Adjust to draw the specific shape
            ctx.fillStyle = fgColor;

            if (eyeFrame === 'circle') {
                ctx.beginPath();
                // Outer circle
                const cx = x + size / 2;
                const cy = y + size / 2;
                const radius = size / 2;
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);

                // Cut out inner hole (counter-clockwise) to make a ring
                // The frame is 1 module thick. 7 modules wide.
                // Inner empty area is 5 modules wide. Radius = 2.5 * cellSize
                const innerRadius = (5 * cellSize) / 2;
                ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2, true);
                ctx.fill();
            } else if (eyeFrame === 'rounded') {
                // Outer 7x7 rounded rect
                const rOuter = 2 * cellSize; // fairly rounded

                // We need to use "evenodd" fill rule or path direction to create a hole
                // easier to just fill outer, clear inner, then fill inner ball later
                // But we don't want to clear the background if we have a frame bg

                // Path approach
                ctx.beginPath();
                // Outer (clockwise)
                ctx.moveTo(x + rOuter, y);
                ctx.arcTo(x + size, y, x + size, y + size, rOuter);
                ctx.arcTo(x + size, y + size, x, y + size, rOuter);
                ctx.arcTo(x, y + size, x, y, rOuter);
                ctx.arcTo(x, y, x + rOuter, y, rOuter);

                // Inner (counter-clockwise) 5x5 hole
                const innerSize = 5 * cellSize;
                const ix = x + cellSize;
                const iy = y + cellSize;
                const rInner = 1.2 * cellSize;

                ctx.moveTo(ix + rInner, iy);
                ctx.lineTo(ix + innerSize - rInner, iy);
                // Manual path for hole is complex with arcTo key points, let's use rect for simpliciy or composite operations
                // Actually, let's just do:
                // Draw Outer
                // GlobalCompositeOperation 'destination-out' to clear center
                // Draw Inner Ball
                // Restore Composite
                // BUT: background might be complex. 
                // Simpler: Draw Outer Solid, Draw Inner White Solid (bg color), Draw Ball Solid.
            }

            // Simplified approach for all shapes that aren't paths
            if (eyeFrame === 'square' || eyeFrame === 'rounded') {
                ctx.fillStyle = fgColor;
                if (eyeFrame === 'rounded') {
                    drawRoundedRect(ctx, x, y, size, size, 2 * cellSize);
                } else {
                    ctx.fillRect(x, y, size, size);
                }
                ctx.fill();

                // Clear inner 5x5
                // Use destination-out to be transparent? No, we want bg color.
                // If transparent bg, we need destination-out. If white bg, white.
                // Since we support transparent PNGs effectively, we should probably stick to fgColor logic.
                // But wait, the previous code skipped drawing these modules. So the area is currently empty/background.

                // If we draw a solid 7x7, we cover the background.
                // Correct way: Draw 7x7 FG. Draw 5x5 BG. Draw 3x3 FG.

                // 1. Frame Outer
                ctx.fillStyle = fgColor;
                if (eyeFrame === 'rounded') {
                    drawRoundedRect(ctx, x, y, size, size, 2.5 * cellSize);
                    ctx.fill();
                } else {
                    ctx.fillRect(x, y, size, size);
                }

                // 2. Frame Inner (Hole) - 5x5
                // If bgColor is transparent/undefined, we might have an issue. 
                // Assuming white or provided bg.
                // If we want transparency, we need 'globalCompositeOperation = destination-out'
                if (!bgColor || bgColor === 'transparent') {
                    ctx.globalCompositeOperation = 'destination-out';
                } else {
                    ctx.fillStyle = bgColor;
                }

                const holeSize = 5 * cellSize;
                const holeX = x + cellSize;
                const holeY = y + cellSize;

                if (eyeFrame === 'rounded') {
                    // Inner radius slightly smaller to look parallel
                    drawRoundedRect(ctx, holeX, holeY, holeSize, holeSize, 1.5 * cellSize);
                    ctx.fill();
                } else {
                    ctx.fillRect(holeX, holeY, holeSize, holeSize);
                }

                // Reset composite
                ctx.globalCompositeOperation = 'source-over';
            }

            // -- Eye Ball --
            // 3x3 center
            const ballSize = 3 * cellSize;
            const ballX = x + 2 * cellSize;
            const ballY = y + 2 * cellSize;

            ctx.fillStyle = fgColor; // Back to FG

            if (eyeBall === 'circle') {
                ctx.beginPath();
                ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (eyeBall === 'rounded') {
                ctx.beginPath();
                drawRoundedRect(ctx, ballX, ballY, ballSize, ballSize, 1 * cellSize);
                ctx.fill();
            } else {
                // Square
                ctx.fillRect(ballX, ballY, ballSize, ballSize);
            }
        };

        // Draw the 3 finders
        drawEye(0, 0); // TL
        drawEye(0, moduleCount - 7); // TR
        drawEye(moduleCount - 7, 0); // BL

        // 6. Draw Logo
        if (options?.logo) {
            console.log('QR: Logo option present, attempting to load...');
            try {
                const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                    const image = new Image();
                    // image.crossOrigin = 'Anonymous'; // Not strictly needed for data URLs and can cause issues
                    image.onload = () => {
                        console.log('QR: Logo image loaded successfully', image.width, 'x', image.height);
                        resolve(image);
                    };
                    image.onerror = (e) => {
                        console.error('QR: Logo image failed to load', e);
                        reject(new Error('Failed to load logo image'));
                    };
                    image.src = options.logo!;
                });

                // Logo Size: 22% of the QR code area (safe for High ECC)
                const logoSize = qrSize * 0.22;
                const logoX = offsetX + (qrSize - logoSize) / 2;
                const logoY = offsetY + (qrSize - logoSize) / 2;

                // Draw background under logo to ensure it stands out and doesn't blend with modules
                // Use a circular or rounded rect background depending on preference, rounded rect fits most logos
                ctx.fillStyle = bgColor || '#ffffff';

                // Add 10% padding
                const pad = logoSize * 0.1;
                const bgSize = logoSize + pad * 2;
                const bgX = logoX - pad;
                const bgY = logoY - pad;

                console.log('QR: Drawing logo background...');
                drawRoundedRect(ctx, bgX, bgY, bgSize, bgSize, 10); // 10px rounding
                ctx.fill();

                // Draw Logo
                console.log('QR: Drawing logo image...');
                ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
                console.log('QR: Logo drawing complete');
            } catch (e) {
                console.warn('Failed to draw logo:', e);
                // Continue without logo
            }
        }

        const format = options?.fileFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
        return canvas.toDataURL(format, 1.0);
    } catch (err) {
        console.error('Failed to generate QR code', err);
        throw err;
    }
};
