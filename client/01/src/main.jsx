import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext';

// Layouts
import LandingLayout from './Layouts/LandingLayout.jsx'
import DashboardLayout from './Layouts/DashboardLayout.jsx'

// Pages
import LandingPage from './Pages/LandingPage.jsx'
import Register from './Pages/Authentification/Register.jsx' 
import Login from './Pages/Authentification/Login.jsx'
import ForgetPassword from './Pages/Authentification/ForgetPassword.jsx'
import LoginSuccess from './Pages/LoginSuccess.jsx'; 
import AboutUs from './Pages/AboutUs.jsx';
import Pricing from './Pages/Pricing.jsx';
// Student Pages
import StudentDashboard from './Pages/Student/StudentDashboard.jsx'
import Profile from './Pages/Student/Profile.jsx';
import MyApplications from './Pages/Student/MyApplications.jsx'
import FindJobs from './Pages/Student/FindJobs.jsx'
import HireFit from './Pages/Student/HireFit.jsx';
import ResumeAI from './Pages/Student/ResumeAI.jsx';
import JobDiscovery from './Pages/Student/JobDiscovery.jsx';
import RoadmapsPage from './Pages/Student/roadmap.jsx';
import ResumeAnalyzer from './Pages/Student/ResumeAnalyzer.jsx';
import ResumeBattle from './Pages/Student/ResumeBattle.jsx';

// Recruiter Pages
import RecruiterDashboard from './Pages/Recruiter/RecruiterDashboard.jsx'
import JobApplications from './Pages/Recruiter/JobApplications.jsx'
import PostJob from './Pages/Recruiter/PostJob.jsx';
import HandlePosts from './Pages/Recruiter/HandlePosts.jsx';
import RecruiterProfile from './Pages/Recruiter/RecruiterProfile.jsx';
import EnlistedApplicants from './Pages/Recruiter/applications.jsx';
import CoinStore from './Pages/Student/CoinStore.jsx';
import CollabWithUs from './Pages/CollabWithUs.jsx';
import ContactUs from './Pages/ContactUs.jsx';
import Terms from './Pages/Terms.jsx';
import Privacy from './Pages/Privacy.jsx';
import Refund from './Pages/Refund.jsx';
import Championship from './Pages/Student/Champianship.jsx';

export const router = createBrowserRouter([
  {
    path: "",
    element: <LandingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  {
    path: "/register",
    element: <Register />, 
  },
  {
    path: "/login",
    element: <Login />,
  },
  { 
    path: "/ForgetPassword", 
    element: <ForgetPassword /> 
  },
  { 
    path: "/login-success", 
    element: <LoginSuccess /> 
  },
  { 
    path: "/Collab", 
    element: <CollabWithUs /> 
  },
  { 
    path: "/Contact", 
    element: <ContactUs /> 
  },
  { 
    path: "/Terms", 
    element: <Terms /> 
  },
  { 
    path: "/Privacy", 
    element: <Privacy /> 
  },
  { 
    path: "/Refund", 
    element: <Refund /> 
  },
  { 
    path: "/AboutUs", 
    element: <AboutUs /> 
  },
  { 
    path: "/Pricing", 
    element: <Pricing /> 
  },

  {
    element: <DashboardLayout />,
    children: [
      { path: "/StudentDashboard", element: <StudentDashboard /> },
      { path: "/RecruiterDashboard", element: <RecruiterDashboard /> },
      { path: "/PostJob", element: <PostJob /> },
      { path: "/Profile", element: <Profile /> },
      { path: "/RecruiterProfile", element: <RecruiterProfile /> },
      { path: "/edit-job/:id", element: <PostJob /> },
      { path: "/HandlePosts", element: <HandlePosts /> },
      { path: "/MyApplications", element: <MyApplications /> },
      { path: "/FindJobs", element: <FindJobs /> },
      { path: "/job-applications", element: <JobApplications /> },
      { path: "/HireFit", element: <HireFit /> },
      { path: "/ResumeAI", element: <ResumeAI /> },
      { path: "/ResumeBattle", element: <ResumeBattle /> },
      { path: "/ResumeAnalyzer", element: <ResumeAnalyzer /> },
      { path: "/JobDiscovery", element: <JobDiscovery /> },
      { path: "/Roadmaps", element: <RoadmapsPage /> },
      { path: "/applications", element: <EnlistedApplicants /> },
      { path: "/CoinStore", element: <CoinStore /> },
      {path:"/ResumeChampionship", element:<Championship/>}

    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)