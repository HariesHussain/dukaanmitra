import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useApp } from '../App';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Struggles', href: '#struggles' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Product Demo', href: '#demo' },
    { name: 'Open Source', href: '#open-source' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#10B981] origin-[0%] z-[60]"
        style={{ scaleX: scrollYProgress }}
      />

      <nav 
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 flex justify-between items-center transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#FCFAF6]/90 backdrop-blur-md border-b border-[#042F21]/10 shadow-sm py-4' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        {/* Logo: Fades/Slides in smoothly when scrolled */}
        <motion.div 
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={isScrolled ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center space-x-3 cursor-pointer"
          style={{ pointerEvents: isScrolled ? 'auto' : 'none' }}
        >
          <div className="bg-[#042F21]/10 p-2 rounded-xl border border-[#042F21]/20">
            <svg className="w-6 h-6 text-[#042F21]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35,20 H65 C80,20 90,32 90,50 C90,68 80,80 65,80 H35 Z" fill="currentColor" />
              <path d="M50,34 H63 C70,34 74,39 74,50 C74,61 70,66 63,66 H50 Z" fill="#FCFAF6" />
              <path d="M12,48 L32,68 L56,40" fill="none" stroke="#10B981" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-bold font-sans tracking-wide text-[#042F21] flex items-center">
            Dukaan<span className="text-[#10B981] font-medium">Mitra</span>
          </span>
        </motion.div>

        {/* Navigation Links: Floating protective pill when transparent, plain when scrolled */}
        <div className="hidden lg:flex items-center">
          <div 
            className={`flex items-center space-x-8 transition-all duration-500 ${
              isScrolled 
                ? 'bg-transparent border-transparent px-0 py-0' 
                : 'bg-[#FCFAF6]/85 backdrop-blur-md border border-[#042F21]/10 px-6 py-2.5 rounded-full shadow-sm'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                className="text-sm font-bold text-[#042F21]/80 hover:text-[#042F21] transition-colors duration-300 relative py-1.5 px-3 rounded-full"
              >
                <span className="relative z-10">{link.name}</span>
                {hoveredLink === link.name && (
                  <motion.span
                    layoutId="navHoverUnderline"
                    className="absolute inset-0 bg-[#042F21]/5 rounded-full z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation buttons: Highlighted and green, with translucent backplate when transparent */}
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#10B981] hover:bg-[#0E9F6E] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 group shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:scale-[1.02]"
            >
              <span>Merchant Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div 
              className={`flex items-center space-x-4 transition-all duration-500 ${
                isScrolled 
                  ? 'bg-transparent border-transparent px-0 py-0'
                  : 'bg-[#FCFAF6]/80 backdrop-blur-sm border border-[#042F21]/5 p-1.5 rounded-2xl shadow-sm'
              }`}
            >
              <Link 
                to="/login" 
                className="text-sm font-bold text-[#042F21] hover:text-[#064E3B] px-4 py-2 hover:bg-[#042F21]/5 rounded-xl transition-all"
              >
                Sign In
              </Link>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-[#10B981] hover:bg-[#0E9F6E] text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-[#042F21] hover:text-[#064E3B] bg-[#FCFAF6]/90 p-2 rounded-xl border border-[#042F21]/15 shadow-sm">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-[72px] left-0 w-full bg-[#FCFAF6] border-b border-[#042F21]/10 p-6 flex flex-col space-y-6 z-40 shadow-xl"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-lg font-bold text-[#042F21] hover:text-[#10B981] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <hr className="border-[#042F21]/10" />
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#10B981] text-white font-bold p-3 rounded-xl flex items-center justify-center space-x-2 w-full"
            >
              <span>Merchant Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-col space-y-4">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="text-center font-bold text-[#042F21] hover:text-[#064E3B] p-3 rounded-xl bg-[#042F21]/5 border border-[#042F21]/10"
              >
                Sign In
              </Link>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  navigate('/signup');
                }}
                className="bg-[#10B981] text-white font-bold p-3 rounded-xl text-center"
              >
                Get Started
              </button>
            </div>
          )}
        </motion.div>
      )}
    </nav>
    </>
  );
}
