import React from 'react';
import { ShieldCheck, QrCode } from 'lucide-react';

interface FooterProps {
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminModal }) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto py-5 px-4 text-slate-600">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-1.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Thoothukudi District Administration · Official Citizen Portal</span>
        </div>

        <p className="text-[11px] text-slate-500 font-normal leading-relaxed max-w-sm">
          Published for public safety, festival coordination, and emergency response during Kulasai Dasara Festival 2026.
        </p>

        {/* Discreet District Administration Tool Trigger */}
        <button
          onClick={onOpenAdminModal}
          type="button"
          className="mt-1 text-[11px] text-slate-500 hover:text-emerald-800 underline underline-offset-4 flex items-center gap-1 transition-colors py-1 px-2 rounded hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>District Admin Guide &amp; QR Code</span>
        </button>
      </div>
    </footer>
  );
};
