import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, X, Wand2 } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import { useAuth } from '../../Context/AuthContext'; // Import Auth

const ResumeAnalyzer = () => {
  const { user } = useAuth(); // Get auth token
  const API_URL = import.meta.env.VITE_API_URL;

  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // --- 1. HANDLE FILE UPLOAD ---
  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
      handleAnalyze(uploadedFile); 
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  // --- 2. REAL BACKEND ANALYSIS ---
  const handleAnalyze = async (uploadedFile) => {
    setAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', uploadedFile);

    try {
      const response = await fetch(`${API_URL}/api/resumeanalyze/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed");
      }

      setResult({
        score: data.score,
        fileName: data.fileName || uploadedFile.name,
        summary: data.summary,
        suggestions: data.suggestions
      });

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setFile(null); // Reset on error
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Optimize Your Resume for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Top 1% Jobs</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Our AI-powered ATS analyzer checks your resume against millions of job descriptions to give you the winning edge.
          </motion.p>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: UPLOAD / RESULTS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. UPLOAD ZONE */}
            {!result && !analyzing && (
              <motion.div 
                {...getRootProps()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border-3 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50'}`}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600 relative z-10">
                  <UploadCloud size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 relative z-10">Drag & drop your resume here</h3>
                <p className="text-slate-500 mb-6 relative z-10">or click to browse (PDF only)</p>
                
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium relative z-10">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 text-xs text-slate-400 font-medium relative z-10">
                  <span className="flex items-center gap-1"><CheckCircle size={14}/> ATS Friendly Check</span>
                  <span className="flex items-center gap-1"><CheckCircle size={14}/> Formatting Score</span>
                  <span className="flex items-center gap-1"><CheckCircle size={14}/> Keyword Match</span>
                </div>
              </motion.div>
            )}

            {/* 2. LOADING STATE */}
            {analyzing && (
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center h-96">
                <div className="relative w-24 h-24 mb-6">
                  <span className="absolute inset-0 border-4 border-slate-100 rounded-full"></span>
                  <span className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></span>
                  <Wand2 className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 animate-pulse">Analyzing your profile...</h3>
                <p className="text-slate-500 mt-2">Checking formatting, keywords, and impact metrics.</p>
              </div>
            )}

            {/* 3. RESULTS DASHBOARD */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="w-48 h-48 flex-shrink-0 relative">
                     <CircularProgressbar 
                        value={result.score} 
                        text={`${result.score}%`} 
                        styles={buildStyles({
                          textSize: '22px',
                          pathColor: result.score > 75 ? '#22c55e' : '#f59e0b',
                          textColor: '#1e293b',
                          trailColor: '#f1f5f9',
                          pathTransitionDuration: 1.5
                        })}
                     />
                     <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Score</span>
                     </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                      {result.score > 75 ? "Excellent Resume! 🚀" : "Needs Improvement 🛠️"}
                    </h2>
                    <p className="text-slate-500 mb-4 leading-relaxed text-sm">
                      {result.summary || "Your resume has been analyzed. Follow the suggestions below."}
                    </p>
                    
                    <div className="flex gap-4 justify-center md:justify-start">
                      <button 
                        onClick={() => { setResult(null); setFile(null); }}
                        className="px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition"
                      >
                        Upload New
                      </button>
                    </div>
                  </div>
                </div>

                {/* Suggestions List */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-lg">AI Suggestions</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {result.suggestions && result.suggestions.map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl flex items-start gap-4 border-l-4 ${
                          item.type === 'critical' ? 'bg-red-50 border-red-500' :
                          item.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                          item.type === 'good' ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className={`mt-1 ${
                          item.type === 'critical' ? 'text-red-600' :
                          item.type === 'warning' ? 'text-amber-600' :
                          item.type === 'good' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {item.type === 'critical' ? <X size={20} /> :
                           item.type === 'warning' ? <AlertTriangle size={20} /> :
                           item.type === 'good' ? <CheckCircle size={20} /> : <FileText size={20} />}
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm uppercase mb-1 ${
                             item.type === 'critical' ? 'text-red-700' :
                             item.type === 'warning' ? 'text-amber-700' :
                             item.type === 'good' ? 'text-green-700' : 'text-blue-700'
                          }`}>
                            {item.type} Issue
                          </h4>
                          <p className="text-slate-700 text-sm leading-relaxed">{item.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* RIGHT: INFO SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
               <h3 className="text-xl font-bold mb-4">Why ATS Matters?</h3>
               <p className="text-slate-300 text-sm leading-relaxed mb-6">
                 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. Our tool ensures your resume speaks the language of these bots.
               </p>
               <ul className="space-y-3 text-sm text-slate-300">
                 <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Standard Fonts</li>
                 <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> No Graphics/Tables</li>
                 <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400"/> Action Verbs</li>
               </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;