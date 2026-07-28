import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, Trash2, Clock, Users, ArrowLeft, 
  Loader2, Search, Filter, ShieldCheck,
  Activity, MapPin, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

const HandlePosts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('All'); 

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/jobs/my-jobs`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setPosts(res.data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    if (user?.token) fetchJobs();
  }, [user, API_URL]);

  const handleDelete = async (id) => {
    if (!window.confirm("Terminate this deployment? All data will be archived.")) return;
    try {
      await axios.delete(`${API_URL}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setPosts(posts.filter(p => p._id !== id));
    } catch (e) { alert("Termination Interrupted."); }
  };

  // --- LOGIC: CALC LIFE EXPECTANCY PERCENTAGE ---
  const calculateProgress = (createdAt, expiresAt) => {
    const start = new Date(createdAt).getTime();
    const end = new Date(expiresAt).getTime();
    const now = new Date().getTime();

    if (now >= end) return 0; // Expired
    const totalDuration = end - start;
    const remaining = end - now;
    const percentage = (remaining / totalDuration) * 100;
    return Math.max(0, Math.min(100, percentage)); // Clamp between 0-100
  };

  // --- LOGIC: FILTERING & SEARCHING ---
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterMode === 'All' || post.mode === filterMode;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-200 pb-20 selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <header className="mb-12">
          <button onClick={() => navigate('/RecruiterDashboard')} className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white mb-6 transition-all group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Hub
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Deployments</span>
              </h1>
            </div>
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Load</p>
                <p className="text-2xl font-black text-white">{filteredPosts.length} <span className="text-indigo-500 text-sm">Nodes</span></p>
            </div>
          </div>
        </header>

        {/* Global Controls Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
           <div className="lg:col-span-8 relative group">
             <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
               <Search size={18} className="text-slate-500 group-focus-within:text-indigo-400" />
             </div>
             <input 
               type="text" 
               placeholder="Search by Job Title or Identity..." 
               className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-[2rem] text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="lg:col-span-4 relative">
             <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
               <Filter size={18} className="text-slate-500" />
             </div>
             <select 
               className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-[2rem] text-white outline-none focus:border-indigo-500/50 transition-all font-bold appearance-none cursor-pointer"
               value={filterMode}
               onChange={(e) => setFilterMode(e.target.value)}
             >
               <option value="All" className="bg-[#0a0f1a]">All Modes</option>
               <option value="Remote" className="bg-[#0a0f1a]">Remote Only</option>
               <option value="On-site" className="bg-[#0a0f1a]">On-site Only</option>
               <option value="Hybrid" className="bg-[#0a0f1a]">Hybrid Only</option>
             </select>
           </div>
        </div>

        {/* Deployment Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syncing Nodes...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, idx) => {
                const progress = calculateProgress(post.createdAt, post.expiresAt);
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={post._id}
                    className="bg-white/5 border border-white/10 p-8 rounded-[3.5rem] backdrop-blur-2xl flex flex-col xl:flex-row items-center justify-between gap-10 hover:border-indigo-500/40 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />

                    {/* Identity */}
                    <div className="flex items-center gap-8 w-full xl:w-1/3">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl border border-white/10">
                        {post.applicants || 0}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{post.title}</h3>
                        <p className="text-indigo-400 font-bold text-[10px] uppercase mt-2">{post.company}</p>
                        <div className="flex gap-2 mt-2">
                           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                             <MapPin size={10}/> {post.location || post.address}
                           </span>
                        </div>
                      </div>
                    </div>

                    {/* Intelligence (Progress Bar) */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
                       <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Clock size={12} className="text-rose-500" /> Life Expectancy
                            </div>
                            <span className="text-[9px] font-black text-white">{Math.round(progress)}% Remaining</span>
                          </div>
                          {/* DYNAMIC PROGRESS BAR */}
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r ${progress < 20 ? 'from-rose-500 to-orange-500' : 'from-indigo-500 to-cyan-400'}`} 
                            />
                          </div>
                          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tight">Created: {new Date(post.createdAt).toLocaleDateString()} | Node Expires: {new Date(post.expiresAt).toLocaleDateString()}</p>
                       </div>

                       <div className="flex flex-col justify-center space-y-1">
                          <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Broadcast Status</div>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                             <span className="text-xs font-black text-white uppercase tracking-widest">{post.mode} Deployment</span>
                          </div>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 w-full xl:w-auto">
                      <button 
                        onClick={() => navigate(`/edit-job/${post._id}`)}
                        className="flex-1 py-4 px-8 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(post._id)}
                        className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandlePosts;