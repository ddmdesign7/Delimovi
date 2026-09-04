import React from 'react';
import { AlertCircle, ArrowLeft, Search } from 'lucide-react';

interface NotFoundViewProps {
  searchedCode: string;
  onBack: () => void;
  onTryCode: (code: string) => void;
  availableCodes: string[];
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  searchedCode,
  onBack,
  onTryCode,
  availableCodes,
}) => {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md space-y-6">
        
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 font-mono">Consignment Not Found</h2>
          <p className="text-slate-600 text-sm">
            No active manifest matches tracking number{' '}
            <span className="text-blue-700 font-mono font-bold">{searchedCode}</span> in our global network database.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 text-left space-y-2.5">
          <span className="text-xs font-mono uppercase font-bold text-slate-400 block tracking-wider">
            Try One of These Active Shipments:
          </span>
          <div className="flex flex-wrap gap-2">
            {availableCodes.map((code) => (
              <button
                key={code}
                onClick={() => onTryCode(code)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-200 font-mono text-xs cursor-pointer transition-colors"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-blue-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Try Another Search</span>
        </button>

      </div>
    </div>
  );
};
