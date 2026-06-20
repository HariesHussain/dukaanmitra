import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  // Zoom scale-in and border-radius shrink as it comes into viewport
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["48px", "0px"]);
  const yText = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacityText = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <section 
      ref={containerRef} 
      id="demo" 
      className="relative w-full h-[85vh] bg-[#FCFAF6] overflow-hidden flex flex-col justify-end p-8 sm:p-12 md:p-16 select-none"
    >
      
      {/* Background Autoplay Muted Loop Cinematic Video with scroll expansion */}
      <motion.div 
        style={{ 
          scale, 
          borderRadius,
        }}
        className="absolute inset-0 z-0 w-full h-full overflow-hidden origin-center"
      >
        <video
          src=""
          poster="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover brightness-[45%] contrast-[105%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
      </motion.div>

      {/* Overlay minimal editorial text with Scroll Reveal */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 max-w-2xl text-left text-white space-y-3"
      >
        <span className="text-xs uppercase tracking-widest text-[#86EFAC] font-bold">
          Product Commercial
        </span>
        
        <h3 className="font-serif-display text-2xl sm:text-4xl font-medium tracking-tight leading-tight">
          A seamless bridge between pings and packets.
        </h3>

        <p className="text-gray-300 text-xs sm:text-sm font-light font-sans max-w-md leading-relaxed">
          Watch how neighborhood Kirana stores automate stock checking, invoice creation, and order routing directly over WhatsApp.
        </p>
      </motion.div>

      {/* Floating video spec label with Reveal */}
      <motion.div 
        style={{ opacity: opacityText }}
        className="absolute top-8 right-8 z-10 flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-white/50 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
        <span>Cinema mode • Loop Active</span>
      </motion.div>

    </section>
  );
}
