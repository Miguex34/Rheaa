// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem('token');
  return token ? <Component /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

