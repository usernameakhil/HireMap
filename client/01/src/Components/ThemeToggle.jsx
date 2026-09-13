import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';

const ThemeToggle = ({ className = '', size = 'md', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'p-2 rounded-lg text-xs',
    md: 'p-2.5 rounded-xl text-sm',
    lg: 'p-3 rounded-2xl text-base'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative inline-flex items-center gap-2 font-semibold transition-all duration-300 ease-out active:scale-90
        ${sizeClasses[size] || sizeClasses.md}
        ${isDark 
          ? 'bg-slate-800/80 text-amber-300 hover:text-amber-200 hover:bg-slate-800 border border-slate-700/80 shadow-sm shadow-indigo-950/20' 
          : 'bg-white text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow'
        }
        ${className}
      `}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun 
            size={iconSizes[size] || 18} 
            className="transition-transform duration-500 rotate-0 hover:rotate-45 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]" 
          />
        ) : (
          <Moon 
            size={iconSizes[size] || 18} 
            className="transition-transform duration-500 -rotate-12 hover:rotate-0 text-slate-700" 
          />
        )}
      </div>

      {showLabel && (
        <span className="text-xs uppercase font-black tracking-widest leading-none">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
