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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-500 mb-4" size={48} />
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Scanning Positions...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09141e] text-slate-800 dark:text-slate-200 pb-20 selection:bg-indigo-500/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- HEADER --- */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <button 
              onClick={() => selectedJob ? setSelectedJob(null) : navigate('/RecruiterDashboard')} 
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider hover:text-slate-900 dark:hover:text-white mb-6 transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              {selectedJob ? "Back to Active Jobs" : "Home"}
            </button>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
              Applications
            </h1>
          </div>
        </header>

        {/* --- VIEW 1: JOB LIST --- */}
        {!selectedJob && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <motion.div 
                whileHover={{ y: -4 }}
                key={job._id}
                onClick={() => fetchApplicants(job._id)}
                className="bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 p-8 rounded-[2.5rem] cursor-pointer hover:border-indigo-400 transition-all group relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-xl"
              >
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{job.title}</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  View Applications <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* --- VIEW 2: APPLICANT MATRIX --- */}
        {selectedJob && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white dark:bg-white/5 border border-slate-200/90 dark:border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    <th className="p-6 sm:p-8 text-[10px] font-black text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="p-6 sm:p-8 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">HireFit Match</th>
                    <th className="p-6 sm:p-8 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">ATS Strength</th>
                    <th className="p-6 sm:p-8 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6 sm:p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black border border-indigo-100 dark:border-indigo-500/20">
                            {app.studentName?.charAt(0) || "U"}
                          </div>
                          <p className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{app.studentName}</p>
                        </div>
                      </td>
                      <td className="p-6 sm:p-8">
                        <div className="flex flex-col items-center">
                          <span className={`text-lg font-black ${app.resumeFitScore > 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {app.resumeFitScore}%
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Relevance</span>
                        </div>
                      </td>
                      <td className="p-6 sm:p-8">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                            {app.analysisScore}%
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                        </div>
                      </td>
                      <td className="p-6 sm:p-8 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button 
                            onClick={() => setViewingApp(app)}
                            className="p-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            title="Full Dossier"
                          >
                            <Search size={15} />
                          </button>
                          
                          {/* QUICK STATUS ACTIONS */}
                          {app.status === 'Pending' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleStatusChange(app._id, 'Shortlisted')} 
                                className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                title="Shortlist"
                              >
                                <CheckCircle size={15} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(app._id, 'Rejected')} 
                                className="p-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                title="Reject"
                              >
                                <XCircle size={15} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                                app.status === 'Shortlisted' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                              }`}>
                                {app.status}
                              </span>
                              <button 
                                onClick={() => handleStatusChange(app._id, 'Pending')} 
                                className="text-[8px] font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase underline underline-offset-2"
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
            className="fixed inset-0 z-50 flex items-center justify-end p-4 sm:p-6 bg-slate-900/50 dark:bg-[#0a0f1a]/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
              className="w-full max-w-xl h-full bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto rounded-l-[3rem] p-8 sm:p-12 relative"
            >
              <button onClick={() => setViewingApp(null)} className="absolute top-8 right-8 w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
                <ArrowLeft size={18} className="rotate-180" />
              </button>

              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md">
                    {viewingApp.studentName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{viewingApp.studentName}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5">
                    <Zap className="text-amber-500 mb-1.5" size={18} />
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">HireFit Score</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{viewingApp.resumeFitScore}%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5">
                    <BrainCircuit className="text-indigo-600 dark:text-indigo-400 mb-1.5" size={18} />
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1">ATS Strength</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{viewingApp.analysisScore}%</p>
                  </div>
                </div>

                <div className="bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-3xl p-6 space-y-4">
                   <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                     <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" /> Actions
                   </h3>
                   
                   <div className="grid gap-3">
                      <a href={viewingApp.resumeDriveLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase text-[10px] tracking-wider transition-all shadow-sm">
                        View Resume <ExternalLink size={14} />
                      </a>
                      
                      <button 
                        onClick={() => handleMailOperator(viewingApp.applicant?.email, selectedJob?.title, viewingApp.studentName)}
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-100 dark:bg-indigo-500/10 border border-slate-200 dark:border-indigo-500/20 text-slate-800 dark:text-indigo-400 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
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