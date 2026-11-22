import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AdminProtectedRoute
 * Prepared for client-side role check when authentication integration is enabled.
 * If token or role verification is required, redirects unauthenticated users to /login.
 * By default allows access in mock mode for previewing.
 */
const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Specifically check for valid admin authentication
  const adminToken = localStorage.getItem('adminToken');

  if (!adminToken) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;

