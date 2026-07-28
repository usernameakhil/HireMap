// src/Components/Navbar.jsx
import { Bell, Menu, Zap, Brain } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  
  const HIREMAP_LOGO = "/hiremap.jpg"; 

  return (
    <header className="sticky top-0 z-[100] bg-[#09141e] backdrop-blur-2xl border-b border-white/5 h-20 px-6 md:px-10 flex items-center justify-between">
      
      {/* Left: Branded Identity & Menu */}
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar} 
          className="p-3 text-slate-100 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/30 blur-lg rounded-full group-hover:bg-indigo-500/50 transition-all"></div>
            <img 
              src={HIREMAP_LOGO} 
              className="w-12 h-12 rounded-xl relative z-10 border border-white/10 shadow-2xl object-cover transition-transform group-hover:scale-105" 
              alt="HireMap Logo" 
              onError={(e) => { e.target.style.display = 'none'; }} // Fallback if image missing
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
              Hire<span className="text-indigo-500">Map</span>
            </span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">
              Smart Career Guidance
            </span>
          </div>
        </div>
      </div>

      {/* Right: Credits & Profile Identity */}
      <div className="flex items-center gap-8">
        
        {/* Live Credit Display */}
        

        <div className="flex items-center gap-5">
          
          
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-xs font-black text-white uppercase tracking-tight">
                {user?.name || 'Operator'}
              </span>
              
            </div>
            
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;