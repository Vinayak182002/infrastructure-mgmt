// AuthCheck.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthCheck = ({ children }) => {
  const token = localStorage.getItem('token'); // Adjust the key as necessary

  useEffect(() => {
    // Show a toast notification if there's no token
    if (!token) {
      toast.error('You need to Login First!!'); // Show error toast
    }
  }, [token]);

  // If token is not found, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; // If authenticated, render children components
};

export default AuthCheck;
