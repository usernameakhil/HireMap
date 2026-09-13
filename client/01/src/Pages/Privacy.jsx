import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  X, 
  ShieldCheck, 
  Eye, 
  Database, 
  UserCheck, 
  Zap, 
  ShieldAlert,
  Info,
  RefreshCw,
  Trash2,
  Share2,
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0b0f19] font-sans overflow-hidden transition-colors duration-200">
      
      {/* --- LEFT SIDE: SECURITY IMPACT --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 dark:bg-[#09141e] items-center justify-center p-16 overflow-hidden border-r border-slate-200/80 dark:border-white/5 transition-colors duration-200">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 space-y-10 max-w-lg"
        >
            <div className="space-y-6">
                <h1 className="text-6xl font-black text-white leading-[0.9] uppercase tracking-tighter italic">
                    Your Data. <br /> 
                    <span className="text-indigo-400">Your Rules.</span>
                </h1>
                <p className="text-slate-300 text-xl leading-relaxed italic border-l-4 border-indigo-500 pl-6 font-medium">
                    "We are committed to protecting user privacy and ensuring secure handling of personal information. Your identity is your property."
                </p>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: CONTENT PANEL --- */}
      <div className="w-full lg:w-1/2 h-screen flex items-center justify-center p-4 md:p-12 relative text-left">
        <Link 
          to="/" 
          aria-label="Return to Home"
          className="absolute top-6 right-6 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm active:scale-90 group z-[100]"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg h-full space-y-10 py-20 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4"
        >
            <header className="space-y-2 border-b border-slate-200/80 dark:border-white/5 pb-8">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                    Privacy <span className="text-indigo-600 dark:text-indigo-400">Policy</span>
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">Updated: March 2026</p>
            </header>

            <div className="space-y-10">
                <Section 
                    icon={Info}
                    title="1. Overview" 
                    content="This Privacy Policy explains how user information is collected, used, and protected when accessing or using the platform. We are committed to protecting user privacy and ensuring secure handling of personal information." 
                />

                <Section 
                    icon={Database}
                    title="2. Information We Collect" 
                    content="We collect limited information necessary for providing platform services, including: Resume or CV documents uploaded by the user, Email address, Phone number, and Basic profile information. We do not collect unnecessary or sensitive personal information beyond what is required for service functionality." 
                />

                <Section 
                    icon={Zap}
                    title="3. How We Use the Information" 
                    content="User information may be used for: Resume analysis and scoring, Job description matching, Generating career insights, Improving platform services, and Providing customer support. The data is processed only for the intended purpose of providing the services requested by the user." 
                />

                <Section 
                    icon={ShieldCheck}
                    title="4. Data Security" 
                    content="We implement appropriate security measures to protect user data including: Secure servers, Access control systems, Encryption and security protocols, and Restricted internal access to sensitive data. We take reasonable steps to ensure that user information remains protected against unauthorized access or misuse." 
                />

                <Section 
                    icon={Share2}
                    title="5. Data Sharing" 
                    content="User data is not sold or shared with third parties for marketing purposes. Data may only be shared with trusted service providers required to operate the platform, including payment processors and infrastructure providers." 
                />

                <Section 
                    icon={Server}
                    title="6. Data Retention" 
                    content="User data may be stored for as long as necessary to provide platform services and comply with legal obligations. Users may request deletion of their data by contacting the platform support team." 
                />

                <Section 
                    icon={UserCheck}
                    title="7. User Rights" 
                    content="Users have the right to: Access their personal information, Request correction of inaccurate data, Request deletion of stored data, and Withdraw consent for data processing." 
                />

                <Section 
                    icon={RefreshCw}
                    title="8. Updates to Privacy Policy" 
                    content="This Privacy Policy may be updated periodically to reflect improvements or regulatory changes. Users are encouraged to review the policy regularly." 
                />
            </div>

            <footer className="pt-8 border-t border-slate-200/80 dark:border-white/5 text-left space-y-6 pb-10">
                <div className="flex justify-center gap-8">
                    <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all">Terms</Link>
                    <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all">About Us</Link>
                </div>
            </footer>
        </motion.div>
      </div>
    </div>
  );
};

const Section = ({ icon: Icon, title, content }) => (
  <div className="space-y-2.5 group transition-all duration-300">
    <div className="flex items-center gap-3.5">
        <div className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
            <Icon size={17} />
        </div>
        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider leading-none">
            {title}
        </h4>
    </div>
    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium pl-12 italic">
        "{content}"
    </p>
  </div>
);

export default Privacy;