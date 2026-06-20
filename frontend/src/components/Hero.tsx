import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const carouselImages = [
  "/media_127.jpg", // Your store runs itself (First image)
  "/media_092.jpg", // MANAGE EVERYTHING
  "/media_104.jpg", // DELIVERED WITHOUT THE CHAOS
  "/media_116.jpg", // ALWAYS IN STOCK
  "/media_138.jpg"  // ORDER FROM WHATSAPP
];

export default function Hero() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Parallax Scroll Driven Values
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 240]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % carouselImages.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const handleWatchDemo = () => {
    const showcase = document.querySelector('#demo');
    if (showcase) {
      showcase.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleLaunchConsole = () => {
    navigate('/signup');
  };

  return (
    <section className="relative w-full h-screen bg-[#042F21] overflow-hidden select-none">
      
      {/* Background Image Carousel with Parallax & Slow Zoom */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ y }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={carouselImages[currentIdx]}
              alt="Store assistant carousel"
              className="w-full h-full object-cover lg:object-fill"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Invisible Interactive Clickable Overlays */}
      {/* 1. Top-Left Logo click zone */}
      <div 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 md:top-12 md:left-12 w-44 h-12 cursor-pointer z-20 hover:bg-white/5 rounded-lg transition-colors"
        title="DukaanMitra Logo"
      />

      {/* 2. Bottom-Left CTA Button Overlay Zones */}
      <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 flex space-x-4 z-20">
        
        {/* Watch Demo overlay trigger */}
        <div 
          onClick={handleWatchDemo}
          className="w-[140px] h-[48px] sm:w-[155px] sm:h-[50px] cursor-pointer hover:bg-white/5 rounded-xl transition-colors border border-transparent active:scale-[0.98]"
          title="Watch Demo"
        />

        {/* Launch Console / GitHub Code overlay trigger */}
        <div 
          onClick={handleLaunchConsole}
          className="w-[140px] h-[48px] sm:w-[155px] sm:h-[50px] cursor-pointer hover:bg-white/5 rounded-xl transition-colors border border-transparent active:scale-[0.98]"
          title="Launch Console"
        />

      </div>

      {/* Elegant Editorial Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center space-y-2 cursor-pointer"
        onClick={handleWatchDemo}
      >
        <span className="text-[10px] uppercase tracking-widest text-white/50 font-sans font-bold">Scroll to Explore</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1.5 bg-[#042F21]/10 backdrop-blur-xs">
          <motion.div 
            animate={{ 
              y: [0, 12, 0],
            }}
            transition={{ 
              duration: 1.6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-1.5 h-2 bg-[#10B981] rounded-full"
          />
        </div>
      </motion.div>

      {/* Carousel Navigation Dot Indicators */}
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex space-x-2.5">
        {carouselImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIdx === idx ? 'w-8 bg-[#10B981]' : 'w-2.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </section>
  );
}
