// src/Components/Navbar.jsx
import { Bell, Menu, Zap, Brain } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  
  const HIREMAP_LOGO = "/hiremap.jpg"; 

  return (
    <header className="sticky top-0 z-[100] bg-white/85 dark:bg-[#09141e]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/5 h-20 px-6 md:px-10 flex items-center justify-between transition-colors duration-200 shadow-sm dark:shadow-none">
      
      {/* Left: Branded Identity & Menu */}
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar} 
          aria-label="Toggle navigation menu"
          className="p-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5 rounded-xl transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/30 blur-md rounded-full group-hover:bg-indigo-500/40 transition-all"></div>
            <img 
              src={HIREMAP_LOGO} 
              className="w-12 h-12 rounded-xl relative z-10 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl object-cover transition-transform group-hover:scale-105" 
              alt="HireMap Logo" 
              onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image missing
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              Hire<span className="text-indigo-600 dark:text-indigo-400">Map</span>
            </span>
            <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] mt-1">
              Smart Career Guidance
            </span>
          </div>
        </div>
      </div>

      {/* Right: Credits, Theme Toggle & Profile Identity */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Theme Toggle Button */}
        <ThemeToggle size="md" />

        <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-white/10">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {user?.name || 'Operator'}
            </span>
            <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              {user?.role || 'Verified'}
            </span>
          </div>
          
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20 ring-1 ring-slate-200 dark:ring-white/20">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;