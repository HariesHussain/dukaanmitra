import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, ArrowRight, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { useApp } from '../App';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login();
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  const handleDemoMode = () => {
    setLoading(true);
    setTimeout(() => {
      login();
      setLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

      <div className="flex items-center space-x-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30">
          <Store className="w-6 h-6 text-emerald-400" />
        </div>
        <span className="text-xl font-bold font-sans tracking-wide text-white">
          Dukaan<span className="text-emerald-400 font-medium">Mitra</span>
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#121622]/40 border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
          <p className="text-xs text-gray-400 mt-1.5">Launch your automated shop and sandbox logs in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Shop Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Patel Provisions"
                className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@patelprovisions.com"
                className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0b0f19] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-emerald-950 font-bold py-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Or Test Instantly</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button
          onClick={handleDemoMode}
          disabled={loading}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 rounded-xl text-sm transition-all duration-300 flex items-center justify-center space-x-2 group hover:scale-[1.01]"
        >
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
          <span>Launch Free Demo Sandbox</span>
        </button>

        <p className="text-center text-xs text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
