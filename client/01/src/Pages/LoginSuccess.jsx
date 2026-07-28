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
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <h2 className="text-indigo-500 font-black uppercase tracking-[0.5em] text-lg">Finalizing Sync</h2>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Stable Connection Established...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;