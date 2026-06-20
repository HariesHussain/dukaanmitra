import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight, Check, AlertCircle, ShoppingCart, RefreshCw } from 'lucide-react';

interface GroceryItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  inStock: boolean;
  category: string;
}

const initialItems: GroceryItem[] = [
  { id: '1', name: 'Fresh Organic Milk 1L', price: 72, stock: 45, inStock: true, category: 'Dairy' },
  { id: '2', name: 'Premium Basmati Rice 5kg', price: 450, stock: 12, inStock: true, category: 'Grains' },
  { id: '3', name: 'Organic Cavendish Bananas (Doz)', price: 60, stock: 0, inStock: false, category: 'Fruits' },
  { id: '4', name: 'Sunflower Cooking Oil 1L', price: 175, stock: 24, inStock: true, category: 'Groceries' },
  { id: '5', name: 'Greek Curd BlueBerry 150g', price: 50, stock: 8, inStock: true, category: 'Dairy' }
];

export default function InventoryAutomation() {
  const [items, setItems] = useState<GroceryItem[]>(initialItems);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['📝 Catalog connected to sheet_10283921.xlsx']);

  const handleToggleStock = (id: string) => {
    setSyncingId(id);
    
    // Simulate API Sheet write delay
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const nextInStock = !item.inStock;
            const nextStock = nextInStock ? 15 : 0;
            
            // Add sync log
            setLogs((l) => [
              `⚡ Sheet Sync: "${item.name}" set to ${nextInStock ? 'In Stock (15)' : 'Out of Stock'}`,
              ...l.slice(0, 3)
            ]);
            
            return {
              ...item,
              inStock: nextInStock,
              stock: nextStock
            };
          }
          return item;
        })
      );
      setSyncingId(null);
    }, 800);
  };

  const handleUpdateStock = (id: string, amount: number) => {
    setSyncingId(id);
    
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const nextStock = Math.max(0, item.stock + amount);
            const nextInStock = nextStock > 0;
            
            setLogs((l) => [
              `⚡ Sheet Update: "${item.name}" stock level changed to ${nextStock}`,
              ...l.slice(0, 3)
            ]);

            return {
              ...item,
              stock: nextStock,
              inStock: nextInStock
            };
          }
          return item;
        })
      );
      setSyncingId(null);
    }, 600);
  };

  return (
    <section id="catalog" className="py-24 px-6 md:px-12 bg-[#0b0f19] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-5 text-left flex flex-col space-y-6">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Tactile Inventory Toggles</span>
            <h2 className="font-serif-display text-3xl md:text-5xl text-white font-medium leading-tight">
              One-click catalogs. <br />
              Synced in real-time.
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              Manage your store directly from the merchant dashboard. Toggle products active or out of stock with simple binary controls. 
              <br /><br />
              The WhatsApp bot instantly checks these variables before completing order calculations, ensuring customers never buy item quantities you don't have.
            </p>
            
            {/* Live Sheets Logs Console */}
            <div className="bg-[#121622] rounded-2xl p-4 border border-white/5 font-mono text-[11px] text-gray-300 space-y-2">
              <div className="flex items-center justify-between text-gray-500 border-b border-white/5 pb-2">
                <span>🔄 Sync Pipeline Logs</span>
                <span className="text-[10px] text-emerald-400">Listening...</span>
              </div>
              <div className="h-24 overflow-y-auto space-y-2.5">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-500">›</span>
                    <span className="leading-tight">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Catalog Board Mockup */}
          <div className="lg:col-span-7 bg-[#121622]/40 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">Store Catalog Manager</h3>
                <p className="text-xs text-gray-400 mt-0.5">Click actions below to test how the sync log reacts.</p>
              </div>
              <span className="bg-[#0b0f19] px-3 py-1 rounded-full border border-white/5 text-[10px] font-mono text-gray-400">
                Total: {items.length} items
              </span>
            </div>

            {/* Catalog List */}
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#0b0f19]/60 hover:bg-[#0b0f19] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className={`p-2.5 rounded-xl mt-0.5 ${
                      item.inStock 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                      <div className="flex items-center space-x-3 mt-1.5 text-xs text-gray-400">
                        <span className="text-emerald-400 font-bold">₹{item.price}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className={`flex items-center space-x-1 ${item.inStock ? 'text-gray-400' : 'text-red-400'}`}>
                          {item.inStock ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400 inline" />
                              <span>{item.stock} in stock</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-red-400 inline" />
                              <span>Out of stock</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    {/* Steppers */}
                    <div className="flex items-center bg-[#121622] rounded-xl border border-white/5 px-1 py-0.5">
                      <button
                        onClick={() => handleUpdateStock(item.id, -1)}
                        disabled={item.stock === 0 || syncingId === item.id}
                        className="px-2.5 py-1 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-white w-6 text-center">
                        {item.stock}
                      </span>
                      <button
                        onClick={() => handleUpdateStock(item.id, 1)}
                        disabled={syncingId === item.id}
                        className="px-2.5 py-1 text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => handleToggleStock(item.id)}
                      disabled={syncingId === item.id}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.inStock ? (
                        <ToggleRight className="w-10 h-10 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-gray-600" />
                      )}
                    </button>

                    {syncingId === item.id && (
                      <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin absolute right-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
