import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  // While checking auth, optionally show loading
  if (loading) return <div>Loading...</div>;

  // Redirect to landing page if not logged in
  if (!isLoggedIn) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
