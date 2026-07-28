import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ArrowLeft, Loader2, FileText, Mail, Phone, 
  Target, ChevronRight, ExternalLink, Search,
  Zap, BrainCircuit, ShieldCheck, CheckCircle, XCircle, Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

const EnlistedApplicants = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingApp, setViewingApp] = useState(null); 

  const API_URL = import.meta.env.VITE_API_URL;

  // --- 1. FETCH RECRUITER'S POSTED JOBS ---
  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/jobs/my-jobs`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setJobs(res.data);
      } catch (e) {
        console.error("Matrix Sync Error:", e);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchRecruiterJobs();
  }, [user, API_URL]);

  // --- 2. FETCH APPLICANTS FOR SPECIFIC JOB ---
  const fetchApplicants = async (jobId) => {
    setLoading(true);
    try {
      // Endpoint should match your backend: GET /api/applications/job/:jobId
      const res = await axios.get(`${API_URL}/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setApplicants(res.data);
      setSelectedJob(jobs.find(j => j._id === jobId));
    } catch (e) {
      console.error("Retrieval Fault:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. STATUS COMMAND PROTOCOL (Fixed 404 Error Logic) ---
  const handleStatusChange = async (appId, newStatus) => {
    try {
      // Ensure your backend has: router.patch('/:id/status', ...)
      const res = await axios.patch(`${API_URL}/api/applications/${appId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (res.status === 200 || res.status === 204) {
        // Update local state so UI reflects the change immediately
        setApplicants(prev => prev.map(app => 
          app._id === appId ? { ...app, status: newStatus } : app
        ));
        
        // If the modal is open, update the viewingApp state too
        if (viewingApp && viewingApp._id === appId) {
          setViewingApp({ ...viewingApp, status: newStatus });
        }
      }
    } catch (e) {
      console.error("Status Update Failed:", e.response?.data || e.message);
      alert("Status Sync Error: Command failed. Check if the route exists on the server.");
    }
  };

  // --- 4. DIRECT MAIL PROTOCOL ---
  const handleMailOperator = (email, jobTitle, name) => {
    if (!email) return alert("Operator email not found in dossier.");
    const subject = encodeURIComponent(`Deployment Update: ${jobTitle}`);
    const body = encodeURIComponent(`Hello ${name},\n\nWe have reviewed your dossier for the ${jobTitle} position and would like to discuss next steps.`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  if (loading && jobs.length === 0) return (
    <div className="min-h-screen bg-[#0a0f1a] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Deployment Nodes...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09141e] text-slate-200 pb-20 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- HEADER --- */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <button 
              onClick={() => selectedJob ? setSelectedJob(null) : navigate('/RecruiterDashboard')} 
              className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white mb-6 transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              {selectedJob ? "Back to Active Jobs" : "Home"}
            </button>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
              Applications 
            </h1>
          </div>
        </header>

        {/* --- VIEW 1: JOB LIST --- */}
        {!selectedJob && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={job._id}
                onClick={() => fetchApplicants(job._id)}
                className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] cursor-pointer hover:border-indigo-500/50 transition-all group relative overflow-hidden"
              >
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{job.title}</h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                  view applications <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* --- VIEW 2: APPLICANT MATRIX --- */}
        {selectedJob && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest"> Name</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">HireFit Match</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">HireMap Analysis</th>
                    <th className="p-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Command Logic</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => (
                    <tr key={app._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 font-black border border-indigo-500/20">
                            {app.studentName?.charAt(0) || "U"}
                          </div>
                          <p className="font-black text-white uppercase tracking-tight">{app.studentName}</p>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col items-center">
                          <span className={`text-lg font-black ${app.resumeFitScore > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {app.resumeFitScore}%
                          </span>
                          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Job Relevance</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-indigo-400">
                            {app.analysisScore}%
                          </span>
                          <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.2em]">Profile Strength</span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setViewingApp(app)}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-indigo-600 transition-all"
                            title="Full Dossier"
                          >
                            <Search size={16} />
                          </button>
                          
                          {/* QUICK STATUS ACTIONS */}
                          {app.status === 'Pending' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleStatusChange(app._id, 'Shortlisted')} 
                                className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(app._id, 'Rejected')} 
                                className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                              >
                                <XCircle size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                app.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                                {app.status}
                              </span>
                              <button 
                                onClick={() => handleStatusChange(app._id, 'Pending')} 
                                className="text-[8px] font-bold text-slate-600 hover:text-white uppercase underline underline-offset-4"
                              >
                                Reset
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- APPLICANT INTEL MODAL --- */}
      <AnimatePresence>
        {viewingApp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-end p-6 bg-[#0a0f1a]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
              className="w-full max-w-xl h-full bg-[#0f172a] border-l border-white/10 shadow-2xl overflow-y-auto rounded-l-[3rem] p-12 relative"
            >
              <button onClick={() => setViewingApp(null)} className="absolute top-8 right-8 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-all">
                <ArrowLeft size={20} className="rotate-180" />
              </button>

              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                    {viewingApp.studentName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{viewingApp.studentName}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <Zap className="text-amber-400 mb-2" size={20} />
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">HireFit Score</p>
                    <p className="text-2xl font-black text-white">{viewingApp.resumeFitScore}%</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <BrainCircuit className="text-indigo-400 mb-2" size={20} />
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">ATS Strength</p>
                    <p className="text-2xl font-black text-white">{viewingApp.analysisScore}%</p>
                  </div>
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-8 space-y-6">
                   <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={16} className="text-indigo-400" /> Operational Actions
                   </h3>
                   
                   <div className="grid gap-3">
                      <a href={viewingApp.resumeDriveLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
                        View resume<ExternalLink size={14} />
                      </a>
                      
                      <button 
                        onClick={() => handleMailOperator(viewingApp.applicant?.email, selectedJob.title, viewingApp.studentName)}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Contact Applicant <Send size={14} />
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnlistedApplicants;