import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  X, 
  Zap, 
  Headphones, 
  ShieldCheck, 
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const ContactUs = () => {
  // --- LOGIC INTEGRATION ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // UPDATED PATH: Points to your new contactRoutes standardized endpoint
      const response = await fetch(`${API_URL}/api/support/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Transmission failed');

      setStatus({ type: 'success', message: 'Message transmitted to support core.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error("Fetch Error:", err);
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F1F5F9] font-sans overflow-hidden selection:bg-indigo-100">
      
      {/* --- LEFT SIDE: SIMPLE & POWERFUL MESSAGE --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-rose-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 space-y-10 max-w-lg"
        >
            <div className="space-y-6">
                <h1 className="text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                    We're Here <br /> 
                    <span className="text-rose-400">To Help</span>
                </h1>
                <p className="text-slate-400 text-xl leading-relaxed  border-l-4 border-rose-500 pl-6 font-medium">
                    Have a question? Need technical help? Our team is ready to support your journey.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-10">
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 space-y-2 group hover:bg-white/10 transition-all">
                    <Headphones className="text-rose-400" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Response Time</p>
                    <p className="text-2xl font-black text-white">{'<'} 24 Hours</p>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 space-y-2 group hover:bg-white/10 transition-all">
                    <ShieldCheck className="text-indigo-400" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security</p>
                    <p className="text-2xl font-black text-white">Encrypted</p>
                </div>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: CONTACT FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12 relative text-left">
        <Link 
          to="/" 
          className="absolute top-6 right-6 p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-rose-600 transition-all shadow-lg active:scale-90 group z-[100]"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-6"
        >
            <header className="space-y-1">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                    Contact <span className="text-rose-500">Us</span>
                </h3>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                {status.message && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${
                      status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 size={16}/> : <Zap size={16}/>}
                    {status.message}
                  </motion.div>
                )}

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Identity</label>
                    <div className="relative group">
                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                        <input name="name" type="text" required value={formData.name} onChange={handleChange}
                            className="w-full bg-white border border-slate-200 px-12 py-4 rounded-[1.2rem] text-slate-900 focus:border-rose-500 outline-none transition-all font-bold placeholder:text-slate-300 shadow-sm text-sm" 
                            placeholder="Your Name" 
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Return Email</label>
                    <div className="relative group">
                        <MailIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                        <input name="email" type="email" required value={formData.email} onChange={handleChange}
                            className="w-full bg-white border border-slate-200 px-12 py-4 rounded-[1.2rem] text-slate-900 focus:border-rose-500 outline-none transition-all font-bold placeholder:text-slate-300 shadow-sm text-sm" 
                            placeholder="email@example.com" 
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Message</label>
                    <div className="relative group">
                        <MessageSquare className="absolute left-5 top-6 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                        <textarea name="message" rows="4" required value={formData.message} onChange={handleChange}
                            className="w-full bg-white border border-slate-200 px-12 py-4 rounded-[1.2rem] text-slate-900 focus:border-rose-500 outline-none transition-all font-bold placeholder:text-slate-300 shadow-sm text-sm" 
                            placeholder="How can we assist you today?"
                        ></textarea>
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full bg-slate-900 hover:bg-rose-600 text-white font-black py-5 rounded-[1.2rem] transition-all shadow-lg uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 active:scale-[0.98] duration-500 group disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>send message <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} /></>}
                </button>
            </form>

            
        </motion.div>
      </div>
    </div>
  );
};

const UserIcon = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const MailIcon = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);

export default ContactUs;