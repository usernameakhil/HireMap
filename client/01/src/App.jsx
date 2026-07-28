function App() {
  return (
    // This div MUST be w-full and bg-[#0f172a]
    <div className="flex min-h-screen bg-[#0f172a]"> 
  <Sidebar />
  <div className="flex-1 bg-[#0f172a]">
     <StudentDashboard />
  </div>
</div>
  );
}