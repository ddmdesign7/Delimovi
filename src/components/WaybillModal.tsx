import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { Parcel } from '../types';

interface WaybillModalProps {
  parcel: Parcel;
  isOpen: boolean;
  onClose: () => void;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({ parcel, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 font-mono">Delimovi Air Waybill & Proof of Consignment</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Waybill Printable Document */}
        <div className="flex-1 overflow-auto p-6 sm:p-8 bg-white text-slate-900 font-sans print:p-0 print:m-0">
          <div className="border-4 border-slate-900 p-6 rounded-lg max-w-2xl mx-auto shadow-xs">
            
            {/* Top Brand Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded font-black flex items-center justify-center font-mono text-lg">D</div>
                  <span className="text-2xl font-extrabold tracking-tight font-mono text-slate-900">DELIMOVI</span>
                </div>
                <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider mt-0.5">International Logistics & Express Freight Network</p>
                <p className="text-[10px] text-slate-500">IATA / FIATA Accredited Airway Bill # {parcel.tracking_number}</p>
              </div>

              <div className="text-right">
                <div className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-400 rounded text-xs font-mono font-bold uppercase">
                  {parcel.service_tier}
                </div>
                <div className="text-[11px] font-mono text-slate-600 mt-1">Status: <span className="font-bold text-slate-900">{parcel.status}</span></div>
              </div>
            </div>

            {/* Barcode Mock Visual */}
            <div className="bg-slate-50 border border-slate-300 p-3 text-center mb-4 rounded flex flex-col items-center justify-center">
              <div className="font-mono text-xs font-bold tracking-widest text-slate-700 mb-1">
                * {parcel.tracking_number} *
              </div>
              <div className="flex items-center gap-[2px] h-10 w-64 justify-center">
                {[...Array(38)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`bg-slate-950 h-full ${
                      (i % 5 === 0 || i % 7 === 0) ? 'w-1.5' : (i % 3 === 0) ? 'w-1' : 'w-0.5'
                    }`} 
                  />
                ))}
              </div>
              <div className="text-[9px] font-mono text-slate-500 mt-1">MASTER TRACKING NUMBER</div>
            </div>

            {/* Shipper & Consignee 2-Column */}
            <div className="grid grid-cols-2 gap-4 border-b-2 border-slate-900 pb-4 mb-4">
              <div className="border border-slate-300 p-3 rounded bg-slate-50">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">1. SHIPPER (FROM)</div>
                <div className="text-xs font-bold text-slate-900">{parcel.sender.name}</div>
                <div className="text-[11px] text-slate-700 leading-tight mt-1">
                  Origin Hub: {parcel.sender.hub}<br />
                  {parcel.sender.city}, {parcel.sender.country}
                </div>
              </div>

              <div className="border border-slate-300 p-3 rounded bg-slate-50">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">2. CONSIGNEE / RECIPIENT (TO)</div>
                <div className="text-xs font-bold text-slate-900">{parcel.recipient.name}</div>
                <div className="text-[11px] text-slate-700 leading-tight mt-1">
                  {parcel.recipient.address}<br />
                  {parcel.recipient.city}, {parcel.recipient.postal_code}<br />
                  {parcel.recipient.country}
                </div>
              </div>
            </div>

            {/* Consignment Details Table */}
            <div className="border border-slate-300 rounded overflow-hidden mb-4">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-300 text-[10px]">
                  <tr>
                    <th className="p-2">Pieces</th>
                    <th className="p-2">Total Weight</th>
                    <th className="p-2">Dimensions</th>
                    <th className="p-2">Declared Value</th>
                    <th className="p-2">Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="p-2 font-bold">{parcel.package_details.pieces} PCS</td>
                    <td className="p-2">{parcel.package_details.weight}</td>
                    <td className="p-2">{parcel.package_details.dimensions}</td>
                    <td className="p-2">{parcel.package_details.declared_value}</td>
                    <td className="p-2 text-slate-900 font-bold">
                      {parcel.package_details.signature_required ? 'REQUIRED' : 'NO SIGNATURE'}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-2 bg-slate-50 text-[10px] text-slate-600 border-t border-slate-200">
                <span className="font-bold">Item Manifest:</span> {parcel.package_details.items}
              </div>
            </div>

            {/* Driver & Authentication Stamp */}
            <div className="grid grid-cols-2 gap-4 items-center pt-2">
              <div className="text-[10px] text-slate-600 font-mono">
                <div>Assigned Courier: <span className="font-bold text-slate-900">{parcel.courier.name}</span></div>
                <div>Vehicle / Plate: {parcel.courier.vehicle}</div>
                <div>Carrier Network: {parcel.carrier}</div>
                <div>Created: {parcel.created_at}</div>
              </div>

              <div className="border-2 border-dashed border-emerald-600 p-2.5 rounded text-center text-emerald-800 bg-emerald-50">
                <div className="text-[9px] font-bold uppercase tracking-widest">VERIFIED ELECTRONIC DISPATCH</div>
                <div className="text-xs font-mono font-bold">DELIMOVI-VERIFIED-SECURITY</div>
                <div className="text-[9px] text-emerald-600">ID: {parcel.tracking_number}-SHA256</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
