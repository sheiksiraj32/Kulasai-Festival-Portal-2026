import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, X, PhoneCall, MessageCircle, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { OfficialContact } from '../types/festival';
import { formatDisplayPhone, getTelUri, getWhatsAppUri, isValidPhoneNumber } from '../utils/phoneUtils';

interface ContactDirectoryProps {
  contacts: OfficialContact[];
  departments: string[];
  isLoading: boolean;
  dataSource: 'google_sheets' | 'verified_preloaded';
  onRefresh: () => void;
  onBack: () => void;
}

export const ContactDirectory: React.FC<ContactDirectoryProps> = ({
  contacts,
  departments,
  isLoading,
  dataSource,
  onRefresh,
  onBack,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Combined filtering by Department and Search Query
  const filteredContacts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return contacts.filter(contact => {
      // 1. Department match
      if (selectedDepartment !== 'ALL' && contact.department.toLowerCase() !== selectedDepartment.toLowerCase()) {
        return false;
      }

      // 2. Search match
      if (!q) return true;

      const nameMatch = contact.name.toLowerCase().includes(q);
      const desigMatch = contact.designation.toLowerCase().includes(q);
      const deptMatch = contact.department.toLowerCase().includes(q);
      const mobileClean = contact.mobile.replace(/\D/g, '');
      const searchClean = q.replace(/\D/g, '');
      const mobileMatch = contact.mobile.includes(q) || (searchClean.length > 0 && mobileClean.includes(searchClean));
      const detailsMatch = contact.additionalDetails ? contact.additionalDetails.toLowerCase().includes(q) : false;

      return nameMatch || desigMatch || deptMatch || mobileMatch || detailsMatch;
    });
  }, [contacts, selectedDepartment, searchQuery]);

  return (
    <div className="w-full min-h-[calc(100vh-70px)] bg-slate-50 flex flex-col">
      {/* Sticky Top Header with uniform civic typography */}
      <div className="sticky top-0 z-30 bg-white text-slate-900 border-b border-slate-200 px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          type="button"
          aria-label="Back to Homepage"
          className="min-h-[44px] min-w-[44px] px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-lg font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Home</span>
        </button>

        <div className="text-center truncate px-2">
          <h1 className="text-sm sm:text-base font-semibold tracking-normal text-slate-900 truncate">
            Important Contact Directory
          </h1>
          <span className="text-[11px] text-slate-500 block truncate font-normal">
            Thoothukudi District Administration · Kulasai Dasara 2026
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          type="button"
          aria-label="Refresh contacts"
          title="Refresh contacts"
          className="min-h-[44px] min-w-[44px] p-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl w-full mx-auto p-4 sm:p-5 flex-1 flex flex-col gap-3.5">
        
        {/* Source Status Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-normal text-slate-600">
              {dataSource === 'google_sheets' ? 'Synced with Official Google Sheet' : 'Verified District Administration Directory'}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            {contacts.length} officials
          </span>
        </div>

        {/* 1. Department Filter Dropdown */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200">
          <label
            htmlFor="department-select"
            className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1"
          >
            Select Department
          </label>
          <div className="relative">
            <select
              id="department-select"
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:bg-white text-slate-900 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Departments ({contacts.length} officials)</option>
              {departments.map(dept => {
                const count = contacts.filter(c => c.department.toLowerCase() === dept.toLowerCase()).length;
                return (
                  <option key={dept} value={dept}>
                    {dept} ({count})
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Search Box */}
        <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200">
          <label htmlFor="search-input" className="sr-only">
            Search officials
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, designation, department or mobile number"
              className="w-full min-h-[44px] pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-emerald-600 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Number of matching officials */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-slate-700">
            {filteredContacts.length === 1
              ? 'Showing 1 official'
              : `Showing ${filteredContacts.length} officials`}
            {selectedDepartment !== 'ALL' && (
              <span className="text-slate-500 font-normal"> · in {selectedDepartment}</span>
            )}
            {searchQuery && (
              <span className="text-slate-500 font-normal"> matching &ldquo;{searchQuery}&rdquo;</span>
            )}
          </span>

          {(selectedDepartment !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDepartment('ALL');
                setSearchQuery('');
              }}
              type="button"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* 4. Filtered Official Contact Cards with uniform typography */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center shadow-xs my-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-800 mb-1">
              No officials found. Please change your search or department selection.
            </p>
            <p className="text-xs text-slate-500 mb-3">
              Try searching with partial name, designation, or phone number.
            </p>
            <button
              onClick={() => {
                setSelectedDepartment('ALL');
                setSearchQuery('');
              }}
              type="button"
              className="min-h-[44px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Show All Officials
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 pb-8">
            {filteredContacts.map((official) => {
              const telUri = getTelUri(official.mobile);
              const whatsAppUri = getWhatsAppUri(official.mobile);
              const hasValidPhone = isValidPhoneNumber(official.mobile);
              const displayPhone = formatDisplayPhone(official.mobile);

              return (
                <div
                  key={official.id}
                  className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors flex flex-col gap-2"
                >
                  {/* Top: Name & Designation */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        {official.sNo && (
                          <span className="text-[11px] font-mono text-slate-400">
                            #{official.sNo}
                          </span>
                        )}
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900 tracking-normal leading-snug">
                          {official.name}
                        </h2>
                      </div>
                      
                      {official.designation && (
                        <span className="inline-block text-xs font-medium text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 rounded px-2 py-0.5 mt-0.5">
                          {official.designation}
                        </span>
                      )}
                    </div>

                    {/* Department badge */}
                    <span className="shrink-0 text-[11px] font-medium text-slate-600 bg-slate-100 rounded px-2 py-0.5">
                      {official.department}
                    </span>
                  </div>

                  {/* Additional details if available */}
                  {official.additionalDetails && (
                    <p className="text-xs text-slate-500 font-normal leading-relaxed italic border-l border-slate-200 pl-2">
                      {official.additionalDetails}
                    </p>
                  )}

                  {/* Bottom: Mobile Number with Call and WhatsApp Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <span className="block text-[10px] uppercase font-medium text-slate-400 tracking-wider">
                        Official Contact
                      </span>
                      <span className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
                        {displayPhone || 'Number on file'}
                      </span>
                    </div>

                    {/* Action buttons with minimum 44px hitboxes */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Direct Phone Call Button */}
                      {hasValidPhone ? (
                        <a
                          href={telUri}
                          aria-label={`Call ${official.name} on ${displayPhone}`}
                          title={`Call ${official.name}`}
                          className="min-h-[44px] min-w-[44px] px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-100" />
                          <span>Call</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No phone</span>
                      )}

                      {/* WhatsApp Button */}
                      {whatsAppUri ? (
                        <a
                          href={whatsAppUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp ${official.name}`}
                          title={`WhatsApp ${official.name}`}
                          className="min-h-[44px] min-w-[44px] px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da851] text-white rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-white" />
                          <span>WhatsApp</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
