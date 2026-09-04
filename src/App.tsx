/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_PARCELS } from './data/mockParcels';
import { Parcel, TimelineEvent } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { TrackingResultView } from './components/TrackingResultView';
import { NotFoundView } from './components/NotFoundView';
import { FlaskSourceModal } from './components/FlaskSourceModal';
import { WaybillModal } from './components/WaybillModal';
import { DispatchModal } from './components/DispatchModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { NotificationModal } from './components/NotificationModal';
import { AuthModal } from './components/AuthModal';
import { loadParcels, saveParcels } from './lib/parcelService';
import { subscribeToAuthState, signOutUser } from './lib/authService';
import { User } from 'firebase/auth';

export default function App() {
  const [parcels, setParcels] = useState<Record<string, Parcel>>(loadParcels);
  const [currentTrackingId, setCurrentTrackingId] = useState<string | null>(null);
  const [searchedNotFoundCode, setSearchedNotFoundCode] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'DLM-4419-US',
    'DLM-7730-UK',
    'DLM-9912-JP',
  ]);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals state
  const [isFlaskSourceOpen, setIsFlaskSourceOpen] = useState(false);
  const [isWaybillOpen, setIsWaybillOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  // Subscribe to Firebase Authentication
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Save parcels to local storage whenever parcels change
  useEffect(() => {
    saveParcels(parcels);
  }, [parcels]);

  // Check URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trackingQuery = params.get('tracking_number');
    if (trackingQuery) {
      handleTrack(trackingQuery);
    }
  }, [parcels]);

  const handleTrack = (code: string) => {
    const formatted = code.trim().toUpperCase();
    
    // Direct or sanitized match
    let matchedParcel = parcels[formatted];
    if (!matchedParcel) {
      const cleanTarget = formatted.replace(/[^A-Z0-9]/g, '');
      for (const [key, val] of Object.entries(parcels)) {
        if (key.replace(/[^A-Z0-9]/g, '') === cleanTarget) {
          matchedParcel = val;
          break;
        }
      }
    }

    if (matchedParcel) {
      setCurrentTrackingId(matchedParcel.tracking_number);
      setSearchedNotFoundCode(null);
      
      // Update recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((c) => c !== matchedParcel!.tracking_number);
        return [matchedParcel!.tracking_number, ...filtered].slice(0, 6);
      });

      // Update URL without full reload
      const newUrl = `${window.location.pathname}?tracking_number=${encodeURIComponent(matchedParcel.tracking_number)}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
      setCurrentTrackingId(null);
      setSearchedNotFoundCode(formatted);
    }
  };

  const handleGoHome = () => {
    setCurrentTrackingId(null);
    setSearchedNotFoundCode(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleNewParcelDispatched = (newParcel: Parcel) => {
    setParcels((prev) => ({
      [newParcel.tracking_number]: newParcel,
      ...prev,
    }));
    handleTrack(newParcel.tracking_number);
  };

  const handleAdvanceMilestone = (trackingNumber: string) => {
    const current = parcels[trackingNumber];
    if (!current || current.status === 'Delivered') return;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-0${now.getMonth() + 1}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let nextStatus = current.status;
    let nextProgress = current.progress_percent + 20;
    let newEventTitle = '';
    let newEventDesc = '';
    let newLocation = current.recipient.city;

    if (current.status === 'Order Registered') {
      nextStatus = 'In Transit';
      nextProgress = 45;
      newEventTitle = 'In Cross-Border Transit';
      newEventDesc = 'Consolidated into high-speed linehaul container and en route to regional distribution gateway.';
      newLocation = `${current.sender.hub} Departures`;
    } else if (current.status === 'In Transit') {
      nextStatus = 'Customs Clearance';
      nextProgress = 70;
      newEventTitle = 'Customs Clearance Finalized';
      newEventDesc = 'Customs declarations verified and cleared for final domestic delivery.';
      newLocation = `${current.recipient.country} Customs Ingress`;
    } else if (current.status === 'Customs Clearance') {
      nextStatus = 'Out for Delivery';
      nextProgress = 90;
      newEventTitle = 'Out for Final Delivery';
      newEventDesc = `Dispatched with courier ${current.courier.name}. Delivery vehicle is in customer delivery radius.`;
      newLocation = `${current.recipient.city} Last-Mile Hub`;
    } else if (current.status === 'Out for Delivery') {
      nextStatus = 'Delivered';
      nextProgress = 100;
      newEventTitle = 'Delivered to Recipient';
      newEventDesc = 'Handed over directly to recipient. Electronic signature and GPS timestamp recorded.';
      newLocation = `${current.recipient.address}, ${current.recipient.city}`;
    }

    const updatedHistory: TimelineEvent[] = [
      {
        id: `h_${Date.now()}`,
        timestamp: timeStr,
        status: newEventTitle,
        location: newLocation,
        description: newEventDesc,
        completed: true,
        is_current: true,
      },
      ...current.history.map((h) => ({ ...h, is_current: false })),
    ];

    const updatedParcel: Parcel = {
      ...current,
      status: nextStatus as any,
      progress_percent: Math.min(100, nextProgress),
      eta: nextStatus === 'Delivered' ? `Delivered Today at ${timeStr.split(' ')[1]}` : current.eta,
      history: updatedHistory,
    };

    setParcels((prev) => ({
      ...prev,
      [trackingNumber]: updatedParcel,
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const activeParcel = currentTrackingId ? parcels[currentTrackingId] : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Global Navbar */}
      <Navbar
        onSearch={handleTrack}
        onOpenDispatch={() => setIsDispatchOpen(true)}
        onOpenFlaskSource={() => setIsFlaskSourceOpen(true)}
        onGoHome={handleGoHome}
        currentTrackingNumber={currentTrackingId || undefined}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeParcel ? (
          <TrackingResultView
            parcel={activeParcel}
            onBack={handleGoHome}
            onOpenWaybill={() => setIsWaybillOpen(true)}
            onOpenNotify={() => setIsNotifyOpen(true)}
            onAdvanceMilestone={handleAdvanceMilestone}
          />
        ) : searchedNotFoundCode ? (
          <NotFoundView
            searchedCode={searchedNotFoundCode}
            onBack={handleGoHome}
            onTryCode={handleTrack}
            availableCodes={Object.keys(parcels)}
          />
        ) : (
          <HomeView
            onTrack={handleTrack}
            onOpenBarcodeScanner={() => setIsBarcodeOpen(true)}
            parcels={parcels}
            recentSearches={recentSearches}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 mt-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>&copy; 2026 DELIMOVI Logistics Infrastructure. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFlaskSourceOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
            >
              Flask Architecture (app.py & templates)
            </button>
            <span className="text-slate-300">&bull;</span>
            <button
              onClick={() => setIsDispatchOpen(true)}
              className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Dispatch Consignment
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <FlaskSourceModal
        isOpen={isFlaskSourceOpen}
        onClose={() => setIsFlaskSourceOpen(false)}
      />

      {activeParcel && (
        <WaybillModal
          parcel={activeParcel}
          isOpen={isWaybillOpen}
          onClose={() => setIsWaybillOpen(false)}
        />
      )}

      {activeParcel && (
        <NotificationModal
          trackingNumber={activeParcel.tracking_number}
          isOpen={isNotifyOpen}
          onClose={() => setIsNotifyOpen(false)}
        />
      )}

      <DispatchModal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        onDispatch={handleNewParcelDispatched}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onScan={handleTrack}
        availableCodes={Object.keys(parcels)}
      />

    </div>
  );
}
