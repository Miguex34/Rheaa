import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CrearNegocio from './components/CrearNegocio';
import PanelReservas from './components/PanelReservas';
import Servicios from './components/Servicios';
import Profesionales from './components/Profesionales';
import Notificaciones from './components/Notificaciones';
import Calendario from './components/Calendario';
import Configuracion from './components/Configuracion';
import Soporte from './components/Soporte'; 
import Login from './components/Login';

// Componente para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const tieneNegocio = true; 

  return (
    <Router>
      <div className="flex">
        {/* Sidebar siempre presente */}
        <Sidebar tieneNegocio={tieneNegocio} />
        <div className="flex-grow p-4">
          <Routes>
            {/* Ruta de inicio de sesión, accesible sin protección */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas */}
            <Route path="/crear-negocio" element={<PrivateRoute><CrearNegocio /></PrivateRoute>} />
            <Route path="/panel-reservas" element={<PrivateRoute><PanelReservas /></PrivateRoute>} />
            <Route path="/servicios" element={<PrivateRoute><Servicios /></PrivateRoute>} />
            <Route path="/profesionales" element={<PrivateRoute><Profesionales /></PrivateRoute>} />
            <Route path="/notificaciones" element={<PrivateRoute><Notificaciones /></PrivateRoute>} />
            <Route path="/calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
            <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
            <Route path="/soporte" element={<PrivateRoute><Soporte /></PrivateRoute>} />

            {/* Redirigir a /login si la ruta no coincide */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
