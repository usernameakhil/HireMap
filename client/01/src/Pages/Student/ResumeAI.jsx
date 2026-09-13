import { useState, useEffect } from 'react';
import { 
  UploadCloud, CheckCircle, AlertOctagon, BrainCircuit, ChevronRight, Zap, Target, 
  Send, MessageSquare, Bot, User as UserIcon, Loader2, Download, Sparkles, Wand2,
  Lock, ShoppingCart, Plus, Coins
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext'; 
import { jsPDF } from "jspdf";
import { useNavigate } from 'react-router-dom';

const ResumeAI = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const HIREMAP_LOGO = "/hiremap.jpg"; 

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  // --- LIVE COIN STATE ---
  const [liveCoins, setLiveCoins] = useState(user?.coins || 0);
  const [showCoinPopup, setShowCoinPopup] = useState(false);
  const REQUIRED_COINS = 5;

  const [messages, setMessages] = useState([
    { role: 'ai', text: "Neural analysis complete. I am ready to optimize your career trajectory. What specific refinements shall we discuss?" }
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Sync with Database/Redis on mount
  useEffect(() => {
    const fetchFreshData = async () => {
      if (!user?.token) return;
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setLiveCoins(data.coins);
        }
      } catch (err) {
        console.error("Neural Sync Error:", err);
      }
    };
    fetchFreshData();
  }, [user?.token, API_URL]);

  // --- LOGIC ---
  const handleAnalyze = async () => {
    if (!file) return alert("Please select a PDF first");

    // --- 1MB SIZE LIMIT CHECK ---
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large! Please upload a PDF under 1MB.");
      return;
    }

    if (liveCoins < REQUIRED_COINS) {
      setShowCoinPopup(true);
      return;
    }
    
    setLoading(true);
    setAnalysis(null); 
    
    setMessages([{ role: 'ai', text: "Neural analysis complete. I am ready to optimize your career trajectory. What specific refinements shall we discuss?" }]);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch(`${API_URL}/api/ai/resume-check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Analysis failed");
      
      // --- MODIFIED: SYNC WITH BACKEND ATOMIC DEDUCTION ---
      if (data.updatedCoins !== undefined) {
        setLiveCoins(data.updatedCoins);
      } else {
        // Fallback for visual continuity if backend doesn't return count
        setLiveCoins(prev => prev - REQUIRED_COINS);
      }
      
      setAnalysis(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setChatLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user?.token}` },
        body: JSON.stringify({ message: currentInput, context: analysis })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Chat failed");
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Connection disrupted. Re-initializing..." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDownloadAnalysis = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    const addCenteredText = (text, y, fontSize, color = [255, 255, 255]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    };

    const checkPageBreak = (neededHeight) => {
      if (yPos + neededHeight > 280) {
        doc.addPage();
        yPos = 20;
        doc.setFillColor(2, 6, 23); 
        doc.rect(0, 0, 210, 297, 'F');
      }
    };

    doc.setFillColor(2, 6, 23); 
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFont("helvetica", "bold");
    addCenteredText("ORBIT NEURAL RESUME INTEL", yPos, 22, [99, 102, 241]); 
    yPos += 15;

    const scoreColor = analysis.atsScore > 75 ? [16, 185, 129] : [244, 63, 94];
    addCenteredText(`ATS COMPATIBILITY INDEX: ${analysis.atsScore}%`, yPos, 18, scoreColor);
    yPos += 15;

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); 
    const summaryLines = doc.splitTextToSize(`SUMMARY: ${analysis.summary}`, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += (summaryLines.length * 7) + 10;

    const addSection = (title, items, titleColor) => {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
      doc.text(title, 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(203, 213, 225); 
      items?.forEach((item) => {
        const lines = doc.splitTextToSize(`• ${item}`, 170);
        checkPageBreak(lines.length * 7);
        doc.text(lines, 20, yPos);
        yPos += (lines.length * 6) + 2;
      });
      yPos += 8;
    };

    addSection("STRUCTURAL DEFICITS", analysis.criticalIssues, [244, 63, 94]); 
    addSection("NEURAL STRENGTHS", analysis.positivePoints, [16, 185, 129]); 
    addSection("OPTIMIZATION ROADMAP", analysis.deepImprovements, [99, 102, 241]); 

    if (analysis.keywordsMissing?.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(165, 180, 252); 
      doc.text("MISSING KEYWORD MESH", 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      const keywords = analysis.keywordsMissing.join(", ");
      const kwLines = doc.splitTextToSize(keywords, 170);
      doc.text(kwLines, 20, yPos);
    }
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    addCenteredText("GENERIC BY ORBIT AI ARCHITECT | CONFIDENTIAL INTEL", 285, 8);
    doc.save(`Orbit_Intel_${user?.name?.replace(" ", "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09141e] text-slate-800 dark:text-slate-200 font-sans pb-20 relative overflow-x-hidden transition-colors duration-200">
      
      {/* --- INSUFFICIENT COINS POPUP --- */}
      <AnimatePresence>
        {showCoinPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/60 dark:bg-black/40">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#030712] border border-slate-200 dark:border-white/10 p-10 rounded-[3rem] max-w-md w-full shadow-2xl text-center relative overflow-hidden text-slate-900 dark:text-white"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-md">
                <Lock size={36} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2 uppercase tracking-tighter">Credits Required</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                Analysis requires <span className="text-amber-500 font-bold">{REQUIRED_COINS} Credits</span>. 
                Your live balance is <span className="text-slate-900 dark:text-slate-200 font-bold">{liveCoins}</span>.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/CoinStore')}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingCart size={16} /> Purchase Credits
                </button>
                <button 
                  onClick={() => setShowCoinPopup(false)}
                  className="w-full py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest text-xs rounded-2xl transition-all border border-slate-200 dark:border-white/5"
                >
                  Cancel Protocol
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- BRANDED BACKGROUND AESTHETIC --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img src={HIREMAP_LOGO} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.015] dark:opacity-[0.02] grayscale blur-sm" alt="" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        
        {/* --- UPLOAD SECTION --- */}
        {!analysis && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 bg-white dark:bg-[#030712]/60 backdrop-blur-3xl rounded-[3rem] p-[1px] border border-slate-200/90 dark:border-white/5 shadow-sm dark:shadow-2xl">
              <div className="bg-white dark:bg-[#030712] rounded-[2.9rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 w-full overflow-hidden">
                  <label className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] h-72 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-[#020617]/50 hover:border-indigo-400 transition-all duration-300 group overflow-hidden relative shadow-inner">
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                    <div className="relative z-10 flex flex-col items-center w-full px-4">
                      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md text-indigo-600 dark:text-indigo-400">
                        <UploadCloud size={40} />
                      </div>
                      <p className="font-black text-xl text-slate-900 dark:text-white tracking-tighter uppercase truncate w-full text-center px-8">
                        {file ? file.name : "Initialize Upload"}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-2">Only PDFs | Limit: 1MB</p>
                    </div>
                  </label>
                </div>
                
                <div className="md:w-72 space-y-6">
                  <div className="bg-slate-50 dark:bg-[#020617] p-6 rounded-[2rem] border border-slate-200/80 dark:border-white/5 shadow-inner">
                    <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                      <Zap size={14} className="fill-current" /> Extraction Matrix
                    </h4>
                    <ul className="text-[10px] text-slate-600 dark:text-slate-400 space-y-3 font-bold uppercase tracking-wider leading-none">
                      <li className="flex gap-3 items-center"><Target size={14} className="text-emerald-500 shrink-0" /> ATS Compatibility</li>
                      <li className="flex gap-3 items-center"><BrainCircuit size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" /> Skill-Density</li>
                      <li className="flex gap-3 items-center"><Wand2 size={14} className="text-purple-500 shrink-0" /> Narrative Polish</li>
                    </ul>
                  </div>
                  <button onClick={handleAnalyze} disabled={!file} className={`w-full py-5 rounded-[1.8rem] font-black uppercase text-xs tracking-wider transition-all duration-300 ${!file ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-700 cursor-not-allowed border border-slate-200 dark:border-white/5' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95'}`}>
                    Start Analysis ({REQUIRED_COINS} Cr)
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet Integration Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white dark:bg-[#030712]/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-slate-200/90 dark:border-white/5 shadow-sm dark:shadow-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-6 ml-1">Wallet Integrity</h4>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                        <Coins className="text-amber-500 fill-amber-500" size={22} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{liveCoins}</span>
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">AI Credits</span>
                      </div>
                    </div>
                    <button onClick={() => navigate('/CoinStore')} className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all shadow-md">
                      <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-[#020617] rounded-full overflow-hidden shadow-inner border border-slate-200/80 dark:border-white/5">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${Math.min((liveCoins / REQUIRED_COINS) * 100, 100)}%` }}
                       className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" 
                       transition={{ duration: 1.5, ease: "easeOut" }}
                     ></motion.div>
                  </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- LOADING --- */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-[500px] animate-in fade-in duration-500">
            <div className="relative w-36 h-36 mb-10">
              <div className="absolute inset-0 border-[4px] border-indigo-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-[4px] border-indigo-600 dark:border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              <BrainCircuit className="absolute inset-0 m-auto text-indigo-600 dark:text-indigo-400 animate-pulse" size={50} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter animate-pulse">Scanning Uploaded Data...</h2>
            <p className="text-slate-500 mt-4 font-bold uppercase tracking-[0.3em] text-xs">Comparing profile against global industry benchmarks</p>
          </div>
        )}

        {/* --- ANALYSIS RESULTS --- */}
        {analysis && !loading && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/5 pb-8">
               <div className="space-y-2">
                 <p className="text-slate-700 dark:text-slate-300 text-lg font-medium italic">"{analysis.summary}"</p>
               </div>
               
               <div className="flex gap-4">
                 <button onClick={handleDownloadAnalysis} className="flex items-center gap-3 px-8 py-3.5 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-md active:scale-95">
                   <Download size={16} /> Download Analysis
                 </button>
                 <button onClick={() => { setAnalysis(null); setFile(null); }} className="px-8 py-3.5 bg-slate-100 dark:bg-[#030712] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                   New Scan
                 </button>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-[#030712]/60 backdrop-blur-3xl rounded-[3rem] p-10 border border-slate-200/90 dark:border-white/5 flex flex-col items-center text-center group transition-all duration-500 hover:border-indigo-400 shadow-sm dark:shadow-2xl">
                 <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8">HireMap Score</h3>
                 <div className="w-48 h-48 relative group-hover:scale-105 transition-transform duration-500">
                   <CircularProgressbar 
                     value={analysis.atsScore} 
                     text={`${analysis.atsScore}%`} 
                     styles={buildStyles({
                       pathColor: analysis.atsScore > 75 ? '#10b981' : analysis.atsScore > 50 ? '#6366f1' : '#f43f5e',
                       textColor: analysis.atsScore > 75 ? '#10b981' : analysis.atsScore > 50 ? '#6366f1' : '#f43f5e',
                       textSize: '22px',
                       trailColor: 'rgba(99,102,241,0.08)',
                       strokeLinecap: 'round'
                     })}
                   />
                 </div>
              </div>

              <div className="bg-rose-50 dark:bg-[#f43f5e]/5 rounded-[3rem] p-8 sm:p-10 border border-rose-200 dark:border-[#f43f5e]/20 backdrop-blur-sm shadow-sm dark:shadow-2xl">
                 <h3 className="text-[11px] font-black text-rose-600 dark:text-[#f43f5e] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                   <AlertOctagon size={18} /> Structural Deficits
                 </h3>
                 <ul className="space-y-4">
                   {analysis.criticalIssues?.map((issue, idx) => (
                     <li key={idx} className="flex gap-4 text-xs sm:text-sm text-slate-800 dark:text-slate-300 bg-white/80 dark:bg-[#f43f5e]/10 p-5 rounded-2xl border border-rose-100 dark:border-[#f43f5e]/10 font-medium italic">
                        <span className="font-black text-rose-500">•</span> {issue}
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="bg-emerald-50 dark:bg-[#10b981]/5 rounded-[3rem] p-8 sm:p-10 border border-emerald-200 dark:border-[#10b981]/20 backdrop-blur-sm shadow-sm dark:shadow-2xl">
                 <h3 className="text-[11px] font-black text-emerald-600 dark:text-[#10b981] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                   <CheckCircle size={18} /> Asset Density
                 </h3>
                 <ul className="space-y-4">
                   {analysis.positivePoints?.map((point, idx) => (
                     <li key={idx} className="flex gap-4 text-xs sm:text-sm text-slate-800 dark:text-slate-300 bg-white/80 dark:bg-[#10b981]/10 p-5 rounded-2xl border border-emerald-100 dark:border-[#10b981]/10 font-medium italic">
                        <span className="font-black text-emerald-500">✓</span> {point}
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="lg:col-span-3 bg-white dark:bg-[#030712]/80 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-14 border border-slate-200/90 dark:border-white/5 relative overflow-hidden group shadow-sm dark:shadow-2xl">
                 <h3 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                   <Zap size={18} fill="currentColor" /> Improve Your Resume
                 </h3>
                 <div className="grid md:grid-cols-2 gap-12 sm:gap-16">
                    <div className="space-y-6">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-l-2 border-indigo-500 pl-3">Required Refinements</p>
                      <ul className="space-y-5">
                        {analysis.deepImprovements?.map((imp, idx) => (
                          <li key={idx} className="flex gap-4 text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed group/item">
                             <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-black shrink-0">{idx+1}</span> 
                             <p className="flex-1 text-sm">"{imp}"</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-l-2 border-indigo-500 pl-3">Missing Keywords</p>
                      <div className="flex flex-wrap gap-3">
                         {analysis.keywordsMissing?.map((kw, idx) => (
                           <span key={idx} className="px-4 py-2 bg-slate-50 dark:bg-[#020617] border border-slate-200/90 dark:border-white/5 rounded-xl text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider hover:border-indigo-400 transition-colors shadow-inner">
                             {kw}
                           </span>
                         ))}
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* AI CHAT */}
            <div className="bg-white dark:bg-[#030712]/60 backdrop-blur-3xl rounded-[3rem] border border-slate-200/90 dark:border-white/5 overflow-hidden flex flex-col md:flex-row h-[700px] shadow-sm dark:shadow-2xl">
               <div className="bg-slate-50 dark:bg-[#020617]/50 p-8 md:w-80 border-r border-slate-200/80 dark:border-white/5 flex flex-col justify-between backdrop-blur-md">
                  <div>
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8 shadow-sm border border-indigo-100 dark:border-white/5">
                       <MessageSquare size={28}/>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">HireMap Bot</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8 italic">"Get real-time AI guidance to improve your professional profile"</p>
                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Suggested Prompts</p>
                       {["Improve my summary", "Review my experience", "Improve my skills section"].map((q, i) => (
                         <button key={i} onClick={() => setInput(q)} className="block w-full text-left p-4 rounded-xl bg-white dark:bg-[#020617] border border-slate-200/80 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-inner">
                           {q}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>

               <div className="flex-1 flex flex-col bg-white dark:bg-[#030712]/30 backdrop-blur-sm">
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                     {messages.map((msg, idx) => (
                       <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in duration-500`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-all ${msg.role === 'user' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 dark:bg-[#020617] text-indigo-600 dark:text-indigo-400 border-slate-200 dark:border-white/10'}`}>
                             {msg.role === 'user' ? <UserIcon size={18}/> : <Bot size={18}/>}
                          </div>
                          <div className={`p-5 rounded-[1.8rem] max-w-[80%] text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-50 dark:bg-[#030712]/80 text-slate-800 dark:text-slate-300 rounded-tl-none border border-slate-200/80 dark:border-white/5 italic'}`}>
                             {msg.text}
                          </div>
                       </div>
                     ))}
                     {chatLoading && (
                       <div className="flex gap-4 animate-pulse">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#020617] flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5"><Bot size={18} className="text-indigo-600"/></div>
                          <div className="bg-slate-50 dark:bg-[#030712]/40 p-5 rounded-[1.8rem] rounded-tl-none border border-slate-200 dark:border-white/5">
                             <div className="flex gap-2">
                               <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                               <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150"></span>
                               <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-300"></span>
                             </div>
                          </div>
                       </div>
                     )}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-6 border-t border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-[#020617]/50 backdrop-blur-xl">
                     <div className="flex gap-4">
                        <input 
                          type="text" 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask questions about your resume..." 
                          className="flex-1 bg-white dark:bg-[#030712] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-200 rounded-[1.8rem] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm shadow-inner placeholder:text-slate-400 dark:placeholder:text-slate-700"
                        />
                        <button type="submit" disabled={!input.trim() || chatLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 rounded-[1.8rem] transition-all shadow-md active:scale-95 disabled:opacity-30 duration-300 flex items-center justify-center">
                           <Send size={18} />
                        </button>
                     </div>
                  </form>
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeAI;
