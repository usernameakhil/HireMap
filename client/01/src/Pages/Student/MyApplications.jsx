import { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import { 
  Building, 
  Calendar, 
  AlertCircle, 
  Loader2, 
  Zap, 
  BrainCircuit, 
  ChevronRight,
  Sparkles,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const HIREMAP_LOGO = "/hiremap.jpg"; 

  useEffect(() => {
    const fetchMyApps = async () => {
      if (!user?.token) return;
      try {
        const response = await fetch(`${API_URL}/api/applications/my-applications`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setApplications(data);
        }
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApps();
  }, [user, API_URL]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09141e] text-slate-800 dark:text-slate-200 pb-20 relative overflow-x-hidden font-sans transition-colors duration-200">
      
      {/* Brand Watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img 
          src={HIREMAP_LOGO} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.015] dark:opacity-[0.02] grayscale blur-sm" 
          alt="" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* --- HEADER --- */}
        <header className="mb-14">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              My <span className="text-indigo-600 dark:text-indigo-400">Applications</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Track your application pipeline in real time</p>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-500 mb-5" size={48} />
            <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Retrieving Secure Data...</p>
          </div>
        ) : applications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#030712]/60 border border-slate-200 dark:border-white/5 border-dashed p-20 sm:p-28 rounded-[3.5rem] text-center backdrop-blur-sm shadow-sm"
          >
            <AlertCircle className="mx-auto text-slate-400 dark:text-slate-700 mb-6" size={64} />
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3">No Active Applications Found</p>
            <p className="text-slate-500 text-xs font-bold mb-10 uppercase tracking-widest">You haven't applied for any role yet</p>
            <button 
              onClick={() => window.location.href='/FindJobs'}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-md active:scale-95"
            >
              Explore Jobs on our Platform
            </button>
          </motion.div>
        ) : (
          /* --- APPLICATION GRID --- */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {applications.map((app, index) => (
              <motion.div 
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white dark:bg-[#030712]/60 border border-slate-200/90 dark:border-white/5 p-8 sm:p-10 rounded-[3rem] backdrop-blur-3xl hover:border-indigo-400 transition-all duration-300 group relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 shadow-sm hover:shadow-md dark:shadow-2xl"
              >
                <div className="relative z-10 space-y-5 flex-1">
                  <div className="space-y-1.5">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {app.jobId?.title || 'External Role'}
                    </h3>
                    <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                      <Building size={14} /> 
                      {app.jobId?.company || 'Company'}
                    </p>
                  </div>

                  {/* AI SCORES */}
                  <div className="flex flex-wrap gap-3">
                    <div className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl flex items-center gap-2 shadow-sm">
                       <Zap size={13} className="text-amber-500 fill-amber-500" />
                       <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider">{app.resumeFitScore || '0'}% FIT</span>
                    </div>
                    <div className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl flex items-center gap-2 shadow-sm">
                       <BrainCircuit size={13} className="text-indigo-600 dark:text-indigo-400" />
                       <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-wider">{app.analysisScore || '0'}% ATS</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Calendar size={12} className="text-slate-400" />
                    <p className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                     Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* STATUS & ACTION */}
                <div className="relative z-10 flex flex-col items-end gap-4 w-full sm:w-auto">
                  <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${
                    app.status === 'Shortlisted' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                    app.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' :
                    'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20'
                  }`}>
                    {app.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;