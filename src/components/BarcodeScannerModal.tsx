import React, { useState, useEffect } from 'react';
import { X, Scan, CheckCircle2, Sparkles } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
  availableCodes: string[];
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  availableCodes,
}) => {
  const [scanning, setScanning] = useState(false);
  const [selectedCode, setSelectedCode] = useState(availableCodes[0] || 'DLM-4419-US');

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = (code: string) => {
    setScanning(true);
    setTimeout(() => {
      onScan(code);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 font-mono">Barcode Scanner & Consignment Reader</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="p-6 text-center">
          <div className="relative w-full h-48 bg-slate-900 border-2 border-blue-500/50 rounded-xl flex items-center justify-center overflow-hidden mb-6 shadow-inner">
            
            {/* Corner targets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>

            {/* Scanning Laser Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-[bounce_2s_infinite]"></div>

            <div className="z-10 text-center">
              <div className="font-mono text-xs text-slate-400 tracking-widest uppercase mb-1">Delimovi Optical HUD</div>
              <div className="font-mono text-base font-bold text-blue-400 tracking-wider">
                {selectedCode}
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1 mt-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Optical Lock Acquired
              </span>
            </div>
          </div>

          <div className="text-left mb-4">
            <label className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider block mb-2">
              Select Package Barcode to Scan:
            </label>
            <div className="space-y-2">
              {availableCodes.map((code) => (
                <button
                  key={code}
                  onClick={() => handleSimulateScan(code)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Scan className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-blue-700">{code}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono group-hover:text-blue-600">Tap to Scan →</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleSimulateScan(selectedCode)}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>Scan Selected Barcode</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
