import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Github, Star, BookOpen, Terminal, Shield } from 'lucide-react';

// Count-up helper component for editorial numbers
function CountUp({ to, duration = 1.8 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = to;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    let timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 25 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function OpenSource() {
  const navigate = useNavigate();

  return (
    <section id="open-source" className="py-32 px-6 md:px-12 bg-[#042F21] text-white relative overflow-hidden">
      
      {/* Soft gradient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left column: Text with scroll reveal */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 flex flex-col space-y-6 text-left"
        >
          <span className="text-xs font-bold text-[#86EFAC] uppercase tracking-widest">Built in Public</span>
          
          <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.1] tracking-tight">
            Free Forever. <br />
            Open Source.
          </h2>
          
          <p className="text-gray-300 text-base leading-relaxed max-w-lg font-sans">
            DukaanMitra is open source and free. We believe neighborhood merchants shouldn't pay recurring subscription fees to big tech companies just to take orders. Host it yourself, link it to your Google Sheet, and customize the Gemini agent code.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/signup')}
              className="bg-[#10B981] hover:bg-[#0E9F6E] text-white font-bold px-7 py-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.15)] active:scale-[0.98]"
            >
              <span>Launch Demo Console</span>
            </button>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-7 py-4 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 active:scale-[0.98]"
            >
              <Github className="w-4.5 h-4.5" />
              <span>Fork GitHub Repo</span>
            </a>
          </div>
        </motion.div>

        {/* Right column: 4 Grid Feature cards with Staggered Scroll Reveal */}
        <div className="lg:col-span-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left flex flex-col justify-between h-44 transition-all duration-350"
            >
              <Star className="w-5 h-5 text-[#86EFAC]" />
              <div>
                <h4 className="text-2xl font-bold font-sans">
                  <CountUp to={1200} />+
                </h4>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">GitHub Stars</p>
              </div>
            </motion.div>

            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left flex flex-col justify-between h-44 transition-all duration-350"
            >
              <BookOpen className="w-5 h-5 text-[#86EFAC]" />
              <div>
                <h4 className="text-lg font-bold font-sans">Documentation</h4>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Step-by-step guides</p>
              </div>
            </motion.div>

            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left flex flex-col justify-between h-44 transition-all duration-350"
            >
              <Terminal className="w-5 h-5 text-[#86EFAC]" />
              <div>
                <h4 className="text-lg font-bold font-sans">FastAPI Proxy</h4>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Fast backend scripts</p>
              </div>
            </motion.div>

            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left flex flex-col justify-between h-44 transition-all duration-350"
            >
              <Shield className="w-5 h-5 text-[#86EFAC]" />
              <div>
                <h4 className="text-lg font-bold font-sans">MIT License</h4>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Permissive & open</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
