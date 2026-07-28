import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Swords, Sparkles, X, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Championship = () => {
  return (
    <div className="h-screen w-full bg-[#09141e] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative flex items-center justify-center">
      
      {/* --- GRID BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0" style={{ 
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* --- EXIT BUTTON --- */}
      <Link to="/" className="fixed top-8 right-8 p-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl hover:text-white hover:bg-white/10 transition-all shadow-xl z-[100] active:scale-90 backdrop-blur-xl">
        <X size={24} />
      </Link>

      {/* --- MAIN CENTER CONSOLE --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl p-12 text-center"
      >
        <div className="space-y-12">
            
            {/* Animated Trophy Icon */}
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse" />
                <motion.div 
                    animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-32 h-32 bg-[#030712]/80 border border-indigo-500/30 rounded-[2.5rem] flex items-center justify-center text-indigo-400 shadow-2xl mx-auto backdrop-blur-2xl"
                >
                    <Trophy size={60} strokeWidth={1.5} />
                    <div className="absolute -top-2 -right-2 bg-rose-500 p-2 rounded-xl border-4 border-[#09141e] shadow-lg">
                        <Lock size={16} className="text-white" />
                    </div>
                </motion.div>
            </div>

            {/* Typography Section */}
            <div className="space-y-4">
                
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none">
                    Hire<span className="text-indigo-500">Cup</span>
                </h1>
                
            </div>

            {/* COMING SOON STATUS BAR */}
            <div className="max-w-md mx-auto space-y-8">
                <div className="bg-[#030712]/60 border border-white/5 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Coming <span className="text-indigo-500">Soon</span></h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        Competitive resume battling and real-time coding challenges are currently undergoing 
                    </p>

                    
                </div>

                <Link to="/StudentDashboard" className="inline-flex items-center gap-3 text-slate-500 hover:text-white font-black uppercase text-[10px] tracking-[0.4em] transition-all group">
                    
                    Return 
                </Link>
            </div>

        </div>
      </motion.div>

      

    </div>
  );
};

export default Championship;