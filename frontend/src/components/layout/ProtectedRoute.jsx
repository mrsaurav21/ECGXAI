import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Intercept new Google users who haven't picked a role/completed profiles
  if (user.is_onboarded === false && window.location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'doctor' ? '/doctor' : '/patient'} replace />;
  }

  // Just render the outlet — Layout.jsx will handle the persistent Navbar and structure cleanly!
  return <Outlet />;
}