import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LoadingSpinner1 } from './LoadingSpinner';

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10 text-gray-600"><LoadingSpinner1 /></div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
