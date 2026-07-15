import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MoodCheck from './pages/MoodCheck';
import MoodResult from './pages/MoodResult';
import Activities from './pages/Activities';
import Profile from './pages/Profile';

// App Layout wrapper to include the navigation bar on active application routes
function AppLayout() {
  return (
    <div class="flex flex-col gap-6 min-h-screen pb-12">
      <Navbar />
      <main class="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page without standard navbar layout */}
        <Route path="/" element={<Landing />} />
        
        {/* Application Page Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkin" element={<MoodCheck />} />
          <Route path="/result" element={<MoodResult />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Catch-all Wildcard Redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
