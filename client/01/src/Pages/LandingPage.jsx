import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Cpu, 
  Network, Globe, Activity,
  Zap, ShieldCheck, Radio, Search, 
  Swords, Briefcase, FileText,
  User, Rocket, Target, BarChart3,
  ChevronLeft, ChevronRight, Bot, Trophy, Map, Brain, Layers,
  Mail, Instagram, Twitter, Linkedin, Github, ExternalLink,
  Youtube, PlayCircle
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ThemeToggle from '../Components/ThemeToggle';

const LandingPage = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Assets
  const HIREMAP_LOGO = "/hiremap.jpg";

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const studentFeatures = [
    { name: 'HireFit Analyzer', icon: Rocket, color: 'indigo', desc: 'See your match score for any job before you apply.' },
    { name: 'Resume Battle', icon: Swords, color: 'indigo', desc: 'Compete against other applicants and see where you rank.' },
    { name: 'Job Discovery Bot', icon: Bot, color: 'indigo', desc: 'Our AI finds low-competition jobs that fit you perfectly.' },
    { name: 'Career Roadmaps', icon: Map, color: 'indigo', desc: 'Step-by-step guides to landing your dream tech role.' },
    { name: 'Championships', icon: Trophy, color: 'indigo', desc: 'Participate in skill challenges to prove your talent and earn verified badges.' },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0a0c14] overflow-x-hidden text-slate-800 dark:text-slate-100 selection:bg-indigo-500/20 font-sans transition-colors duration-200">
      
      {/* --- PROFESSIONAL BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* --- TOP NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 dark:bg-[#0a0c14]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-2xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/40 blur-xl rounded-full group-hover:bg-indigo-500/40 transition-all"></div>
              <img src={HIREMAP_LOGO} className="w-10 h-10 sm:w-12 h-12 rounded-xl relative z-10 border border-slate-200 dark:border-white/20 shadow-sm dark:shadow-2xl object-cover transition-transform group-hover:scale-110" alt="Logo" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">Hire<span className="text-indigo-600 dark:text-indigo-400">Map</span></span>
              <span className="text-[7px] sm:text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] mt-1">Smart Career Guidance</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 xl:gap-12 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#recruiter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Recruiters</a>
            <a href="#ecosystem" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AI Modules</a>
            <a href="/aboutus" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About us</a>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <ThemeToggle size="sm" />
            <Link to="/login" className="hidden sm:block text-[10px] font-black text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-[0.3em]">Sign In</Link>
            <Link to="/register" className="bg-slate-900 text-white dark:bg-white dark:text-black px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all active:scale-95 shadow-md dark:shadow-2xl">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen bg-slate-50/50 dark:bg-white/[0.03] w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-16 overflow-hidden border-b border-slate-200/80 dark:border-white/5 pt-20 lg:pt-0">
  
  {/* Background Engine (Kept Same) */}
  <div className="absolute inset-0 z-0 pointer-events-none">
    <div className="absolute top-[-5%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/5 dark:bg-indigo-100/10 rounded-full blur-[140px] opacity-60" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-100/10 rounded-full blur-[140px] opacity-40" />
  </div>

  <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
    
    {/* --- LEFT SIDE: CONTENT --- */}
    <motion.div 
      style={{ opacity }} 
      className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1"
    >
      <h5 className="text-4xl sm:text-6xl md:text-[6.5rem] lg:text-[7rem] xl:text-[4.5rem] font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] sm:leading-[0.85] uppercase">
        STOP APPLYING <br />
        <span className="text-indigo-600 dark:text-indigo-400 bg-clip-text bg-gradient-to-r">
          START WINNING
        </span>
      </h5>
      
      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
        Upload your Resume. Battle against top candidates. Get matched by AI, not by luck. 
        <span className="text-slate-900 dark:text-white font-semibold"> HireMap</span> connects your talent to the best companies instantly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start pt-6">
        <Link 
          to="/register" 
          state={{ role: 'student' }} 
          className="group px-8 sm:px-10 py-5 sm:py-6 bg-indigo-600 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-4 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 relative overflow-hidden active:scale-95"
        >
            Find My Dream Job <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          to="/register" 
          state={{ role: 'recruiter' }} 
          className="px-8 sm:px-10 py-5 sm:py-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-800 dark:text-white font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-4 hover:bg-slate-100 dark:hover:bg-white/10 transition-all backdrop-blur-xl active:scale-95 shadow-sm dark:shadow-none"
        >
          I'm Hiring
        </Link>
      </div>
    </motion.div>

    {/* --- RIGHT SIDE: PREMIUM NEURAL LOGO --- */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="order-1 lg:order-2 flex justify-center lg:justify-end relative"
    >
      <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
        {/* The "Neural Core" Logo */}
        <div className="relative z-10 group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
          <img src={HIREMAP_LOGO} className="w-100 h-80 sm:w-1400 h-80 rounded-[4rem] relative z-10 border border-slate-200 dark:border-white/20 shadow-xl dark:shadow-2xl object-cover transition-transform group-hover:scale-105" alt="Logo" />
        </div>
      </div>
    </motion.div>

  </div>

  {/* Background Bottom Image (Kept Same) */}
  <div className="absolute bottom-[-5%] sm:bottom-[-10%] w-full flex justify-center opacity-20 dark:opacity-30 pointer-events-none z-0">
     <img src="https://framerusercontent.com/images/4V6K7Z2g1p7k0k3.png" alt="neural" className="w-[600px] sm:w-[1200px]" />
  </div>
</section>

      {/* --- FEATURE SLIDER --- */}
      <section id="features" className="py-20 sm:py-32 relative z-20 overflow-visible bg-white dark:bg-transparent border-b border-slate-200/60 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
           <div className="space-y-4">
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Tools for <span className="text-indigo-600 dark:text-indigo-400">Success</span></h2>
              <p className="text-slate-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">Advanced features to help you stand out</p>
           </div>
           <div className="flex gap-4">
                <button onClick={() => scroll('left')} aria-label="Scroll left" className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all text-slate-700 dark:text-white shadow-sm dark:shadow-xl"><ChevronLeft size={20}/></button>
                <button onClick={() => scroll('right')} aria-label="Scroll right" className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all text-slate-700 dark:text-white shadow-sm dark:shadow-xl"><ChevronRight size={20}/></button>
            </div>
        </div>

        <div 
          ref={scrollRef} 
          className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-hide px-6 sm:px-10 pb-12 sm:pb-20 pt-10 snap-x overflow-y-visible" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {studentFeatures.map((f, i) => (
                <div key={i} className="snap-center shrink-0">
                    <FeatureCard {...f} />
                </div>
            ))}
        </div>
      </section>

      {/* --- RECRUITER SECTION --- */}
      <section id="recruiter" className="py-20 sm:py-32 bg-slate-50/80 dark:bg-white/[0.03] border-y border-slate-200/80 dark:border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 sm:gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
                <div className="absolute -inset-10 blur-[100px] rounded-full opacity-50" />
                <div className="bg-white dark:bg-[#0f111a] border border-slate-200/90 dark:border-white/10 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl dark:shadow-2xl relative z-10 overflow-hidden group">
                   <div className="flex justify-between items-center mb-6 sm:mb-10">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                         <span className="text-[8px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">AI Candidate Filter</span>
                      </div>
                   </div>

                   <div className="space-y-6 sm:space-y-8 font-mono">
                      <div className="p-4 sm:p-6 bg-slate-50 dark:bg-white/[0.04] rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 group-hover:border-rose-500/30 transition-all">
                        <p className="text-[8px] sm:text-[10px] text-rose-500 dark:text-rose-400 mb-2">{'>'} SCANNING TOP APPLICANTS...</p>
                        <div className="flex justify-between items-end">
                           <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Match Accuracy</h4>
                           <span className="text-2xl sm:text-3xl font-black text-rose-500 dark:text-rose-400">98.2%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full mt-4 overflow-hidden">
                           <motion.div initial={{ width: 0 }} whileInView={{ width: '98%' }} className="h-full bg-rose-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:gap-6">
                         <div className="p-4 sm:p-5 bg-slate-50 dark:bg-white/[0.03] rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 text-center">
                            <Target size={18} className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                            <p className="text-[7px] sm:text-[8px] font-black uppercase text-slate-500 mb-1">Precision</p>
                            <p className="text-slate-900 dark:text-white font-black text-sm sm:text-lg">Instant</p>
                         </div>
                         <div className="p-4 sm:p-5 bg-slate-50 dark:bg-white/[0.03] rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 text-center">
                            <Layers size={18} className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                            <p className="text-[7px] sm:text-[8px] font-black uppercase text-slate-500 mb-1">Verification</p>
                            <p className="text-slate-900 dark:text-white font-black text-sm sm:text-lg">Passed</p>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6 sm:space-y-10 text-center lg:text-left">
               <div className="space-y-4">
                  <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">For <br/><span className="text-rose-500 dark:text-rose-400">Recruiters</span></h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg leading-relaxed font-medium italic">Stop reading thousands of resumes. HireMap uses AI to rank every candidate based on real skills, so you only interview the best.</p>
               </div>
               <div className="space-y-5 sm:space-y-6">
                  <TerminalItem num="01" title="Better Hires" desc="Find candidates that actually fit your job requirements instantly." />
                  <TerminalItem num="02" title="AI Verification" desc="We check every resume claim so you don't have to." />
                  <TerminalItem num="03" title="Save Time" desc="Reduce your hiring time by 90% with our automated ranking system." />
               </div>
               <Link to="/register" state={{ role: 'recruiter' }} className="inline-flex items-center gap-4 text-[10px] sm:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest group">
                  Post a Job <div className="p-3 bg-rose-500 text-white rounded-xl group-hover:scale-110 transition-transform"><ChevronRight size={18}/></div>
               </Link>
            </div>
        </div>
      </section>

      {/* --- ECOSYSTEM SECTION --- */}
      <section id="ecosystem" className="py-20 sm:py-32 bg-white dark:bg-white/[0.03] mx-auto px-6">
         <div className="text-center mb-16 sm:mb-24 space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">AI <span className="text-indigo-600 dark:text-indigo-400 decoration-indigo-500/30 underline-offset-8">Modules</span></h2>
            <p className="text-slate-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.5em]">The Core of HireMap Technology</p>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <DeepDiveBox Icon={Rocket} title="HireFit Analyzer" desc="We scan your resume against job descriptions to show you exactly what to fix to get hired." color="indigo" />
            <DeepDiveBox Icon={Swords} title="Resume Battle" desc="See how you stack up against other job seekers and learn how to beat the competition." color="indigo" />
            <DeepDiveBox Icon={Bot} title="Job Discovery Bot" desc="Our bot hunts for high-paying jobs with low competition, giving you the best chance to win." color="indigo" />
            <DeepDiveBox Icon={Trophy} title="Championships" desc="Participate in skill challenges to prove your talent and earn verified badges." color="indigo" />
            <DeepDiveBox Icon={Network} title="Roadmaps" desc="Get a clear, AI-generated path to your next big promotion or career move." color="indigo" />
            <DeepDiveBox Icon={ShieldCheck} title="Skill Sync" desc="Your profile stays updated as you learn new skills, keeping you ready for recruiters 24/7." color="indigo" />
         </div>
      </section>

      {/* --- PREMIUM FOOTER --- */}
      <footer id="foot" className="w-full pt-10 sm:pt-12 pb-6 sm:pb-8 px-6 sm:px-10 border-t border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-[#080a12] relative z-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-16 mb-1 sm:mb-12">
             <div className="lg:col-span-2 space-y-8 sm:space-y-10 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-5">
                   <div className="p-2 rounded-xl shadow-md">
                      <img src={HIREMAP_LOGO} className="w-10 h-10 sm:w-12 h-12 rounded-xl relative z-10 border border-slate-200 dark:border-white/20 shadow-md object-cover" alt="Logo" />
                   </div>
                   <span className="text-3xl text-slate-900 dark:text-white font-black tracking-tighter uppercase">HireMap</span>
                </div>
                <p className="text-slate-600 dark:text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-sm italic opacity-90 mx-auto sm:mx-0">
                  Faster than job boards. Smarter than manual hiring.
                  Our AI helps companies discover the best talent instantly.
                </p>
                <div className="flex justify-center sm:justify-start gap-4 sm:gap-6">
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="HireMap on LinkedIn">
                    <FooterSocial Icon={Linkedin} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="HireMap on Instagram">
                    <FooterSocial Icon={Instagram} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" aria-label="HireMap on YouTube">
                    <FooterSocial Icon={Youtube} />
                  </a>
                </div>
             </div>

             <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Connect</p>
                <ul className="space-y-4 sm:space-y-5 text-[11px] sm:text-[14px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                    <li>
                        <Link to="/Collab" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center sm:justify-start gap-2 group">
                            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-700 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 rounded-full transition-all"></div>
                            COLLAB WITH US
                        </Link>
                    </li>
                    <li>
                        <Link to="/Contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center sm:justify-start gap-2 group">
                            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-700 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 rounded-full transition-all"></div>
                            CONTACT US
                        </Link>
                    </li>
                    <li>
                        <Link to="/AboutUs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center sm:justify-start gap-2 group">
                            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-700 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-400 rounded-full transition-all"></div>
                            ABOUT US
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="space-y-6 sm:space-y-8 text-center sm:text-left">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Legal</p>
                <ul className="space-y-4 sm:space-y-5 text-[11px] sm:text-[14px] font-black uppercase text-slate-700 dark:text-slate-300">
                    <li>
                        <Link to="/Terms" className="hover:text-rose-600 dark:hover:text-rose-300 transition-all flex items-center justify-center sm:justify-start gap-2 group">
                            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-700 group-hover:bg-rose-600 dark:group-hover:bg-rose-300 rounded-full transition-all"></div>
                            Terms and Conditions
                        </Link>
                    </li>
                    <li>
                        <Link to="/Privacy" className="hover:text-rose-600 dark:hover:text-rose-300 transition-all flex items-center justify-center sm:justify-start gap-2 group">
                            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-700 group-hover:bg-rose-600 dark:group-hover:bg-rose-300 rounded-full transition-all"></div>
                            Privacy policy
                        </Link>
                    </li>
                    <li>
                        <Link to="/Refund" className="hover:text-rose-600 dark:hover:text-rose-300 transition-all flex items-center justify-center sm:justify-start gap-2 group">
                            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-700 group-hover:bg-rose-600 dark:group-hover:bg-rose-300 rounded-full transition-all"></div>
                            Refund policy
                        </Link>
                    </li>
                    <li>
                        <Link to="/Pricing" className="hover:text-rose-600 dark:hover:text-rose-300 transition-all flex items-center justify-center sm:justify-start gap-2 group">
                            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-700 group-hover:bg-rose-600 dark:group-hover:bg-rose-300 rounded-full transition-all"></div>
                            Pricing
                        </Link>
                    </li>
                </ul>
            </div>
          </div>

          <div className="pt-8 sm:pt-10 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-[8px] sm:text-[9px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.5em]">© 2026 HIREMAP SYSTEMS • MADE FOR STUDENTS WITH ❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* --- HELPER COMPONENTS --- */

const FeatureCard = ({ name, icon: Icon, color, desc }) => {
  return (
    <div className="p-8 sm:p-10 w-[280px] sm:w-[380px] h-[320px] sm:h-[380px] rounded-[2.5rem] sm:rounded-[3.5rem] bg-white dark:bg-[#111827]/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl flex flex-col justify-between group hover:-translate-y-4 transition-all duration-500 relative z-30 shadow-md hover:shadow-xl dark:shadow-2xl">
       <div className="relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 dark:bg-[#0a0c14] text-slate-800 dark:text-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 border border-slate-200 dark:border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
             <Icon size={24} className="sm:size-[28px]" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3 leading-none">{name}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed italic opacity-85 group-hover:opacity-100 transition-opacity">"{desc}"</p>
       </div>
       <div className="relative z-10 flex justify-end">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all shadow-sm active:scale-90">
             <ArrowRight size={18} />
          </div>
       </div>
    </div>
  );
};

const TerminalItem = ({ num, title, desc }) => (
    <div className="flex gap-4 sm:gap-8 group cursor-pointer text-left">
        <span className="text-2xl sm:text-4xl font-black text-slate-300 dark:text-slate-700 group-hover:text-rose-500 transition-colors leading-none">{num}</span>
        <div>
            <h4 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1 sm:mb-2 leading-none group-hover:text-rose-500 transition-colors">{title}</h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base font-medium leading-tight italic opacity-80 group-hover:opacity-100 transition-opacity">"{desc}"</p>
        </div>
    </div>
);

const DeepDiveBox = ({ Icon, title, desc, color }) => {
    return (
        <div className="p-8 sm:p-12 bg-white dark:bg-[#111827]/70 border border-slate-200/80 dark:border-white/10 rounded-[2.5rem] sm:rounded-[3.5rem] transition-all duration-500 group relative overflow-hidden backdrop-blur-sm hover:border-indigo-500/50 shadow-sm hover:shadow-md dark:shadow-xl text-center sm:text-left">
            <Icon size={32} className="mx-auto sm:mx-0 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-white group-hover:scale-110 transition-all mb-8 sm:mb-10" />
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 leading-none">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">"{desc}"</p>
        </div>
    );
};

const FooterSocial = ({ Icon }) => (
  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm active:scale-90">
    <Icon size={18} />
  </div>
);

export default LandingPage;
