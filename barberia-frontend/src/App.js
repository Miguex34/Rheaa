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
import VistaCliente from './components/VistaCliente'; 
import RegistroEmpleado from './components/RegistroEmpleado';
import './index.css';
import Reserva from './components/Reserva';
import Disponibilidad from './components/Disponibilidad';
import PreguntaPreferencia from './components/PreguntaPreferencia';
import PrimeraHoraDisponible from './components/PrimeraHoraDisponible';
import ProfesionalEspecifico from './components/ProfesionalEspecifico';
import Resumen from './components/Resumen';
import RegistroCliente from './components/RegistroCliente';
import TicketsSoporte from './components/TicketsSoporte';
import PasoRegistroReserva from './components/PasoRegistroReserva';
import MetodoPago from './components/MetodoPago';
import ConfirmacionReserva from './components/ConfirmacionReserva';

// Función PrivateRoute para proteger rutas privadas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  location.pathname.startsWith('/cliente') || location.pathname.startsWith('/negocio');

  const routesWithSidebar = [
    '/',
    '/panel-reservas',
    '/servicios',
    '/profesionales',
    '/calendario',
    '/configuracion',
  ];
  
  const showSidebar = token && routesWithSidebar.some((route) => location.pathname.startsWith(route));

    return (
    <div className="flex">
      {/* Mostrar el Sidebar solo en rutas permitidas */}
      {showSidebar && <Sidebar tieneNegocio={true} />}

      <div className={`flex-grow p-4 ${showSidebar ? 'ml-64' : ''}`}>
        <Routes>
          {/* Rutas públicas para la VistaCliente y Disponibilidad */}
          <Route path="/cliente/:id_negocio" element={<VistaCliente />} />
          <Route path="/disponibilidad/:id_negocio" element={<Disponibilidad />} />
          <Route path="/reserva/:negocioId/:servicioId/:horarioId" element={<Reserva />} />
          <Route path="/pregunta-preferencia" element={<PreguntaPreferencia />} />
          <Route path="/primera-hora-disponible/:servicioId" element={<PrimeraHoraDisponible />} />
          <Route path="/profesional-especifico/:servicioId" element={<ProfesionalEspecifico />} /> 
          <Route path="/resumen" element={<Resumen />} />
          <Route path="/paso-registro-reserva" element={<PasoRegistroReserva />} />
          <Route path="/metodo-pago" element={<MetodoPago />} />
          <Route path="/confirmacion" element={<ConfirmacionReserva />} />


          {/* Rutas públicas para Login y Registro */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro-cliente" element={<RegistroCliente />} />
          {/* Nueva ruta pública para registro del empleado usando el token */}
          <Route path="/registro/:token" element={<RegistroEmpleado />} />

{          /* Rutas privadas protegidas */}
          <Route path="/" element={<Navigate to="/cuenta" replace />} />
          <Route path="/cuenta" element={<PrivateRoute><Cuenta /></PrivateRoute>} />
          <Route path="/panel-reservas" element={<PrivateRoute><PanelReservas /></PrivateRoute>} />
          <Route path="/servicios" element={<PrivateRoute><Servicios /></PrivateRoute>} />
          <Route path="/profesionales" element={<PrivateRoute><Profesionales /></PrivateRoute>} />
          <Route path="/notificaciones" element={<PrivateRoute><Notificaciones /></PrivateRoute>} />
          <Route path="/calendario" element={<PrivateRoute><Calendario /></PrivateRoute>} />
          <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
          <Route path="/soporte" element={<PrivateRoute><Soporte /></PrivateRoute>} />
          <Route path="/negocio/:nombre" element={<VistaCliente />} />
          <Route path="/soporteAdmin" element={<TicketsSoporte />} />

          {/* Redireccionar rutas no encontradas */}
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
}

export default App;