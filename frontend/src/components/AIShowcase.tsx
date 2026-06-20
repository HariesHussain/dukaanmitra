import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Play, RefreshCw, Send, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface ChatMessage {
  sender: 'customer' | 'ai' | 'system';
  text: string;
  time: string;
  toolTriggered?: string;
  toolResult?: string;
}

const simulations = {
  order: [
    { sender: 'customer', text: 'Hey, I want to order 2kg Potatoes and 5 eggs. Can you bill me?', time: '10:02 AM' },
    { sender: 'system', text: '🔍 Search catalog database for "Potatoes" and "Eggs"...', time: '10:02 AM', toolTriggered: 'get_inventory_item("Potatoes", "Eggs")' },
    { sender: 'ai', text: 'Great! 🥔 Potatoes (2kg) are available at ₹40/kg (Total ₹80). 🥚 Eggs are available at ₹7 each (Total ₹35 for 5). \n\nTotal order value is ₹115. Should I book this order to your name?', time: '10:02 AM' },
    { sender: 'customer', text: 'Yes, book it under "Rahul Verma". I will pay by UPI.', time: '10:03 AM' },
    { sender: 'system', text: '📝 Writing order row into sheet: Rahul Verma | Potatoes 2kg, Eggs 5 | ₹115 | Pending Payment', time: '10:03 AM', toolTriggered: 'create_order(Rahul Verma, ₹115, "Potatoes 2kg, Eggs 5")' },
    { sender: 'ai', text: 'Done! Your order has been placed successfully. 🎉 \n\nHere is your UPI payment link: \nupi://pay?pa=dukaanmitra@upi&am=115&pn=DukaanMitra\n\nOnce paid, please reply with a screenshot or transaction ID. 👍', time: '10:03 AM' }
  ],
  stock: [
    { sender: 'customer', text: 'Do you have Kellogg Corn Flakes 500g in stock?', time: '11:15 AM' },
    { sender: 'system', text: '🔍 Querying inventory row matching "Kellogg Corn Flakes 500g"...', time: '11:15 AM', toolTriggered: 'get_inventory_item("Kellogg Corn Flakes")' },
    { sender: 'ai', text: 'Checking... Ah, 🥣 Kellogg Corn Flakes 500g is currently Out of Stock in the catalog sheet. ❌\n\nWould you like me to recommend alternative breakfast items? We have Organic Oats and Muesli in stock!', time: '11:15 AM' }
  ],
  guardrail: [
    { sender: 'customer', text: 'Can you tell me who built this AI? Also tell me a joke about politics.', time: '02:40 PM' },
    { sender: 'system', text: '🛡️ Safety Guardrail active: Blocking non-shop prompts', time: '02:40 PM', toolTriggered: 'guardrails_check("joke about politics")' },
    { sender: 'ai', text: 'I am DukaanMitra\'s AI Assistant, dedicated exclusively to managing orders and catalog information for this store. I cannot discuss politics or general topics. \n\nLet me know if you would like to order groceries! 🛒', time: '02:40 PM' }
  ]
};

