import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function CtaSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Parallax translation for the merchant image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const yImage = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  const handleWatchDemo = () => {
    const element = document.querySelector('#demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-6 md:px-12 bg-[#FCFAF6] border-t border-[#042F21]/5 relative overflow-hidden"
    >
      
      {/* Background shape */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#10B981]/5 blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto bg-[#EFF2EB] rounded-3xl border border-[#042F21]/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left Side: Text and CTAs with Viewport Slide-In */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-6 text-left"
        >
          <motion.span variants={itemVariants} className="text-xs font-bold text-[#10B981] uppercase tracking-widest">
            Focus on Your Customers
          </motion.span>
          
          <motion.h2 variants={itemVariants} className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#042F21] font-medium leading-[1.1] tracking-tight">
            Spend less time answering messages. <br className="hidden md:block" />
            More time growing your business.
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-[#4B5563] text-base leading-relaxed max-w-lg font-sans">
            Let DukaanMitra handle catalog queries, checkout calculations, and order receipts automatically. Spend your days greeting neighbors and expanding your inventory.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/signup')}
              className="bg-[#042F21] hover:bg-[#064E3B] text-white font-bold px-8 py-4.5 rounded-xl text-xs transition-all duration-300 flex items-center justify-center space-x-1.5 shadow-[0_4px_12px_rgba(4,47,33,0.15)] active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleWatchDemo}
              className="bg-white hover:bg-gray-50 text-[#042F21] border border-[#042F21]/15 font-bold px-8 py-4.5 rounded-xl text-xs transition-all duration-300 flex items-center justify-center space-x-1.5 active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-[#042F21]" />
              <span>Watch Demo Video</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side: Natural Photography with Pan Scroll Parallax */}
        <div className="lg:col-span-5 w-full min-h-[350px] lg:min-h-[450px] relative overflow-hidden">
          <motion.img 
            style={{ y: yImage }}
            src="https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?q=80&w=800"
            alt="Smiling shop owner"
            className="absolute inset-0 w-full h-[120%] object-cover grayscale-[10%] brightness-95 origin-center"
          />
          {/* Subtle gradient overlay to blend into the left background */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#EFF2EB]/80 via-transparent to-transparent pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
}
