import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Download, Printer, Settings, Check, Copy } from 'lucide-react';
import { FESTIVAL_CONFIG } from '../config/festivalConfig';

interface AdminHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSheetId: (sheetId: string) => void;
  currentSheetId?: string;
}

export const AdminHelpModal: React.FC<AdminHelpModalProps> = ({
  isOpen,
  onClose,
  onUpdateSheetId,
  currentSheetId = '',
}) => {
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [sheetInput, setSheetInput] = useState<string>(currentSheetId);

  useEffect(() => {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://thoothukudi.nic.in';
    setTargetUrl(url);
  }, []);

  useEffect(() => {
    if (targetUrl) {
      QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
      })
        .then((url: string) => setQrDataUrl(url))
        .catch((err: unknown) => console.error('QR code generation error', err));
    }
  }, [targetUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `kulasai-dasara-2026-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplySheet = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSheetId(sheetInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-700" />
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-900">
                District Administration Guide &amp; QR Code
              </h2>
              <span className="text-[11px] text-slate-500 block font-normal">
                Thoothukudi District Administration · Portal Setup
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-700 text-xs sm:text-sm">
          
          {/* Section 1: Official QR Code Generator */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1.5">
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span>Official Public QR Code Generator</span>
            </div>
            <p className="text-slate-500 text-xs mb-3 font-normal">
              Devotees and citizens scan this QR code displayed at bus stands, parking lots, and temple gates to open this portal directly without login.
            </p>

            <div className="mb-3">
              <label htmlFor="portal-url" className="block text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">
                Portal Published URL:
              </label>
              <div className="flex gap-2">
                <input
                  id="portal-url"
                  type="url"
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  onClick={handleCopyUrl}
                  type="button"
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* QR Preview & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-white p-3 rounded-lg border border-slate-200">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Official Kulasai Dasara 2026 QR Code"
                  className="w-28 h-28 object-contain border border-slate-200 rounded p-1"
                />
              ) : (
                <div className="w-28 h-28 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                  Generating...
                </div>
              )}

              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={handleDownloadQr}
                  type="button"
                  className="w-full min-h-[40px] px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res QR Code (PNG)</span>
                </button>
                <button
                  onClick={handlePrint}
                  type="button"
                  className="w-full min-h-[40px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-300"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print QR Notice Sheet</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Live Google Sheets Connector */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <span className="font-semibold text-slate-900 block mb-1">
              Live Google Sheets Synchronization
            </span>
            <p className="text-slate-500 text-xs mb-2.5 font-normal leading-relaxed">
              To update contact numbers from Google Sheets:
              <br />
              1. Open your sheet &rarr; Click <strong>File &gt; Share &gt; Publish to web</strong>.
              <br />
              2. Choose <strong>Comma-separated values (.csv)</strong> and click <strong>Publish</strong>.
              <br />
              3. Paste the URL or Sheet ID below:
            </p>

            <form onSubmit={handleApplySheet} className="flex gap-2">
              <input
                type="text"
                value={sheetInput}
                onChange={e => setSheetInput(e.target.value)}
                placeholder="Paste Google Sheet ID or published CSV URL"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
              >
                Sync Now
              </button>
            </form>
            {sheetInput && (
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Active source: {sheetInput}
              </p>
            )}
          </div>

          {/* Section 3: Official Numbers & Map Asset Reference */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
            <span className="font-semibold text-slate-900 block">
              Official Administration Configuration:
            </span>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1 font-normal">
              <li>
                <strong>Control Room Toll-Free:</strong> <code className="bg-slate-200 px-1 rounded text-slate-800">{FESTIVAL_CONFIG.controlRoom.tollFreeDisplay}</code> (Single toll-free line).
              </li>
              <li>
                <strong>Consolidated Map Image:</strong> Referenced as <code className="bg-slate-200 px-1 rounded text-slate-800">/Kulasai Festival Single Map.jpeg</code> in <code className="bg-slate-200 px-1 rounded text-slate-800">src/config/festivalConfig.ts</code>.
              </li>
              <li>
                <strong>Tamil Nadu Logo:</strong> Referenced as <code className="bg-slate-200 px-1 rounded text-slate-800">/images.png</code> in <code className="bg-slate-200 px-1 rounded text-slate-800">src/config/festivalConfig.ts</code>.
              </li>
            </ul>
          </div>

          {/* Section 4: Vercel Deployment Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
            <span className="font-semibold text-slate-900 block">
              Vercel Deployment Setup (Ready):
            </span>
            <p className="text-xs text-slate-600 font-normal">
              The project is configured for one-click Vercel deployment:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1 font-normal">
              <li>
                <strong>Configuration File:</strong> <code className="bg-slate-200 px-1 rounded text-slate-800">vercel.json</code> includes SPA rewrites and serverless function routing.
              </li>
              <li>
                <strong>Serverless Functions:</strong> Located in <code className="bg-slate-200 px-1 rounded text-slate-800">/api/contacts.ts</code>, <code className="bg-slate-200 px-1 rounded text-slate-800">/api/health.ts</code>, and <code className="bg-slate-200 px-1 rounded text-slate-800">/api/upload-asset.ts</code>.
              </li>
              <li>
                <strong>Vercel Build Command:</strong> <code className="bg-slate-200 px-1 rounded text-slate-800">npm run build</code>
              </li>
              <li>
                <strong>Output Directory:</strong> <code className="bg-slate-200 px-1 rounded text-slate-800">dist</code>
              </li>
              <li>
                <strong>Optional Vercel Env Vars:</strong> <code className="bg-slate-200 px-1 rounded text-slate-800">GOOGLE_SHEET_ID</code> or <code className="bg-slate-200 px-1 rounded text-slate-800">GOOGLE_SHEETS_CSV_URL</code> for live Google Sheets directory synchronization.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="min-h-[40px] px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
