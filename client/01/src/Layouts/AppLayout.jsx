import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/SideBar";
import BottomNav from "../Components/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 bg-white dark:bg-[#0f172a] transition-colors duration-200">
        <Header />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50 dark:bg-[#0b0f19]">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
