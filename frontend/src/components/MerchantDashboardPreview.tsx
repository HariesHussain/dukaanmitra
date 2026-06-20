import React from 'react';
import { motion } from 'framer-motion';
import { Database, ShoppingBag, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function MerchantDashboardPreview() {
  return (
    <section id="dashboard-preview" className="py-24 px-6 md:px-12 bg-[#F4F1EA] border-t border-[#064E3B]/5 relative">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest">Real Merchant Console</span>
          <h2 className="font-serif-display text-3xl md:text-5xl text-[#064E3B] font-medium leading-tight">
            Designed for busy shop counters.
          </h2>
          <p className="text-[#4B5563] text-sm md:text-base max-w-lg mx-auto">
            A clean, high-contrast dashboard displaying incoming orders, stock volumes, and WhatsApp system logs.
          </p>
        </div>

        {/* CSS Laptop Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl flex flex-col items-center select-none"
        >
          {/* Laptop Screen Bezel */}
          <div className="w-full bg-[#1e2022] p-4 rounded-t-3xl border-t border-x border-slate-700 shadow-2xl relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></div>
            
            {/* Screen Content Wrapper */}
            <div className="w-full aspect-[16/10] bg-[#070a13] rounded-xl overflow-hidden border border-slate-800 flex flex-col font-sans text-xs text-gray-200">
              
              {/* Dashboard Top bar */}
              <div className="bg-[#121622] px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-[#064E3B] flex items-center justify-center text-white font-bold text-[8px]">
                    DM
                  </div>
                  <span className="font-bold text-white tracking-wide">DukaanMitra Console</span>
                </div>
                <div className="flex items-center space-x-3 text-[10px] text-gray-400">
                  <span className="bg-[#10B981]/10 px-2 py-0.5 rounded text-[#10B981] border border-[#10B981]/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Agent Active
                  </span>
                </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="flex-1 p-4 grid grid-cols-12 gap-4 items-stretch overflow-hidden">
                
                {/* Left side: Orders Kanban columns */}
                <div className="col-span-8 flex flex-col space-y-3 overflow-hidden">
                  <h4 className="font-bold text-[#FCFAF6] text-xs flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#10B981]" />
                    Live Orders Board
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-3 flex-1 overflow-hidden">
                    
                    {/* Col 1: Pending */}
                    <div className="bg-[#121622]/40 rounded-xl p-2.5 border border-white/5 flex flex-col space-y-2 overflow-hidden">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-1 block">
                        New Orders (1)
                      </span>
                      <div className="bg-[#070a13] p-2.5 rounded-lg border border-white/5 space-y-2">
                        <div className="flex justify-between font-bold text-[10px] text-white">
                          <span>Rahul Verma</span>
                          <span className="text-gray-500">2m</span>
                        </div>
                        <p className="text-[9px] font-mono text-gray-400 bg-white/5 p-1 rounded">Potatoes 2kg, Eggs 5</p>
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className="text-[#10B981]">₹115</span>
                          <span className="text-blue-400">Pending</span>
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Transit */}
                    <div className="bg-[#121622]/40 rounded-xl p-2.5 border border-white/5 flex flex-col space-y-2 overflow-hidden">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-1 block">
                        In Transit (1)
                      </span>
                      <div className="bg-[#070a13] p-2.5 rounded-lg border border-white/5 space-y-2">
                        <div className="flex justify-between font-bold text-[10px] text-white">
                          <span>Anisha Sen</span>
                          <span className="text-gray-500">22m</span>
                        </div>
                        <p className="text-[9px] font-mono text-gray-400 bg-white/5 p-1 rounded">Bananas 1 Doz, Milk 2L</p>
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className="text-[#10B981]">₹204</span>
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <Truck className="w-2.5 h-2.5" /> Dispatch
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Col 3: Settled */}
                    <div className="bg-[#121622]/40 rounded-xl p-2.5 border border-white/5 flex flex-col space-y-2 overflow-hidden">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-1 block">
                        Completed (5)
                      </span>
                      <div className="bg-[#121622]/20 p-2.5 rounded-lg border border-white/5 opacity-60 space-y-1 text-[9px]">
                        <div className="flex justify-between text-white">
                          <span>Vipin Kumar</span>
                          <span className="text-gray-500">1h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>₹625</span>
                          <span className="text-[#10B981] flex items-center gap-0.5 font-bold">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Settled
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right side: Catalog list & sheets logs */}
                <div className="col-span-4 flex flex-col space-y-3 overflow-hidden border-l border-white/5 pl-4">
                  <h4 className="font-bold text-[#FCFAF6] text-xs flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-[#10B981]" />
                    Google Sheets Inventory
                  </h4>
                  
                  <div className="bg-[#121622]/40 rounded-xl p-2.5 border border-white/5 flex-1 flex flex-col space-y-2 overflow-hidden text-[9px] font-mono">
                    <div className="flex justify-between text-gray-400 border-b border-white/5 pb-1 text-[8px] font-bold uppercase">
                      <span>Item</span>
                      <span>Stock</span>
                    </div>
                    <div className="space-y-1.5 flex-1 overflow-y-auto">
                      <div className="flex justify-between text-white">
                        <span>Milk 1L</span>
                        <span className="text-[#10B981]">45 units</span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>Basmati Rice 5kg</span>
                        <span>12 units</span>
                      </div>
                      <div className="flex justify-between text-red-400 font-bold">
                        <span>Bananas (Doz)</span>
                        <span>Out of Stock</span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>Sunflower Oil 1L</span>
                        <span>24 units</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 border border-white/5 rounded p-2 text-[8px] text-gray-400 leading-tight">
                      ⚙️ Sync: row 3 updated. Stock level '45' synced to sheet database.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Laptop keyboard base */}
          <div className="w-[105%] h-4 bg-[#ccd0d2] rounded-b-xl shadow-xl border-b-2 border-slate-400 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#8c9092] rounded-b-md"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
