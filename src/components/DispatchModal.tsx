import React, { useState } from 'react';
import { X, PackagePlus, ArrowRight, Shield, Truck } from 'lucide-react';
import { Parcel } from '../types';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (newParcel: Parcel) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({ isOpen, onClose, onDispatch }) => {
  const [senderName, setSenderName] = useState('Apex Industrial Labs');
  const [senderCity, setSenderCity] = useState('Frankfurt');
  const [senderCountry, setSenderCountry] = useState('Germany');
  
  const [recipientName, setRecipientName] = useState('Lucas Silva');
  const [recipientAddress, setRecipientAddress] = useState('Avenida Paulista 1200');
  const [recipientCity, setRecipientCity] = useState('São Paulo');
  const [recipientZip, setRecipientZip] = useState('01310-100');
  const [recipientCountry, setRecipientCountry] = useState('Brazil');

  const [weight, setWeight] = useState('3.2');
  const [items, setItems] = useState('Precision Optical Calibrator');
  const [serviceTier, setServiceTier] = useState('Delimovi Global Express');
  const [signature, setSignature] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const countryCode = recipientCountry.slice(0, 2).toUpperCase() || 'GL';
    const trackingId = `DLM-${randomSuffix}-${countryCode}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').slice(0, 19);

    const newParcel: Parcel = {
      tracking_number: trackingId,
      status: 'Order Registered',
      progress_percent: 20,
      service_tier: serviceTier,
      carrier: 'Delimovi Worldwide Freight',
      sender: {
        name: senderName,
        city: senderCity,
        country: senderCountry,
        hub: `${senderCity} International Cargo Hub`,
      },
      recipient: {
        name: recipientName,
        address: recipientAddress,
        city: recipientCity,
        postal_code: recipientZip,
        country: recipientCountry,
      },
      package_details: {
        weight: `${weight} kg`,
        dimensions: '32 × 22 × 18 cm',
        items: items,
        pieces: 1,
        declared_value: '$450.00',
        signature_required: signature,
        insured: true,
      },
      courier: {
        name: 'Auto-Assigned upon Departure',
        id: `DRV-${randomSuffix}`,
        phone: '+1 800 555 0122',
        vehicle: 'Delimovi High-Capacity Van',
        rating: 4.9,
        current_zone: `${senderCity} Sorting Bay`,
      },
      eta: 'In 3 Business Days',
      created_at: dateStr,
      history: [
        {
          id: 'h1',
          timestamp: `${now.getFullYear()}-0${now.getMonth() + 1}-${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
          status: 'Order Registered & Label Printed',
          location: `${senderCity} Air Logistics Center, ${senderCountry}`,
          description: 'Shipment manifest registered in the Delimovi global logistics network.',
          completed: true,
          is_current: true,
        },
      ],
    };

    onDispatch(newParcel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-mono">Dispatch New Consignment</h2>
              <p className="text-xs text-slate-500">Generate real-time Delimovi tracking ID & manifest</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-5 text-xs font-sans">
          
          {/* Sender */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider block">1. Origin & Sender</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Sender Company / Name</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={senderCity}
                  onChange={(e) => setSenderCity(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={senderCountry}
                  onChange={(e) => setSenderCountry(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-mono font-bold text-indigo-700 uppercase tracking-wider block">2. Recipient & Destination</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Destination City & Postal Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={recipientCity}
                    onChange={(e) => setRecipientCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={recipientZip}
                    onChange={(e) => setRecipientZip(e.target.value)}
                    placeholder="ZIP"
                    className="w-24 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={recipientCountry}
                  onChange={(e) => setRecipientCountry(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">3. Package Specifications & Service Tier</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Service Tier</label>
                <select
                  value={serviceTier}
                  onChange={(e) => setServiceTier(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="Delimovi Prime Express Air">Delimovi Prime Express Air</option>
                  <option value="Delimovi Global Express">Delimovi Global Express</option>
                  <option value="Delimovi EcoGround">Delimovi EcoGround Carbon-Neutral</option>
                  <option value="Delimovi Continental Priority">Delimovi Continental Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Items Description</label>
                <input
                  type="text"
                  required
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="sigReq"
                checked={signature}
                onChange={(e) => setSignature(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="sigReq" className="text-slate-700 text-xs cursor-pointer">
                Require Recipient Physical Signature upon Delivery (ID Verification)
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-mono text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer transition-all uppercase tracking-wider"
            >
              <span>Initialize Dispatch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
