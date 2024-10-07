// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ tieneNegocio }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">Rhea Reserve</div>
      <ul className="mt-4">
        {/* Opción siempre visible */}
        <li className="p-2 hover:bg-gray-700">
          <Link to="/crear-negocio">Crea Tu Negocio</Link>
        </li>

        {/* Opciones visibles solo si tiene un negocio */}
        {tieneNegocio && (
          <>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/panel-reservas">Panel de Reservas</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/servicios">Servicios</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/profesionales">Profesionales</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/notificaciones">Notificaciones</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/calendario">Calendario</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/configuracion">Configuración</Link>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <Link to="/soporte">Soporte</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
