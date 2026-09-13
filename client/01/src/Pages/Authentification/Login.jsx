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
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0b0f19] font-sans overflow-hidden transition-colors duration-200">
      
      {/* --- LEFT SIDE: CRAZY VISUAL EXPERIENCE --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 dark:bg-[#09141e] items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 space-y-10 max-w-lg"
        >
            <div className="flex items-center gap-4">
                <img src={HIREMAP_LOGO} className="w-16 h-16 rounded-2xl shadow-2xl border-2 border-white/10" alt="Logo" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Hire<span className="text-indigo-400">Map</span></h1>
            </div>

            <div className="space-y-6">
                <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                    Get access
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed border-l-4 border-indigo-500 pl-6">
                    Enter your credentials to get access to our application.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 space-y-2">
                    <Activity className="text-emerald-400" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase">Trusted by</p>
                    <p className="text-2xl font-black text-white">1200+</p>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 space-y-2">
                    <Globe className="text-indigo-400" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase">Global Nodes</p>
                    <p className="text-2xl font-black text-white">128</p>
                </div>
            </div>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: COMPRESSED LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 relative">
        <Link 
          to="/" 
          aria-label="Return to Home"
          className="absolute top-6 right-6 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm active:scale-90 group z-[100]"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-5"
        >
            <header className="space-y-1">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                    Welcome <span className="text-indigo-600 dark:text-indigo-400">Back</span>
                </h3>
                <p className="text-slate-500 text-xs font-semibold">Sign in to your HireMap account</p>
            </header>

            {/* ROLE TOGGLE */}
            <div className="flex p-1 bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.2rem] shadow-inner relative overflow-hidden">
                <button 
                    type="button"
                    onClick={() => setRole('student')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${role === 'student' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <User size={13} /> Student
                </button>
                <button 
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${role === 'recruiter' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <Building2 size={13} /> Recruiter
                </button>
                <motion.div 
                    animate={{ x: role === 'student' ? '0%' : '100%' }}
                    className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-indigo-600 rounded-[1rem] shadow-sm"
                />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-wider">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={17} />
                        <input 
                            name="email" type="email" required value={formData.email} onChange={handleChange} 
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-11 py-3.5 rounded-[1.2rem] text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm text-sm" 
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
                        <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase ml-2 tracking-wider">Company Domain</label>
                        <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={17} />
                            <input 
                                name="companyEmail" type="email" required={role === 'recruiter'} value={formData.companyEmail} onChange={handleChange} 
                                className="w-full bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-11 py-3.5 rounded-[1.2rem] text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-semibold placeholder:text-indigo-300 text-sm" 
                                placeholder="hr@company.com" 
                            />
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-1">
                    <div className="flex justify-between items-center px-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                        <Link to="/ForgetPassword" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={17} />
                        <input 
                            name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} 
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-11 py-3.5 rounded-[1.2rem] text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm text-sm" 
                            placeholder="••••••••" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                        <Zap size={14} /> {error}
                    </motion.div>
                )}

                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-[1.2rem] transition-all shadow-md uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2.5 active:scale-[0.98]"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <> Login <ArrowRight className="group-hover:translate-x-1 transition-transform" size={15} /> </>
                    )}
                </button>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10"></div></div>
                <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest">
                    <span className="px-4 bg-slate-50 dark:bg-[#0b0f19] text-slate-400 dark:text-slate-500">Fast Pass</span>
                </div>
            </div>

            <div className="scale-95 origin-center">
                <GoogleButton 
                    text={`Continue with Google`} 
                    onClick={handleGoogleLogin} 
                />
            </div>

            <footer className="pt-2 text-center space-y-1">
                <p className="text-slate-500 text-xs">Don't have an account?</p>
                <Link to="/register" className="inline-block text-indigo-600 dark:text-indigo-400 hover:underline font-bold uppercase tracking-wider text-xs">
                    Sign Up
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