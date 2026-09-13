// src/Layouts/DashboardLayout
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Components/SideBar'; 
import Navbar from '../Components/Navbar';   
import { useAuth } from '../Context/AuthContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    // Logic for page titles based on location
    return 'Dashboard';
  };

  return (
    /* min-h-screen ensures the dark background spans the entire height of the page.
       The main wrapper must be relative to act as the scroll container for the sticky Navbar.
    */
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/20 transition-colors duration-200">
      
      {/* 1. Sidebar */}
      <Sidebar 
        role={user?.role || 'student'} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* 2. Main Content Area */}
      {/* min-w-0 prevents flex items from overflowing and creating white gaps */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-200">
        
        {/* 3. Top Navbar 
            Ensure the Navbar component itself has 'sticky top-0 z-40' classes 
        */}
        <Navbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          title={getPageTitle()} 
        />

        {/* 4. The Page Content */}
        {/* Using 'flex-1' ensures this area fills all available vertical space.
            We keep the background color here as a safety layer.
        */}
        <main className="flex-1 relative z-0 bg-slate-50 dark:bg-[#0b0f19] w-full transition-colors duration-200">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
