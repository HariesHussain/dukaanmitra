import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';

const plans = [
  {
    name: "Sandbox Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for testing DukaanMitra and setting up your Google Sheets catalog template.",
    features: [
      "Visual web chat simulator playground",
      "Connect 1 Google Sheet database",
      "Manual stock toggle manager",
      "Standard Gemini 1.5 Flash models",
      "Basic inventory lookup tools",
      "Community support"
    ],
    cta: "Launch Demo Console",
    popular: false,
    highlight: false
  },
  {
    name: "Merchant Pro",
    price: "₹999",
    period: "month",
    description: "Connect your real WhatsApp number and run your shop automatically 24 hours a day.",
    features: [
      "Everything in Sandbox Free",
      "Connect your real WhatsApp Business API",
      "Live customer order processing",
      "Instant UPI QR & Payment Links generation",
      "Robust custom safety guardrails",
      "Sync orders to Sheet immediately",
      "Gemini 1.5 Pro model support",
      "Priority 24/7 technical support"
    ],
    cta: "Get Pro Access",
    popular: true,
    highlight: true
  }
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 px-6 md:px-12 bg-[#0b0f19] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Simple Transparent Pricing</span>
          <h2 className="font-serif-display text-3xl md:text-5xl text-white font-medium mt-3 leading-tight">
            Plans built to scale with your shop.
          </h2>
          <p className="text-gray-400 mt-4 text-base md:text-lg">
            Start testing in the Sandbox mode for free. Upgrade to Merchant Pro only when you are ready to link your official WhatsApp Business line.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`p-8 rounded-3xl border flex flex-col justify-between relative ${
                plan.highlight 
                  ? 'bg-gradient-to-b from-[#14281c] to-[#0c1a11] border-emerald-500/30 shadow-[0_15px_40px_rgba(16,185,129,0.15)]' 
                  : 'bg-[#121622]/40 border-white/5 hover:bg-[#121622]/80 transition-colors'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-emerald-500 text-emerald-950 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                  Popular Choice
                </span>
              )}

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{plan.name}</span>
                <div className="flex items-baseline space-x-1.5 mt-4 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">{plan.description}</p>

                <hr className="border-white/5 mb-8" />

                {/* Features list */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-3 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  if (plan.highlight) {
                    navigate('/signup');
                  } else {
                    // Quick login & sandbox launch
                    navigate('/login');
                  }
                }}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  plan.highlight 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:scale-[1.02]' 
                    : 'bg-white/10 hover:bg-white/15 border border-white/10 text-white hover:scale-[1.02]'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
