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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F1F5F9] font-sans overflow-hidden">
      
      {/* --- LEFT SIDE: PREMIUM VISUAL PANEL --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        </div>

        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-10 max-w-lg">
            <div className="flex items-center gap-4">
                <img src={HIREMAP_LOGO} className="w-16 h-16 rounded-2xl shadow-2xl border-2 border-white/10" alt="Logo" />
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Hire<span className="text-indigo-500">Map</span></h1>
            </div>
            <div className="space-y-6">
                <h2 className="text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                    {showOtpStep ? "Verify Identity" : "Initialize Profile"}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed italic border-l-4 border-indigo-500 pl-6">
                    {showOtpStep ? "Secure verification in progress. Please check your inbox for the authorization code." : "Join the global neural network of high-performance talent and elite recruiters."}
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

      {/* --- RIGHT SIDE: COMPRESSED REGISTRATION FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 relative text-left">
        <Link to="/" className="absolute top-6 right-6 p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-lg active:scale-90 z-[100] group">
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-4">
            <AnimatePresence mode="wait">
              {!showOtpStep ? (
                <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <header className="space-y-1">
                      <h3 className="text-4xl font-black text-slate-700 tracking-tighter uppercase leading-none">
                          Create <span className="text-indigo-500">Account</span>
                      </h3>
                  </header>

                  <div className="flex p-1 bg-slate-100 rounded-[1.2rem] shadow-inner relative overflow-hidden">
                      <button onClick={() => setRole('student')} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1rem] text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${role === 'student' ? 'text-white' : 'text-slate-500'}`}>
                          <User size={12} /> Student
                      </button>
                      <button onClick={() => setRole('recruiter')} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[1rem] text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${role === 'recruiter' ? 'text-white' : 'text-slate-500'}`}>
                          <Building2 size={12} /> Recruiter
                      </button>
                      <motion.div animate={{ x: role === 'student' ? '0%' : '100%' }} className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-slate-900 rounded-[1rem] shadow-lg" />
                  </div>

                  <form onSubmit={handleRegisterInitiate} className="grid grid-cols-1 gap-3 text-left">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
                          <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                              <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full bg-white border border-slate-200 px-10 py-3 rounded-xl text-slate-900 focus:border-indigo-600 outline-none transition-all font-bold text-xs" placeholder="Name" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Phone</label>
                          <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                              <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full bg-white border border-slate-200 px-10 py-3 rounded-xl text-slate-900 focus:border-indigo-600 outline-none transition-all font-bold text-xs" placeholder="+91..." />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Auth Email</label>
                          <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full bg-white border border-slate-200 px-10 py-3 rounded-xl text-slate-900 focus:border-indigo-600 outline-none transition-all font-bold text-xs" placeholder="name@gmail.com" />
                          </div>
                      </div>

                      <AnimatePresence>
                          {role === 'recruiter' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1 overflow-hidden">
                              <label className="text-[9px] font-black text-indigo-500 uppercase ml-2 tracking-widest">Company Email</label>
                              <div className="relative group">
                                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                  <input name="companyEmail" type="email" required={role === 'recruiter'} value={formData.companyEmail} onChange={handleChange} className="w-full bg-indigo-50 border border-indigo-200 px-10 py-3 rounded-xl text-indigo-900 focus:border-indigo-600 outline-none transition-all font-bold text-xs" placeholder="hr@org.com" />
                              </div>
                          </motion.div>
                          )}
                      </AnimatePresence>

                      <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Create Password</label>
                          <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                              <input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className="w-full bg-white border border-slate-200 px-10 py-3 rounded-xl text-slate-900 focus:border-indigo-600 outline-none transition-all font-bold text-xs" placeholder="••••••••" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-all">
                                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                          </div>
                      </div>

                      {error && <p className="text-[9px] font-black text-rose-500 uppercase text-center">{error}</p>}

                      <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-[0.3em] text-[9px] flex items-center justify-center gap-3 active:scale-[0.98] group">
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <>Initialize Sync <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} /></>}
                      </button>
                  </form>

                  <div className="relative py-1">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                      <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]"><span className="px-4 bg-[#F1F5F9] text-slate-600">Fast Pass</span></div>
                  </div>

                  <div className="scale-95 origin-center"><GoogleButton text={`Register with Google`} onClick={handleGoogleLogin} /></div>

                  <footer className="pt-2 text-center border-t border-slate-100 mt-2">
                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest  mb-1">Already have an account?</p>
                      <Link to="/login" className="inline-block text-slate-900 hover:text-indigo-600 font-black uppercase tracking-widest text-[9px] transition-all border-b-2 border-indigo-200 pb-0.5 group">Login</Link>
                  </footer>
                </motion.div>
              ) : (
                /* --- COMPRESSED OTP STEP --- */
                <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto shadow-lg"><Shield size={32} /></div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Verify <span className="text-indigo-600">Email</span></h3>
                    <p className="text-slate-400 text-[10px] font-medium leading-tight">Code sent to: <span className="text-slate-900 font-bold">{formData.email}</span></p>
                  </div>

                  <form onSubmit={handleVerifyAndRegister} className="space-y-6">
                    <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-white border-2 border-slate-200 px-6 py-4 rounded-2xl text-slate-900 text-center text-3xl font-black tracking-[0.4em] outline-none focus:border-indigo-600 transition-all shadow-inner" placeholder="000000" required />
                    <div className="flex flex-col items-center gap-2">
                      <div className={`text-xl font-black ${timer < 10 ? 'text-rose-500 animate-pulse' : 'text-indigo-600'}`}>00:{timer < 10 ? `0${timer}` : timer}</div>
                      {timer === 0 && <button type="button" onClick={handleRegisterInitiate} className="text-[9px] font-black text-indigo-600 uppercase underline">Resend Code</button>}
                    </div>
                    <button type="submit" disabled={loading || timer === 0} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all shadow-lg uppercase tracking-[0.3em] text-[9px]">Complete Verification</button>
                    <button type="button" onClick={() => setShowOtpStep(false)} className="text-[9px] font-black text-slate-400 uppercase hover:text-slate-900">Edit Details</button>
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