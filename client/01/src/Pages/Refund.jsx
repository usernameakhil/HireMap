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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F1F5F9] font-sans overflow-hidden selection:bg-amber-100">
      
      {/* --- LEFT SIDE: FINANCIAL HUB VISUAL --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] items-center justify-center p-16 overflow-hidden border-r border-slate-800">
        {/* Animated Amber Aura */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ 
            }} />
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 space-y-10 max-w-lg"
        >
            <div className="space-y-6">
                
                <h1 className="text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                    Fair <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400  decoration-amber-500/30 underline-offset-8">Clear</span> <br />
                    Simple
                </h1>
                <p className="text-slate-400 text-xl leading-relaxed border-l-4 border-amber-500 pl-6 font-medium opacity-80">
                    "Our coin system is built on trust. We believe in transparent exchanges and straightforward returns."
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-10">
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2">
                    <History className="text-amber-400" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Process Time</p>
                    <p className="text-lg font-bold text-white uppercase">48 Hours</p>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 space-y-2">
                    <CheckCircle className="text-emerald-400" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolution</p>
                    <p className="text-lg font-bold text-white uppercase">Guaranteed</p>
                </div>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: CONTENT PANEL --- */}
      <div className="w-full lg:w-1/2 h-screen flex items-center justify-center p-4 md:p-12 relative text-left">
        {/* Close Button */}
        <Link 
          to="/" 
          className="absolute top-6 right-6 p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-amber-600 transition-all shadow-lg active:scale-90 group z-[100]"
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
                    Refund <span className="text-amber-600">Policy</span>
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
            <footer className="pt-12 border-t border-slate-200 text-left space-y-8 pb-10">
                <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 group">
                    <div className="flex items-center gap-4 mb-4">
                        <Mail size={20} className="text-amber-600" />
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">6. Contact for Payment Issues</h4>
                    </div>
                    <p className="text-[12px] text-slate-600 font-medium pl-9">
                        Users may contact support for payment-related concerns via:<br />
                        <span className="text-slate-900 font-bold">Email: support@hiremap.com</span>
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100">
                    
                    <Link to="/contact" className="text-amber-600 hover:text-amber-700 font-black uppercase tracking-widest text-[10px] transition-all border-b border-amber-200">
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
  <div className="space-y-3 group transition-all duration-500">
    <div className="flex items-center gap-4">
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all duration-500 shadow-sm">
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

export default Refund;
