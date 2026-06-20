import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    num: "01",
    icon: MessageSquare,
    title: "Customer orders",
    description: "Buyers message your store on WhatsApp. They type naturally: 'I want 2L milk and a dozen eggs.' No websites, no shopping cart clicks.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600",
    type: "chat"
  },
  {
    num: "02",
    icon: Search,
    title: "AI checks inventory",
    description: "The AI agent instantly queries your Google Sheet database. It verifies stock levels and locks quantities in real-time.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600",
    type: "sheet"
  },
  {
    num: "03",
    icon: FileText,
    title: "AI creates order",
    description: "The agent generates a UPI invoice link and appends a new order row in the Google Sheets database automatically.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600",
    type: "order"
  },
  {
    num: "04",
    icon: CheckCircle,
    title: "Merchant fulfills",
    description: "You see the confirmed order on your console. Pack the items, hit dispatch, and notify the customer instantly.",
    image: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=600",
    type: "status"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 md:px-12 bg-[#EFF2EB] border-t border-[#042F21]/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with scroll reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-20 text-left"
        >
          <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest">Store Automation Pipeline</span>
          <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#042F21] font-medium mt-3 leading-[1.1] tracking-tight">
            How DukaanMitra automates your store.
          </h2>
          <p className="text-[#4B5563] mt-4 text-base sm:text-lg">
            Four simple steps linking customer WhatsApp pings to your checkout desk in seconds.
          </p>
        </motion.div>

        {/* Staggered Horizontal Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-[#FCFAF6] border border-[#042F21]/5 rounded-3xl p-5 flex flex-col justify-between h-[450px] shadow-sm hover:shadow-xl hover:border-[#10B981]/25 transition-all duration-500 relative group cursor-default overflow-hidden"
            >
              {/* Step Image & Animated Overlay Frame */}
              <div className="w-full h-48 rounded-2xl overflow-hidden relative border border-[#042F21]/5 bg-[#EFF2EB]">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay backdrop shading */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Animated UI Overlay Container */}
                {step.type === 'chat' && (
                  <div className="absolute inset-0 flex flex-col justify-end p-2.5">
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="bg-white/95 backdrop-blur-xs text-gray-800 rounded-xl rounded-bl-none p-2 shadow-md text-left max-w-[85%]"
                    >
                      <p className="text-[7px] leading-tight font-sans font-bold text-[#042F21]">Customer</p>
                      <p className="text-[9px] font-sans text-gray-700 font-medium mt-0.5">🛒 Need 2L Milk and Bread...</p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 1.0, duration: 0.4 }}
                      className="bg-[#D1FAE5]/95 backdrop-blur-xs text-gray-800 rounded-xl rounded-br-none p-2 shadow-md text-left max-w-[85%] self-end mt-1.5"
                    >
                      <p className="text-[7px] leading-tight font-sans font-bold text-[#065F46]">DukaanMitra AI</p>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <span className="text-[9px] font-sans text-gray-700">Checking stock...</span>
                        <motion.span 
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="text-[9px] font-sans"
                        >💬</motion.span>
                      </div>
                    </motion.div>
                  </div>
                )}

                {step.type === 'sheet' && (
                  <div className="absolute inset-0 flex items-center justify-center p-2.5">
                    <motion.div 
                      initial={{ scale: 0.92, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="bg-white/95 backdrop-blur-xs border border-[#042F21]/10 rounded-xl p-2 w-full shadow-lg text-[8px] font-mono text-gray-700"
                    >
                      <div className="grid grid-cols-3 border-b border-gray-200 pb-1 text-gray-400 font-bold">
                        <span>Product</span>
                        <span>Stock</span>
                        <span>Price</span>
                      </div>
                      <div className="grid grid-cols-3 pt-1 border-b border-gray-100">
                        <span>Bread</span>
                        <span className="text-[#10B981]">14</span>
                        <span>₹45</span>
                      </div>
                      <motion.div 
                        animate={{ 
                          backgroundColor: ["rgba(16,185,129,0)", "rgba(16,185,129,0.12)", "rgba(16,185,129,0)"] 
                        }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="grid grid-cols-3 py-0.5 border-b border-[#10B981]/15 font-bold text-[#042F21]"
                      >
                        <span>Milk 1L</span>
                        <span className="text-red-500 font-bold">22➔20</span>
                        <span>₹60</span>
                      </motion.div>
                    </motion.div>
                  </div>
                )}

                {step.type === 'order' && (
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      whileInView={{ scale: 1, opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
                      className="bg-white/95 backdrop-blur-xs rounded-xl shadow-xl p-2.5 border border-gray-100 w-full text-left"
                    >
                      <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                        <span className="text-[8px] font-mono text-gray-400">INVOICE #1001</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[7px] font-bold px-1.5 py-0.25 rounded-full">APPROVED</span>
                      </div>
                      <div className="py-1">
                        <span className="text-[7px] text-gray-400 block">TOTAL AMOUNT</span>
                        <span className="text-xs font-bold text-[#042F21]">₹165.00</span>
                      </div>
                      <div className="bg-[#EFF2EB] rounded-lg p-1 flex items-center justify-between text-[7px] text-gray-600">
                        <span>UPI QR Generated</span>
                        <span className="bg-[#10B981] text-white font-bold px-1.5 py-0.25 rounded text-[6px]">Link Sent</span>
                      </div>
                    </motion.div>
                  </div>
                )}

                {step.type === 'status' && (
                  <div className="absolute inset-0 flex items-center justify-center p-2.5">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/95 backdrop-blur-xs rounded-xl shadow-xl p-2 w-full text-left flex items-center space-x-2 border border-gray-100"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#10B981]/15 flex items-center justify-center text-[#10B981]">
                        <motion.div
                          animate={{ 
                            x: [-2, 2, -2] 
                          }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                          className="text-xs"
                        >
                          🚚
                        </motion.div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] font-bold text-[#042F21] block truncate">Dispatched Cargo</span>
                        <span className="text-[7px] text-gray-400 block truncate">Route active • ETA 8 mins</span>
                        <div className="w-full bg-gray-150 h-0.75 rounded-full mt-1 overflow-hidden">
                          <motion.div 
                            initial={{ width: "10%" }}
                            whileInView={{ width: "85%" }}
                            viewport={{ once: false }}
                            transition={{ duration: 2.8, repeat: Infinity }}
                            className="h-full bg-[#10B981]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

              </div>

              {/* Text Info */}
              <div className="text-left mt-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#10B981] uppercase tracking-wider">Step {step.num}</span>
                    <step.icon className="w-4 h-4 text-[#042F21]/30" />
                  </div>
                  <h3 className="font-serif-display text-xl text-[#042F21] font-semibold mt-2.5">
                    {step.title}
                  </h3>
                  <p className="text-[#4B5563] text-xs leading-relaxed mt-2 font-normal font-sans">
                    {step.description}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
