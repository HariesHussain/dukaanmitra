import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function Problems() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Automatically track if the struggles section is visible in viewport
  const isSectionInView = useInView(sectionRef, { amount: 0.15 });

  useEffect(() => {
    // If user has unmuted the video but scrolls away, auto-mute it
    if (!isSectionInView && !isMuted) {
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
      setIsMuted(true);
    }
  }, [isSectionInView, isMuted]);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <section ref={sectionRef} id="struggles" className="py-32 px-6 md:px-12 bg-[#FCFAF6] border-t border-[#042F21]/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Large Autoplay Documentary Loop Video with Viewport Reveal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden border border-[#042F21]/10 shadow-xl relative group bg-[#EFF2EB] hover:scale-[1.01] transition-transform duration-500">
              <video
                ref={videoRef}
                src="/kirana_documentary.mp4"
                poster="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000"
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover grayscale-[15%] brightness-95"
              />
              <div className="absolute inset-0 bg-[#042F21]/5 pointer-events-none"></div>

              {/* Floating Mute/Unmute Control overlay */}
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer shadow-lg"
                title={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#10B981]" />
                )}
              </button>
            </div>
            
            <p className="text-[10px] uppercase tracking-wider text-[#042F21]/50 font-bold mt-3 text-left pl-2">
              Kirana Retail Documentary • Muted Loop • Click to Unmute
            </p>
          </motion.div>

          {/* Right Side: Editorial story with Staggered Scroll Reveal */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-6 flex flex-col space-y-8 text-left"
          >
            <motion.span variants={itemVariants} className="text-xs font-bold text-[#10B981] uppercase tracking-widest">
              The Grocery Struggle
            </motion.span>
            
            <motion.h2 variants={itemVariants} className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#042F21] font-medium leading-[1.1] tracking-tight">
              Running a local store shouldn't feel this chaotic.
            </motion.h2>
            
            <motion.div variants={itemVariants} className="space-y-6 text-[#4B5563] text-base sm:text-lg leading-relaxed font-normal font-sans">
              <p>
                Every morning, independent Kirana store owners open their doors to a flood of phone calls, catalog pings, inventory checklists, and long checkout queues. Copy-pasting pricing tables and manually updating WhatsApp catalogs takes hours of stressful labor that could be spent growing the business.
              </p>
              <p>
                Neighborhood grocery stores are the vital pulse of local communities, yet they are burdened with clunky developer tools or forced to use complex custom apps that regular customers simply refuse to download. They want to message you like a friend, not fill out online forms.
              </p>
              <p>
                DukaanMitra transforms this chaos into order. By putting your entire inventory on a single Google Sheet that anyone can edit and letting an AI agent coordinate checkout messages, we help you keep your catalog synced, confirm orders instantly, and run your neighborhood shop on autopilot.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
