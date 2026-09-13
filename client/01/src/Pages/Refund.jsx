import React from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCcw, 
  X, 
  Zap, 
  Coins, 
  ShieldAlert, 
  CreditCard, 
  ArrowRight,
  History,
  AlertTriangle,
  Mail,
  Scale,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Refund = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0b0f19] font-sans overflow-hidden transition-colors duration-200">
      
      {/* --- LEFT SIDE: FINANCIAL HUB VISUAL --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 dark:bg-[#09141e] items-center justify-center p-16 overflow-hidden border-r border-slate-200/80 dark:border-white/5 transition-colors duration-200">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 space-y-10 max-w-lg"
        >
            <div className="space-y-6">
                <h1 className="text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                    Fair <br /> 
                    <span className="text-amber-400">Clear</span> <br />
                    Simple
                </h1>
                <p className="text-slate-300 text-xl leading-relaxed border-l-4 border-amber-500 pl-6 font-medium">
                    "Our credit system is built on trust. We believe in transparent exchanges and straightforward service."
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2 shadow-sm">
                    <History className="text-amber-400" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Process Time</p>
                    <p className="text-lg font-bold text-white uppercase">48 Hours</p>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2 shadow-sm">
                    <CheckCircle className="text-emerald-400" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Resolution</p>
                    <p className="text-lg font-bold text-white uppercase">Guaranteed</p>
                </div>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: CONTENT PANEL --- */}
      <div className="w-full lg:w-1/2 h-screen flex items-center justify-center p-4 md:p-12 relative text-left">
        <Link 
          to="/" 
          aria-label="Return to Home"
          className="absolute top-6 right-6 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-white transition-all shadow-sm active:scale-90 group z-[100]"
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
                    Refund <span className="text-amber-600 dark:text-amber-400">Policy</span>
                </h3>
            </header>

            <div className="space-y-10">
              <Section 
                  icon={Coins}
                  title="1. Credit-Based Purchase Policy" 
                  content="HireMap operates on a prepaid credit system (“Credits”) that allows users to access premium AI-powered features such as resume analysis and job-fit insights. Credits are not a currency, have no monetary value outside the platform, and cannot be transferred, exchanged, or withdrawn." 
              />

              <Section 
                  icon={AlertTriangle}
                  title="2. No Refund Policy" 
                  content="All purchases of Credits are final and non-refundable once the transaction is successfully completed. Users are advised to review feature details and pricing before making a purchase." 
              />

              <Section 
                  icon={RefreshCcw}
                  title="3. Exceptions for Technical Issues" 
                  content="Refunds or credit reversals may be considered only in cases where a payment is completed but Credits are not added to the user’s account, or Credits are deducted without the requested service being delivered due to a verified technical error." 
              />

              <Section 
                  icon={Zap}
                  title="4. Service Usage Policy" 
                  content="Once Credits have been successfully used to access any feature or service on the platform, the transaction is considered complete and non-refundable." 
              />

              <Section 
                  icon={Scale}
                  title="5. Dispute & Support" 
                  content="Users may report payment-related issues through the official support channels provided on the platform. All requests will be reviewed and addressed within a reasonable timeframe." 
              />

              <Section 
                  icon={ShieldCheck}
                  title="6. Fraud & Misuse" 
                  content="HireMap reserves the right to suspend accounts or deny refunds in cases of suspected fraudulent activity, abuse of the platform, or violation of terms and policies." 
              />
            </div>

            <footer className="pt-8 border-t border-slate-200/80 dark:border-white/5 text-left space-y-6 pb-10">
                <div className="bg-amber-50/70 dark:bg-amber-500/10 p-6 rounded-[2rem] border border-amber-200 dark:border-amber-500/20 shadow-sm">
                    <div className="flex items-center gap-3 mb-2.5">
                        <Mail size={18} className="text-amber-600 dark:text-amber-400" />
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Payment Support</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pl-7">
                        Users may contact support for payment concerns via:<br />
                        <span className="text-slate-900 dark:text-white font-bold">Email: support@hiremap.com</span>
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <Link to="/contact" className="text-amber-600 dark:text-amber-400 hover:underline font-bold uppercase tracking-wider text-xs transition-all">
                        Raise Support Ticket
                    </Link>
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
        <div className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all shadow-sm">
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

export default Refund;
