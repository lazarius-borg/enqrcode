import { useState, useEffect } from 'react';
import { MobileHeader } from './components/layout/MobileHeader';
import { TabNavigation, type TabId } from './components/layout/TabNavigation';
import { PreviewCard } from './components/features/PreviewCard';
import { InputForms } from './components/features/InputForms';
import { StyleEditor } from './components/features/StyleEditor';
import { SettingsPanel } from './components/features/SettingsPanel';
import { HistoryPanel } from './components/features/HistoryPanel';
import { useQR } from './hooks/useQR';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { CustomizationOptions } from './components/features/CustomizationPanel'; // Type
import { AdSpace } from './components/features/AdSpace';
import './index.css';

function App() {
  const [content, setContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [showHistory, setShowHistory] = useState(false);

  const [options, setOptions] = useState<CustomizationOptions>({
    color: { dark: '#000000', light: '#ffffff00' },
    margin: 1,
    pattern: 'square',
    frame: 'none',
    frameText: 'SCAN ME',
    errorCorrectionLevel: 'M',
    width: 1000
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
        return [newItem, ...prev].slice(0, 50);
      });
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [content, setHistory]);

  const { qrCodeData, loading } = useQR(content, {
    color: options.color,
    width: options.width || 1000,
    margin: options.margin,
    pattern: options.pattern,
    frame: options.frame,
    frameText: options.frameText,
    errorCorrectionLevel: options.errorCorrectionLevel
  });

  const handleDownload = () => {
    if (!qrCodeData) return;
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!qrCodeData) return;
    try {
      const blob = await (await fetch(qrCodeData)).blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          title: 'QR Code',
          text: content,
          files: [file],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black lg:bg-slate-900 flex items-center justify-center p-0 lg:p-8">
      {/* Desktop Phone Frame Wrapper */}
      <div className="w-full h-full lg:w-[400px] lg:h-[850px] bg-bg lg:rounded-[3rem] lg:border-8 lg:border-slate-800 lg:shadow-2xl overflow-hidden relative flex flex-col">

        {/* Dynamic Island / Notch Placeholder for Desktop Look */}
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>

        <MobileHeader onHistoryClick={() => setShowHistory(true)} />

        <HistoryPanel
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onSelect={(val) => { setContent(val); setShowHistory(false); }}
        />

        <main className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-6 pb-20">

          <PreviewCard
            dataUrl={qrCodeData}
            loading={loading}
            onDownload={handleDownload}
            onShare={handleShare}
          />

          {/* Advertisement Space */}
          <div className="mb-6 mt-2">
            <AdSpace className="rounded-2xl" />
          </div>

          <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

          <div className="min-h-[300px] animate-fade-in">
            {activeTab === 'content' && (
              <InputForms onChange={setContent} />
            )}

            {activeTab === 'style' && (
              <StyleEditor options={options} onChange={setOptions} />
            )}

            {activeTab === 'settings' && (
              <SettingsPanel options={options} onChange={setOptions} />
            )}
          </div>



        </main>
      </div>
    </div>
  );
}

export default App;
