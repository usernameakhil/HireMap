import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Users, Globe, Briefcase, TrendingUp, 
  ChevronRight, Sparkles, Target, Zap, Rocket,
  ArrowUpRight, BarChart3, ShieldCheck, Activity,
  Clock, MapPin, DollarSign, Loader2, Brain, Terminal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [recruiterName, setRecruiterName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const HIREMAP_LOGO = "/hiremap.jpg"; 

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.token) return;
      
      try {
        const [jobsRes, profileRes] = await Promise.all([
          axios.get(`${API_URL}/api/jobs/my-jobs`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          axios.get(`${API_URL}/api/recruiter/profile`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        setPosts(jobsRes.data);
        const fullName = profileRes.data.fullName || profileRes.data.name || user.name || "Partner";
        setRecruiterName(fullName.split(' ')[0]);
        
      } catch (err) {
        console.error("Recruiter Sync Failed:", err);
        setRecruiterName(user?.name?.split(' ')[0] || "Partner");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, API_URL]);

  const totalApplicants = posts.reduce((acc, p) => acc + (p.applicants || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09141e] text-slate-800 dark:text-slate-200 font-sans pb-20 relative overflow-x-hidden selection:bg-indigo-500/20 transition-colors duration-200">
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        
        {/* --- WELCOME CONSOLE --- */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group rounded-[3.5rem] p-[1px] bg-gradient-to-r from-indigo-200 via-indigo-300 to-indigo-200 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-indigo-500/20 shadow-sm dark:shadow-2xl overflow-hidden"
        >
          <div className="bg-white dark:bg-[#09141e] backdrop-blur-3xl rounded-[3.4rem] p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 border border-slate-200/90 dark:border-white/5">
             <div className="relative z-10 space-y-6 text-center lg:text-left flex-1">
                <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] uppercase">
                   Welcome<br />
                   <span className="text-indigo-600 dark:text-indigo-400">
                      {loading ? "..." : recruiterName}
                   </span>
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 border-l-2 border-indigo-500/30 pl-5">
                   Our AI is currently analyzing applicants to identify the most qualified candidates for your team.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                   <button onClick={() => navigate('/PostJob')} className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-md flex items-center justify-center gap-2.5 active:scale-95">
                      <Plus size={18} strokeWidth={3} /> Post New Job
                   </button>
                   <button onClick={() => navigate('/HandlePosts')} className="px-10 py-5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-black uppercase text-[11px] tracking-widest text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2.5 shadow-sm">
                      <Briefcase size={18} /> Manage Roles
                   </button>
                </div>
             </div>
             
             <div className="relative group shrink-0 hidden lg:block">
                <div className="absolute inset-0 bg-indigo-600/10 dark:bg-indigo-600/20 blur-[80px]"></div>
                <motion.img 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src={HIREMAP_LOGO} 
                  alt="Identity" 
                  className="w-[320px] relative z-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-lg" 
                />
             </div>
          </div>
        </motion.section>

        {/* --- QUICK STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <StatCard label="Active Openings" value={posts.length} icon={Activity} />
          <StatCard label="Total Candidates" value={totalApplicants} icon={Users} />
          <div className="bg-white dark:bg-[#030712]/60 border border-slate-200/90 dark:border-white/10 p-8 sm:p-10 rounded-[3rem] flex flex-col justify-center items-center text-center backdrop-blur-md shadow-sm hover:shadow-md dark:shadow-xl group transition-all">
              <div className="relative mb-3">
                 <ShieldCheck className="text-emerald-500 relative z-10" size={42} />
              </div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">System Status</p>
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase mt-1">Verified</h4>
          </div>
        </div>

        {/* --- RECRUITMENT MODULES --- */}
        <div className="space-y-10 pt-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Tools For <span className="text-indigo-600 dark:text-indigo-400">Success</span></h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-0.5">Proprietary AI features for elite team building</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ModuleBox 
              onClick={() => navigate('/PostJob')}
              title="Post a Job" 
              desc="Post new job role. Our AI instantly formats your JD for maximum reach." 
              icon={Rocket} 
            />
            <ModuleBox 
              onClick={() => navigate('/HandlePosts')}
              title="Handle Posts" 
              desc="Deep-scan and manage your active job posts. Monitor applicant quality in real-time." 
              icon={Terminal} 
            />
            <ModuleBox 
              onClick={() => navigate('/applications')}
              title="Applications" 
              desc="Monitor the applications which are already analyzed by our intelligence" 
              icon={Target} 
            />
          </div>
        </div>

        {/* --- ACTIVE DEPLOYMENTS LISTING --- */}
        <div className="bg-white dark:bg-[#09141e] border border-slate-200/90 dark:border-white/5 rounded-[3.5rem] p-8 sm:p-12 backdrop-blur-3xl shadow-sm dark:shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-end mb-10 relative z-10">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Live Job Posts</h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-2">Currently active and receiving applicants</p>
            </div>
            <button 
              onClick={() => navigate('/HandlePosts')}
              className="px-6 py-2.5 bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
            >
               View All <ArrowUpRight size={15} />
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600 dark:text-indigo-500" size={48} /></div>
          ) : (
            <div className="space-y-5 relative z-10">
              {posts.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem] bg-slate-50/50 dark:bg-white/[0.01]">
                   <p className="text-slate-500 font-bold uppercase text-xs tracking-wider">No active job posts</p>
                </div>
              ) : (
                posts.slice(0, 4).map((post) => (
                  <motion.div 
                    key={post._id}
                    whileHover={{ x: 6 }}
                    className="group flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 bg-slate-50 dark:bg-[#020617] border border-slate-200/80 dark:border-white/5 rounded-[2rem] hover:border-indigo-400 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => navigate('/HandlePosts')}
                  >
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-14 h-14 bg-indigo-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl border border-indigo-100 dark:border-white/5 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        {post.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{post.title}</h4>
                        <div className="flex flex-wrap gap-5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2.5">
                           <span className="flex items-center gap-1.5"><MapPin size={13} className="text-indigo-600 dark:text-indigo-400"/> {post.location}</span>
                           <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400"><Users size={13}/> {post.applicants || 0} Applicants</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                       <ChevronRight size={18} />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- PREMIUM STAT CARD ---
const StatCard = ({ label, value, icon: Icon }) => (
  <motion.div 
    whileHover={{ y: -6 }}
    className="bg-white dark:bg-[#09141e] border border-slate-200/90 dark:border-white/5 p-8 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group shadow-sm hover:shadow-md dark:shadow-2xl transition-all duration-300"
  >
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Icon size={26} />
      </div>
      <div className="flex items-end gap-3">
        <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</h3>
      </div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-2 ml-0.5">{label}</p>
    </div>
  </motion.div>
);

// --- PREMIUM MODULE BOX ---
const ModuleBox = ({ title, desc, icon: Icon, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative p-8 sm:p-10 bg-white dark:bg-[#09141e] border border-slate-200/90 dark:border-white/5 rounded-[3rem] backdrop-blur-3xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-indigo-400 shadow-sm hover:shadow-md dark:shadow-2xl flex flex-col h-full"
  >
    <div className="w-16 h-16 bg-indigo-50 dark:bg-[#09141e] border border-indigo-100 dark:border-white/5 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
      <Icon size={30} />
    </div>
    
    <div className="relative z-10 flex-1">
      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3 leading-none">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed italic opacity-90 mb-6">"{desc}"</p>
    </div>
    
    <div className="flex justify-between items-center relative z-10 mt-auto">
      <div className="w-11 h-11 bg-slate-100 dark:bg-white text-slate-800 dark:text-black rounded-xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
        <ChevronRight size={20} strokeWidth={2.5} />
      </div>
    </div>
  </div>
);

export default RecruiterDashboard;