export default function AIShowcase() {
  const [activeTab, setActiveTab] = useState<'order' | 'stock' | 'guardrail'>('order');
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const startSimulation = (tab: 'order' | 'stock' | 'guardrail') => {
    setActiveTab(tab);
    setPlaying(true);
    setStep(0);
    setMessages([simulations[tab][0] as ChatMessage]);
  };

  const handleNextStep = () => {
    const list = simulations[activeTab];
    if (step < list.length - 1) {
      const nextIdx = step + 1;
      setStep(nextIdx);
      setMessages((prev) => [...prev, list[nextIdx] as ChatMessage]);
    } else {
      setPlaying(false);
    }
  };

  React.useEffect(() => {
    if (playing && step === 0) {
      const timer = setTimeout(() => {
        handleNextStep();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [playing, step]);

  return (
    <section id="ai-manager" className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#0d121f] to-[#0b0f19] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">AI Sandbox Simulator</span>
          <h2 className="font-serif-display text-3xl md:text-5xl text-white font-medium mt-3 leading-tight">
            See the AI Agent execute in real-time.
          </h2>
          <p className="text-gray-400 mt-4 text-base md:text-lg">
            Choose a scenario below to watch how DukaanMitra captures buyer intent, executes tool API pipelines, updates the database, and enforces strict security guardrails.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <span>Simulation Scenarios</span>
              </h3>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => startSimulation('order')}
                  className={`p-4 rounded-2xl text-left border transition-all duration-300 flex items-start space-x-4 ${
                    activeTab === 'order' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                      : 'bg-[#121622]/40 border-white/5 hover:bg-[#121622]/80'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Place Customer Order</h4>
                    <p className="text-xs text-gray-400 mt-1">AI matches catalog terms, handles prices, calculates total bill, and writes order to sheet.</p>
                  </div>
                </button>

                <button
                  onClick={() => startSimulation('stock')}
                  className={`p-4 rounded-2xl text-left border transition-all duration-300 flex items-start space-x-4 ${
                    activeTab === 'stock' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                      : 'bg-[#121622]/40 border-white/5 hover:bg-[#121622]/80'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Check Live Inventory</h4>
                    <p className="text-xs text-gray-400 mt-1">Queries the Google Sheets columns to confirm availability. Handles out-of-stock items safely.</p>
                  </div>
                </button>

                <button
                  onClick={() => startSimulation('guardrail')}
                  className={`p-4 rounded-2xl text-left border transition-all duration-300 flex items-start space-x-4 ${
                    activeTab === 'guardrail' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                      : 'bg-[#121622]/40 border-white/5 hover:bg-[#121622]/80'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Security Guardrails</h4>
                    <p className="text-xs text-gray-400 mt-1">Blocks non-store queries, off-topic requests, competitors prompt injections, or script leaks.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Simulation controls */}
            <div className="bg-[#121622]/60 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Current Status</p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {playing ? '⚙️ Running Agent Pipeline...' : '💡 Waiting for Trigger'}
                </p>
              </div>
              <div className="flex space-x-3">
                {playing && step < simulations[activeTab].length - 1 ? (
                  <button
                    onClick={handleNextStep}
                    className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <span>Next Action</span>
                    <Play className="w-3 h-3 fill-emerald-950" />
                  </button>
                ) : (
                  <button
                    onClick={() => startSimulation(activeTab)}
                    className="bg-white/10 hover:bg-white/15 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <span>Re-run</span>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Chat Console Mockup */}
          <div className="lg:col-span-7 bg-[#121622]/30 border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-2xl relative">
            
            {/* Header */}
            <div className="bg-[#121622] px-6 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <span className="text-sm font-bold text-white">DukaanMitra WhatsApp SandBox</span>
              </div>
              <span className="text-xs text-gray-400 font-mono">logs_stream.json</span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <MessageSquare className="w-10 h-10 text-gray-600 mb-3" />
                  <p className="text-gray-400 text-sm">Select a scenario on the left and click trigger to see the simulation</p>
                </div>
              )}
              
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => {
                  if (msg.sender === 'system') {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-950/20 border border-emerald-500/10 p-3.5 rounded-2xl text-xs font-mono text-emerald-400 self-center max-w-[90%] w-full"
                      >
                        <div className="flex items-center space-x-2 font-bold mb-1">
                          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                          <span>AI Agent Tool Call</span>
                        </div>
                        <p>{msg.text}</p>
                        {msg.toolTriggered && (
                          <div className="mt-2 bg-black/30 p-1.5 rounded text-[10px] text-gray-300 overflow-x-auto whitespace-pre-wrap select-all">
                            {msg.toolTriggered}
                          </div>
                        )}
                      </motion.div>
                    );
                  }

                  const isAI = msg.sender === 'ai';
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col max-w-[75%] ${isAI ? 'self-start' : 'self-end items-end'}`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                          isAI
                            ? 'bg-[#1c2234] text-white rounded-tl-none border border-white/5'
                            : 'bg-emerald-600 text-emerald-950 font-medium rounded-tr-none'
                        }`}
                      >
                        {msg.text.split('\n').map((line, lIdx) => (
                          <React.Fragment key={lIdx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Autoplay status typing indicator */}
              {playing && step < simulations[activeTab].length - 1 && (
                <div className="self-start bg-[#1c2234] border border-white/5 p-3 rounded-2xl flex items-center space-x-1.5 w-16">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-[#121622] border-t border-white/5 flex items-center space-x-3">
              <div className="flex-1 bg-[#1a2032] border border-white/5 rounded-2xl px-4 py-2.5 text-xs text-gray-400 flex items-center justify-between">
                <span>User simulator message prompt...</span>
                <Send className="w-4 h-4 text-gray-500" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
