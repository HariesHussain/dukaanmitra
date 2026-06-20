import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, Settings, LogOut, ShoppingBag, DollarSign, AlertTriangle, 
  MessageSquare, RefreshCw, Send, CheckCircle, Truck, Play, Database, Sparkles
} from 'lucide-react';
import { useApp } from '../App';

interface Order {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: 'Pending' | 'Delivering' | 'Settled';
  timestamp: string;
}

interface InventoryItem {
  name: string;
  price: number;
  stock: number;
  inStock: boolean;
  category: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, sheetsId, geminiKey } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'chat'>('orders');
  
  // Demo State (for immediate usage)
  const [orders, setOrders] = useState<Order[]>([
    { id: '1001', customer: 'Rahul Verma', items: 'Potatoes 2kg, Eggs 5', total: 115, status: 'Pending', timestamp: '10 mins ago' },
    { id: '1002', customer: 'Anisha Sen', items: 'Organic Bananas 1 Doz, Milk 2L', total: 204, status: 'Delivering', timestamp: '34 mins ago' },
    { id: '1003', customer: 'Vipin Kumar', items: 'Basmati Rice 5kg, Cooking Oil 1L', total: 625, status: 'Settled', timestamp: '1 hour ago' },
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { name: 'Fresh Organic Milk 1L', price: 72, stock: 45, inStock: true, category: 'Dairy' },
    { name: 'Premium Basmati Rice 5kg', price: 450, stock: 12, inStock: true, category: 'Grains' },
    { name: 'Organic Cavendish Bananas (Doz)', price: 60, stock: 0, inStock: false, category: 'Fruits' },
    { name: 'Sunflower Cooking Oil 1L', price: 175, stock: 24, inStock: true, category: 'Groceries' },
  ]);

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot' | 'system', text: string, time: string }>>([
    { sender: 'system', text: '🤖 DukaanMitra AI sandbox ready. Direct inputs bypass WhatsApp verification.', time: 'System Boot' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Sync spreadsheet triggers
  const handleSyncData = () => {
    setSyncing(true);
    // Call Python FastAPI if key details are entered
    fetch('/api/inventory')
      .then(res => res.json())
      .then(data => {
        if (data && data.items) {
          setInventory(data.items);
        }
        if (data && data.orders) {
          setOrders(data.orders);
        }
        setSyncing(false);
      })
      .catch(() => {
        // Fallback for mock sandbox execution
        setTimeout(() => {
          setSyncing(false);
          // Shuffle stock count a bit
          setInventory(prev => prev.map(item => ({
            ...item,
            stock: item.inStock ? Math.floor(Math.random() * 20) + 5 : 0
          })));
        }, 1200);
      });
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'Pending' | 'Delivering' | 'Settled') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    
    // Attempt backend update
    fetch('/api/orders/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: nextStatus })
    }).catch(() => {});
  };

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatHistory(prev => [...prev, { sender: 'user', text: userText, time: timeString }]);
    setChatLoading(true);

    try {
      // POST to FastAPI server backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          sheets_id: sheetsId,
          gemini_key: geminiKey
        })
      });
      const data = await response.json();
      
      if (data.tool_calls && data.tool_calls.length > 0) {
        data.tool_calls.forEach((tool: string) => {
          setChatHistory(prev => [...prev, {
            sender: 'system',
            text: `🛠️ Tool Execution: ${tool}`,
            time: timeString
          }]);
        });
      }

      setChatHistory(prev => [...prev, {
        sender: 'bot',
        text: data.reply || "Sorry, I encountered an issue coordinating with the agent core.",
        time: timeString
      }]);
    } catch (err) {
      // Offline fallback simulator replies
      setTimeout(() => {
        let fallbackReply = "I am running in Offline Sandbox mode. Please connect your credentials in Settings to trigger live AI responses.";
        if (userText.toLowerCase().includes('stock') || userText.toLowerCase().includes('have')) {
          fallbackReply = "🥛 We currently have Toned Milk (45 left) and Basmati Rice (12 left) in stock. Organic Bananas are out of stock.";
        } else if (userText.toLowerCase().includes('order') || userText.toLowerCase().includes('buy')) {
          fallbackReply = "Sure! I can write order requests to your sheet. Let me know what items to bill.";
        }
        setChatHistory(prev => [...prev, { sender: 'bot', text: fallbackReply, time: timeString }]);
      }, 700);
    } finally {
      setChatLoading(false);
      // Auto-trigger sync to update visual grid if inventory was modified
      handleSyncData();
    }
  };

  const hasCredentials = sheetsId && geminiKey;

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-200 flex flex-col">
      
      {/* Header bar */}
      <header className="glassmorphism border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center z-20">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/30">
            <Store className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-lg font-bold font-sans tracking-wide text-white">
            Dukaan<span className="text-emerald-400 font-medium">Mitra</span>
            <span className="ml-2.5 text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 text-gray-400">
              Merchant Console
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            to="/settings" 
            className="flex items-center space-x-1.5 text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/5 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </Link>
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-gray-400 hover:text-red-400 p-2 rounded-xl transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Warning banner if credentials aren't connected */}
      {!hasCredentials && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span><strong>Running in Free Demo Sandbox Mode.</strong> Live WhatsApp bots and Google Sheets updates require settings configuration.</span>
          </div>
          <Link to="/settings" className="font-bold underline hover:text-white">Configure Settings</Link>
        </div>
      )}

      {/* Main Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Stats cards & Orders Boards */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121622]/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Sales</span>
                <h4 className="text-2xl font-bold text-white mt-1">₹{orders.reduce((acc, curr) => acc + curr.total, 0)}</h4>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121622]/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pending Orders</span>
                <h4 className="text-2xl font-bold text-white mt-1">{orders.filter(o => o.status === 'Pending').length}</h4>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#121622]/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Alerts</span>
                <h4 className="text-2xl font-bold text-red-400 mt-1">{inventory.filter(i => !i.inStock).length} Out of Stock</h4>
              </div>
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 text-sm font-bold border-b-2 px-6 transition-all ${
                activeTab === 'orders' ? 'border-emerald-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Order Board
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`pb-3 text-sm font-bold border-b-2 px-6 transition-all ${
                activeTab === 'inventory' ? 'border-emerald-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Catalog Quick-Edit
            </button>
          </div>

          {/* Orders Column board */}
          {activeTab === 'orders' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: Pending */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>New Orders ({orders.filter(o => o.status === 'Pending').length})</span>
                  </span>
                </div>
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'Pending').map(order => (
                    <div key={order.id} className="bg-[#121622]/40 border border-white/5 rounded-2xl p-4.5 space-y-3 relative group">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-white">{order.customer}</span>
                        <span className="text-[10px] text-gray-500">{order.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono bg-black/25 p-2 rounded border border-white/5">{order.items}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-emerald-400">₹{order.total}</span>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Delivering')}
                          className="bg-white/5 hover:bg-white/10 text-white px-3 py-1 rounded-xl text-[10px] font-bold border border-white/5 flex items-center space-x-1"
                        >
                          <Truck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Dispatch</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === 'Pending').length === 0 && (
                    <div className="text-center py-8 text-xs text-gray-500 border border-dashed border-white/5 rounded-2xl">
                      No new orders
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Delivering */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>In Transit ({orders.filter(o => o.status === 'Delivering').length})</span>
                  </span>
                </div>
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'Delivering').map(order => (
                    <div key={order.id} className="bg-[#121622]/40 border border-white/5 rounded-2xl p-4.5 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-white">{order.customer}</span>
                        <span className="text-[10px] text-gray-500">{order.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono bg-black/25 p-2 rounded border border-white/5">{order.items}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-emerald-400">₹{order.total}</span>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Settled')}
                          className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl text-[10px] font-bold border border-emerald-500/20 flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Paid & Settle</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === 'Delivering').length === 0 && (
                    <div className="text-center py-8 text-xs text-gray-500 border border-dashed border-white/5 rounded-2xl">
                      No orders in transit
                    </div>
                  )}
                </div>
              </div>

              {/* Column 3: Settled */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Completed ({orders.filter(o => o.status === 'Settled').length})</span>
                  </span>
                </div>
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'Settled').map(order => (
                    <div key={order.id} className="bg-[#121622]/20 border border-white/5 opacity-70 rounded-2xl p-4.5 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-white">{order.customer}</span>
                        <span className="text-[10px] text-gray-500">{order.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono bg-black/10 p-2 rounded border border-white/5">{order.items}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-gray-400">₹{order.total}</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Settled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Inventory Manager Quick Edit */}
          {activeTab === 'inventory' && (
            <div className="bg-[#121622]/40 border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-bold text-white text-base">Store Catalog</h3>
                  <p className="text-xs text-gray-400">Update price columns or stock counts directly below</p>
                </div>
                <button
                  onClick={handleSyncData}
                  disabled={syncing}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/20 flex items-center space-x-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing Sheet...' : 'Sync Sheet'}</span>
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {inventory.map((item, idx) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-sm font-bold text-white mt-0.5">₹{item.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Stock Count</p>
                        <span className={`text-sm font-bold mt-0.5 inline-block ${item.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {item.stock > 0 ? `${item.stock} units` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Interactive AI Sandbox Chat Console */}
        <div className="lg:col-span-4 flex flex-col h-[500px] lg:h-[650px] bg-[#121622]/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Header */}
          <div className="bg-[#121622] px-5 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">DukaanMitra AI Sandbox</span>
            </div>
            <button 
              onClick={handleSyncData}
              className="text-gray-400 hover:text-white transition-colors"
              title="Force Sheet Sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Chat Logs Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col">
            {chatHistory.map((msg, idx) => {
              if (msg.sender === 'system') {
                return (
                  <div key={idx} className="bg-emerald-950/20 border border-emerald-500/10 p-3 rounded-2xl text-[10px] font-mono text-emerald-400 leading-relaxed self-center w-full">
                    {msg.text}
                  </div>
                );
              }
              const isAI = msg.sender === 'bot';
              return (
                <div key={idx} className={`flex flex-col max-w-[85%] ${isAI ? 'self-start' : 'self-end items-end'}`}>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isAI ? 'bg-[#1c2234] text-white rounded-tl-none border border-white/5' : 'bg-emerald-500 text-emerald-950 font-medium rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}
            {chatLoading && (
              <div className="self-start bg-[#1c2234] border border-white/5 p-3 rounded-2xl flex items-center space-x-1.5 w-16">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendPrompt} className="p-3 bg-[#121622] border-t border-white/5 flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask simulator 'Check stock of bread'..."
              className="flex-1 bg-[#1a2032] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 p-2.5 rounded-xl transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
