import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Rocket, ChevronRight, Globe, Flame, 
  ArrowLeft, Target, Cpu, Code, ShieldCheck, Microscope, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RoadmapsPage = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const HIREMAP_LOGO = "/hiremap.jpg"; 

  const roadmaps = [
    {
      id: 1,
      role: "Full Stack Developer",
      craze: "90%",
      demand: "Critical",
      description: "Master the MERN stack with high-tier AI integration.",
      steps: [
        { title: "Frontend ", topics: ["HTML","CSS","Java script","Tailwind CSS","React js","Next js(Advanced)", ] },
        { title: "Backend Architecture", topics: ["Node.js", "Express", "PostgreSQL/MongoDB","Flask/Fast API(for AI integration)"] },
        { title: "AI integration", topics: ["LLM's API Handling"] }
      ]
    },
    {
      id: 2,
      role: "AI/ML Engineer",
      craze: "120%",
      demand: "Hyper-Growth",
      description: "Deep dive into Neural Networks and LLM fine-tuning.",
      steps: [
        { title: "python and libraries", topics: ["python","numpy", "pandas","matplotlib","seaborn"] },
        { title: "Mathematics", topics: ["Linear Algebra", "Calculus", "Probability"] },
        { title: "Machine Learning basics", topics: ["data preprocessing"] },
        { title: "Machile Learning", topics: ["supervised Learning","unsupervised Learning","reinforcement learning","sk-learn"] },
        { title: "Deep Learning", topics: ["ANN","cnn","rnn","transformers","NLP"] },
        { title: "AI Api's and backend", topics: ["flask/fast API","API's handling"] },
        { title: "Gen ai", topics: ["LangChain","RAG","vector database"] },
        { title: "Agentic AI", topics: ["langraph","RAG(advanced)"] },


      ]
    },
    
  ];

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#030712] font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* --- LEFT SIDE (30%): STRICTLY FIXED SIDEBAR --- */}
      <div className="hidden lg:flex lg:w-[30%] h-full flex-shrink-0 relative bg-[#09141e] flex-col justify-between p-12 border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
        </div>

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-12">
            <div className="space-y-6">
                
                <h1 className="text-5xl font-black text-white leading-none uppercase tracking-tighter ">
                    Career <br /> 
                    <span className="text-indigo-500">Pathways</span>
                </h1>
                <p className="text-slate-300 text-sm font-medium  border-l-2 border-indigo-500/30 pl-6 leading-relaxed">
                    Follow step-by-step roadmaps designed for different career roles and industries.
                </p>
                <p className="text-slate-300 text-sm font-medium  border-l-2 border-indigo-500/30 pl-6 leading-relaxed">
                    If your desired career path is not listed,drop a message in <b>contact us</b> page and we will create a roadmap for you.
                </p>
                
                <p className="text-slate-300 text-sm font-medium  border-l-2 border-indigo-500/30 pl-6 leading-relaxed">
                   Roadmaps are designed based on real job requirements and market demand.
                </p>
                <p className="text-slate-300 text-sm font-medium  border-l-2 border-indigo-500/30 pl-6 leading-relaxed">
                    Roadmaps are regularly updated to match evolving technologies and job trends.
                </p>
            </div>

            {/* STATIC GLOBAL INDEX CARD */}
            
        </motion.div>

        
      </div>

      {/* --- RIGHT SIDE (70%): SCROLLABLE INTERFACE (NO SCROLLBAR) --- */}
      <div className="flex-1 h-full relative overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        <Link to="/StudentDashboard" className="absolute top-8 right-8 p-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl hover:text-white hover:bg-white/10 transition-all shadow-xl z-[100] active:scale-90 backdrop-blur-xl">
          <X size={24} />
        </Link>

        <div className="flex flex-col items-center w-full min-h-full">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl p-6 md:p-12 space-y-12">
                <AnimatePresence mode="wait">
                    {!selectedRoadmap ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, x: -50 }}
                            key="list"
                            className="space-y-16 py-10"
                        >
                            <header className="space-y-2 text-center lg:text-left">
                                <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-none ">Select <span className="text-indigo-500">Path</span></h2>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {roadmaps.map((roadmap) => (
                                    <div 
                                        key={roadmap.id}
                                        onClick={() => setSelectedRoadmap(roadmap)}
                                        className="group relative p-10 bg-[#09141e]/60 border border-white/5 rounded-[3.5rem] cursor-pointer backdrop-blur-3xl shadow-2xl transition-all duration-700 hover:border-indigo-500/40 hover:-translate-y-2"
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-xl">
                                                {roadmap.role.includes("Full Stack") ? <Code size={32} /> : <Cpu size={32} />}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Market Demand</span>
                                                <span className="text-2xl font-black text-emerald-400 tracking-tighter">{roadmap.craze}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-none">{roadmap.role}</h3>
                                        <p className="text-slate-500 text-sm italic font-medium opacity-80 group-hover:opacity-100 transition-opacity mb-8">"{roadmap.description}"</p>
                                        <div className="flex justify-end pt-4">
                                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white transition-colors">
                                                Initialize <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: 50 }}
                            key="detail"
                            className="py-10 space-y-12 pb-24"
                        >
                            <button 
                                onClick={() => setSelectedRoadmap(null)}
                                className="flex items-center gap-4 text-slate-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <ArrowLeft size={16} />
                                </div>
                                Back to Selection
                            </button>

                            <div className="bg-[#09141e] border border-white/5 rounded-[3rem] p-12  relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[100px]" />
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter  leading-none mb-6 relative z-10">{selectedRoadmap.role}</h2>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl relative z-10 opacity-80">"{selectedRoadmap.description}"</p>
                            </div>

                            <div className="space-y-10 relative pl-4 md:pl-20">
                                <div className="absolute left-[34px] md:left-[62px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-indigo-500/40 via-white/10 to-transparent" />
                                {selectedRoadmap.steps.map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-10 md:-left-[28px] top-6 w-5 h-5 rounded-full bg-[#030712] border-2 border-indigo-500 flex items-center justify-center z-10 group-hover:scale-125 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                        </div>
                                        <div className="bg-[#09141e]/100 border border-white/5 p-10 rounded-[3rem] hover:border-indigo-500/30 transition-all duration-500 backdrop-blur-3xl shadow-2xl">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4">
                                                <span className="text-indigo-500 text-xs font-black bg-indigo-500/10 px-3 py-1 rounded-lg">Step 0{idx + 1}</span> 
                                                {step.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {step.topics.map((topic, i) => (
                                                    <span key={i} className="px-5 py-2.5 bg-[#030712] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-all cursor-default shadow-inner">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapsPage;