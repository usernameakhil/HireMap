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
    <div className="h-screen bg-[#030712] flex flex-col items-center justify-center gap-6">
      <Loader2 className="animate-spin text-indigo-500" size={64} />
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#030712] font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* --- LEFT SIDE (30%): IDENTITY CONSOLE --- */}
      <div className="hidden lg:flex lg:w-[30%] h-full flex-shrink-0 relative bg-[#09141e] flex-col justify-between p-12 border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-10">
            <div className="space-y-6 text-center lg:text-left">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-4xl uppercase shadow-2xl mx-auto lg:mx-0">
                    {profile.fullName?.charAt(0) || "P"}
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
                        {profile.fullName || "Name"}
                    </h1>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
                        {profile.designation || "Designation"}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <StaticInfo icon={Mail} label={profile.email||"email"} />
                <StaticInfo icon={Phone} label={profile.phone || "Phone"} />
                <StaticInfo icon={Linkedin} label="Identity Verified" />
            </div>

            <div className="bg-[#030712]/60 border border-white/5 p-8 rounded-[2.5rem] space-y-6 backdrop-blur-xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Hiring specialties</p>
                <div className="flex flex-wrap gap-2">
                    {profile.hiringSpecialties.slice(0, 5).map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase rounded-lg">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-4 text-slate-600 opacity-30">
            <ShieldCheck size={18} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Partner Encryption Active</span>
        </div>
      </div>

      {/* --- RIGHT SIDE (70%): DATA GRID --- */}
      <div className="flex-1 h-full relative p-6 md:p-16 flex flex-col justify-center items-center ]">
        
        <Link to="/recruiter-dashboard" className="absolute top-8 right-8 p-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl hover:text-white transition-all shadow-xl z-[100] active:scale-90 backdrop-blur-xl">
          <X size={24} />
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl space-y-10">
            
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter ">Profile <span className="text-indigo-500"></span></h2>
                </div>
                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-xl flex items-center gap-3"
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : (isEditing ? <Save size={16} /> : <Edit3 size={16} />)}
                    {isEditing ? 'Sync Changes' : 'Modify Profile'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div key="edit-fields" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-2 grid md:grid-cols-2 gap-6">
                            <EditInput label="Full Name" value={profile.fullName} onChange={(v) => setProfile({...profile, fullName: v})} />
                            <EditInput label="Designation" value={profile.designation} onChange={(v) => setProfile({...profile, designation: v})} />
                            <EditInput label="Company" value={profile.companyName} onChange={(v) => setProfile({...profile, companyName: v})} />
                            <EditInput label="Office" value={profile.officeAddress} onChange={(v) => setProfile({...profile, officeAddress: v})} />
                            <div className="col-span-2">
                                <textarea 
                                    className="w-full bg-[#09141e] border border-white/10 p-6 rounded-[2rem] text-slate-300 outline-none focus:border-indigo-500 transition-all font-medium italic"
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
                            <div className="col-span-2 bg-[#09141e]/60 border border-white/5 p-12 rounded-[4rem] relative overflow-hidden group shadow-2xl">
                                <Zap className="absolute -bottom-10 -right-10 text-indigo-500/5 rotate-12" size={200} />
                                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-6">Professional Briefing</h4>
                                <p className="text-2xl text-slate-100 font-medium leading-relaxed  border-l-4 border-indigo-500/30 pl-8">
                                    {profile.aboutMe || "No briefing provided. Initialize editing to define your professional philosophy."}
                                </p>
                            </div>

                            {/* Organization Card */}
                            <div className="bg-[#030712]/80 border border-white/5 p-10 rounded-[3rem] space-y-6 shadow-xl hover:border-indigo-500/30 transition-all duration-500 group">
                                <div className="w-14 h-14 bg-[#09141e] border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Building2 size={28} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Company Name</p>
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{profile.companyName || "Independent"}</h4>
                                    <p className="text-indigo-400 text-[10px] font-black uppercase mt-2">{profile.companyIndustry}</p>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-[#030712]/80 border border-white/5 p-10 rounded-[3rem] space-y-6 shadow-xl hover:border-indigo-500/30 transition-all duration-500 group">
                                <div className="w-14 h-14 bg-[#09141e] border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Location</p>
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{profile.officeAddress || "Address"}</h4>
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
    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Icon size={18} />
        </div>
        <span className="text-[11px] font-black text-slate-400 group-hover:text-white transition-all uppercase tracking-widest truncate">{label}</span>
    </div>
);

const EditInput = ({ label, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#030712] border border-white/10 p-5 rounded-2xl text-slate-200 outline-none focus:border-indigo-500 transition-all font-bold text-sm shadow-inner"
        />
    </div>
);

export default RecruiterProfile;