import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import HomePage from './pages/Homepage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import PredictionPage from './pages/PredictionPage';
import HistoryPage from './pages/HistoryPage.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Standalone Auth & Onboarding Routes (No Navbar/Footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        {/* Layout Wrapped Routes (Layout component provides the single global Navbar & Footer) */}
        <Route element={<Layout />}>
          {/* Public / Landing Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* General App Pages */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/predict" element={<PredictionPage />} />
          <Route path="/history" element={<HistoryPage />} />

          {/* Doctor Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['doctor', 'admin']} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
          </Route>

          {/* Patient Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['patient', 'admin']} />}>
            <Route path="/patient" element={<PatientDashboard />} />
          </Route>
        </Route>

        {/* Dynamic Root Entry Redirect */}
        <Route
          path="/welcome"
          element={
            user ? (
              user.is_onboarded === false ? (
                <Navigate to="/complete-profile" replace />
              ) : (
                <Navigate to={user.role === 'doctor' ? '/doctor' : '/patient'} replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}