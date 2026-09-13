import { useState, useEffect, useCallback } from 'react';
import { 
  User, Mail, Phone, Briefcase, Code2, Loader2, Award, MapPin, 
  ExternalLink, Plus, UploadCloud, RefreshCw, Eye, X, ChevronRight, Zap,
  Trophy, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [viewMode, setViewMode] = useState('loading');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReframeModal, setShowReframeModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const HIREMAP_LOGO = "/hiremap.jpg";

  const enrichProfileData = useCallback((data) => {
    return {
      ...data,
      coins: data.coins ?? 0,
      education: data.education || [],
      achievements: data.achievements || [],
      certifications: data.certifications || [],
      projects: data.projects || [],
      experience: data.experience || [],
      skills: data.skills || []
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user?.token) return;
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        setProfileData(enrichProfileData(data));
        if (data.skills && data.skills.length > 0) {
          setViewMode('dashboard');
        } else {
          setViewMode('empty');
        }
      } else {
        setViewMode('empty');
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      setViewMode('empty');
    }
  }, [user?.token, API_URL, enrichProfileData]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleResumeUpload = async (fileToUpload) => {
    if (!fileToUpload) return;

    // --- 1MB SIZE LIMIT CHECK ---
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
    if (fileToUpload.size > MAX_FILE_SIZE) {
      alert("File is too large! Please upload a PDF under 1MB.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    const formData = new FormData();
    formData.append('resume', fileToUpload);

    try {
      const response = await fetch(`${API_URL}/api/users/profile/extract`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formData
      });
      const uploadResult = await response.json();
      if (!response.ok) throw new Error(uploadResult.message || "Extraction Failed");
      await fetchProfile();
      setViewMode('dashboard');
      setShowReframeModal(false);
    } catch (err) {
      console.error("Neural Analysis Fault:", err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (viewMode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09141e]">
        <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-500" size={40} />
      </div>
    );
  }

  if (viewMode === 'empty' || showReframeModal) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#09141e] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
        </div>
        {showReframeModal && (
          <button onClick={() => setShowReframeModal(false)} className="absolute top-6 right-6 p-3 bg-white dark:bg-white/5 text-slate-700 dark:text-white rounded-full border border-slate-200 dark:border-white/10 z-50 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-md">
            <X size={20} />
          </button>
        )}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-lg p-[1px] bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-indigo-500/30 rounded-[3.5rem] shadow-2xl">
          <div className="bg-white/95 dark:bg-[#09141e]/95 backdrop-blur-3xl rounded-[3.4rem] overflow-hidden border border-slate-200/90 dark:border-white/5">
            <div className="p-10 text-center bg-indigo-50 dark:bg-indigo-600/10 border-b border-slate-100 dark:border-white/5">
               <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Build Your Identity</h1>
               <p className="text-slate-600 dark:text-slate-400 text-sm font-medium tracking-tight">Upload your Resume (PDF)</p>
            </div>
            <div className="p-10">
              {isAnalyzing ? (
                 <div className="flex flex-col items-center justify-center py-10">
                   <div className="relative">
                      <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-500 mb-6" size={56} />
                      <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full"></div>
                   </div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Analyzing Data...</h3>
                   <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Parsing career trajectory</p>
                 </div>
              ) : (
                <label className="border-2 border-dashed border-slate-200 dark:border-indigo-500/20 rounded-[2.5rem] h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 hover:border-indigo-400 transition-all group">
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleResumeUpload(e.target.files[0])} />
                  <div className="flex flex-col items-center gap-4 text-slate-400 dark:text-slate-500">
                    <UploadCloud size={40} className="text-indigo-600 dark:text-indigo-400" />
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none text-slate-800 dark:text-slate-300">Drop Resume (PDF)</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2">Limit: 1MB</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-[0.2em] italic text-center px-6">Auto-populates education, skills, and projects</span>
                </label>
              )}
              {error && <p className="text-rose-500 dark:text-rose-400 text-center text-[10px] mt-6 uppercase font-black tracking-[0.3em]">{error}</p>}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (viewMode === 'recruiter') {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#09141e] py-10 px-4 flex flex-col items-center transition-colors duration-200">
         <button onClick={() => setViewMode('dashboard')} className="mb-8 flex items-center gap-3 bg-white dark:bg-[#09141e] text-slate-800 dark:text-slate-200 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all border border-slate-200 dark:border-white/10 shadow-md">
            <ChevronRight className="rotate-180" size={18}/> Back to Console
         </button>
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-2xl p-16 text-slate-900 rounded-sm">
            <div className="border-b-[6px] border-slate-900 pb-8 mb-10">
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{profileData?.fullName || profileData?.name}</h1>
              <p className="text-2xl text-indigo-600 font-black mt-2 uppercase tracking-tight">{profileData?.jobRoles?.[0] || 'Professional'}</p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><MapPin size={12}/> {profileData?.location}</span>
                <span className="flex items-center gap-2"><Phone size={12}/> {profileData?.phone}</span>
                <span className="flex items-center gap-2"><Mail size={12}/> {profileData?.resumeEmail || profileData?.email}</span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-12">
               <div className="col-span-8 space-y-12">
                 <section>
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b-2 border-slate-100 pb-2">Experience History</h3>
                   {profileData?.experience?.map((exp, i) => (
                     <div key={i} className="mb-8">
                       <div className="flex justify-between items-baseline font-black uppercase">
                         <h4 className="text-xl tracking-tight">{exp.role}</h4>
                         <span className="text-[9px] bg-slate-100 px-3 py-1 rounded-full">{exp.duration}</span>
                       </div>
                       <p className="text-indigo-600 text-sm font-black mb-3">{exp.company}</p>
                       <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{exp.desc}"</p>
                     </div>
                   ))}
                 </section>
               </div>
               <div className="col-span-4 space-y-12">
                 <section>
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b-2 border-slate-100 pb-2">Technical Core</h3>
                   <div className="flex flex-wrap gap-2">
                     {profileData?.skills?.map(s => <span key={s} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">{s}</span>)}
                   </div>
                 </section>
               </div>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09141e] text-slate-800 dark:text-slate-200 pb-20 relative overflow-x-hidden font-sans transition-colors duration-200">
      {/* Branded Header */}
      <div className="top-0 z-40 bg-white/80 dark:bg-[#09141e]/80 border-b border-slate-200/80 dark:border-white/5 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 h-20 sm:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
             <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-md">
               {(profileData?.fullName || profileData?.name || "U").charAt(0).toUpperCase()}
             </div>
             <div>
               <h1 className="font-black text-slate-900 dark:text-white text-lg sm:text-xl tracking-tighter uppercase leading-none">{profileData?.fullName || profileData?.name}</h1>
             </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
             <div className="hidden md:flex items-center gap-3 bg-indigo-50 dark:bg-indigo-600/10 px-5 py-2.5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                <Zap size={18} className="text-indigo-600 dark:text-indigo-400 fill-current" />
                <span className="font-black text-slate-900 dark:text-white text-lg">{profileData?.coins || 0}</span>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Credits</span>
             </div>
             <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={() => navigate('/CoinStore')} aria-label="Purchase Coins" className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white rounded-2xl border border-slate-200 dark:border-white/5 transition-all shadow-sm">
                  <Plus size={20} />
                </button>
                <button onClick={() => setShowReframeModal(true)} aria-label="Refresh Profile" className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white rounded-2xl border border-slate-200 dark:border-white/5 transition-all shadow-sm">
                  <RefreshCw size={20} />
                </button>
                <button onClick={() => setViewMode('recruiter')} className="flex items-center gap-2 bg-indigo-600 text-white px-5 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-md active:scale-95">
                  <Eye size={18} /> <span className="hidden sm:inline">view details</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 sm:py-12 space-y-10 sm:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
           <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} className="lg:col-span-2 bg-white dark:bg-[#09141e]/60 backdrop-blur-3xl rounded-[3rem] p-8 sm:p-12 border border-slate-200/90 dark:border-white/5 relative group overflow-hidden shadow-sm dark:shadow-2xl">
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">Professional Summary</h2>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-xl leading-relaxed font-medium max-w-3xl">"{profileData?.summary || "No summary provided."}"</p>
              </div>
           </motion.div>

           <div className="bg-white dark:bg-[#09141e]/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-slate-200/90 dark:border-white/5 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-2xl relative overflow-hidden group">
              {(() => {
                 const config = (profileData?.atsScore >= 90) ? { label: "Elite", color: "text-emerald-500" } : 
                                (profileData?.atsScore >= 80) ? { label: "Master", color: "text-indigo-600 dark:text-indigo-400" } :
                                { label: "Verified", color: "text-indigo-600 dark:text-indigo-400" };
                 return (
                   <div className="relative z-10 w-full flex flex-col items-center">
  <h3 className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mb-8">
    HireMap score
  </h3>
  
  <div className="w-44 h-44 rounded-full border-[8px] border-slate-100 dark:border-white/5 flex items-center justify-center relative mb-8 mx-auto group-hover:scale-105 transition-transform duration-500 shadow-sm">
    <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-white/5" />
      <circle 
        cx="50" cy="50" r="46" 
        stroke="currentColor" 
        strokeWidth="6" 
        fill="transparent" 
        strokeDasharray={`${289 * ((profileData?.atsScore || 0) / 100)} 289`} 
        className={`${config.color} transition-all duration-1000`} 
        strokeLinecap="round" 
      />
    </svg>
    <div className="text-center">
      <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white block tracking-tighter leading-none">
        {profileData?.atsScore || 0}
      </span>
      <span className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase mt-1 block">
        Score
      </span>
    </div>
  </div>

  {/* --- IMPROVE SCORE BUTTON --- */}
  <Link 
    to="/ResumeAI" 
    className="group/btn relative flex items-center gap-3 px-6 py-3.5 bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl transition-all duration-300 hover:bg-indigo-600 hover:text-white shadow-sm"
  >
    <Zap size={16} className="text-indigo-600 dark:text-indigo-400 group-hover/btn:text-white transition-colors" />
    <span className="text-[10px] font-black text-indigo-700 dark:text-white group-hover/btn:text-white uppercase tracking-[0.2em]">
      Improve Score
    </span>
    <ChevronRight size={14} className="text-indigo-600 dark:text-indigo-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
  </Link>
</div>
                 );
              })()}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
           <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-[#09141e]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-slate-200/90 dark:border-white/5 shadow-sm dark:shadow-xl">
                 <h3 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] opacity-70"><Code2 className="text-indigo-600 dark:text-indigo-400" size={18}/> Technical Skills</h3>
                 <div className="flex flex-wrap gap-2.5">
                    {profileData?.skills?.map((skill, i) => (
                      <span key={i} className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold text-[9px] rounded-xl border border-indigo-200 dark:border-indigo-500/20 uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="bg-white dark:bg-[#09141e]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-slate-200/90 dark:border-white/5 shadow-sm dark:shadow-xl">
                 <h3 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] opacity-70"><Trophy className="text-indigo-600 dark:text-indigo-400" size={18} /> Achievements</h3>
                 <div className="space-y-4">
                   {profileData?.achievements?.map((ach, i) => (
                     <div key={i} className="flex gap-4 items-start group">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>
                        <p className="text-[11px] text-slate-700 dark:text-slate-400 font-medium uppercase tracking-wider leading-relaxed">{ach}</p>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="bg-white dark:bg-[#09141e]/60 rounded-[2.5rem] p-8 border border-slate-200/90 dark:border-white/5 shadow-sm dark:shadow-xl">
                 <h3 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] opacity-70"><Mail className="text-indigo-600 dark:text-indigo-400" size={18}/> Contact Details</h3>
                 <div className="space-y-4 text-[11px] font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer leading-none"><Mail size={16}/> {profileData?.resumeEmail || profileData?.email}</div>
                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer leading-none"><Phone size={16}/> {profileData?.phone}</div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-[#09141e]/60 backdrop-blur-3xl rounded-[3rem] p-8 sm:p-12 border border-slate-200/90 dark:border-white/5 shadow-sm dark:shadow-2xl relative overflow-hidden">
                 <h3 className="font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] opacity-70"><Briefcase className="text-indigo-600 dark:text-indigo-400" size={18}/> Experience History</h3>
                 <div className="space-y-12 relative before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-10px)] before:w-[1px] before:bg-indigo-500/20">
                    {profileData?.experience?.map((exp, i) => (
                      <div key={i} className="relative pl-10 group">
                         <div className="absolute left-0 top-1.5 w-[22px] h-[22px] bg-white dark:bg-[#09141e] rounded-full border border-indigo-600 z-10 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                         </div>
                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <div>
                               <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{exp.role}</h4>
                               <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wider mt-1.5 uppercase">{exp.company}</p>
                            </div>
                            <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-600/10 rounded-xl text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest border border-indigo-100 dark:border-indigo-500/10 h-fit mt-2 sm:mt-0 shadow-sm">{exp.duration}</span>
                         </div>
                         <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium italic opacity-90">"{exp.desc}"</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                 {profileData?.projects?.map((proj, i) => (
                    <div key={i} className="bg-white dark:bg-[#09141e]/60 border border-slate-200/90 dark:border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-400 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-xl">
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-base border border-indigo-100 dark:border-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                              <ExternalLink size={18}/>
                            </a>
                          )}
                       </div>
                       <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter leading-none">{proj.title}</h4>
                       <p className="text-[10px] text-indigo-600 dark:text-indigo-500 font-bold mb-4 uppercase tracking-wider leading-none">{proj.tech}</p>
                       <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic line-clamp-3 opacity-90">"{proj.desc}"</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
