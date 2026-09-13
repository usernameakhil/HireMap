import React, { useState, useEffect } from 'react';
import { 
  Globe, MapPin, Briefcase, Zap, ExternalLink, 
  Sparkles, ChevronDown, Search, X, ShieldCheck,
  Coins, ShoppingCart, Lock, Plus, Microscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const JobDiscovery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [formData, setFormData] = useState({
    country: '', cityState: '', jobRole: '', 
    experience: 'Entry Level', workMode: 'Any', jobType: 'Full-time'
  });
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [liveCoins, setLiveCoins] = useState(user?.coins || 0);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const REQUIRED_COINS = 5;

  useEffect(() => {
    const fetchFreshCoins = async () => {
      if (!user?.token) return;
      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (response.data) setLiveCoins(response.data.coins);
      } catch (err) { console.error("Coin Sync Error:", err); }
    };
    fetchFreshCoins();
  }, [user?.token, API_URL]);

  const handleSearch = async () => {
    if (!formData.country || !formData.jobRole) {
      alert("Please fill in at least Country and Job Role.");
      return;
    }
    if (liveCoins < REQUIRED_COINS) {
      setShowCoinPopup(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/job-intelligence/recommend`, formData, {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      setPlatforms(response.data.platforms);
      if (response.data.updatedCoins !== undefined) setLiveCoins(response.data.updatedCoins);
      else setLiveCoins(prev => prev - REQUIRED_COINS);
    } catch (error) {
      const msg = error.response?.data?.message || "Internal Engine Error";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#030712] font-sans selection:bg-indigo-500/20 overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* --- LEFT SIDE (30%): STATIC SYSTEM HUB --- */}
      <div className="hidden lg:flex lg:w-[30%] h-full flex-shrink-0 relative bg-white dark:bg-[#09141e] flex-col justify-between p-12 border-r border-slate-200/80 dark:border-white/5 overflow-hidden transition-colors duration-200">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-10">
            <div className="space-y-6">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter">
                    Job<span className="text-indigo-600 dark:text-indigo-400">Bot</span>
                </h1>
                <div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium border-l-2 border-indigo-500/30 pl-5 leading-relaxed">
                    Our Job Bot scans thousands of job listings across multiple platforms to find the most relevant opportunities for you.
                    It collects the latest openings and provides direct application links, so you can apply quickly without searching on different websites.
                    </p>
                    <br />
                    <p className="text-slate-800 dark:text-slate-200 text-sm font-bold">
                    What Job Bot does :
                    </p>
                    <ul className="space-y-2 opacity-90 text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2">
                        <li>• Scans jobs from multiple platforms in real time</li>
                        <li>• Shows the latest job openings in one place</li>
                        <li>• Provides direct apply links to the original job posting</li>
                        <li>• Saves time by eliminating manual job searching</li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#030712]/80 border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-3xl shadow-sm dark:shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                            <Coins className="text-amber-500 fill-amber-500" size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Wallet</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mt-2">{liveCoins}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/CoinStore')} className="bg-indigo-600 p-3 rounded-xl text-white hover:scale-105 transition-all shadow-md active:scale-95">
                        <Plus size={20} strokeWidth={3}/>
                    </button>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${Math.min((liveCoins/REQUIRED_COINS)*100, 100)}%` }} />
                </div>
                <p className="text-[9px] text-center font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Required Coins: {REQUIRED_COINS} </p>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE (70%): INTERACTIVE INTERFACE (HIDDEN SCROLL) --- */}
      <div className="flex-1 h-full relative overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        <Link to="/" className="absolute top-8 right-8 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all shadow-md z-[100]">
          <X size={22} />
        </Link>

        <div className="flex flex-col items-center w-full min-h-full">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl p-6 md:p-12 space-y-12">
                
                {/* Search Panel */}
                <div className="space-y-10 py-6">
                    <div className="bg-white dark:bg-[#09141e]/60 border border-slate-200/90 dark:border-white/10 p-8 sm:p-10 rounded-[3rem] shadow-sm dark:shadow-2xl backdrop-blur-3xl space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            <InputField label="Country" icon={<Globe size={16} className="text-indigo-600 dark:text-indigo-400"/>} value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} placeholder="e.g. India" />
                            <InputField label="City / State" icon={<MapPin size={16} className="text-indigo-600 dark:text-indigo-400"/>} value={formData.cityState} onChange={(e) => setFormData({...formData, cityState: e.target.value})} placeholder="e.g. Bangalore" />
                            <InputField label="Job Role" icon={<Briefcase size={16} className="text-indigo-600 dark:text-indigo-400"/>} value={formData.jobRole} onChange={(e) => setFormData({...formData, jobRole: e.target.value})} placeholder="e.g. Frontend Dev" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
                            <SelectField label="Experience" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} options={['Entry Level', 'Intermediate', 'Senior', 'Executive']} />
                            <SelectField label="Job Type" value={formData.jobType} onChange={(e) => setFormData({...formData, jobType: e.target.value})} options={['Full-time', 'Internship', 'Freelancing', 'Contract']} />
                            <SelectField label="Work Mode" value={formData.workMode} onChange={(e) => setFormData({...formData, workMode: e.target.value})} options={['Any', 'Remote', 'On-site', 'Hybrid']} />
                            
                            <div className="flex items-end">
                            <button 
                                onClick={handleSearch} 
                                disabled={loading} 
                                className="w-full bg-indigo-600 text-white dark:bg-white dark:text-slate-900 font-black uppercase tracking-widest text-[11px] py-4.5 rounded-2xl hover:bg-indigo-500 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-md active:scale-95 disabled:opacity-30 duration-300"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" /> : <><Zap size={18} className="fill-current" /> Start Scan</>}
                            </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results (Scrollable Section Below) */}
                <div className="pb-20">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : platforms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {platforms.map((platform, idx) => <PlatformCard key={idx} data={platform} />)}
                        </div>
                    ) : (
                        <div className="py-28 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3.5rem] bg-white dark:bg-[#09141e]/20">
                            <Search className="text-slate-400 dark:text-slate-700 mx-auto mb-5" size={44} />
                            <h3 className="text-xl font-black text-slate-500 dark:text-white uppercase tracking-wider opacity-60">Ready for Scan Protocol</h3>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
      </div>

      {/* --- INSUFFICIENT COINS POPUP --- */}
      <AnimatePresence>
        {showCoinPopup && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 dark:bg-black/80">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-[#09141e] border border-slate-200 dark:border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center space-y-6 shadow-2xl text-slate-900 dark:text-white">
              <Lock size={44} className="text-amber-500 mx-auto" />
              <h2 className="text-2xl font-black uppercase tracking-tighter">Credits Required</h2>
              <p className="text-slate-500 text-xs font-semibold">You need {REQUIRED_COINS} coins to scan across platforms.</p>
              <button onClick={() => navigate('/CoinStore')} className="w-full py-4 bg-amber-500 text-black font-black uppercase text-xs rounded-2xl hover:bg-amber-400 transition-all shadow-md">Buy Credits</button>
              <button onClick={() => setShowCoinPopup(false)} className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold uppercase text-xs rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const InputField = ({ label, icon, value, onChange, placeholder }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">{icon} {label}</label>
    <input value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-slate-50 dark:bg-[#030712] border border-slate-200/80 dark:border-white/5 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 font-bold text-sm shadow-inner" />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
    <select value={value} onChange={onChange} className="w-full bg-slate-50 dark:bg-[#030712] border border-slate-200/80 dark:border-white/5 rounded-2xl px-5 py-4 focus:border-indigo-500 outline-none text-slate-800 dark:text-white font-bold uppercase text-[10px] tracking-wider cursor-pointer appearance-none shadow-inner">
        {options.map(opt => <option key={opt} value={opt} className="bg-white dark:bg-[#09141e] text-slate-800 dark:text-white">{opt}</option>)}
    </select>
  </div>
);

const PlatformCard = ({ data }) => (
  <a href={data.directLink} target="_blank" rel="noopener noreferrer" className="group relative bg-white dark:bg-[#09141e]/60 border border-slate-200/90 dark:border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md dark:shadow-xl">
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-sm">
        <img src={data.logo} alt="" className="w-7 h-7 object-contain rounded-md" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${data.name}&background=6366f1&color=fff&bold=true`; }} />
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black uppercase border border-emerald-200 dark:border-emerald-500/20">Active</div>
    </div>
    <div className="relative z-10 flex flex-col flex-1">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase">{data.name}</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 italic opacity-90 group-hover:opacity-100 transition-opacity">"{data.description}"</p>
      <div className="mt-auto pt-5 border-t border-slate-100 dark:border-white/5 font-black text-[10px] uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2">Initialize Launch <ExternalLink size={13} /></div>
    </div>
  </a>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] h-[280px] animate-pulse">
    <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl mb-8"></div>
    <div className="h-6 bg-slate-100 dark:bg-white/5 rounded-md w-3/4 mb-4"></div>
    <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-md w-full mb-2"></div>
    <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-md w-2/3"></div>
  </div>
);

export default JobDiscovery;