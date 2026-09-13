import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const syncInitiated = useRef(false); 

  useEffect(() => {
    if (syncInitiated.current) return;

    const token = searchParams.get('token');
    
    if (token) {
      syncInitiated.current = true; 
      
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        const fullUserData = {
          ...payload,
          token: token,
          name: payload.fullName // Mapping for UI consistency
        };

        if (login) {
          login(fullUserData);
        }

        const targetPath = payload.role === 'recruiter' 
          ? '/RecruiterDashboard' 
          : '/StudentDashboard';
        
        navigate(targetPath, { replace: true });

      } catch (error) {
        console.error("Neural Sync Critical Failure:", error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, login]); 

  return (
    <div className="h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center space-y-6 transition-colors duration-200">
      <div className="w-16 h-16 border-4 border-indigo-600 dark:border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <h2 className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.4em] text-lg">Finalizing Sync</h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mt-2">Connection Established...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;