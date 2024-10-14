// src/components/Sidebar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Importamos useLocation
import logo from '../assets/images/logo.png'; // Ajusta la ruta si es necesario

const Sidebar = ({ tieneNegocio }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para obtener la ruta actual

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token
    navigate('/login'); // Redirige al login
  };

  // Función para determinar si la ruta está activa y aplicar estilos
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white shadow-lg flex flex-col">
      <div className="p-4 flex items-center space-x-2">
        <img src={logo} alt="Logo Rhea Reserve" className="h-10 w-10" />
        <span className="text-2xl font-bold">Rhea Reserve</span>
      </div>
      <ul className="mt-6 space-y-2 flex-grow">
        {tieneNegocio && (
          <>
            <li>
              <Link
                to="/Cuenta"
                className={`block p-2 px-4 rounded transition-colors duration-200 ${
                  isActive('/Cuenta') ? 'bg-purple-500' : 'hover:bg-gray-700'
                }`}
              >
                Negocio
              </Link>
            </li>
            <li>
              <Link
                to="/panel-reservas"
                className={`block p-2 px-4 rounded transition-colors duration-200 ${
                  isActive('/panel-reservas') ? 'bg-purple-500' : 'hover:bg-gray-700'
                }`}
              >
                Panel de Reservas
              </Link>
            </li>
            <li>
              <Link
                to="/servicios"
                className={`block p-2 px-4 rounded transition-colors duration-200 ${
                  isActive('/servicios') ? 'bg-purple-500' : 'hover:bg-gray-700'
                }`}
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                to="/profesionales"
                className={`block p-2 px-4 rounded transition-colors duration-200 ${
                  isActive('/profesionales') ? 'bg-purple-500' : 'hover:bg-gray-700'
                }`}
              >
                Profesionales
              </Link>
            </li>
            <li>
              <Link
                to="/notificaciones"
                className={`block p-2 px-4 rounded transition-colors duration-200 ${
                  isActive('/notificaciones') ? 'bg-purple-500' : 'hover:bg-gray-700'
                }`}
              >
                Notificaciones
              </Link>
            </li>
            <li>
              <Link
                to="/calendario"
                className={`block p-2 px-4 rounded transition-colors duration-200 ${
                  isActive('/calendario') ? 'bg-purple-500' : 'hover:bg-gray-700'
                }`}
              >
                Calendario
              </Link>
            </li>
            <li>
              <Link
                to="/configuracion"
                className={`block p-2 px-4 rounded transition-colors duration-200 ${
                  isActive('/configuracion') ? 'bg-purple-500' : 'hover:bg-gray-700'
                }`}
              >
                Configuración
              </Link>
            </li>
            <li>
              <Link
                to="/soporte"
                className={`block p-2 px-4 rounded transition-colors duration-200 ${
                  isActive('/soporte') ? 'bg-purple-500' : 'hover:bg-gray-700'
                }`}
              >
                Soporte
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

