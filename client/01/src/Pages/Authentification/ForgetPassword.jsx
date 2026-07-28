import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, Key, ArrowRight, Loader2, User, Building2 } from 'lucide-react';
import Navbar from '../../Components/Navbar';

const ForgtPassword = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('student'); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // STEP 1: Request OTP from Backend
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setError(''); 
    setLoading(true);
    
    try {
      /**
       * The 'role' is passed here so the backend knows whether to search 
       * the StudentProfile or RecruiterProfile collection.
       */
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          role 
        }) 
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        setMessage(data.message || `OTP dispatched to your ${role} email.`);
      } else {
        setError(data.message || 'Identity not found in the matrix.');
      }
    } catch (err) {
      setError('Connection to Intelligence Matrix lost.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Reset the Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(''); 
    setError(''); 
    setLoading(true);

    try {
      /**
       * We pass 'role' again to ensure the final password update targets
       * the correct document in the specific collection.
       */
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          otp: otp.trim(), 
          newPassword, 
          role 
        })
      });
      const data = await res.json();

      if (res.ok) {
        // SUCCESS: Clear fields and notify user
        alert('Access Key Re-calibrated successfully.');
        // Pass the role back to login so the correct tab is selected
        navigate('/login', { state: { role } });
      } else {
        setError(data.message || 'Verification failed. Invalid OTP.');
      }
    } catch (err) {
      setError('Internal Sync Error during password update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-200">
      <Navbar />
      <div className="flex items-center justify-center py-24 px-4 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl w-full max-w-md relative z-10"
        >
          <header className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500">
              {step === 1 ? <Key size={30} /> : <ShieldCheck size={30} />}
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
              {step === 1 ? 'Recover Access' : 'Set New Key'}
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 italic">
              Initiating {role} Node Recovery
            </p>
          </header>

          {/* Role Toggle: Crucial for determining which DB to hit */}
          {step === 1 && (
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl mb-8">
              <button 
                onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${role === 'student' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                <User size={12} /> Student
              </button>
              <button 
                onClick={() => setRole('recruiter')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${role === 'recruiter' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                <Building2 size={12} /> Recruiter
              </button>
            </div>
          )}

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl mb-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={16} /> {message}
            </div>
          )}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl mb-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Mail size={16} /> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
                    {role === 'student' ? 'Primary Student Email' : 'Corporate Recruiter Email'}
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="email" required 
                      className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-bold placeholder:text-slate-700"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'student' ? 'student@gmail.com' : 'hr@company.com'}
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Request OTP <ArrowRight size={16}/></>}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword} 
                className="space-y-6"
              >
                 <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Verification Dossier (OTP)</label>
                  <input 
                    type="text" required 
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-500 text-center tracking-[0.5em] font-black text-xl placeholder:text-slate-800"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="######"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">New Neural Access Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input 
                      type="password" required 
                      className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold placeholder:text-slate-700"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Re-calibrate Key'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgtPassword;