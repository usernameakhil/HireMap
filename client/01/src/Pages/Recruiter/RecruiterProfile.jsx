import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building2, Briefcase, Mail, Phone, MapPin, 
  Globe, Linkedin, ShieldCheck, Award, Target, 
  Save, Loader2, Sparkles, Plus, Trash2, 
  Edit3, Zap, Box, Layout, Activity,
  Database, Cpu, ChevronRight, BadgeCheck, ExternalLink,
  Info, BriefcaseBusiness, Building, GraduationCap, Map, X
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';

const RecruiterProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const [profile, setProfile] = useState({
    fullName: '',
    designation: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    companyName: '',
    companyWebsite: '',
    companyIndustry: 'Technology',
    officeAddress: '',
    aboutMe: '',
    hiringSpecialties: [],
    isVerified: false 
  });

  const [tempTag, setTempTag] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/recruiter/profile`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.data) setProfile(prev => ({ ...prev, ...res.data }));
      } catch (err) { 
        console.error("Profile Sync Error", err); 
      } finally { 
        setLoading(false); 
      }
    };
    if (user?.token) fetchProfile();
  }, [user.token, API_URL]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/api/recruiter/profile`, profile, {
        headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }
      });
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) { 
      alert("Update Failed"); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return (
    <div className="h-screen bg-slate-50 dark:bg-[#030712] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-500" size={54} />
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-[#030712] font-sans selection:bg-indigo-500/20 overflow-hidden text-slate-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* --- LEFT SIDE (30%): IDENTITY CONSOLE --- */}
      <div className="hidden lg:flex lg:w-[30%] h-full flex-shrink-0 relative bg-white dark:bg-[#09141e] flex-col justify-between p-12 border-r border-slate-200/80 dark:border-white/5 overflow-hidden transition-colors duration-200">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-8">
            <div className="space-y-5 text-center lg:text-left">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl uppercase shadow-md mx-auto lg:mx-0">
                    {profile.fullName?.charAt(0) || "P"}
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                        {profile.fullName || "Name"}
                    </h1>
                    <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        {profile.designation || "Designation"}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <StaticInfo icon={Mail} label={profile.email || "Email"} />
                <StaticInfo icon={Phone} label={profile.phone || "Phone"} />
                <StaticInfo icon={Linkedin} label="Identity Verified" />
            </div>

            <div className="bg-slate-50 dark:bg-[#030712]/60 border border-slate-200/80 dark:border-white/5 p-6 rounded-[2rem] space-y-4 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Hiring Specialties</p>
                <div className="flex flex-wrap gap-2">
                    {profile.hiringSpecialties.slice(0, 5).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase rounded-lg">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-3 text-slate-400 dark:text-slate-600 text-xs">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Partner Encryption Active</span>
        </div>
      </div>

      {/* --- RIGHT SIDE (70%): DATA GRID --- */}
      <div className="flex-1 h-full relative p-6 md:p-14 flex flex-col justify-center items-center overflow-y-auto">
        
        <Link to="/RecruiterDashboard" aria-label="Return to Dashboard" className="absolute top-8 right-8 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-2xl hover:text-slate-900 dark:hover:text-white transition-all shadow-md z-[100] active:scale-95 backdrop-blur-xl">
          <X size={22} />
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl space-y-8">
            
            <div className="flex justify-between items-end border-b border-slate-200/80 dark:border-white/5 pb-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Recruiter <span className="text-indigo-600 dark:text-indigo-400">Profile</span></h2>
                </div>
                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-wider hover:bg-indigo-500 transition-all shadow-md flex items-center gap-2.5 active:scale-95"
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : (isEditing ? <Save size={16} /> : <Edit3 size={16} />)}
                    {isEditing ? 'Sync Changes' : 'Modify Profile'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div key="edit-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-2 grid md:grid-cols-2 gap-5">
                            <EditInput label="Full Name" value={profile.fullName} onChange={(v) => setProfile({...profile, fullName: v})} />
                            <EditInput label="Designation" value={profile.designation} onChange={(v) => setProfile({...profile, designation: v})} />
                            <EditInput label="Company" value={profile.companyName} onChange={(v) => setProfile({...profile, companyName: v})} />
                            <EditInput label="Office Address" value={profile.officeAddress} onChange={(v) => setProfile({...profile, officeAddress: v})} />
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-2">About / Briefing</label>
                                <textarea 
                                    className="w-full bg-slate-50 dark:bg-[#09141e] border border-slate-200 dark:border-white/10 p-5 rounded-2xl text-slate-900 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all font-medium text-sm shadow-sm"
                                    rows="4"
                                    value={profile.aboutMe}
                                    onChange={(e) => setProfile({...profile, aboutMe: e.target.value})}
                                    placeholder="Enter professional briefing..."
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="static-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-2 grid md:grid-cols-2 gap-8">
                            {/* Summary Card */}
                            <div className="col-span-2 bg-white dark:bg-[#09141e]/60 border border-slate-200/90 dark:border-white/5 p-8 sm:p-10 rounded-[3rem] relative overflow-hidden group shadow-sm dark:shadow-2xl">
                                <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-4">Professional Briefing</h4>
                                <p className="text-xl text-slate-800 dark:text-slate-100 font-medium leading-relaxed border-l-4 border-indigo-500/30 pl-6">
                                    {profile.aboutMe || "No briefing provided. Initialize editing to define your professional philosophy."}
                                </p>
                            </div>

                            {/* Organization Card */}
                            <div className="bg-white dark:bg-[#030712]/80 border border-slate-200/90 dark:border-white/5 p-8 rounded-[2.5rem] space-y-4 shadow-sm hover:shadow-md dark:shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-[#09141e] border border-indigo-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Company Name</p>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{profile.companyName || "Independent"}</h4>
                                    <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase mt-1">{profile.companyIndustry}</p>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white dark:bg-[#030712]/80 border border-slate-200/90 dark:border-white/5 p-8 rounded-[2.5rem] space-y-4 shadow-sm hover:shadow-md dark:shadow-xl transition-all duration-300 group">
                                <div className="w-12 h-12 bg-indigo-50 dark:bg-[#09141e] border border-indigo-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Location</p>
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{profile.officeAddress || "Address"}</h4>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

/* --- HELPER MODULES --- */

const StaticInfo = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 rounded-2xl group hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Icon size={16} />
        </div>
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">{label}</span>
    </div>
);

const EditInput = ({ label, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-2">{label}</label>
        <input 
            type="text" 
            value={value || ""} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#030712] border border-slate-200 dark:border-white/10 p-4 rounded-2xl text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all font-semibold text-sm shadow-sm"
        />
    </div>
);

export default RecruiterProfile;