import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
  UploadCloud, FileText, CheckCircle, AlertTriangle, X, Wand2, 
  Briefcase, ArrowRight, Zap, Target, BrainCircuit,
  Coins, Plus, ShieldCheck, Microscope, Lock
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';

const HireFit = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [liveCoins, setLiveCoins] = useState(user?.coins || 0);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const REQUIRED_COINS = 2;
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB Limit

  useEffect(() => {
    const fetchFreshData = async () => {
      if (!user?.token) return;
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (response.ok) setLiveCoins(data.coins);
      } catch (err) { console.error("Neural Sync Error:", err); }
    };
    fetchFreshData();
    if (location.state?.jobDescription) setJobDescription(location.state.jobDescription);
  }, [user, location.state, API_URL]);

  const onDrop = (acceptedFiles, fileRejections) => {
    // Handle File Rejections (Size or Type)
    if (fileRejections.length > 0) {
      const errorType = fileRejections[0].errors[0].code;
      if (errorType === 'file-too-large') {
        alert("File is too large! Please upload a PDF under 1MB.");
      } else {
        alert("Invalid file type. Please upload a PDF.");
      }
      return;
    }

    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) { setFile(uploadedFile); setError(null); }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'] }, 
    multiple: false,
    maxSize: MAX_FILE_SIZE // Enforce the 1MB limit here
  });

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) { alert("Upload resume & paste job description."); return; }
    if (liveCoins < REQUIRED_COINS) { setShowCoinPopup(true); return; }
    setAnalyzing(true); setResult(null); setError(null);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch(`${API_URL}/api/analyze/resume`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user?.token}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Analysis failed");
      setLiveCoins(prev => prev - REQUIRED_COINS);
      setResult(data);
    } catch (err) { setError(err.message); } finally { setAnalyzing(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#030712] font-sans selection:bg-indigo-500/20 overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* --- LEFT SIDE (30%): STATIC SYSTEM HUB --- */}
      <div className="hidden lg:flex lg:w-[30%] relative bg-white dark:bg-[#09141e] flex-col justify-between p-12 overflow-hidden border-r border-slate-200/80 dark:border-white/5 transition-colors duration-200">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-10">
            <div className="space-y-6">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter">
                    Hire<span className="text-indigo-600 dark:text-indigo-400">Fit</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium border-l-2 border-indigo-500/30 pl-5 leading-relaxed">
                  Upload a job description and your resume (PDF).
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium border-l-2 border-indigo-500/30 pl-5 leading-relaxed">
                  HireFit Analyzer compares both and shows how well your profile matches the job.
                </p>
                <div className="border-l-2 border-indigo-500/30 pl-5 space-y-2">
                  <p className="text-slate-800 dark:text-slate-200 text-sm font-bold">You will get:</p>
                  <ul className="text-xs font-semibold text-slate-600 dark:text-slate-400 space-y-1">
                    <li>• A match score showing how closely your resume fits the role</li>
                    <li>• Skill gaps between your resume and the job requirements</li>
                    <li>• Improvement suggestions to help increase your score</li>
                  </ul>
                </div>
            </div>

            {/* WALLET HUD (STATIC) */}
            <div className="bg-slate-50 dark:bg-[#030712]/60 border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-xl shadow-sm dark:shadow-2xl">
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
                    <button onClick={() => navigate('/CoinStore')} className="bg-indigo-600 p-3 rounded-xl text-white hover:bg-indigo-500 transition-all shadow-md active:scale-95">
                        <Plus size={20} strokeWidth={3}/>
                    </button>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((liveCoins/REQUIRED_COINS)*100, 100)}%` }} className="h-full bg-amber-500" />
                </div>
                <p className="text-[9px] text-center font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Coins Required: {REQUIRED_COINS} </p>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE (70%): DYNAMIC INTERFACE --- */}
      <div className="w-full lg:w-[70%] flex flex-col items-center justify-start p-6 md:p-12 relative overflow-y-auto no-scrollbar h-screen">
        <Link to="/StudentDashboard" className="absolute top-8 right-8 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all shadow-md z-[100]">
          <X size={22} />
        </Link>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl space-y-10 pb-24">
            
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-40 text-center space-y-8">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 border-6 border-indigo-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-6 border-indigo-600 dark:border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  <BrainCircuit className="absolute inset-0 m-auto text-indigo-600 dark:text-indigo-400 animate-pulse" size={54} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Analyzing Resume</h3>
              </div>
            ) : result ? (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Score Section */}
                <div className="bg-white dark:bg-[#09141e] border border-slate-200/90 dark:border-white/5 rounded-[3.5rem] p-10 sm:p-12 flex flex-col md:flex-row items-center gap-12 sm:gap-16 shadow-sm dark:shadow-2xl relative overflow-hidden group">
                  <div className="w-52 h-52 flex-shrink-0">
                      <CircularProgressbar 
                        value={result.matchPercentage} 
                        text={`${result.matchPercentage}%`} 
                        styles={buildStyles({ 
                            pathColor: '#6366f1', 
                            textColor: '#6366f1', 
                            trailColor: 'rgba(99,102,241,0.08)',
                            strokeLinecap: 'round'
                        })} 
                      />
                  </div>
                  <div className="space-y-5 flex-1 text-center md:text-left relative z-10">
                      <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none italic">
                        {result.matchPercentage > 70 ? "OPTIMIZED MATCH" : "GAP DETECTED"}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium italic opacity-90">
                        {result.matchPercentage > 70 
                            ? '"Your Resume shows high-level alignment with target requirements."' 
                            : '"Skill gaps identified. Optimization recommended."'}
                      </p>
                      <button onClick={() => {setResult(null); setFile(null); setJobDescription("");}} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 transition-all shadow-md active:scale-95">
                        Initialize New Scan
                      </button>
                  </div>
                </div>

                {/* Deficits & Assets */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-[2.5rem] p-8 space-y-5">
                        <h3 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.3em] flex items-center gap-2"><AlertTriangle size={16}/> Missing Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.missingSkills?.length > 0 ? result.missingSkills.map((s, i) => (
                                <span key={i} className="px-3.5 py-1.5 bg-white dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-xl border border-rose-200 dark:border-rose-500/20 uppercase tracking-wider">{s}</span>
                            )) : <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold italic">No missing skills detected.</p>}
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-[2.5rem] p-8 space-y-5">
                        <h3 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-2"><CheckCircle size={16}/> Asset Density</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.strengths?.map((str, i) => (
                                <span key={i} className="px-3.5 py-1.5 bg-white dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-xl border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wider">{str}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Optimization Roadmap */}
                <div className="bg-white dark:bg-[#09141e] border border-slate-200/90 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-sm dark:shadow-2xl">
                   <h3 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-2"><Wand2 size={18} /> Optimization Steps</h3>
                   <div className="grid gap-3">
                      {result.improvementPoints?.map((point, i) => (
                        <div key={i} className="flex gap-5 items-center p-5 bg-slate-50 dark:bg-[#030712]/50 rounded-[1.8rem] border border-slate-200/80 dark:border-white/5 hover:border-indigo-400 transition-all">
                           <span className="text-2xl font-black text-indigo-500/30">0{i+1}</span>
                           <p className="text-slate-700 dark:text-slate-300 font-medium text-base italic leading-relaxed">"{point}"</p>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            ) : (
              /* --- STATIC INITIAL INPUT VIEW --- */
              <div className="space-y-8">
                <header className="space-y-1">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em] ml-1">Analyze Your Resume</p>
                </header>

                <div className="grid gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-wider flex items-center gap-2"><Briefcase size={14}/> Job Description</label>
                        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows="6" className="w-full bg-white dark:bg-white/[0.02] border border-slate-200/90 dark:border-white/5 px-6 py-5 rounded-[2rem] text-slate-900 dark:text-slate-200 focus:border-indigo-500 outline-none transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-700 text-sm shadow-inner" placeholder="Paste requirements here..."></textarea>
                    </div>

                    <div {...getRootProps()} className={`border-2 border-dashed rounded-[2.5rem] p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.01] hover:border-indigo-400'}`}>
                        <input {...getInputProps()} />
                        {file ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-600/10 rounded-2xl border border-indigo-200 dark:border-indigo-500/20"><FileText size={28} className="text-indigo-600 dark:text-indigo-400" /></div>
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{file.name}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-slate-500">
                                <UploadCloud size={36} className="text-indigo-600 dark:text-indigo-400" />
                                <div className="text-center">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-400">Drop Resume (PDF)</p>
                                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Limit: 1MB</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={handleAnalyze} disabled={!file || !jobDescription} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2rem] transition-all uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95 shadow-lg shadow-indigo-500/20">
                        <Zap size={18} className="fill-current" /> Analyze Protocol
                    </button>
                </div>
              </div>
            )}
        </motion.div>
      </div>

      {/* --- COIN POPUP --- */}
      <AnimatePresence>
        {showCoinPopup && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 dark:bg-black/80">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-[#09141e] border border-slate-200 dark:border-white/10 p-10 rounded-[3rem] max-w-sm w-full shadow-2xl text-center space-y-6 text-slate-900 dark:text-white">
              <Lock size={44} className="text-amber-500 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Insufficient Credits</h2>
                <p className="text-slate-500 text-sm font-medium italic">"Required: {REQUIRED_COINS} Cr. Balance low."</p>
              </div>
              <button onClick={() => navigate('/CoinStore')} className="w-full py-4 bg-amber-500 text-black font-black uppercase text-xs rounded-xl shadow-md">Purchase Credits</button>
              <button onClick={() => setShowCoinPopup(false)} className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold uppercase text-xs rounded-xl">Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HireFit;
