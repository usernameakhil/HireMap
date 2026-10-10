import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, User, Search, ArrowRight, Zap, 
  Rocket, Swords, Bot, Trophy, Map, Brain, ShieldCheck, 
  Target, ChevronRight
} from 'lucide-react'; 
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import { useTheme } from '../../Context/ThemeContext';

const StudentDashboard = () => {
  const { user } = useAuth(); 
  const { isDark } = useTheme();
  const [stats, setStats] = useState({ applied: 0, shortlisted: 0 });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Your custom high-end logo asset
  const HIREMAP_LOGO = isDark ? "/hiremap.jpg" : "/hiremap-light.jpg"; 

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.token) return;
      try {
        const response = await fetch(`${API_URL}/api/applications/my-applications`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setStats({
            applied: data.length,
            shortlisted: data.filter(app => app.status === 'Shortlisted').length
          });
        }
      } catch (error) {
        console.error("Connection Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, API_URL]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/20 overflow-x-hidden pb-20 transition-colors duration-200">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img 
          src={HIREMAP_LOGO} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.015] dark:opacity-[0.02] grayscale blur-sm" 
          alt="" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group rounded-[3.5rem] p-[1px] bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-indigo-500/40 shadow-xl dark:shadow-2xl overflow-hidden"
        >
          <div className="bg-white/95 dark:bg-[#09141e]/95 backdrop-blur-3xl rounded-[3.4rem] p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[60vh] border border-slate-200/80 dark:border-white/5">
             <div className="relative z-10 space-y-8 text-center lg:text-left flex-1">
                
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] uppercase">
                   Welcome<br />
                   <span className="text-indigo-600 dark:text-indigo-400 bg-clip-text">
                      {user?.name?.split(' ')[0] || 'Operator'}
                   </span>
                </h2>
                
                <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                   Your professional deployment is ready. We are mapping your talent to the global high-tier grid in real-time.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-2">
                   <Link to="/FindJobs" className="px-10 py-5 bg-indigo-600 rounded-[2rem] font-black uppercase text-[11px] tracking-widest text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-md shadow-indigo-600/20">
                      <Search size={18} /> Explore Jobs
                   </Link>
                   <Link to="/Profile" className="px-10 py-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] font-black uppercase text-xs tracking-widest text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all backdrop-blur-xl flex items-center justify-center gap-3 shadow-sm dark:shadow-none">
                      <User size={18} /> Update Profile
                   </Link>
                </div>
             </div>
             
             {/* Branded Logo Focal Point */}
             <div className="relative group shrink-0 hidden lg:block">
                <div className="absolute inset-0 bg-indigo-500/15 dark:bg-indigo-500/25 blur-[100px] transition-all"></div>
                <motion.img 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  src={HIREMAP_LOGO} 
                  alt="Identity" 
                  className="w-[360px] relative z-10 rounded-[4rem] shadow-xl dark:shadow-[0_0_80px_rgba(99,102,241,0.2)] border border-slate-200 dark:border-white/10" 
                />
             </div>
          </div>
        </motion.section>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-20 mt-6">
        
        {/* --- PERFORMANCE ANALYTICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <MetricCard title="Active Enlistments" value={stats.applied} icon={Briefcase} color="indigo" label="Synced Applications" />
           <MetricCard title="Grid Shortlists" value={stats.shortlisted} icon={Target} color="indigo" label="Target Matches" />
           <div className="bg-white dark:bg-[#0e1526] border border-slate-200/90 dark:border-white/10 p-10 rounded-[3.5rem] flex flex-col justify-center items-center text-center backdrop-blur-md hover:border-emerald-500/40 transition-all shadow-sm hover:shadow-md dark:shadow-xl group">
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all"></div>
                 <ShieldCheck className="text-emerald-600 dark:text-emerald-400 relative z-10" size={54} />
              </div>
              <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Institutional Trust</p>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mt-2">Verified</h4>
           </div>
        </div>

        {/* --- TOOLS FOR SUCCESS --- */}
        <div className="space-y-12 pt-6 relative">
          <div className="flex flex-col gap-3">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Tools For <span className="text-indigo-600 dark:text-indigo-400">Success</span></h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.6em] ml-1">Proprietary AI Infrastructure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ModuleBox to="/HireFit" title="HireFit Analyzer" desc="Stop comparing your resume with long job descriptions and getting confused. Our AI shows how well your resume matches the job and tells you exactly what to improve" Icon={Rocket} color="indigo" />
            <ModuleBox to="/ResumeBattle" title="Resume Battle" desc="Compare your resume with successful candidates. Get clear insights on what to improve and how recruiters really evaluate profiles" Icon={Swords} color="indigo" />
            <ModuleBox to="/JobDiscovery" title="Job Bot" desc="Stop searching across multiple platforms. Find all job postings from different platforms in one place with just one click" Icon={Bot} color="indigo" />
            <ModuleBox to="/roadmaps" title="Career Paths" desc="Get step-by-step roadmaps for different roles, designed by top engineers who succeeded in their fields" Icon={Map} color="indigo" />
            <ModuleBox to="/ResumeAI" title="Resume Analyzer" desc="Build your resume the way recruiters actually review it. Get a score and clear improvement tips from our recruiter AI to land your dream job faster" Icon={Brain} color="indigo"/>
            <ModuleBox to="/FindJobs" title="Grab Offers" desc="Stop searching through crowded job listings. Get your dream job in just one click" Icon={Trophy} color="indigo"/>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- PREMIUM UI COMPONENTS --- */

const MetricCard = ({ title, value, icon: Icon, color, label }) => {
  return (
    <div className="bg-white dark:bg-[#0e1526] border border-slate-200/90 dark:border-indigo-500/20 p-12 rounded-[3.5rem] backdrop-blur-md relative overflow-hidden group hover:border-indigo-400/60 transition-all shadow-sm hover:shadow-md dark:shadow-xl">
       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 dark:opacity-5 transition-opacity text-slate-800 dark:text-white">
          <Icon size={72} />
       </div>
       <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-3">{title}</p>
       <h4 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{value}</h4>
       <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
};

const ModuleBox = ({ to, title, desc, Icon, color }) => {
  return (
    <Link to={to} className="p-10 rounded-[3rem] border border-slate-200/90 dark:border-indigo-500/25 bg-white dark:bg-[#111827]/70 backdrop-blur-2xl flex flex-col justify-between group hover:-translate-y-4 transition-all duration-500 relative overflow-hidden min-h-[380px] shadow-sm hover:shadow-xl dark:shadow-xl">
       <div className="relative z-10">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
             <Icon size={30} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed italic opacity-85 group-hover:opacity-100 transition-opacity">"{desc}"</p>
       </div>
       <div className="relative z-10 flex justify-end mt-8">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all shadow-sm active:scale-90">
             <ArrowRight size={20} />
          </div>
       </div>
    </Link>
  );
};

export default StudentDashboard;
