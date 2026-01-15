import { useState, useEffect } from 'react';
import { MobileHeader } from './components/layout/MobileHeader';
import { TabNavigation, type TabId } from './components/layout/TabNavigation';
import { PreviewCard } from './components/features/PreviewCard';
import { InputForms } from './components/features/InputForms';
import { StyleEditor } from './components/features/StyleEditor';
import { SettingsPanel } from './components/features/SettingsPanel';
import { HistoryPanel } from './components/features/HistoryPanel';
import { Sidebar } from './components/layout/Sidebar';
import { HistoryView } from './components/features/HistoryView';
import { useQR } from './hooks/useQR';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { CustomizationOptions } from './components/features/CustomizationPanel'; // Type
import { AdSpace } from './components/features/AdSpace';
import './index.css';

import { ExportDialog } from './components/features/ExportDialog';

function App() {
  const [content, setContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [showHistory, setShowHistory] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const [options, setOptions] = useState<CustomizationOptions>({
    color: { dark: '#000000', light: '#ffffff' },
    margin: 1,
    pattern: 'square',
    frame: 'none',
    frameText: 'SCAN ME',
    errorCorrectionLevel: 'M',
    width: 1000,
    fileFormat: 'png'
  });

  const [, setHistory] = useLocalStorage<any[]>('enqrcode-history', []);

  // History Auto-save
  useEffect(() => {
    if (!content || content.length < 4) return;
    const timeoutId = setTimeout(() => {
      setHistory((prev: any[]) => {
        if (prev.length > 0 && prev[0].content === content) return prev;
        const newItem = {
          id: Date.now().toString(),
          content,
          type: 'QR', // Generic for now
          timestamp: Date.now()
        };
        return [newItem, ...prev].slice(50);
      });
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [content, setHistory]);

  const { qrCodeData, loading, error } = useQR(content, {
    color: options.color,
    width: options.width || 1000,
    margin: options.margin,
    pattern: options.pattern,
    eyeFrame: options.eyeFrame,
    eyeBall: options.eyeBall,
    frame: options.frame,
    frameText: options.frameText,
    errorCorrectionLevel: options.errorCorrectionLevel,
    fileFormat: options.fileFormat,
    logo: options.logo
  });

  // Debug: Alert on QR generation errors
  useEffect(() => {
    if (error) {
      console.error('QR Generation Error:', error);
      alert(`Failed to generate QR Code: ${error.message}`);
    }
  }, [error]);

  const handleDownloadClick = () => {
    if (!qrCodeData) return;
    setShowExportDialog(true);
  };

  const handleExportConfirm = (filename: string) => {
    if (!qrCodeData) return;
    const link = document.createElement('a');
    link.href = qrCodeData;
    const ext = options.fileFormat || 'png';
    const finalName = filename.trim() || `qrcode-${Date.now()}`;
    link.download = `${finalName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportDialog(false);
  };

  const handleShare = async () => {
    if (!qrCodeData) return;
    try {
      const blob = await (await fetch(qrCodeData)).blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });

      if (!navigator.share) {
        alert('Sharing is not supported on this browser (requires HTTPS).');
        return;
      }

      const shareData = {
        title: 'QR Code',
        text: content,
        files: [file],
      };

      if (navigator.canShare && !navigator.canShare(shareData)) {
        alert('Sharing this type of file is not supported.');
        return;
      }

      await navigator.share(shareData);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        alert(`Error sharing: ${err.message}`);
      }
    }
  };

  // Helper to sync Active Tab changes from Sidebar
  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
  };

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans antialiased overflow-hidden flex flex-col lg:grid lg:grid-cols-[260px_1fr_420px] lg:grid-rows-[1fr]">

      {/* DESKTOP SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onChange={handleTabChange}
        className="hidden lg:flex row-span-full z-20"
      />

      {/* MOBILE HEADER - Sticky */}
      <div className="lg:hidden sticky top-0 z-50">
        <MobileHeader onHistoryClick={() => setShowHistory(true)} />
      </div>

      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelect={(val) => { setContent(val); setShowHistory(false); }}
      />

      {/* 
          MAIN CONTENT AREA 
          Mobile: Single column flow (Preview -> Ads -> Controls).
          Desktop: Dissected into Grid Columns.
      */}

      {/* RE-THINKING STRUCTURE FOR PRESERVATION
          The easiest way to preserve mobile EXACTLY while having a Grid on Desktop 
          is to allow two different root structures conditionally, OR
          use `contents` CSS.
          
          Let's use the `contents` approach for the wrapper.
      */}

      <main className="flex-1 overflow-y-auto hide-scrollbar lg:contents">

        {/* PREVIEW CONTAINER */}
        {/* Mobile: Block in flow. Desktop: Col 2, Fixed/Flex Center. */}
        <div className="p-4 lg:p-0 lg:col-start-2 lg:row-start-1 lg:row-span-full lg:h-full lg:flex lg:flex-col-reverse lg:gap-8 lg:items-center lg:justify-end lg:pt-6 lg:bg-bg/50 relative">
          <PreviewCard
            dataUrl={qrCodeData}
            loading={loading}
            onDownload={handleDownloadClick}
            onShare={handleShare}
            className="lg:max-w-[400px] lg:shadow-2xl lg:mb-0"
          />

          {/* Desktop Background Decoration (Optional) */}
          <div className="hidden lg:block absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 to-transparent opacity-50"></div>

          {/* Ad Space - Mobile: Below Preview. Desktop: Above Preview (via flex-col-reverse) */}
          <div className="w-full max-w-[320px] lg:max-w-[400px]">
            <AdSpace className="rounded-2xl" />
          </div>
        </div>

        {/* CONTROLS CONTAINER */}
        {/* Mobile: Block in flow. Desktop: Col 3, Scrollable Sidebar. */}
        <div className="lg:col-start-3 lg:row-start-1 lg:row-span-full lg:h-full lg:overflow-y-auto lg:bg-surface lg:border-l lg:border-border lg:flex lg:flex-col">

          {/* Ad Space - Moved to Preview Col */}

          {/* Mobile Tabs */}
          <div className="lg:hidden px-4">
            <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* Content Panels */}
          <div className="px-4 pb-20 lg:py-6 lg:px-6 lg:flex-1 animate-fade-in">

            {activeTab === 'content' && (
              <InputForms onChange={setContent} />
            )}

            {activeTab === 'style' && (
              <StyleEditor options={options} onChange={setOptions} />
            )}

            {activeTab === 'settings' && (
              <SettingsPanel options={options} onChange={setOptions} />
            )}

            {/* Desktop History View */}
            {activeTab === 'history' && (
              <div className="hidden lg:block h-full">
                <HistoryView onSelect={(val) => { setContent(val); }} />
              </div>
            )}

            {/* Fallback for formatting if history selected on mobile (shouldn't happen via tabs but valid state) 
                    On Mobile, 'history' is not a tab. If activeTab is 'history', mobile view might show nothing.
                    We should ensure Mobile tabs don't allowing selecting 'history'.
                */}
          </div>
        </div>
      </main>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onConfirm={handleExportConfirm}
        defaultFilename={`qrcode-${Date.now()}`}
        format={options.fileFormat || 'png'}
      />
    </div>
  );
}

export default App;
