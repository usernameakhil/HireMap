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
  <div className={`space-y-2.5 ${disabled ? 'opacity-40' : ''}`}>
    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-[0.2em] flex items-center gap-2 leading-none">
      <Icon size={14} className="text-indigo-600 dark:text-indigo-400" /> {label}
    </label>
    {options ? (
      <div className="relative group">
        <select 
          disabled={disabled}
          className={`w-full bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-bold appearance-none text-xs uppercase tracking-wider ${disabled ? 'cursor-not-allowed' : 'cursor-pointer shadow-sm'}`}
          value={value} 
          onChange={(e) => onChange(e, name)}
        >
          {options.map(opt => <option key={opt} value={opt} className="bg-white dark:bg-[#09141e] text-slate-900 dark:text-white">{opt}</option>)}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={16} className="rotate-90 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    ) : (
      <input 
        disabled={disabled}
        type={type}
        required={name !== 'salary' && name !== 'website'}
        className={`w-full bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-700 text-sm shadow-sm ${disabled ? 'cursor-not-allowed' : ''}`}
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#09141e] text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/20 overflow-x-hidden relative transition-colors duration-200">
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        
        {/* --- EXIT / RETURN BUTTON --- */}
        <Link to="/RecruiterDashboard" aria-label="Return to Dashboard" className="absolute top-8 right-8 p-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-2xl hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-md z-[100] active:scale-95 backdrop-blur-xl">
          <X size={22} />
        </Link>

        <header className="mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85]">
              {isEditing ? 'Recalibrate' : 'Deploy'} 
              <span className="text-indigo-600 dark:text-indigo-400 italic"> Position</span>
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-10">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#030712]/60 border border-slate-200/90 dark:border-white/10 p-8 sm:p-12 md:p-14 rounded-[3.5rem] backdrop-blur-3xl space-y-10 shadow-sm dark:shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Target Position" icon={Target} name="title" placeholder="e.g. Lead Software Architect" value={formData.title} onChange={handleChange} />
                <InputField label="Company Name" icon={Building2} name="company" placeholder="Entity Name" value={formData.company} onChange={handleChange} />
                <InputField label="Phone" icon={Phone} name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
                <InputField label="Company Website" icon={Globe} name="website" placeholder="https://company.io" value={formData.website} onChange={handleChange} />
                <InputField label="Job Type" icon={Briefcase} name="type" options={['Full-time', 'Internship', 'Contract', 'Part-time']} value={formData.type} onChange={handleChange} />
                <InputField label="Work Mode" icon={Zap} name="mode" options={['Remote', 'On-site', 'Hybrid']} value={formData.mode} onChange={handleChange} />
                <InputField label="Salary" icon={DollarSign} name="salary" placeholder="e.g. ₹12L - ₹18L" value={formData.salary} onChange={handleChange} />
                <InputField label="Country and City" icon={MapPin} name="address" placeholder="City, Country" value={formData.address} onChange={handleChange} />
                <InputField label="Active Duration" icon={Clock} name="visibilityDuration" options={['7 Days', '15 Days', '30 Days', 'Forever']} value={formData.visibilityDuration} onChange={handleChange} disabled={isEditing} />
                <InputField label="CV Requirement" icon={FileStack} name="cvLimit" options={['50 CVs', '100 CVs', '500 CVs', 'No Limit']} value={formData.cvLimit} onChange={handleChange} disabled={isEditing} />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-[0.2em] flex items-center gap-2 leading-none">
                  <AlignLeft size={14} className="text-indigo-600 dark:text-indigo-400" /> Job Description
                </label>
                <textarea 
                  required rows="7"
                  className="w-full bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-white/10 p-6 rounded-[2.5rem] text-slate-800 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all font-medium leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-700 text-sm shadow-sm"
                  placeholder="Detail core operational objectives and technical requirements..."
                  value={formData.description}
                  onChange={(e) => handleChange(e, 'description')}
                />
              </div>

              <button 
                disabled={loading}
                className="w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs transition-all duration-300 shadow-md flex items-center justify-center gap-3 bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 disabled:opacity-30"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18}/> {isEditing ? 'Finalize Recalibration' : 'Execute Broadcast'}</>}
              </button>
            </form>
          </div>

          {/* --- PREVIEW PANEL --- */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-10 space-y-6">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] ml-4 italic">Live Job Preview</p>
              
              <div className="relative group">
                <div className="relative bg-white dark:bg-[#030712]/80 border border-slate-200/90 dark:border-white/10 p-10 rounded-[3.5rem] shadow-sm hover:shadow-md dark:shadow-2xl backdrop-blur-3xl overflow-hidden transition-all">
                  <div className="flex items-center gap-6 mb-10 relative z-10">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-[#09141e] border border-indigo-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-4xl uppercase shadow-sm">
                      {formData.company ? formData.company.charAt(0) : "?"}
                    </div>
                    <div>
                      <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1.5 flex items-center gap-1.5">
                        <ShieldCheck size={12} /> Company
                      </p>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                        {formData.company || "Pending..."}
                      </h4>
                    </div>
                  </div>

                  <div className="mb-10 relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight mb-4">
                      {formData.title || "Position Title"}
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                       <span className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{formData.type}</span>
                       <span className="px-3.5 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">{formData.mode}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-8 gap-x-6 mb-8 relative z-10 border-t border-slate-100 dark:border-white/5 pt-8">
                    <div className="space-y-1">
                      <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-wider">Salary</p>
                      <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">{formData.salary || "TBD"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-wider">Address</p>
                      <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight truncate">{formData.address || "City"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-wider">CV Requirement</p>
                      <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">{formData.cvLimit}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-wider">Active Duration</p>
                      <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">{formData.visibilityDuration}</p>
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