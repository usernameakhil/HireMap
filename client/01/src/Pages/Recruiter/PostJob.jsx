import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, ArrowLeft, Loader2, Building2, Phone, Briefcase, 
  MapPin, DollarSign, Globe, Clock, FileStack, AlignLeft,
  CheckCircle2, Sparkles, Eye, Zap, Target, RefreshCcw,
  ShieldCheck, ArrowUpRight, Cpu, Radio, Network, X,ChevronRight 
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

const InputField = ({ label, icon: Icon, type = "text", placeholder, name, options, value, onChange, disabled }) => (
  <div className={`space-y-3 ${disabled ? 'opacity-40' : ''}`}>
    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-[0.3em] flex items-center gap-3 leading-none">
      <Icon size={14} className="text-indigo-500" /> {label}
    </label>
    {options ? (
      <div className="relative group">
        <select 
          disabled={disabled}
          className={`w-full bg-[#030712] border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold appearance-none text-xs uppercase tracking-widest ${disabled ? 'cursor-not-allowed' : 'cursor-pointer shadow-inner'}`}
          value={value} 
          onChange={(e) => onChange(e, name)}
        >
          {options.map(opt => <option key={opt} value={opt} className="bg-[#09141e]">{opt}</option>)}
        </select>
        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={16} className="rotate-90 text-indigo-400" />
        </div>
      </div>
    ) : (
      <input 
        disabled={disabled}
        type={type}
        required={name !== 'salary' && name !== 'website'}
        className={`w-full bg-[#030712] border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-bold placeholder:text-slate-700 text-sm shadow-inner ${disabled ? 'cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        value={value || ""} 
        onChange={(e) => onChange(e, name)}
      />
    )}
  </div>
);

const PostJob = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: '', company: '', phone: '', type: 'Full-time',
    mode: 'Remote', salary: '', address: '', description: '',
    website: '', visibilityDuration: '30 Days', cvLimit: 'No Limit'
  });

  useEffect(() => {
    if (isEditing) {
      const fetchJobData = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/jobs/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setFormData(res.data);
        } catch (err) {
          navigate('/HandlePosts');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchJobData();
    }
  }, [id, isEditing, user.token, API_URL, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cleanCvLimit = formData.cvLimit === 'No Limit' 
        ? 0 
        : parseInt(formData.cvLimit.replace(/\D/g, '')) || 0;

      const submissionData = { ...formData, cvLimit: cleanCvLimit };
      const endpoint = isEditing ? `${API_URL}/api/jobs/${id}` : `${API_URL}/api/jobs`;
      const method = isEditing ? 'put' : 'post';
      
      const response = await axios[method](endpoint, submissionData, {
        headers: { 
          'Authorization': `Bearer ${user.token}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.status === 201 || response.status === 200) { 
        navigate('/HandlePosts'); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Operation Failed.");
    } finally { 
      setLoading(false); 
    }
  };

  const handleChange = (e, name) => { 
    setFormData(prev => ({ ...prev, [name]: e.target.value })); 
  };

  if (initialLoading) return (
    <div className="min-h-screen bg-[#09141e] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-indigo-500" size={56} />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Accessing Node Matrix</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09141e] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* --- GRID BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0" style={{ 
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        
        {/* --- EXIT / RETURN BUTTON --- */}
        <Link to="/RecruiterDashboard" className="absolute top-8 right-8 p-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl hover:text-white hover:bg-white/10 transition-all shadow-xl z-[100] active:scale-90 backdrop-blur-xl">
          <X size={24} />
        </Link>

        <header className="mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              {isEditing ? 'Recalibrate' : 'Deploy'} 
              <span className="text-indigo-500 italic">Position</span>
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">
            <form onSubmit={handleSubmit} className="bg-[#030712]/60 border border-white/10 p-10 md:p-14 rounded-[4rem] backdrop-blur-3xl space-y-12 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField label="Target Position" icon={Target} name="title" placeholder="e.g. Lead Software Architect" value={formData.title} onChange={handleChange} />
                <InputField label="Company Name" icon={Building2} name="company" placeholder="Entity Name" value={formData.company} onChange={handleChange} />
                <InputField label="Phone" icon={Phone} name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
                <InputField label="Combany Website" icon={Globe} name="website" placeholder="https://company.io" value={formData.website} onChange={handleChange} />
                <InputField label="Job Type" icon={Briefcase} name="type" options={['Full-time', 'Internship', 'Contract', 'Part-time']} value={formData.type} onChange={handleChange} />
                <InputField label="Work " icon={Zap} name="mode" options={['Remote', 'On-site', 'Hybrid']} value={formData.mode} onChange={handleChange} />
                <InputField label="Salary" icon={DollarSign} name="salary" placeholder="e.g. ₹12L - ₹18L" value={formData.salary} onChange={handleChange} />
                <InputField label="Country and City" icon={MapPin} name="address" placeholder="City, Country" value={formData.address} onChange={handleChange} />
                <InputField label="Active Duration" icon={Clock} name="visibilityDuration" options={['7 Days', '15 Days', '30 Days', 'Forever']} value={formData.visibilityDuration} onChange={handleChange} disabled={isEditing} />
                <InputField label="CV's requirement" icon={FileStack} name="cvLimit" options={['50 CVs', '100 CVs', '500 CVs', 'No Limit']} value={formData.cvLimit} onChange={handleChange} disabled={isEditing} />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-[0.4em] flex items-center gap-3 leading-none">
                  <AlignLeft size={14} className="text-indigo-500" /> Job Description
                </label>
                <textarea 
                  required rows="8"
                  className="w-full bg-[#030712] border border-white/10 p-8 rounded-[3rem] text-slate-300 outline-none focus:border-indigo-500 transition-all font-medium leading-relaxed placeholder:text-slate-800 text-base shadow-inner no-scrollbar"
                  placeholder="Detail core operational objectives and technical requirements..."
                  value={formData.description}
                  onChange={(e) => handleChange(e, 'description')}
                />
              </div>

              <button 
                disabled={loading}
                className="w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[0.5em] text-xs transition-all duration-700 shadow-2xl flex items-center justify-center gap-4 bg-indigo-600 text-white hover:bg-white hover:text-black active:scale-95 disabled:opacity-20 shadow-indigo-500/20"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={20}/> {isEditing ? 'Finalize Recalibration' : 'Execute Broadcast'}</>}
              </button>
            </form>
          </div>

          {/* --- PREVIEW PANEL --- */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-12 space-y-8">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em] ml-6 italic">Grid Node Preview</p>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[4rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                
                <div className="relative bg-[#030712]/80 border border-white/10 p-12 rounded-[4rem] shadow-2xl backdrop-blur-3xl overflow-hidden">
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)`, backgroundSize: '32px 32px' }}></div>
                  
                  <div className="flex items-center gap-8 mb-12 relative z-10">
                    <div className="w-24 h-24 bg-[#09141e] border border-white/10 rounded-3xl flex items-center justify-center text-indigo-400 font-black text-5xl uppercase shadow-2xl group-hover:border-indigo-500/40 transition-all duration-500">
                      {formData.company ? formData.company.charAt(0) : "?"}
                    </div>
                    <div>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                        <ShieldCheck size={12} />Company Name
                      </p>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-indigo-400 transition-colors">
                        {formData.company || "Pending..."}
                      </h4>
                    </div>
                  </div>

                  <div className="mb-12 relative z-10">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-6 ">
                      {formData.title || "Position Title"}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                       <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-400 uppercase tracking-widest">{formData.type}</span>
                       <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[9px] font-black text-purple-400 uppercase tracking-widest">{formData.mode}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-10 gap-x-6 mb-12 relative z-10 border-t border-white/5 pt-12">
                    <div className="space-y-1">
                      <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Salary</p>
                      <p className="text-white font-bold text-sm tracking-tight">{formData.salary || "TBD"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">adress</p>
                      <p className="text-white font-bold text-sm tracking-tight truncate">{formData.address || "city"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">CV's requirement</p>
                      <p className="text-white font-bold text-sm tracking-tight">{formData.cvLimit}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">active duration</p>
                      <p className="text-white font-bold text-sm tracking-tight">{formData.visibilityDuration}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;