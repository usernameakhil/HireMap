import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Zap, 
  FileText, 
  Cpu, 
  ShieldCheck,
  Users,
  Brain,
  Target,
  Rocket,
  MousePointerClick,
  Info,
  Coins,
  ShieldAlert,
  Search,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F1F5F9] font-sans overflow-hidden selection:bg-rose-100">
      
      {/* --- LEFT SIDE: THE VISIONARY HUB --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] items-center justify-center p-16 overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 space-y-10 max-w-lg"
        >
            <div className="space-y-6">
                <h1 className="text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter ">
                    About <br />
                    <span className="text-indigo-400 bg-clip-text bg-gradient-to-r decoration-indigo-500/30 ">HireMap</span>
                </h1>
                <p className="text-slate-400 text-xl leading-relaxed border-l-4 border-indigo-500 pl-6 font-medium opacity-80">
                    A fully AI-powered ecosystem bridging the gap between talent and opportunity without the traditional barriers.
                </p>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: FEATURE & COMPLIANCE PANEL --- */}
      <div className="w-full lg:w-1/2 h-screen flex items-center justify-center p-4 md:p-12 relative text-left">
        <Link 
          to="/" 
          className="absolute top-6 right-6 p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-lg active:scale-90 group z-[100]"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg h-full space-y-12 py-24 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4"
        >
            <header className="space-y-2 border-b border-slate-200 pb-8">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                    OUR <span className="text-indigo-500">MISSION</span>
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mt-2">Empowering the Next Generation of Professionals</p>
            </header>

            <div className="space-y-12">
    <Section 
        icon={Info}
        title="1. What is HireMap?" 
        content="HireMap is an AI-powered career tools platform. Our mission is to help students and job seekers improve their professional profiles and make better career decisions through intelligent, data-driven insights. The platform offers free job discovery features, while monetization is based only on optional premium AI tools." 
    />

    <Section 
        icon={Brain}
        title="2. AI-Powered Resume Analysis" 
        content="HireMap provides AI-driven resume analysis that evaluates structure, content, and effectiveness. Users receive actionable suggestions to improve their resumes and better align with industry expectations." 
    />

    <Section 
        icon={Zap}
        title="3. Smart Application Assistance" 
        content="HireMap offers intelligent tools that help users organize, track, and streamline their job application process. The platform provides relevant job suggestions and reduces manual effort while maintaining user control over applications." 
    />

    <Section 
        icon={Target}
        title="4. HireFit Analyzer" 
        content="HireFit analyzes how well a user's profile aligns with a specific job description. It highlights key skill gaps and provides insights to improve compatibility with desired roles." 
    />

    <Section 
        icon={Search}
        title="5. Job Discovery" 
        content="HireMap includes a curated job discovery section that helps users explore relevant opportunities based on their skills and preferences." 
    />

    <Section 
        icon={Cpu}
        title="6. Recruiter Tools" 
        content="For employers, HireMap provides AI-based tools to evaluate candidate profiles and simplify the hiring process through structured insights and matching systems." 
    />

    <Section 
        icon={Coins}
        title="7. Transparent Credit System" 
        content="HireMap operates on a transparent credit-based system. Credits are used only for accessing premium AI features such as advanced resume analysis and job-fit insights. Credits are non-transferable and cannot be withdrawn as cash." 
    />

    <Section 
        icon={ShieldCheck}
        title="8. Security & Trust" 
        content="We prioritize user data protection with secure authentication systems. HireMap is built to provide fair and accessible career tools without offering any job guarantees or placement services." 
    />
</div>
            <footer className="pt-12 border-t border-slate-200 text-left space-y-8 pb-10">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={16} className="text-indigo-500" />
                            <p className="text-[12px] text-slate-500 font-medium italic">
                                Built to empower students globally.
                            </p>
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">
                            © {new Date().getFullYear()} HireMap Systems. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </motion.div>
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, content }) => (
  <div className="space-y-3 group transition-all duration-500">
    <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500 shadow-sm">
            <Icon size={18} />
        </div>
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none pt-1">
            {title}
        </h4>
    </div>
    <p className="text-slate-500 text-[13px] leading-relaxed font-medium pl-14 italic opacity-80 group-hover:opacity-100 transition-opacity">
        "{content}"
    </p>
  </div>
);

export default AboutUs;
