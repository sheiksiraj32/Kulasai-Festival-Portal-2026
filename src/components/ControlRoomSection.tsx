import React from 'react';
import { PhoneCall, ShieldAlert } from 'lucide-react';
import { ControlRoomConfig } from '../types/festival';
import { getTelUri } from '../utils/phoneUtils';

interface ControlRoomSectionProps {
  config: ControlRoomConfig;
}

export const ControlRoomSection: React.FC<ControlRoomSectionProps> = ({ config }) => {
  const tollFreeTel = getTelUri(config.tollFreeNumber);

  return (
    <section 
      aria-label="Festival Control Room Assistance"
      className="w-full bg-white rounded-xl shadow-xs border border-rose-200 p-3.5 sm:p-4 transition-all"
    >
      {/* Uniform section header */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold tracking-wide text-slate-900 uppercase">
              Festival Control Room
            </h2>
            <p className="text-[11px] text-slate-500 font-normal">
              24×7 Citizen Emergency & Festival Assistance · Kulasai
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
          Toll-Free
        </span>
      </div>

      {/* Single Toll-Free Control Room Number Box */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3 sm:p-3.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Toll-Free Helpline Number
          </span>
          <span className="block text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-normal tabular-nums mt-0.5">
            {config.tollFreeDisplay}
          </span>
          <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
            Free call from any mobile or landline across Tamil Nadu
          </span>
        </div>

        <a
          href={tollFreeTel}
          aria-label={`Call Festival Control Room Toll Free ${config.tollFreeDisplay}`}
          className="shrink-0 min-h-[44px] min-w-[44px] px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 active:scale-[0.98]"
        >
          <PhoneCall className="w-4 h-4 text-emerald-100" />
          <span>Call Now</span>
        </a>
      </div>
    </section>
  );
};
