import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const reviews = [
  {
    quote: "I set up DukaanMitra in 10 minutes. My regular customers love ordering over WhatsApp. The milk stocks are always right on the dot now!",
    author: "Ramesh Patel",
    business: "Patel Provisions, Mumbai",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    cols: "lg:col-span-4"
  },
  {
    quote: "No complex billing apps to teach my staff. The service coordinates with my Google Sheets table automatically.",
    author: "Ananya Gupta",
    business: "Gupta Daily Needs, Delhi",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    cols: "lg:col-span-4"
  },
  {
    quote: "DukaanMitra handles our WhatsApp ordering line 24 hours a day. Our checkout queue has cut down by half.",
    author: "Baldev Singh",
    business: "Singh & Sons Grocery, Amritsar",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    cols: "lg:col-span-4"
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
  hidden: (rotation: number) => ({ 
    opacity: 0, 
    y: 40,
    rotate: rotation 
  }),
  visible: { 
    opacity: 1, 
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-32 px-6 md:px-12 bg-[#FCFAF6] border-t border-[#042F21]/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-20 text-left"
        >
          <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest">Store Owner Feedback</span>
          <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#042F21] font-medium mt-3 leading-[1.1] tracking-tight">
            Trusted by neighborhood grocers.
          </h2>
          <p className="text-[#4B5563] mt-4 text-base sm:text-lg">
            See how neighborhood Kirana shops and local grocery stores use DukaanMitra to save hours of manual chat updates.
          </p>
        </motion.div>

        {/* Testimonials Grid with Large Merchant Photos and Asymmetrical Staggered Reveal */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {reviews.map((rev, index) => {
            const rot = index === 0 ? -1.5 : index === 1 ? 1.5 : -1;
            return (
              <motion.div
                key={index}
                custom={rot}
                variants={cardVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02, 
                  rotate: index === 0 ? -0.5 : index === 1 ? 0.5 : -0.2 
                }}
                className={`bg-[#EFF2EB] border border-[#042F21]/5 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 group ${rev.cols}`}
              >
                {/* Photo section */}
                <div className="w-full h-64 overflow-hidden relative">
                  <img 
                    src={rev.image} 
                    alt={rev.author}
                    className="w-full h-full object-cover grayscale-[70%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#EFF2EB] via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Quote details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6 text-left">
                  <p className="font-serif-display text-xl text-[#042F21] italic leading-relaxed relative">
                    <Quote className="w-8 h-8 text-[#10B981]/15 absolute -top-4 -left-4 pointer-events-none" />
                    "{rev.quote}"
                  </p>

                  <div className="pt-4 border-t border-[#042F21]/10">
                    <h4 className="font-bold text-[#042F21] text-sm">{rev.author}</h4>
                    <p className="text-xs text-[#4B5563] mt-0.5">{rev.business}</p>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
