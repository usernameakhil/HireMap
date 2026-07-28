import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, FileText, Settings, User, 
  LogOut, Rocket, X, Swords 
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const Sidebar = ({ role, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth(); 

  const menus = {
    student: [
      { name: 'Overview', path: '/StudentDashboard', icon: LayoutDashboard },
      { name: 'Profile', path: '/Profile', icon: User },
      { name: 'AI-Resume', path: '/ResumeAI', icon: FileText },
      { name: 'Job Bot', path: '/JobDiscovery', icon: Briefcase},
      { name: 'HireFit Analyzer', path: '/HireFit', icon: Rocket }, 
      { name: 'Resume Battleground', path: '/ResumeBattle', icon: Swords },
      { name: 'Find Jobs', path: '/FindJobs', icon: Briefcase },
      { name: 'My Applications', path: '/MyApplications', icon: FileText },
      { name: 'Roadmaps', path: '/roadmaps', icon: Settings },
      { name: 'CoinStore', path: '/CoinStore', icon: Settings },
    ],
    recruiter: [
      { name: 'Overview', path: '/RecruiterDashboard', icon: LayoutDashboard },
      { name: 'Post a Job', path: '/PostJob', icon: Rocket },
      { name: 'Handle Posts', path: '/HandlePosts', icon: Briefcase },
      { name: 'applications', path: '/applications', icon: Swords },
      //{ name: 'Pricing & Scale', path: '/Pricing', icon: FileText },
      { name: 'Profile', path: '/RecruiterProfile', icon: User },
    ]
  };
  
  const links = role === 'recruiter' ? menus.recruiter : menus.student;
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 z-40 backdrop-blur-md transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#09141e] border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Rocket size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-widest text-white uppercase opacity-90">Orbit</span>
          </div>
          <button onClick={toggleSidebar} className="p-1 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
          {links.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
              >
                <Icon size={18} className={active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-700/50">
          <button 
            onClick={() => {
              toggleSidebar(); 
              logout();        
            }} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
