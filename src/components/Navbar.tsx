import React, { useState } from 'react';
import { PackagePlus, Server, Search, User as UserIcon, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  onSearch: (trackingNumber: string) => void;
  onOpenDispatch: () => void;
  onOpenFlaskSource: () => void;
  onGoHome: () => void;
  currentTrackingNumber?: string;
  currentUser: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  onOpenDispatch,
  onOpenFlaskSource,
  onGoHome,
  currentTrackingNumber,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const [navSearchInput, setNavSearchInput] = useState('');

  const handleNavSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchInput.trim()) {
      onSearch(navSearchInput.trim().toUpperCase());
      setNavSearchInput('');
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20 text-white font-black tracking-wider text-xl font-mono group-hover:scale-105 transition-transform">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-mono">DELIMOVI</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold hidden sm:inline-block">
                v2.4
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block -mt-0.5 font-mono">
              LOGISTICS PLATFORM
            </span>
          </div>
        </button>

        {/* Global Nav Search */}
        <form onSubmit={handleNavSubmit} className="hidden md:flex items-center gap-2 max-w-sm w-full">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tracking ID (e.g. DLM-4419-US)..."
              value={navSearchInput}
              onChange={(e) => setNavSearchInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 font-mono uppercase focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 transition-all placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            Track
          </button>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Dispatch Button */}
          <button
            onClick={onOpenDispatch}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PackagePlus className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Dispatch</span>
          </button>

          {/* Flask Source Code Viewer Button */}
          <button
            onClick={onOpenFlaskSource}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Inspect Flask Backend Code (app.py & templates)"
          >
            <Server className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Flask Source</span>
          </button>

          {/* Firebase Authentication Button / User Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="max-w-[130px] truncate font-medium" title={currentUser.email || ''}>
                  {currentUser.email}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
