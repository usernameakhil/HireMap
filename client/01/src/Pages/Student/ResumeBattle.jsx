import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, Trophy, AlertTriangle, Shield, Zap, UploadCloud, 
  X, Crown, Skull, BrainCircuit, Download, Target, ShieldCheck, Microscope
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { jsPDF } from "jspdf";
import { Link } from 'react-router-dom';

const ResumeBattle = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const HIREMAP_LOGO = "/hiremap.jpg"; 

  const [resumeA, setResumeA] = useState(null);
  const [resumeB, setResumeB] = useState(null);
  const [battling, setBattling] = useState(false);
  const [result, setResult] = useState(null);

  // --- DROPZONES ---
  const Dropzone = ({ file, setFile, label, color }) => {
    const onDrop = (acceptedFiles) => setFile(acceptedFiles[0]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false });

    const themes = {
      indigo: {
        active: 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400',
        hover: 'hover:border-indigo-500/50 hover:bg-indigo-500/5',
        icon: 'text-indigo-400'
      },
      rose: {
        active: 'border-rose-500/50 bg-rose-500/5 text-rose-400',
        hover: 'hover:border-rose-500/50 hover:bg-rose-500/5',
        icon: 'text-rose-400'
      }
    };

    if (file) {
      return (
        <div className={`relative h-64 rounded-[2.5rem] border-2 ${themes[color].active} backdrop-blur-3xl flex flex-col items-center justify-center p-8 text-center shadow-2xl transition-all duration-500`}>
          <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="absolute top-4 right-4 p-2 bg-[#020617] text-slate-400 rounded-full hover:text-white transition-all border border-white/10"><X size={16}/></button>
          <div className="w-16 h-16 bg-[#020617] rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-white/5">
            <Shield size={32} className="text-white" />
          </div>
          <h3 className="font-black text-sm text-white truncate max-w-full px-4 tracking-tight uppercase">{file.name}</h3>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-2 opacity-60">Ready for Combat</p>
        </div>
      );
    }

    return (
      <div {...getRootProps()} className={`h-64 rounded-[2.5rem] border-2 border-dashed border-white/10 bg-[#030712]/40 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-700 group shadow-inner ${themes[color].hover}`}>
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-[#020617] rounded-3xl flex items-center justify-center mb-4 text-slate-500 group-hover:scale-110 group-hover:text-white transition-all border border-white/5 shadow-xl">
          <UploadCloud size={32} />
        </div>
        <h3 className="font-black text-base text-slate-400 group-hover:text-white tracking-tighter uppercase">{label}</h3>
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mt-2 ">Upload PDF</p>
      </div>
    );
  };

  const startBattle = async () => {
    if (!resumeA || !resumeB) return alert("Both fighters must be present!");
    setBattling(true);
    setResult(null);
    const formData = new FormData();
    formData.append('resumeA', resumeA);
    formData.append('resumeB', resumeB);
    try {
      const response = await fetch(`${API_URL}/api/ai/battle`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user?.token}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTimeout(() => { setResult(data); setBattling(false); }, 1500);
    } catch (error) {
      alert("Battle Error: " + error.message);
      setBattling(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const doc = new jsPDF();
    const winnerName = result.winner === "Resume A" ? "ALPHA UNIT" : "BETA UNIT";
    doc.save(`Orbit_Battle_Intel_${winnerName.replace(" ", "_")}.pdf`);
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#030712] font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* --- LEFT SIDE (30%): STATIC HUB --- */}
      <div className="hidden lg:flex lg:w-[30%] h-full flex-shrink-0 relative bg-[#09141e] flex-col justify-between p-12 border-r border-white/5 overflow-hidden">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-12">
            <div className="space-y-6">
                <h1 className="text-5xl font-black text-white leading-none uppercase tracking-tighter ">
                    Resume <br /> 
                    <span className="text-indigo-500">Battle</span>
                </h1>
                <div className="space-y-4 text-slate-300 text-sm font-medium  border-l-2 border-indigo-500/30 pl-6 leading-relaxed">
                    <p>Compare two professional Resumes in the ResumeBattle</p>
                    <ul className="space-y-2 opacity-80 text-[10px] uppercase font-black tracking-widest">
                        <li>• Analyze and compare key skills across both Resumes</li>
                        <li>• Evaluate how impactful each experience section is</li>
                        <li>• Identify which resume aligns better with industry keywords</li>
                        <li>• Measure the strength of quantified achievements</li>
                        <li>• Detect clarity, organization, and readability quality</li>
                        <li>• Predict which resume is more likely to capture recruiter interest</li>
                        <li>• Compare how both resumes perform with ATS systems</li>
                        <li>• Highlight strengths that give one profile the edge</li>
                        <li>• Provide targeted suggestions to strengthen weaker sections</li>
                    </ul>
                </div>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE (70%): INTERACTIVE INTERFACE --- */}
      <div className="flex-1 h-full relative overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        <Link to="/StudentDashboard" className="absolute top-4 right-8 p-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl hover:text-white transition-all shadow-xl z-[100] active:scale-90 backdrop-blur-xl">
          <X size={24} />
        </Link>

        <div className="flex flex-col items-center w-full min-h-full">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl p-6 md:p-12 space-y-12">
                
                {battling ? (
                <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-10">
                    <div className="relative w-48 h-48">
                        <div className="absolute inset-0 border-8 border-indigo-500/10 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 border-8 border-rose-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                        <Swords className="absolute inset-0 m-auto text-white animate-pulse" size={64} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Processing Collision...</h3>
                        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.5em]">Evaluating Resumes</p>
                    </div>
                </div>
                ) : result ? (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
                    {/* The Verdict */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-full">
                            <Target size={14} /> Battle Result
                        </div>
                        <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                            {result.winner === "Resume A" ? "ALPHA" : "BETA"} <span className="text-indigo-500">DOMINANT</span>
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium  opacity-80 max-w-3xl mx-auto px-10 border-x border-white/5">
                            "{result.winnerReason}"
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <UnitCard name="ALPHA UNIT" score={result.scores.resumeA} winner={result.winner === 'Resume A'} color="indigo" />
                        <UnitCard name="BETA UNIT" score={result.scores.resumeB} winner={result.winner === 'Resume B'} color="rose" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <AnalysisCard icon={Zap} title="Impact" text={result.comparison.impact} />
                        <AnalysisCard icon={BrainCircuit} title="Skills" text={result.comparison.skills} />
                        <AnalysisCard icon={Target} title="Visual" text={result.comparison.formatting} />
                    </div>

                    <div className="bg-[#09141e] border border-white/5 rounded-[4rem] p-12 space-y-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[100px]" />
                        <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] flex items-center gap-3"><Zap size={20} className="fill-current" /> Unit Reconstruction Roadmap</h3>
                        <div className="grid gap-4">
                            {result.improvementPlan.map((p, i) => (
                                <div key={i} className="flex gap-6 items-center p-6 bg-[#030712]/80 rounded-[2rem] border border-white/5 hover:border-indigo-500/40 transition-all duration-500">
                                    <span className="text-2xl font-black text-indigo-600/20">0{i+1}</span>
                                    <p className="text-slate-400 font-medium text-base italic leading-relaxed">"{p}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 pt-10">
                        
                        <button onClick={() => { setResult(null); setResumeA(null); setResumeB(null); }} className="px-10 py-5 bg-white/5 border border-white/10 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3">
                            <Swords size={18} /> New Battle
                        </button>
                    </div>
                </motion.div>
                ) : (
                <div className="space-y-16 h-full flex flex-col justify-center py-10">
                    <div className="grid md:grid-cols-2 gap-12 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                            <div className="w-20 h-20 bg-[#030712] rounded-full border-4 border-[#09141e] flex items-center justify-center font-black text-3xl italic text-slate-700 shadow-2xl">VS</div>
                        </div>
                        <Dropzone file={resumeA} setFile={setResumeA} label="Initialize Alpha" color="indigo" />
                        <Dropzone file={resumeB} setFile={setResumeB} label="Initialize Beta" color="rose" />
                    </div>

                    <div className="flex justify-center pt-10">
                        <button onClick={startBattle} disabled={!resumeA || !resumeB || battling} className="px-16 py-8 bg-indigo-600 hover:bg-white hover:text-black text-white font-black rounded-[2.5rem] transition-all duration-700 uppercase tracking-[0.5em] text-xs flex items-center justify-center gap-4 disabled:opacity-20 active:scale-95 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                            <Swords size={20} className={battling ? "animate-spin" : ""} />start comparing
                        </button>
                    </div>
                </div>
                )}
            </motion.div>
        </div>
      </div>
    </div>
  );
};

const UnitCard = ({ name, score, winner, color }) => (
  <div className={`bg-[#09141e]/60 border ${winner ? (color === 'indigo' ? 'border-indigo-500/40' : 'border-rose-500/40') : 'border-white/5'} p-10 rounded-[3.5rem] relative overflow-hidden shadow-2xl`}>
    <div className="relative z-10 flex justify-between items-center mb-8">
        <h4 className="font-black text-2xl tracking-tighter uppercase italic">{name}</h4>
        {winner ? <Crown className="text-amber-400 animate-bounce" size={32} /> : <Skull className="text-slate-700" size={32}/>}
    </div>
    <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Battle Score</span>
            <span>{score}/100</span>
        </div>
        <div className="h-3 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5">
            <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.5 }} className={`h-full rounded-full ${color === 'indigo' ? 'bg-indigo-500' : 'bg-rose-500'} shadow-[0_0_20px_rgba(99,102,241,0.2)]`} />
        </div>
    </div>
  </div>
);

const AnalysisCard = ({ icon: Icon, title, text }) => (
  <div className="bg-[#09141e]/60 border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-center min-h-[220px] hover:border-indigo-500/20 transition-all shadow-xl">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-indigo-500 mb-6 border border-white/5">
      <Icon size={24} />
    </div>
    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">{title}</h4>
    <p className="text-sm text-slate-400 italic leading-relaxed opacity-80">"{text}"</p>
  </div>
);

export default ResumeBattle;