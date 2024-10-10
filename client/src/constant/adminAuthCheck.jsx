// AuthCheck.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminAuthCheck = ({ children }) => {
  const token = localStorage.getItem('tokenAdmin'); // Adjust the key as necessary

  useEffect(() => {
    // Show a toast notification if there's no token
    if (!token) {
      toast.error('Admin - You need to Login First!!'); // Show error toast
    }
  }, [token]);

  // If token is not found, redirect to login page
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return children; // If authenticated, render children components
};

export default AdminAuthCheck;
