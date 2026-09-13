import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building2, Mail, Lock, ShieldCheck, 
  Sparkles, Loader2, X, Target, Zap, 
  Phone, Shield, Activity, Globe, ArrowRight, Eye, EyeOff 
} from 'lucide-react';
import GoogleButton from '../../Components/GoogleButton';
import { useAuth } from '../../Context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(40);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    companyEmail: '', 
    password: '' 
  });

  const HIREMAP_LOGO = "/hiremap.jpg"; 

  useEffect(() => {
    let interval;
    if (showOtpStep && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpStep, timer]);

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google?role=${role}`;
  };

  const handleRegisterInitiate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, role: role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      setShowOtpStep(true);
      setTimer(40);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (timer === 0) return setError("OTP Expired. Please request a new one.");
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/register-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: role, otp: otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid OTP');
      login(data);
      navigate(role === 'student' ? '/StudentDashboard' : '/RecruiterDashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#0b0f19] font-sans overflow-hidden transition-colors duration-200">
      
      {/* --- LEFT SIDE: PREMIUM VISUAL PANEL --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 dark:bg-[#09141e] items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-10 max-w-lg">
            <div className="flex items-center gap-4">
                <img src={HIREMAP_LOGO} className="w-16 h-16 rounded-2xl shadow-2xl border-2 border-white/10" alt="Logo" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Hire<span className="text-indigo-400">Map</span></h1>
            </div>
            <div className="space-y-6">
                <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                    {showOtpStep ? "Verify Identity" : "Initialize Profile"}
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-indigo-500 pl-6">
                    {showOtpStep ? "Secure verification in progress. Please check your inbox for the authorization code." : "Join the global network of high-performance talent and top-tier companies."}
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

      {/* --- RIGHT SIDE: COMPRESSED REGISTRATION FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 relative text-left">
        <Link to="/" aria-label="Return to Home" className="absolute top-6 right-6 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm active:scale-90 z-[100] group">
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-4">
            <AnimatePresence mode="wait">
              {!showOtpStep ? (
                <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <header className="space-y-1">
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                          Create <span className="text-indigo-600 dark:text-indigo-400">Account</span>
                      </h3>
                      <p className="text-slate-500 text-xs font-semibold">Join HireMap to explore opportunities</p>
                  </header>

                  <div className="flex p-1 bg-slate-200/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[1.2rem] shadow-inner relative overflow-hidden">
                      <button type="button" onClick={() => setRole('student')} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${role === 'student' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                          <User size={13} /> Student
                      </button>
                      <button type="button" onClick={() => setRole('recruiter')} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1rem] text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${role === 'recruiter' ? 'text-slate-900 dark:text-white font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                          <Building2 size={13} /> Recruiter
                      </button>
                      <motion.div animate={{ x: role === 'student' ? '0%' : '100%' }} className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-indigo-600 rounded-[1rem] shadow-sm" />
                  </div>

                  <form onSubmit={handleRegisterInitiate} className="grid grid-cols-1 gap-3 text-left">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-wider">Full Name</label>
                          <div className="relative group">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={15} />
                              <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-9 py-3 rounded-xl text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-semibold text-xs shadow-sm" placeholder="Name" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-wider">Phone</label>
                          <div className="relative group">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={15} />
                              <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-9 py-3 rounded-xl text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-semibold text-xs shadow-sm" placeholder="+91..." />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-wider">Email Address</label>
                          <div className="relative group">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={15} />
                              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-9 py-3 rounded-xl text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-semibold text-xs shadow-sm" placeholder="name@gmail.com" />
                          </div>
                      </div>

                      <AnimatePresence>
                          {role === 'recruiter' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1 overflow-hidden">
                              <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase ml-2 tracking-wider">Company Email</label>
                              <div className="relative group">
                                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={15} />
                                  <input name="companyEmail" type="email" required={role === 'recruiter'} value={formData.companyEmail} onChange={handleChange} className="w-full bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-9 py-3 rounded-xl text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-semibold text-xs" placeholder="hr@org.com" />
                              </div>
                          </motion.div>
                          )}
                      </AnimatePresence>

                      <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-wider">Create Password</label>
                          <div className="relative group">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={15} />
                              <input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-9 py-3 rounded-xl text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-semibold text-xs shadow-sm" placeholder="••••••••" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-all">
                                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                          </div>
                      </div>

                      {error && <p className="text-[10px] font-bold text-rose-500 uppercase text-center">{error}</p>}

                      <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 rounded-xl transition-all shadow-md uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2.5 active:scale-[0.98]">
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <>Initialize Account <ArrowRight className="group-hover:translate-x-1 transition-transform" size={15} /></>}
                      </button>
                  </form>

                  <div className="relative py-1">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10"></div></div>
                      <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest"><span className="px-4 bg-slate-50 dark:bg-[#0b0f19] text-slate-400 dark:text-slate-500">Fast Pass</span></div>
                  </div>

                  <div className="scale-95 origin-center"><GoogleButton text={`Register with Google`} onClick={handleGoogleLogin} /></div>

                  <footer className="pt-2 text-center border-t border-slate-200 dark:border-white/10 mt-2">
                      <p className="text-slate-500 text-xs mb-0.5">Already have an account?</p>
                      <Link to="/login" className="inline-block text-indigo-600 dark:text-indigo-400 hover:underline font-bold uppercase tracking-wider text-xs">Login</Link>
                  </footer>
                </motion.div>
              ) : (
                /* --- COMPRESSED OTP STEP --- */
                <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto shadow-sm border border-indigo-100 dark:border-indigo-500/20"><Shield size={30} /></div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Verify <span className="text-indigo-600 dark:text-indigo-400">Email</span></h3>
                    <p className="text-slate-500 text-xs font-medium leading-tight">Code sent to: <span className="text-slate-900 dark:text-white font-bold">{formData.email}</span></p>
                  </div>

                  <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                    <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 px-6 py-4 rounded-2xl text-slate-900 dark:text-white text-center text-3xl font-black tracking-[0.4em] outline-none focus:border-indigo-600 transition-all shadow-inner" placeholder="000000" required />
                    <div className="flex flex-col items-center gap-2">
                      <div className={`text-xl font-black ${timer < 10 ? 'text-rose-500 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`}>00:{timer < 10 ? `0${timer}` : timer}</div>
                      {timer === 0 && <button type="button" onClick={handleRegisterInitiate} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase underline">Resend Code</button>}
                    </div>
                    <button type="submit" disabled={loading || timer === 0} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all shadow-md uppercase tracking-[0.3em] text-[10px]">Complete Verification</button>
                    <button type="button" onClick={() => setShowOtpStep(false)} className="text-[10px] font-bold text-slate-400 uppercase hover:text-slate-900 dark:hover:text-white">Edit Details</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;