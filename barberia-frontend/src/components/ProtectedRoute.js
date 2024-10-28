import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Validar el token haciendo una solicitud al backend
        await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token inválido o sesión expirada:', error);
        localStorage.removeItem('token'); // Eliminar token si es inválido
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Mostrar nada mientras se verifica la autenticación
  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  // Permitir acceso a la página de reserva sin autenticación
  if (location.pathname.startsWith('/reserva')) {
    return children;
  }

  // Redirigir al login si no está autenticado para otras rutas protegidas
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

