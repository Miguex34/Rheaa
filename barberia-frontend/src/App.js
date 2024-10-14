// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PanelReservas from './components/PanelReservas';
import Servicios from './components/Servicios';
import Profesionales from './components/Profesionales';
import Notificaciones from './components/Notificaciones';
import Calendario from './components/Calendario';
import Configuracion from './components/Configuracion';
import Soporte from './components/Soporte';
import Login from './components/Login';
import Register from './components/Register';
import Cuenta from './components/Cuenta';
import './index.css';
// Función PrivateRoute para proteger rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const showSidebar = token && !isAuthRoute;
  const tieneNegocio = true;

  return (
    <div className="flex">
      {showSidebar && <Sidebar tieneNegocio={tieneNegocio} />}
      <div className={`flex-grow p-4 ${showSidebar ? 'ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/Cuenta" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cuenta" element={<PrivateRoute><Cuenta /></PrivateRoute>} />
          <Route path="/panel-reservas" element={<PrivateRoute><PanelReservas /></PrivateRoute>} />      
          <Route path="/servicios" element={<PrivateRoute><Servicios /></PrivateRoute>} />
          <Route path="/profesionales" element={<PrivateRoute><Profesionales /></PrivateRoute>} />
          <Route path="/notificaciones" element={<PrivateRoute><Notificaciones /></PrivateRoute>} />
          <Route path="/calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
          <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
          <Route path="/soporte" element={<PrivateRoute><Soporte /></PrivateRoute>} />
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}export default App;
