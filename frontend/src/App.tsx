import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import DonationPage from './pages/DonationPage';
import NotFoundPage from './pages/NotFoundPage';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    initializeDefaultData();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/rights" element={<RightsPage />} />
          <Route path="/contact-counsellor" element={<ContactCounsellorPage />} />
          <Route path="/support-services" element={<SupportServicesPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

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

