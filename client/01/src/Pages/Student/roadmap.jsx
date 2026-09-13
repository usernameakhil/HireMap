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
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#030712] font-sans selection:bg-indigo-500/20 overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* --- LEFT SIDE (30%): STRICTLY FIXED SIDEBAR --- */}
      <div className="hidden lg:flex lg:w-[30%] h-full flex-shrink-0 relative bg-white dark:bg-[#09141e] flex-col justify-between p-12 border-r border-slate-200/80 dark:border-white/5 overflow-hidden transition-colors duration-200">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-10">
            <div className="space-y-6">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter">
                    Career <br /> 
                    <span className="text-indigo-600 dark:text-indigo-400">Pathways</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium border-l-2 border-indigo-500/30 pl-5 leading-relaxed">
                    Follow step-by-step roadmaps designed for different career roles and industries.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium border-l-2 border-indigo-500/30 pl-5 leading-relaxed">
                    If your desired career path is not listed, drop a message on the <b>Contact Us</b> page and we will create a roadmap for you.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium border-l-2 border-indigo-500/30 pl-5 leading-relaxed">
                   Roadmaps are designed based on real job requirements and market demand.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium border-l-2 border-indigo-500/30 pl-5 leading-relaxed">
                    Roadmaps are regularly updated to match evolving technologies and job trends.
                </p>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE (70%): SCROLLABLE INTERFACE (NO SCROLLBAR) --- */}
      <div className="flex-1 h-full relative overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        <Link to="/StudentDashboard" className="absolute top-6 right-8 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-2xl hover:text-slate-900 dark:hover:text-white transition-all shadow-md z-[100] active:scale-95 backdrop-blur-xl">
          <X size={22} />
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
                            className="space-y-12 py-6 sm:py-10"
                        >
                            <header className="space-y-2 text-center lg:text-left">
                                <h2 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Select <span className="text-indigo-600 dark:text-indigo-400">Path</span></h2>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {roadmaps.map((roadmap) => (
                                    <div 
                                        key={roadmap.id}
                                        onClick={() => setSelectedRoadmap(roadmap)}
                                        className="group relative p-8 sm:p-10 bg-white dark:bg-[#09141e]/60 border border-slate-200/90 dark:border-white/5 rounded-[3rem] cursor-pointer backdrop-blur-3xl shadow-sm hover:shadow-md dark:shadow-2xl transition-all duration-300 hover:border-indigo-400 hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-indigo-50 dark:bg-white/5 rounded-2xl border border-indigo-100 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                                {roadmap.role.includes("Full Stack") ? <Code size={28} /> : <Cpu size={28} />}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Market Demand</span>
                                                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{roadmap.craze}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3 leading-none">{roadmap.role}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm italic font-medium opacity-90 mb-6 line-clamp-3">"{roadmap.description}"</p>
                                        <div className="flex justify-end pt-2">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-white transition-colors">
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
                            className="py-8 space-y-10 pb-20"
                        >
                            <button 
                                onClick={() => setSelectedRoadmap(null)}
                                className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all uppercase text-[10px] font-black tracking-wider group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-white dark:group-hover:text-black transition-all shadow-sm">
                                    <ArrowLeft size={16} />
                                </div>
                                Back to Selection
                            </button>

                            <div className="bg-white dark:bg-[#09141e] border border-slate-200/90 dark:border-white/5 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden shadow-sm dark:shadow-2xl">
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-4 relative z-10">{selectedRoadmap.role}</h2>
                                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-medium leading-relaxed max-w-2xl relative z-10 opacity-90">"{selectedRoadmap.description}"</p>
                            </div>

                            <div className="space-y-8 relative pl-4 md:pl-20">
                                <div className="absolute left-[34px] md:left-[62px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-indigo-500/40 via-slate-300 dark:via-white/10 to-transparent" />
                                {selectedRoadmap.steps.map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-10 md:-left-[28px] top-6 w-5 h-5 rounded-full bg-white dark:bg-[#030712] border-2 border-indigo-600 flex items-center justify-center z-10 group-hover:scale-125 transition-transform shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                                        </div>
                                        <div className="bg-white dark:bg-[#09141e] border border-slate-200/90 dark:border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-400 transition-all duration-300 backdrop-blur-3xl shadow-sm hover:shadow-md dark:shadow-2xl">
                                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                                                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-black bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-lg">Step 0{idx + 1}</span> 
                                                {step.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-2.5">
                                                {step.topics.map((topic, i) => (
                                                    <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-[#030712] border border-slate-200/80 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 transition-all cursor-default">
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