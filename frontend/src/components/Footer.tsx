import React from 'react';
import { Store } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#022F24] border-t border-white/5 py-12 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-2 rounded-xl border border-white/15">
            <svg className="w-5 h-5 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35,20 H65 C80,20 90,32 90,50 C90,68 80,80 65,80 H35 Z" fill="currentColor" />
              <path d="M50,34 H63 C70,34 74,39 74,50 C74,61 70,66 63,66 H50 Z" fill="#022F24" />
              <path d="M12,48 L32,68 L56,40" fill="none" stroke="#10B981" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-bold font-sans tracking-wide text-white">
            Dukaan<span className="text-[#10B981] font-medium">Mitra</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-300">
          <a href="#struggles" className="hover:text-[#10B981] transition-colors">Struggles</a>
          <a href="#how-it-works" className="hover:text-[#10B981] transition-colors">How It Works</a>
          <a href="#demo" className="hover:text-[#10B981] transition-colors">Product Demo</a>
          <a href="#dashboard-preview" className="hover:text-[#10B981] transition-colors">Console Preview</a>
          <a href="#open-source" className="hover:text-[#10B981] transition-colors">Open Source</a>
        </div>

        {/* Copy */}
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} DukaanMitra Inc. Licensed under MIT.</span>
        </div>

      </div>
    </footer>
  );
}
