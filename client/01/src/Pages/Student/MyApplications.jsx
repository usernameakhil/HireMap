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
    <div className="min-h-screen bg-[#09141e] text-slate-200 pb-20 selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* --- GRID BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0" style={{ 
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* --- HEADER --- */}
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              My 
              <span className="text-indigo-500"> Applications</span>
            </h1>
          </motion.div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-indigo-500 mb-6" size={56} />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Retrieving Secure Data...</p>
          </div>
        ) : applications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#030712]/60 border border-white/5 border-dashed p-32 rounded-[4rem] text-center backdrop-blur-sm"
          >
            <AlertCircle className="mx-auto text-slate-800 mb-8" size={80} />
            <p className="text-3xl font-black text-white uppercase tracking-tighter mb-4">No Active Applications Found</p>
            <p className="text-slate-500 text-sm font-medium mb-12 uppercase tracking-widest opacity-60">You haven't applied for any role yet</p>
            <button 
              onClick={() => window.location.href='/FindJobs'}
              className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Explore Jobs in our platform 
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
                whileHover={{ y: -8 }}
                className="bg-[#030712]/60 border border-white/5 p-10 rounded-[3.5rem] backdrop-blur-3xl hover:border-indigo-500/40 transition-all duration-500 group relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 shadow-2xl"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-indigo-500/10 transition-all duration-700" />

                <div className="relative z-10 space-y-6 flex-1">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors">
                      {app.jobId?.title || 'System Redacted'}
                    </h3>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                      <Building size={14} className="text-indigo-500" /> 
                      {app.jobId?.company || 'External Entity'}
                    </p>
                  </div>

                  {/* AI SCORES */}
                  <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3 shadow-lg">
                       <Zap size={14} className="text-amber-500 fill-amber-500" />
                       <span className="text-[11px] font-black text-white uppercase tracking-wider">{app.resumeFitScore || '0'}% FIT</span>
                    </div>
                    <div className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center gap-3 shadow-lg">
                       <BrainCircuit size={14} className="text-indigo-400" />
                       <span className="text-[11px] font-black text-white uppercase tracking-wider">{app.analysisScore || '0'}% ATS</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Calendar size={12} className="text-slate-700" />
                    <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.3em]">
                     APPLIED DATE: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* STATUS & ACTION */}
                <div className="relative z-10 flex flex-col items-end gap-6 w-full sm:w-auto">
                  <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border backdrop-blur-md  ${
                    app.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ' :
                    app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 ' :
                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-500/10'
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