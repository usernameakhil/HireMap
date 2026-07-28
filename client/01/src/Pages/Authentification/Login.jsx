import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Building2, User, Mail, Lock, Loader2, X, Sparkles, Target, Zap, Fingerprint, Globe, ShieldCheck, Activity, Eye, EyeOff } from 'lucide-react';
import GoogleButton from '../../Components/GoogleButton';
import { useAuth } from '../../Context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState('student'); 
  const [formData, setFormData] = useState({ email: '', password: '', companyEmail: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const HIREMAP_LOGO = "/hiremap.jpg"; 

  useEffect(() => {
    if (role === 'student') setFormData(prev => ({ ...prev, companyEmail: '' }));
    setError('');
  }, [role]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google?role=${role}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loginPayload = {
        email: formData.email,
        password: formData.password,
        role: role,
        ...(role === 'recruiter' && { companyEmail: formData.companyEmail })
      };
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      login(data);
      navigate(data.role === 'recruiter' ? '/RecruiterDashboard' : '/StudentDashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F1F5F9] font-sans overflow-hidden">
      
      {/* --- LEFT SIDE: CRAZY VISUAL EXPERIENCE --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute inset-0 opacity-10" style={{ 
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 space-y-10 max-w-lg"
        >
            <div className="flex items-center gap-4">
                <img src={HIREMAP_LOGO} className="w-16 h-16 rounded-2xl shadow-2xl border-2 border-white/10" alt="Logo" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Hire<span className="text-indigo-500">Map</span></h1>
            </div>

            <div className="space-y-6">
                <h2 className="text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                    Get access
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed border-l-4 border-indigo-500 pl-6">
                    Enter your credentials to get excess to our application.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-10">
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 space-y-2">
                    <Activity className="text-emerald-400" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase">Trusted by</p>
                    <p className="text-2xl font-black text-white">1200+</p>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 space-y-2">
                    <Globe className="text-indigo-400" size={24} />
                    <p className="text-[10px] font-black text-slate-500 uppercase">Global Nodes</p>
                    <p className="text-2xl font-black text-white">128</p>
                </div>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: COMPRESSED LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 relative">
        <Link 
          to="/" 
          className="absolute top-6 right-6 p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-lg active:scale-90 group z-[100]"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-4 sm:space-y-5"
        >
            <header className="space-y-1">
                <h3 className="text-4xl font-black text-slate-700 tracking-tighter uppercase leading-none">
                    Welcome <span className="text-indigo-500">Back</span>
                </h3>
            </header>

            {/* ROLE TOGGLE - COMPRESSED */}
            <div className="flex p-1 bg-slate-100 rounded-[1.2rem] shadow-inner relative overflow-hidden">
                <button 
                    onClick={() => setRole('student')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${role === 'student' ? 'text-white' : 'text-slate-500'}`}
                >
                    <User size={12} /> Student
                </button>
                <button 
                    onClick={() => setRole('recruiter')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${role === 'recruiter' ? 'text-white' : 'text-slate-500'}`}
                >
                    <Building2 size={12} /> Recruiter
                </button>
                <motion.div 
                    animate={{ x: role === 'student' ? '0%' : '100%' }}
                    className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-slate-900 rounded-[1rem] shadow-lg"
                />
            </div>

            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Auth Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            name="email" type="email" required value={formData.email} onChange={handleChange} 
                            className="w-full bg-white border border-slate-200 px-12 py-3.5 sm:py-4 rounded-[1.2rem] text-slate-900 focus:border-indigo-600 outline-none transition-all font-bold placeholder:text-slate-300 shadow-sm text-sm" 
                            placeholder="yourname@hiremap.com" 
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {role === 'recruiter' && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }} 
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="space-y-1 overflow-hidden"
                    >
                        <label className="text-[9px] font-black text-indigo-500 uppercase ml-2 tracking-widest">Company Domain</label>
                        <div className="relative group">
                            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-200 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                                name="companyEmail" type="email" required={role === 'recruiter'} value={formData.companyEmail} onChange={handleChange} 
                                className="w-full bg-indigo-50 border border-indigo-200 px-12 py-3.5 sm:py-4 rounded-[1.2rem] text-indigo-900 focus:border-indigo-600 outline-none transition-all font-bold placeholder:text-indigo-200 text-sm" 
                                placeholder="hr@company.com" 
                            />
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-1">
                    <div className="flex justify-between items-center px-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                        <Link to="/ForgetPassword" className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:text-slate-900 transition-colors  underline-offset-4">Forget?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} 
                            className="w-full bg-white border border-slate-200 px-12 py-3.5 sm:py-4 rounded-[1.2rem] text-slate-900 focus:border-indigo-600 outline-none transition-all font-bold placeholder:text-slate-300 shadow-sm text-sm" 
                            placeholder="••••••••" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} /> {error}
                    </motion.div>
                )}

                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-black py-4 sm:py-5 rounded-[1.2rem] transition-all shadow-lg shadow-indigo-100 uppercase tracking-[0.3em] text-[9px] flex items-center justify-center gap-3 active:scale-[0.98] duration-500 group"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <> Login <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} /> </>
                    )}
                </button>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]">
                    <span className="px-4 bg-[#F1F5F9] text-slate-500">Fast Pass</span>
                </div>
            </div>

            <div className="scale-95 origin-center">
                <GoogleButton 
                    text={`Continue with Google`} 
                    onClick={handleGoogleLogin} 
                />
            </div>

            <footer className="pt-2 text-center space-y-2">
                <p className="text-slate-800 text-[9px] font-black uppercase tracking-widest leading-none">Don't have an account?</p>
                <Link to="/register" className="inline-block text-slate-900 hover:text-indigo-600 font-black uppercase tracking-widest text-[9px] transition-all border-b-2 border-indigo-200 pb-0.5 group">
                    Sign<span className="group-hover:pl-1 transition-all">Up</span>
                </Link>
            </footer>
        </motion.div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className, size }) => (
    <svg 
        className={className} 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export default Login;