import React from 'react';
import { Map, BookOpenCheck, ChevronRight } from 'lucide-react';

interface HomeNavigationProps {
  onOpenMap: () => void;
  onOpenDirectory: () => void;
}

export const HomeNavigation: React.FC<HomeNavigationProps> = ({
  onOpenMap,
  onOpenDirectory,
}) => {
  return (
    <div className="w-full flex flex-col gap-3 sm:gap-3.5 mt-3 sm:mt-4">
      {/* 1. FESTIVAL LOCATION MAP BUTTON */}
      <button
        onClick={onOpenMap}
        type="button"
        className="w-full group text-left bg-white hover:bg-slate-50/80 active:bg-slate-100 text-slate-900 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all border border-slate-200 hover:border-emerald-600/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-[0.99] flex items-center justify-between min-h-[84px]"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
            <Map className="w-5 h-5 text-emerald-800" />
          </div>
          <div className="min-w-0">
            <span className="block text-base sm:text-lg font-semibold text-slate-900 tracking-normal group-hover:text-emerald-900">
              Festival Location Map
            </span>
            <span className="block text-xs text-slate-500 font-normal mt-0.5 truncate">
              Single consolidated route, temple, beach, facilities &amp; bus stands
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:bg-emerald-50 transition-all">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800" />
        </div>
      </button>

      {/* 2. CONTACT DIRECTORY BUTTON */}
      <button
        onClick={onOpenDirectory}
        type="button"
        className="w-full group text-left bg-white hover:bg-slate-50/80 active:bg-slate-100 text-slate-900 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20 active:scale-[0.99] flex items-center justify-between min-h-[84px]"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
            <BookOpenCheck className="w-5 h-5 text-sky-800" />
          </div>
          <div className="min-w-0">
            <span className="block text-base sm:text-lg font-semibold text-slate-900 tracking-normal group-hover:text-sky-900">
              Important Contact Directory
            </span>
            <span className="block text-xs text-slate-500 font-normal mt-0.5 truncate">
              Department-wise officials, Direct Phone Dialler &amp; WhatsApp
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:bg-sky-50 transition-all">
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-800" />
        </div>
      </button>
    </div>
  );
};
