import React, { useState } from 'react';
import { X, Bell, Check, Mail, Phone, ShieldCheck } from 'lucide-react';

interface NotificationModalProps {
  trackingNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  trackingNumber,
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notifyOutForDelivery, setNotifyOutForDelivery] = useState(true);
  const [notifyDelivered, setNotifyDelivered] = useState(true);
  const [notifyExceptions, setNotifyExceptions] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-mono">Live Consignment Alerts</h2>
              <p className="text-[11px] text-slate-500 font-mono">For {trackingNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {saved ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-mono">Subscribed Successfully!</h3>
            <p className="text-xs text-slate-600">
              You will receive automated instant milestone alerts for {trackingNumber}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                Mobile Phone (SMS Notifications)
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">Alert Triggers:</span>
              
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOutForDelivery}
                  onChange={(e) => setNotifyOutForDelivery(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Out for Delivery / Driver dispatched</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyDelivered}
                  onChange={(e) => setNotifyDelivered(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Proof of delivery & photo confirmation</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyExceptions}
                  onChange={(e) => setNotifyExceptions(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Customs inspections & milestone updates</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 cursor-pointer transition-all mt-2"
            >
              Activate Live Alerts
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
