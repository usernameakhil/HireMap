import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Briefcase, Filter, X, Loader2, Building, 
  Link as LinkIcon, CheckCircle, AlertCircle, Sparkles, Zap, FileText, UploadCloud, Target
} from 'lucide-react'; 
import Navbar from '../../Components/Navbar';
import JobCard from '../../Components/JobCard'; 
import { useAuth } from '../../Context/AuthContext';

const FindJobs = () => {
  const { user } = useAuth(); 
  const [jobs, setJobs] = useState([]); 
  const [appliedJobIds, setAppliedJobIds] = useState([]); 
  const [filteredJobs, setFilteredJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [driveLink, setDriveLink] = useState(""); 
  const [resumeFile, setResumeFile] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const HIREMAP_LOGO = "/hiremap.jpg"; 

  // --- DATA SYNCHRONIZATION ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const jobRes = await fetch(`${API_URL}/api/jobs`);
        const jobData = await jobRes.json();
        
        if (jobRes.ok) {
          setJobs(jobData);
          setFilteredJobs(jobData);
        }

        if (user?.token) {
          const appRes = await fetch(`${API_URL}/api/applications/my-applications`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          const appData = await appRes.json();
          if (appRes.ok) {
            setAppliedJobIds(appData.map(app => app.jobId?._id || app.jobId));
          }
        }
      } catch (error) {
        console.error("Matrix Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, user?.token]);

  // --- OPERATIONAL FILTERING ---
  useEffect(() => {
    let result = jobs;
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(job => 
        (job.title?.toLowerCase() || "").includes(lowerTerm) || 
        (job.company?.toLowerCase() || "").includes(lowerTerm)
      );
    }
    if (filterRole !== "All") {
      result = result.filter(job => job.type === filterRole);
    }
    if (filterLocation !== "All") {
      result = result.filter(job => job.mode === filterLocation);
    }
    setFilteredJobs(result);
  }, [searchTerm, filterRole, filterLocation, jobs]);

  // --- UI HANDLERS ---
  const handleApply = (job) => {
    if (!user) return alert("System Access Denied: Please login to apply!");
    setSelectedJob(job);
    setDriveLink("");
    setResumeFile(null); 
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        return alert("Validation Error: System restricted to PDF dossiers.");
      }
      setResumeFile(file);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!resumeFile || !driveLink || !selectedJob) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('resumeFile', resumeFile); 
      formData.append('resumeDriveLink', driveLink); 
      formData.append('jobId', selectedJob._id);
      formData.append('recruiterId', selectedJob.recruiter?._id || selectedJob.recruiter);
      formData.append('studentName', user.name);

      const response = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formData 
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert(`Enlisted! AI Results - Fit: ${result.resumeFitScore}%, ATS: ${result.analysisScore}%`);
      setAppliedJobIds(prev => [...prev, selectedJob._id]);
      setIsModalOpen(false);
    } catch (error) {
      alert(`Critical Fault: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09141e] text-slate-200 pb-20 selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* --- BRANDED BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img 
          src={HIREMAP_LOGO} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] opacity-[0.02] grayscale blur-sm" 
          alt="" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            
            
          </motion.div>

          <div className="w-full md:w-auto bg-[#030712]/60 border border-white/10 p-3 rounded-[2.5rem] backdrop-blur-3xl flex flex-col md:flex-row gap-2 max-w-4xl shadow-2xl">
            <div className="flex-1 relative flex items-center px-6 min-w-[300px]">
              <Search className="text-indigo-400" size={22} />
              <input 
                type="text"
                placeholder="Scan by role or company..."
                className="w-full bg-transparent px-5 py-4 text-white outline-none font-black uppercase text-[11px] tracking-widest placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3">
            <aside className="bg-[#030712]/60 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-3xl sticky top-32 space-y-10 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <Filter size={20} className="text-indigo-400" />
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Filter Jobs</h3>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3 ml-1">
                    <Briefcase size={14} className="text-indigo-400"/> Type of Job
                  </label>
                  <select 
                    value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full bg-[#020617] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-black uppercase text-[10px] tracking-widest cursor-pointer shadow-inner"
                  >
                    <option value="All">All Tiers</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Intern">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
            </aside>
          </div>

          {/* Jobs Feed */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-indigo-500 mb-6" size={56} />
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Scanning Sectors...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {filteredJobs.map(job => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    onApply={() => handleApply(job)} 
                    isApplied={appliedJobIds.includes(job._id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/[0.02] border border-white/5 border-dashed rounded-[4rem] backdrop-blur-sm">
                <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-xs">No matching nodes found in grid.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-6 z-[100]">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#030712] border border-white/10 rounded-[4rem] w-full max-w-2xl shadow-[0_0_100px_rgba(99,102,241,0.2)] relative z-10 p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-[100px] -mr-24 -mt-24" />
              
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-3">Initiate Deployment</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 border-l-2 border-indigo-500 pl-4">
                  Operator: {user?.name} | Role ID: {selectedJob?.title}
                </p>
                
                <form onSubmit={handleSubmitApplication} className="space-y-10">
                  {/* DUAL INPUT SECTION */}
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    />
                    <div className={`border-2 border-dashed rounded-[3rem] p-12 flex flex-col items-center justify-center transition-all duration-500
                      ${resumeFile ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 bg-white/5 group-hover:border-indigo-500/40'}`}>
                      {resumeFile ? (
                        <><CheckCircle className="text-emerald-400 mb-3 animate-bounce" size={32} /> <p className="text-[11px] font-black text-white uppercase tracking-widest">{resumeFile.name}</p></>
                      ) : (
                        <><UploadCloud className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform" size={40} /> <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Upload PDF Dossier</p></>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-3 ml-2">
                      <LinkIcon size={16}/> Resume Drive Link
                    </label>
                    <input 
                      required
                      type="url"
                      placeholder="https://drive.google.com/file/..."
                      className="w-full bg-[#020617] border border-white/5 p-6 rounded-[2rem] text-white outline-none focus:border-indigo-500 transition-all font-black text-[11px] tracking-widest placeholder:text-slate-800 shadow-inner"
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                    />
                  </div>

                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6 flex gap-5">
                     <AlertCircle size={24} className="text-indigo-400 shrink-0" />
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                       Both physical dossier and cloud link will be processed by the <span className="text-indigo-400">AI JobFit Engine</span> upon execution.
                     </p>
                  </div>

                  <button 
                    disabled={!resumeFile || !driveLink || isSubmitting}
                    className="w-full py-7 rounded-[2.5rem] bg-white text-black font-black uppercase text-[11px] tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all duration-500 disabled:opacity-30 shadow-2xl flex items-center justify-center gap-4 active:scale-95"
                  >
                    {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> Syncing Matrix...</> : <><Target size={20}/> Execute Application</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindJobs;