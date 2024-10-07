// src/Routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CrearNegocio from './components/CrearNegocio';
import PanelReservas from './components/PanelReservas';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crear-negocio" element={<ProtectedRoute component={CrearNegocio} />} />
        <Route path="/panel-reservas" element={<ProtectedRoute component={PanelReservas} />} />
        {/* Redirect to login if no route matches */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
