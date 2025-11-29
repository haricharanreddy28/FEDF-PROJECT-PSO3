import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { initializeDefaultData } from './utils/storage';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VictimDashboard from './pages/VictimDashboard';
import CounsellorDashboard from './pages/CounsellorDashboard';
import LegalDashboard from './pages/LegalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyPage from './pages/EmergencyPage';
import RightsPage from './pages/RightsPage';
import ContactCounsellorPage from './pages/ContactCounsellorPage';
import SupportServicesPage from './pages/SupportServicesPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  useEffect(() => {
    initializeDefaultData();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/rights" element={<RightsPage />} />
          <Route path="/contact-counsellor" element={<ContactCounsellorPage />} />
          <Route path="/support-services" element={<SupportServicesPage />} />

          <Route
            path="/dashboard/victim"
            element={
              <ProtectedRoute allowedRoles={['victim']}>
                <VictimDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/counsellor"
            element={
              <ProtectedRoute allowedRoles={['counsellor']}>
                <CounsellorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/legal"
            element={
              <ProtectedRoute allowedRoles={['legal']}>
                <LegalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

