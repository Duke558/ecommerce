import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // wait for Clerk to load

  return isSignedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
