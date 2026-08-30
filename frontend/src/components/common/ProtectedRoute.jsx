import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute – wraps routes that require authentication.
 * Redirects unauthenticated users to /login with return URL state.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
        <div className="space-y-3">
          <div className="text-4xl">🔒</div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-sm text-slate-400">
            Your role ({user.role}) does not have permission to access this module.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
