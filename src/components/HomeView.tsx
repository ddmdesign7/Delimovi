import React, { useState } from 'react';
import { 
  Search, 
  Scan, 
  ArrowRight, 
  ShieldCheck, 
  Plane, 
  Truck, 
  Clock, 
  Globe, 
  Zap, 
  Building2, 
  CheckCircle2, 
  Radio, 
  Package, 
  Sparkles,
  History,
  Layers
} from 'lucide-react';
import { Parcel } from '../types';

interface HomeViewProps {
  onTrack: (trackingNumber: string) => void;
  onOpenBarcodeScanner: () => void;
  parcels: Record<string, Parcel>;
  recentSearches: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onTrack,
  onOpenBarcodeScanner,
  parcels,
  recentSearches,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setInputError('Please enter a tracking ID');
      return;
    }
    setInputError('');
    onTrack(searchInput.trim().toUpperCase());
  };

  const sampleList: Parcel[] = Object.values(parcels);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider shadow-xs">
          <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
          <span>Real-Time Multi-Carrier Logistics Telemetry</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Track Any Shipment with <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900">
            Absolute Precision
          </span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Integrated satellite GPS tracking, milestone verification, customs clearance telemetry, and direct courier dispatch status.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-md relative">
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Enter Consignment ID (e.g. DLM-4419-US)"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (inputError) setInputError('');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-11 pr-12 py-4 text-slate-900 font-mono text-base tracking-wider placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 uppercase transition-all shadow-xs"
              />
              {/* Barcode Quick Trigger Inside Input */}
              <button
                type="button"
                onClick={onOpenBarcodeScanner}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                title="Scan with Optical Barcode Reader"
              >
                <Scan className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer font-mono uppercase tracking-wider shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Track Parcel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {inputError && (
            <p className="text-red-600 text-xs font-mono mt-2 ml-2">{inputError}</p>
          )}

          {/* Recent Searches if any */}
          {recentSearches.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 flex items-center gap-1 font-mono">
                <History className="w-3 h-3 text-slate-400" />
                Recent:
              </span>
              {recentSearches.map((code) => (
                <button
                  key={code}
                  onClick={() => onTrack(code)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-slate-200 hover:border-blue-200 font-mono text-xs cursor-pointer transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Quick-Track Consignment Cards */}
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-mono font-bold text-slate-900 uppercase tracking-wider">
              Live Demo Consignments (Click to Inspect)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">{sampleList.length} Active Shipments</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleList.map((parcel) => (
            <button
              key={parcel.tracking_number}
              onClick={() => onTrack(parcel.tracking_number)}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 p-5 rounded-2xl text-left transition-all group cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-extrabold font-mono text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  {parcel.tracking_number}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600" />
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {parcel.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 font-mono space-y-1 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Route:</span>
                  <span className="text-slate-800 font-medium">{parcel.sender.city} ({parcel.sender.country}) → {parcel.recipient.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-slate-700">{parcel.service_tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ETA:</span>
                  <span className="text-blue-600 font-bold">{parcel.eta}</span>
                </div>
              </div>

              {/* Progress Mini Bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all" 
                  style={{ width: `${parcel.progress_percent}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Global Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="text-3xl font-extrabold text-slate-900 font-mono">142,890+</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Parcels Monitored Today</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="text-3xl font-extrabold text-blue-600 font-mono">99.4%</div>
          <div className="text-xs font-medium text-slate-500 mt-1">On-Time SLA Guarantee</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">1.8 Days</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Average Cross-Border Speed</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div className="text-3xl font-extrabold text-indigo-600 font-mono">190+</div>
          <div className="text-xs font-medium text-slate-500 mt-1">Countries & Custom Hubs</div>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Plane className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Multi-Tier Carrier Telemetry</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consolidated manifest ingestion across air freight lines, maritime shipping, and last-mile electric courier dispatch.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Geofenced Checkpoint Logs</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatic time-stamped optical scans at every depot with driver identity and customs duty verification.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Electronic Proof of Delivery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cryptographically sealed airway bills, electronic signature mandates, and instant printable documentation.
          </p>
        </div>
      </div>

    </div>
  );
};
