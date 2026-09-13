import { Outlet } from 'react-router-dom'

function LandingLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Outlet />
    </div>
  );
}
export default LandingLayout