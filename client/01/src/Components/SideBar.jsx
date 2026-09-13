import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, FileText, Settings, User, 
  LogOut, Rocket, X, Swords 
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import ThemeToggle from './ThemeToggle';

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
      { name: 'Profile', path: '/RecruiterProfile', icon: User },
    ]
  };
  
  const links = role === 'recruiter' ? menus.recruiter : menus.student;
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/70 z-40 backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-[#0e1526] border-r border-slate-200 dark:border-slate-800/80 shadow-2xl transform transition-all duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Rocket size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-widest text-slate-900 dark:text-white uppercase opacity-90">Orbit</span>
          </div>
          <button onClick={toggleSidebar} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
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
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                <Icon size={18} className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Theme</span>
            <ThemeToggle size="sm" showLabel />
          </div>
          
          <button 
            onClick={() => {
              toggleSidebar(); 
              logout();        
            }} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
