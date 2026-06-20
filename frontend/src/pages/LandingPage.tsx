import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problems from '../components/Problems';
import HowItWorks from '../components/HowItWorks';
import VideoShowcase from '../components/VideoShowcase';
import OpenSource from '../components/OpenSource';
import CtaSection from '../components/CtaSection';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FCFAF6] text-[#1F2937]">
      <Navbar />
      <Hero />
      <Problems />
      <HowItWorks />
      <VideoShowcase />
      <Testimonials />
      <OpenSource />
      <CtaSection />
      <Footer />
    </div>
  );
}
