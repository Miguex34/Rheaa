// src/components/VistaCliente.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VistaCliente = () => {
  const { idNegocio } = useParams();
  const navigate = useNavigate();
  const [negocio, setNegocio] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNegocio = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/negocios/${idNegocio}`);
      setNegocio(response.data);
    } catch (error) {
      setError('Error al obtener la información del negocio');
      console.error('Error al obtener el negocio:', error);
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/servicios`, {
        params: { id_negocio: idNegocio },
      });
      setServicios(response.data);
    } catch (error) {
      setError('Error al obtener los servicios del negocio');
      console.error('Error al obtener los servicios:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchNegocio();
      await fetchServicios();
      setLoading(false);
    };
    loadData();
  }, [idNegocio]);

  // Mostrar un mensaje de carga mientras los datos se obtienen
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Mostrar un mensaje de error si ocurre algún problema al obtener los datos
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Mostrar un mensaje si no se encuentra el negocio
  if (!negocio && !loading) {
    return <div className="text-red-500">Negocio no encontrado. Verifica la URL.</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Información del negocio */}
      {negocio && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-purple-500">{negocio.nombre}</h1>
          <p className="mt-2">{negocio.direccion}</p>
          <p>Teléfono: {negocio.telefono}</p>
          <p>
            Horario: {negocio.horario_inicio} - {negocio.horario_cierre}
          </p>
        </div>
      )}

      {/* Lista de servicios */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Servicios Disponibles</h2>
        {servicios.length > 0 ? (
          servicios.map((servicio) => (
            <div key={servicio.id} className="border-b border-gray-200 py-4">
              <h3 className="text-xl font-semibold">{servicio.nombre}</h3>
              <p>{servicio.descripcion}</p>
              <p>Duración: {servicio.duracion} minutos</p>
              <p>Precio: ${servicio.precio}</p>
              <button
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                onClick={() => handleSeleccionarServicio(servicio.id)}
              >
                Seleccionar
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay servicios disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

// Función para manejar la selección de un servicio (a implementar)
const handleSeleccionarServicio = (idServicio) => {
  console.log(`Servicio seleccionado con ID: ${idServicio}`);
  // Aquí podrías redirigir al cliente a una vista de selección de fecha y hora
};

export default VistaCliente;
