import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { LOGO_IMAGE_BASE64 } from '../assets/logoImageBase64';

interface HeaderProps {
  onTitleClick?: () => void;
  logoUrl?: string;
  onLogoUploaded?: (url: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onTitleClick,
  logoUrl = LOGO_IMAGE_BASE64 || '/images.png',
  onLogoUploaded,
}) => {
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          await fetch('/api/upload-asset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: 'images.png',
              dataBase64: base64Data,
            }),
          });
        } catch {
          // If server write fails, client still uses the data uri
        }
        setImgError(false);
        if (onLogoUploaded) onLogoUploaded(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="h-1 w-full bg-emerald-700" />

      <div className="max-w-2xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-center">
        <div 
          onClick={onTitleClick}
          className="cursor-pointer flex items-center gap-3 sm:gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1 transition-opacity hover:opacity-95"
        >
          {/* Government of Tamil Nadu Original Uploaded Logo */}
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            {!imgError ? (
              <img
                src={logoUrl}
                alt="Government of Tamil Nadu Official Emblem"
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Click to select the uploaded images.png"
                className="w-14 h-14 rounded-lg border-2 border-dashed border-emerald-600 bg-emerald-50/80 flex flex-col items-center justify-center text-[9px] font-medium text-emerald-800 text-center leading-tight p-1 cursor-pointer hover:bg-emerald-100"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700 mb-0.5" />
                <span>Upload</span>
                <span>images.png</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* District Administration & Festival Information with uniform slim typography */}
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-800 uppercase leading-tight">
              Government of Tamil Nadu
            </span>
            <span className="text-xs sm:text-sm font-medium tracking-wide text-slate-700 uppercase leading-snug">
              Thoothukudi District Administration
            </span>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight mt-0.5">
              KULASAI DASARA FESTIVAL – 2026
            </h1>
            <span className="text-[11px] sm:text-xs font-normal text-slate-500 leading-tight">
              Festival Information &amp; Emergency Assistance Portal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
