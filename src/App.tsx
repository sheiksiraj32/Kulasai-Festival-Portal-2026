/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ControlRoomSection } from './components/ControlRoomSection';
import { HomeNavigation } from './components/HomeNavigation';
import { MapViewer } from './components/MapViewer';
import { ContactDirectory } from './components/ContactDirectory';
import { Footer } from './components/Footer';
import { AdminHelpModal } from './components/AdminHelpModal';
import { FESTIVAL_CONFIG, VERIFIED_OFFICIALS } from './config/festivalConfig';
import { fetchOfficialsContacts } from './services/sheetsService';
import { OfficialContact } from './types/festival';

export default function App() {
  // Navigation state: 'home' | 'map' | 'directory'
  const [currentView, setCurrentView] = useState<'home' | 'map' | 'directory'>('home');
  
  // Data states
  const [contacts, setContacts] = useState<OfficialContact[]>(VERIFIED_OFFICIALS);
  const [departments, setDepartments] = useState<string[]>(() => {
    return Array.from(new Set(VERIFIED_OFFICIALS.map(o => o.department))).sort();
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'google_sheets' | 'verified_preloaded'>('verified_preloaded');
  const [customSheetId, setCustomSheetId] = useState<string>(FESTIVAL_CONFIG.googleSheetId || '');
  const [mapImageUrl, setMapImageUrl] = useState<string>(FESTIVAL_CONFIG.mapImageUrl);
  const [logoUrl, setLogoUrl] = useState<string>(FESTIVAL_CONFIG.logoUrl);
  
  // Admin help modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Load contacts
  const loadContacts = async (sheetIdToUse?: string) => {
    setIsLoading(true);
    try {
      const result = await fetchOfficialsContacts(sheetIdToUse !== undefined ? sheetIdToUse : customSheetId);
      setContacts(result.contacts);
      setDepartments(result.departments);
      setDataSource(result.source);
    } catch (e) {
      console.error('Error fetching contacts:', e);
      setContacts(VERIFIED_OFFICIALS);
      setDepartments(Array.from(new Set(VERIFIED_OFFICIALS.map(o => o.department))).sort());
      setDataSource('verified_preloaded');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (FESTIVAL_CONFIG.googleSheetId || FESTIVAL_CONFIG.googleSheetCsvUrl) {
      loadContacts();
    }
  }, []);

  const handleUpdateSheetId = (newSheetId: string) => {
    setCustomSheetId(newSheetId);
    loadContacts(newSheetId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Official Header with Government of Tamil Nadu Logo */}
      <Header
        onTitleClick={() => setCurrentView('home')}
        logoUrl={logoUrl}
        onLogoUploaded={setLogoUrl}
      />

      {/* 2. Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-5 flex-1 flex flex-col justify-start">
            
            {/* FESTIVAL CONTROL ROOM: Only one Toll-Free Helpline */}
            <ControlRoomSection config={FESTIVAL_CONFIG.controlRoom} />

            {/* TWO PRIMARY BUTTONS:
                1. FESTIVAL LOCATION MAP
                2. CONTACT DIRECTORY */}
            <HomeNavigation
              onOpenMap={() => setCurrentView('map')}
              onOpenDirectory={() => setCurrentView('directory')}
            />

            {/* Citizen advisory note */}
            <div className="mt-5 text-center text-xs text-slate-500 font-normal leading-relaxed">
              <p>For immediate emergency assistance, call the Festival Control Room Toll-Free number (1800 425 1077). Use the Contact Directory to reach sector officers directly.</p>
            </div>
          </div>
        )}

        {currentView === 'map' && (
          <MapViewer
            imageUrl={mapImageUrl}
            onUpdateImageUrl={setMapImageUrl}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'directory' && (
          <ContactDirectory
            contacts={contacts}
            departments={departments}
            isLoading={isLoading}
            dataSource={dataSource}
            onRefresh={() => loadContacts()}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* 3. Official Civic Footer */}
      {currentView === 'home' && (
        <Footer onOpenAdminModal={() => setIsAdminModalOpen(true)} />
      )}

      {/* 4. District Admin Guide & QR Code Modal */}
      <AdminHelpModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onUpdateSheetId={handleUpdateSheetId}
        currentSheetId={customSheetId}
      />
    </div>
  );
}
