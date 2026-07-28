import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, User, Search, ArrowRight, Zap, 
  Rocket, Swords, Bot, Trophy, Map, Brain, ShieldCheck, 
  Target, ChevronRight
} from 'lucide-react'; 
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth(); 
  const [stats, setStats] = useState({ applied: 0, shortlisted: 0 });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Your custom high-end logo asset
  const HIREMAP_LOGO = "/hiremap.jpg"; 

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
    <div className="min-h-screen bg-[#09141e] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden pb-20">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img 
          src={HIREMAP_LOGO} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.02] grayscale blur-sm" 
          alt="" 
        />
        <div className="absolute inset-0" style={{ 
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group rounded-[3.5rem] p-[1px] bg-indigo-400  shadow-2xl overflow-hidden"
        >
          <div className="bg-[#09141e] backdrop-blur-3xl rounded-[3.4rem] p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[70vh]">
             <div className="relative z-10 space-y-10 text-center lg:text-left flex-1">
                
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                   Welcome<br />
                   <span className="text-indigo-500 bg-clip-text bg-gradient-to-r ">
                      {user?.name?.split(' ')[0] || 'Operator'}
                   </span>
                </h2>
                
                <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 opacity-80">
                   Your professional deployment is ready. We are mapping your talent to the global high-tier grid in real-time.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
                   <Link to="/FindJobs" className="px-12 py-6 bg-indigo-600 rounded-[2rem] font-black uppercase text-[11px] tracking-widest text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                      <Search size={20} /> Explore Jobs
                   </Link>
                   <Link to="/Profile" className="px-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] font-black uppercase text-xs tracking-widest text-white hover:bg-white/10 transition-all backdrop-blur-xl flex items-center justify-center gap-3">
                      <User size={20} /> Update Profile
                   </Link>
                </div>
             </div>
             
             {/* Branded Logo Focal Point */}
             <div className="relative group shrink-0 hidden lg:block">
                <div className="absolute inset-0  blur-[120px]  transition-all"></div>
                <motion.img 
                  animate={{ y: [0, -25, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  src={HIREMAP_LOGO} 
                  alt="Identity" 
                  className="w-[400px] relative z-10 rounded-[4rem] shadow-[0_0_100px_rgba(99,102,241,0.25)] border border-white/10" 
                />
             </div>
          </div>
        </motion.section>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-20 mt-10">
        
        {/* --- PERFORMANCE ANALYTICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <MetricCard title="Active Enlistments" value={stats.applied} icon={Briefcase} color="indigo" label="Synced Applications" />
           <MetricCard title="Grid Shortlists" value={stats.shortlisted} icon={Target} color="indigo" label="Target Matches" />
           <div className="bg-[#09141e] border border-white/10 p-10 rounded-[3.5rem] flex flex-col justify-center items-center text-center backdrop-blur-md hover:border-emerald-500/40 transition-all shadow-xl group">
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-emerald-500/20 blur-2xl group-hover:bg-emerald-500/40 transition-all"></div>
                 <ShieldCheck className="text-emerald-500 relative z-10" size={60} />
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Institutional Trust</p>
              <h4 className="text-3xl font-black text-white uppercase tracking-tighter mt-2">Verified</h4>
           </div>
        </div>

        {/* --- TOOLS FOR SUCCESS --- */}
        <div className="space-y-16 pt-10 relative">
          <div className="flex flex-col gap-4">
            <h2 className="text-7xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">Tools For <span className="text-indigo-500">Success</span></h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.6em] ml-2">Proprietary AI Infrastructure</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <ModuleBox to="/HireFit" title="HireFit Analyzer" desc="Stop comparing your resume with long job descriptions and getting confused. Our AI shows how well your resume matches the job and tells you exactly what to improve" Icon={Rocket} color="indigo" />
            <ModuleBox to="/ResumeBattle" title="Resume Battle" desc="Compare your resume with successful candidates. Get clear insights on what to improve and how recruiters really evaluate profiles" Icon={Swords} color="indigo" />
            <ModuleBox to="/JobDiscovery" title="Job  Bot" desc="Stop searching across multiple platforms. Find all job postings from different platforms in one place with just one click" Icon={Bot} color="indigo" />
            <ModuleBox to="/roadmaps" title="career paths" desc="Get step-by-step roadmaps for different roles, designed by top engineers who succeeded in their fields" Icon={Map} color="indigo" />
            <ModuleBox to="/ResumeAI" title="resume analyzer" desc="Build your resume the way recruiters actually review it. Get a score and clear improvement tips from our recruiter AI to land your dream job faster" Icon={Brain} color="indigo"/>
            <ModuleBox to="/FindJobs" title="Grab Offers" desc="Stop searching through crowded job listings. Get your dream job in just one click" Icon={Trophy} color="indigo"/>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- PREMIUM UI COMPONENTS --- */

const MetricCard = ({ title, value, icon: Icon, color, label }) => {
  const colors = {
    indigo: "text-indigo-400 border-indigo-500/20 shadow-[0_0_60px_rgba(99,102,241,0.05)]",
  };
  return (
    <div className={`bg-[#09141e] border ${colors[color]} p-14 rounded-[4rem] backdrop-blur-md relative overflow-hidden group hover:bg-white/[0.04] transition-all`}>
       <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon size={80} />
       </div>
       <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">{title}</p>
       <h4 className="text-7xl font-black text-white tracking-tighter mb-2">{value}</h4>
       <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{label}</p>
    </div>
  );
};

const ModuleBox = ({ to, title, desc, Icon, color }) => {
  const themes = {
    indigo: "border-indigo-500/30 text-indigo-400 shadow-[0_0_80px_rgba(99,102,241,0.1)]",
  };
  
  return (
    <Link to={to} className={`p-12 rounded-[4rem] border ${themes[color]} bg-white/[0.02] backdrop-blur-2xl flex flex-col justify-between group hover:-translate-y-6 transition-all duration-700 relative overflow-hidden min-h-[400px]`}>
       <div className="relative z-10">
          <div className="w-20 h-20bg-[#09141e] rounded-[2rem] flex items-center justify-center mb-10 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-xl">
             <Icon size={36} />
          </div>
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-none">{title}</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{desc}"</p>
       </div>
       <div className="relative z-10 flex justify-end mt-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
             <ArrowRight size={24} />
          </div>
       </div>
    </Link>
  );
};

export default StudentDashboard;
