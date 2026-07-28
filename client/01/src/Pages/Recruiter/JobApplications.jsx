import { useState, useEffect } from 'react';
import { 
  ExternalLink, CheckCircle, XCircle, Loader, User, 
  FileText, TrendingUp, Mail, Send 
} from 'lucide-react';
import Navbar from '../../Components/Navbar';
import { useAuth } from '../../Context/AuthContext';

const JobApplications = () => {
  const { user } = useAuth(); 
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // --- 1. FETCH APPLICATIONS ---
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.token) return;

      try {
        const response = await fetch(`${API_URL}/api/applications/recruiter/all`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setApplications(data);
        } else {
          console.error("Fetch failed:", data.message);
        }
      } catch (error) {
        console.error("Connection error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, API_URL]);

  // --- 2. UPDATE STATUS (Dashboard Sync Optimized) ---
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Optimistic UI update: instantly reflects in recruiter table
        // and ensures database consistency for student dashboard fetch
        setApplications(prev => prev.map(app => 
          app._id === appId ? { ...app, status: newStatus } : app
        ));
      }
    } catch (error) {
      alert("Error updating status matrix");
    }
  };

  // --- 3. DIRECT MAIL COMMAND ---
  const handleContactOperator = (email, jobTitle, applicantName) => {
    const subject = encodeURIComponent(`Regarding your application for ${jobTitle}`);
    const body = encodeURIComponent(`Hi ${applicantName},\n\nWe reviewed your dossier and would like to move forward...`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            Enlisted <span className="text-indigo-500">Operators</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">
            Execute command protocols: Shortlist, Reject, or Message Candidates.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin text-indigo-500 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Syncing Database...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white/5 border border-white/10 border-dashed p-20 text-center rounded-[2rem]">
            <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No dossiers received in this sector.</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate</th>
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Deployment</th>
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">AI Match</th>
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Communication</th>
                    <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Command Logic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Candidate */}
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-black">
                            {app.applicant?.name?.charAt(0) || <User size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase">{app.applicant?.name || "Unknown"}</p>
                            <p className="text-[10px] text-slate-500 font-bold">{app.applicant?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Job Role & Resume */}
                      <td className="p-6">
                        <p className="text-xs font-black text-slate-300 uppercase tracking-tight mb-1">
                          {app.jobId?.title || "Deleted Node"}
                        </p>
                        <a 
                          href={app.resumeUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-white transition-colors text-[9px] font-black uppercase"
                        >
                          <FileText size={12} /> View Dossier
                        </a>
                      </td>

                      {/* AI Score */}
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                          <TrendingUp size={12} className="text-emerald-400" />
                          <span className="text-xs font-black text-white">{app.matchScore || 0}%</span>
                        </div>
                      </td>

                      {/* Message Button */}
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => handleContactOperator(app.applicant?.email, app.jobId?.title, app.applicant?.name)}
                          className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center mx-auto"
                          title="Contact Operator"
                        >
                          <Send size={16} />
                        </button>
                      </td>

                      {/* Command Actions */}
                      <td className="p-6">
                        {app.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                              className="px-3 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2 text-[9px] font-black uppercase"
                            >
                              <CheckCircle size={14} /> Shortlist
                            </button>
                            <button 
                              onClick={() => handleStatusChange(app._id, 'Rejected')}
                              className="px-3 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 text-[9px] font-black uppercase"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                              app.status === 'Shortlisted' 
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            }`}>
                              {app.status}
                            </span>
                            <button 
                              onClick={() => handleStatusChange(app._id, 'Pending')}
                              className="text-[9px] font-bold text-slate-600 hover:text-white uppercase underline"
                            >
                              Reset
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;