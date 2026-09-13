import React, { useState } from 'react';
import { 
  MapPin, DollarSign, FileText, CheckCircle2, Zap, 
  Clock, Globe, ArrowUpRight, ShieldCheck, X 
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';

const JobCard = ({ job, onApply, isApplied }) => { 
  const navigate = useNavigate(); 
  const [showFullDesc, setShowFullDesc] = useState(false); // Modal state

  if (!job) return null;

  const {
    title = "Untitled Role",
    company = "Unknown Identity",
    type = "Full-time",
    mode = "Remote",
    salary = "Negotiable",
    address = "Global Sector",
    description = "",
    website = "#",
    expiresAt
  } = job;

  const getDaysRemaining = (expiryDate) => {
    const remaining = new Date(expiryDate) - new Date();
    const days = Math.ceil(remaining / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}D Left` : "Expiring Soon";
  };

  const handleAnalyzeClick = () => {
    const formattedJobText = `Role: ${title}\nEntity: ${company}\nBriefing: ${description}`.trim();
    navigate('/HireFit', { state: { jobDescription: formattedJobText } });
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }}
        className="relative bg-white dark:bg-[#111827]/70 border border-slate-200/80 dark:border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-indigo-400/60 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-md dark:shadow-none transition-all group flex flex-col h-full overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/15 transition-all pointer-events-none" />

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform shadow-sm dark:shadow-none">
              {company.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                <ShieldCheck size={12} className="text-indigo-600 dark:text-indigo-400" /> {company}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              {type}
            </span>
            <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 uppercase tracking-widest">
              <Clock size={10} /> {getDaysRemaining(expiresAt)}
            </span>
          </div>
        </div>

        {/* Truncated Description */}
        <div className="mb-6 relative">
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium italic line-clamp-3">
            "{description}"
          </p>
          <button 
            onClick={() => setShowFullDesc(true)}
            className="mt-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-700 dark:hover:text-white transition-colors underline underline-offset-4"
          >
            See More Detail
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-slate-100 dark:border-white/5 mt-auto">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Deployment Zone</p>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-[11px]">
              <MapPin size={12} className="text-indigo-600 dark:text-indigo-400" /> {address}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Operational Mode</p>
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-[11px]">
              <Zap size={12} className="text-amber-500" /> {mode}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Compensation</p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              <DollarSign size={12} /> {salary}
            </div>
          </div>
          <div className="space-y-1 text-right flex flex-col items-end">
            <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sync Website</p>
            <a href={website} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white transition-colors">
              <Globe size={14} />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 relative z-10">
          <button 
            onClick={handleAnalyzeClick}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-white dark:hover:text-black transition-all"
          >
            <FileText size={14} />
            Analyze
          </button>

          {isApplied ? (
            <button disabled className="flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-not-allowed">
              <CheckCircle2 size={14} /> Enlisted
            </button>
          ) : (
            <button onClick={onApply} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2">
              Apply Now <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </motion.div>

      {/* --- DESCRIPTION POPUP MODAL --- */}
      <AnimatePresence>
        {showFullDesc && (
          <div className="fixed inset-0 flex items-center justify-center p-6 z-[200]">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowFullDesc(false)}
              className="absolute inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-[3rem] w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl relative z-10 flex flex-col text-slate-900 dark:text-white"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/70 dark:bg-white/5">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">Job Briefing</h3>
                  <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">{title} @ {company}</p>
                </div>
                <button 
                  onClick={() => setShowFullDesc(false)}
                  className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-rose-500/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-10 overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200/80 dark:border-white/5">
                    <Zap size={20} className="text-amber-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest mb-2 text-slate-900 dark:text-white">Requirement Matrix</h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-white/5 flex justify-end">
                <button 
                  onClick={() => setShowFullDesc(false)}
                  className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all shadow-md"
                >
                  Return to Matrix
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobCard;