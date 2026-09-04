import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  Bell, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Star, 
  Play, 
  FileText, 
  Info,
  Navigation,
  Globe,
  ExternalLink,
  Check
} from 'lucide-react';
import { Parcel, TimelineEvent } from '../types';

interface TrackingResultViewProps {
  parcel: Parcel;
  onBack: () => void;
  onOpenWaybill: () => void;
  onOpenNotify: () => void;
  onAdvanceMilestone: (trackingNumber: string) => void;
}

export const TrackingResultView: React.FC<TrackingResultViewProps> = ({
  parcel,
  onBack,
  onOpenWaybill,
  onOpenNotify,
  onAdvanceMilestone,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [callingDriver, setCallingDriver] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCallDriver = () => {
    setCallingDriver(true);
    setTimeout(() => {
      setCallingDriver(false);
      alert(`Connected to Delimovi Driver Dispatch for ${parcel.courier.name} (${parcel.courier.phone})`);
    }, 1200);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Out for Delivery':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Customs Clearance':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'In Transit':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Consignment Search</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Milestone Simulator Button */}
          {parcel.status !== 'Delivered' && (
            <button
              onClick={() => onAdvanceMilestone(parcel.tracking_number)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Simulate checkpoint arrival"
            >
              <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
              <span>Simulate Next Checkpoint</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Status Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${getStatusBadge(parcel.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
                {parcel.status}
              </span>
              <span className="text-xs text-slate-600 font-mono bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {parcel.service_tier}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight flex items-center gap-3">
              {parcel.tracking_number}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Carrier: <span className="text-slate-800 font-semibold">{parcel.carrier}</span> &bull; Dispatched on {parcel.created_at}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenWaybill}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-mono text-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Waybill Document</span>
            </button>

            <button
              onClick={onOpenNotify}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-mono text-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Get Alerts</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/20"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Share Tracking</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ETA & Progress Bar */}
        <div className="mt-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                ESTIMATED ARRIVAL WINDOW
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono flex items-center gap-2 mt-0.5">
                <Clock className="w-6 h-6 text-blue-600" />
                {parcel.eta}
              </div>
            </div>
            <div className="sm:text-right">
              <span className="text-xs font-mono text-slate-500">Total Route Progress</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">{parcel.progress_percent}%</div>
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-slate-100 rounded-full h-4 p-0.5 overflow-hidden border border-slate-200 relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-1000 shadow-xs"
              style={{ width: `${parcel.progress_percent}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 mt-2">
            <span>Origin: {parcel.sender.city}</span>
            <span>Current: {parcel.history[0]?.location || 'In Transit'}</span>
            <span>Destination: {parcel.recipient.city}</span>
          </div>
        </div>

      </div>

      {/* 2-Column Grid: Left (Timeline + Map HUD), Right (Driver + Specs + Destination) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Interactive Route HUD & Map Simulator */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider">
                  Live Global Transit Route Visualizer
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                GPS Telemetry Synced
              </span>
            </div>

            {/* Visual Route Diagram */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 my-2 relative">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                
                {/* Node 1: Origin */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center mb-2 border border-slate-300">
                    A
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Origin Depot</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5">{parcel.sender.city}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{parcel.sender.country}</span>
                </div>

                {/* Node 2: Hub */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center mb-2 border border-blue-200">
                    B
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Sortation Hub</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5">{parcel.sender.hub.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Consolidated</span>
                </div>

                {/* Node 3: Current Node */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-blue-50 border border-blue-300 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-2 ring-4 ring-blue-100">
                    <Navigation className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-blue-700 font-bold">Active Waypoint</span>
                  <span className="text-xs font-bold text-blue-900 mt-0.5 truncate max-w-full">
                    {parcel.history[0]?.location.split(',')[0]}
                  </span>
                  <span className="text-[10px] text-blue-600 font-mono font-medium">Live Scanner</span>
                </div>

                {/* Node 4: Destination */}
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-xs flex items-center justify-center mb-2 border border-emerald-200">
                    D
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Final Address</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5">{parcel.recipient.city}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{parcel.recipient.country}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Detailed Milestone Timeline */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></div>
                <h2 className="text-xl font-bold text-slate-900 font-mono">
                  Milestone Verification Timeline
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {parcel.history.length} Checkpoints Recorded
              </span>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-6 relative before:absolute before:top-4 before:bottom-4 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {parcel.history.map((event, index) => (
                <div key={event.id || index} className="relative flex items-start gap-4 pl-1">
                  
                  {/* Step Marker */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-all ${
                      event.is_current
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-xs'
                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {event.is_current ? '✓' : '•'}
                  </div>

                  {/* Step Card Content */}
                  <div
                    className={`flex-1 rounded-2xl p-5 border transition-all ${
                      event.is_current
                        ? 'bg-blue-50/40 border-blue-200 shadow-xs ring-1 ring-blue-200/50'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h3 className={`font-bold text-sm sm:text-base ${event.is_current ? 'text-blue-700' : 'text-slate-900'}`}>
                        {event.status}
                      </h3>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {event.timestamp}
                      </span>
                    </div>

                    <div className="text-xs text-blue-600 font-mono mb-2 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{event.location}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {event.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 Col: Courier + Specs + Recipient) */}
        <div className="space-y-6">

          {/* Assigned Driver Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block mb-4">
              ASSIGNED LOGISTICS COURIER
            </span>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-mono font-black text-xl shadow-xs">
                {parcel.courier.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{parcel.courier.name}</h4>
                <div className="text-xs text-slate-500 font-mono">Badge: {parcel.courier.id}</div>
                <div className="text-xs text-amber-600 font-mono flex items-center gap-1 mt-0.5 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{parcel.courier.rating} Driver Rating</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-mono bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle Assigned:</span>
                <span className="text-slate-800 font-semibold">{parcel.courier.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatch Sector:</span>
                <span className="text-slate-800 font-semibold">{parcel.courier.current_zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier Fleet:</span>
                <span className="text-slate-700">{parcel.carrier}</span>
              </div>
            </div>

            <button
              onClick={handleCallDriver}
              disabled={callingDriver}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>{callingDriver ? 'Connecting to Dispatch...' : `Contact Courier (${parcel.courier.phone})`}</span>
            </button>
          </div>

          {/* Consignment Specs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
              Consignment Specifications
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Total Net Weight</span>
                <span className="font-mono text-slate-900 font-bold">{parcel.package_details.weight}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Box Dimensions</span>
                <span className="font-mono text-slate-800">{parcel.package_details.dimensions}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Declared Value</span>
                <span className="font-mono text-slate-900 font-bold">{parcel.package_details.declared_value}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Signature Mandate</span>
                <span className={`font-mono font-bold ${parcel.package_details.signature_required ? 'text-blue-700' : 'text-slate-500'}`}>
                  {parcel.package_details.signature_required ? 'YES (Recipient ID Required)' : 'NO SIGNATURE'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Cargo Insurance</span>
                <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Full Transit Cover
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
              <span className="text-slate-800 font-semibold block mb-0.5">Manifest Contents:</span>
              {parcel.package_details.items}
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono mb-3">
              Delivery Destination
            </h3>
            <div className="text-base font-bold text-slate-900 mb-1 font-sans">{parcel.recipient.name}</div>
            <div className="text-xs text-slate-600 leading-relaxed font-mono space-y-0.5">
              <p>{parcel.recipient.address}</p>
              <p>{parcel.recipient.city}, {parcel.recipient.postal_code}</p>
              <p className="text-blue-700 font-semibold">{parcel.recipient.country}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
