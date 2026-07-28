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
    <div className="min-h-screen bg-[#09141e] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden pb-20">
      
      {/* --- GRID BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0" style={{ 
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 space-y-12">
        
        {/* --- WELCOME CONSOLE --- */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group rounded-[3.5rem] p-[1px] bg-indigo-300  shadow-2xl overflow-hidden"
        >
          <div className="bg-[#09141e] backdrop-blur-3xl rounded-[3.4rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/5">
             <div className="relative z-10 space-y-8 text-center lg:text-left flex-1">
                
                
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                   Welcome<br />
                   <span className="text-indigo-500 ">
                      {loading ? "..." : recruiterName}
                   </span>
                </h2>
                
                <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 opacity-80  border-l-2 border-indigo-500/30 pl-6">
Our AI is currently analyzing applicants to identify the most qualified candidates for your team.                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
                   <button onClick={() => navigate('/PostJob')} className="px-12 py-6 bg-white text-black rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 duration-500">
                      <Plus size={20} strokeWidth={3} /> Post New Job
                   </button>
                   <button onClick={() => navigate('/HandlePosts')} className="px-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] font-black uppercase text-[11px] tracking-widest text-white hover:bg-white/10 transition-all backdrop-blur-xl flex items-center justify-center gap-3">
                      <Briefcase size={18} /> Manage Roles
                   </button>
                </div>
             </div>
             
             <div className="relative group shrink-0 hidden lg:block">
                <div className="absolute inset-0 bg-indigo-600/20 blur-[100px]  transition-all"></div>
                <motion.img 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src={HIREMAP_LOGO} 
                  alt="Identity" 
                  className="w-[350px] relative z-10 rounded-[3rem]  border border-white/10 grayscale-[0.5]" 
                />
             </div>
          </div>
        </motion.section>

        {/* --- QUICK STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard label="Active Openings" value={posts.length} icon={Activity} color="indigo"  />
          <StatCard label="Total Candidates" value={totalApplicants} icon={Users} color="indigo"  />
          <div className="bg-[#030712]/60 border border-white/10 p-10 rounded-[3rem] flex flex-col justify-center items-center text-center backdrop-blur-md hover:border-emerald-500/30 transition-all shadow-xl group">
              <div className="relative mb-4">
                 <div className="absolute inset-0 bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/40 transition-all"></div>
                 <ShieldCheck className="text-emerald-500 relative z-10" size={48} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">System Status</p>
              <h4 className="text-xl font-black text-white uppercase mt-1">Verified </h4>
          </div>
        </div>

        {/* --- RECRUITMENT MODULES --- */}
        <div className="space-y-12 pt-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none ">Tools For <span className="text-indigo-500">Success</span></h2>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.5em] ml-1">Proprietary AI features for elite team building</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ModuleBox 
              onClick={() => navigate('/PostJob')}
              title="post a job " 
              desc="post new job role. Our AI instantly formats your JD for maximum reach." 
              icon={Rocket} 
            />
            <ModuleBox 
              onClick={() => navigate('/HandlePosts')}
              title="Handle posts" 
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
        <div className="bg-[#09141e] border border-white/5 rounded-[4rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="flex justify-between items-end mb-12 relative z-10">
            <div>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Live job posts</h3>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3  opacity-80">Currently active and receiving applicants</p>
            </div>
            <button 
              onClick={() => navigate('/HandlePosts')}
              className="px-8 py-3 bg-[#020617] border border-white/10 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3 duration-500 shadow-xl"
            >
               View <ArrowUpRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-indigo-500" size={56} /></div>
          ) : (
            <div className="space-y-6 relative z-10">
              {posts.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                   <p className="text-slate-700 font-black uppercase text-xs tracking-widest ">"No active job posts"</p>
                </div>
              ) : (
                posts.slice(0, 4).map((post) => (
                  <motion.div 
                    key={post._id}
                    whileHover={{ x: 10, backgroundColor: "rgba(99,102,241,0.05)" }}
                    className="group flex flex-col md:flex-row items-center justify-between p-8 bg-[#020617] border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all cursor-pointer shadow-lg"
                    onClick={() => navigate('/HandlePosts')}
                  >
                    <div className="flex items-center gap-8 w-full">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-2xl border border-white/5 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        {post.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{post.title}</h4>
                        <div className="flex flex-wrap gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-3">
                           <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-400"/> {post.location}</span>
                           <span className="flex items-center gap-2 text-indigo-400"><Users size={14}/> {post.applicants || 0} APPLICANTS</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-black transition-all">
                       <ChevronRight size={20} />
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
const StatCard = ({ label, value, icon: Icon, trend }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-[#09141e] border border-white/5 p-10 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden group shadow-2xl transition-all duration-700"
  >
    <div className={`absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/5 rounded-full blur-[80px] group-hover:bg-indigo-500/10 transition-all duration-700`} />
    <div className="relative z-10">
      <div className={`w-16 h-16 rounded-[1.5rem] bg-indigo-600/10 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-xl`}>
        <Icon size={32} />
      </div>
      <div className="flex items-end gap-3">
        <h3 className="text-5xl font-black text-white tracking-tighter leading-none">{value}</h3>
        <span className="text-[10px] font-black text-emerald-400 mb-1.5 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
          <TrendingUp size={12} /> {trend}
        </span>
      </div>
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3 ml-1">{label}</p>
    </div>
  </motion.div>
);

// --- PREMIUM MODULE BOX ---
const ModuleBox = ({ title, desc, icon: Icon, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative p-12 bg-[#09141e] border border-white/5 rounded-[4rem] backdrop-blur-3xl cursor-pointer overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:border-indigo-500/30 shadow-2xl flex flex-col h-full"
  >
    <div className={`absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-[100px] group-hover:bg-indigo-500/10 transition-all duration-700`} />
    
    <div className="w-20 h-20 bg-[#09141e] border border-white/5 rounded-[2rem] flex items-center justify-center text-indigo-400 mb-10 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-2xl">
      <Icon size={36} />
    </div>
    
    <div className="relative z-10 flex-1">
      <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">{title}</h3>
      <p className="text-slate-500 text-lg font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{desc}"</p>
    </div>
    
    <div className="flex justify-between items-center relative z-10 mt-10">
      <div className="w-14 h-14 bg-white text-black rounded-[1.5rem] flex items-center justify-center shadow-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
        <ChevronRight size={24} strokeWidth={3} />
      </div>
    </div>
  </div>
);

export default RecruiterDashboard;