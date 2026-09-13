import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Swords, Sparkles, X, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Championship = () => {
  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-[#09141e] text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/20 overflow-hidden relative flex items-center justify-center transition-colors duration-200">

      {/* --- EXIT BUTTON --- */}
      <Link to="/" className="fixed top-8 right-8 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-2xl hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-md z-[100] active:scale-95 backdrop-blur-xl">
        <X size={22} />
      </Link>

      {/* --- MAIN CENTER CONSOLE --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl p-8 sm:p-12 text-center"
      >
        <div className="space-y-10">
            
            {/* Animated Trophy Icon */}
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[50px] rounded-full animate-pulse" />
                <motion.div 
                    animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 bg-white dark:bg-[#030712]/80 border border-slate-200 dark:border-indigo-500/30 rounded-[2.5rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xl mx-auto backdrop-blur-2xl"
                >
                    <Trophy size={54} strokeWidth={1.5} />
                    <div className="absolute -top-2 -right-2 bg-rose-500 p-2 rounded-xl border-4 border-slate-50 dark:border-[#09141e] shadow-md">
                        <Lock size={14} className="text-white" />
                    </div>
                </motion.div>
            </div>

            {/* Typography Section */}
            <div className="space-y-3">
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                    Hire<span className="text-indigo-600 dark:text-indigo-400">Cup</span>
                </h1>
            </div>

            {/* COMING SOON STATUS BAR */}
            <div className="max-w-md mx-auto space-y-6">
                <div className="bg-white dark:bg-[#030712]/60 border border-slate-200/90 dark:border-white/5 p-8 sm:p-10 rounded-[3rem] backdrop-blur-3xl shadow-sm hover:shadow-md dark:shadow-2xl relative overflow-hidden">
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Coming <span className="text-indigo-600 dark:text-indigo-400">Soon</span></h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                        Competitive resume battling and real-time coding challenges are currently undergoing development.
                    </p>
                </div>

                <Link to="/StudentDashboard" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white font-bold uppercase text-[11px] tracking-[0.3em] transition-all">
                    Return to Dashboard
                </Link>
            </div>

        </div>
      </motion.div>

    </div>
  );
};

export default Championship;