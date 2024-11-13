import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import fondo1 from '../assets/images/fondo1.png';

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const VistaCliente = () => {
  const { nombre } = useParams(); // Obtener el nombre del negocio desde la URL
  const [negocio, setNegocio] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    // Función para obtener información del negocio, servicios y horarios
    const fetchData = async () => {
      try {
        // Obtener el negocio por su nombre
        const responseNegocio = await axios.get(`http://localhost:5000/api/negocios/${nombre}`);
        setNegocio(responseNegocio.data);

        // Obtener los servicios del negocio usando el ID del negocio
        const responseServicios = await axios.get(`http://localhost:5000/api/servicios/negocio/${responseNegocio.data.id}`);
        setServicios(responseServicios.data);

        // Obtener los horarios del negocio usando el ID del negocio
        const responseHorarios = await axios.get(`http://localhost:5000/api/horarios/negocio/${responseNegocio.data.id}`);
        setHorarios(responseHorarios.data);

        setLoading(false);
      } catch (error) {
        setError('No se pudo obtener la información del negocio, los servicios o los horarios.');
        setLoading(false);
      }
    };

    fetchData();
  }, [nombre]);

  const handleOpenModal = (servicio) => {
    setSelectedServicio(servicio);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedServicio(null);
  };

  const serviciosFiltrados = filtroCategoria
    ? servicios.filter(servicio => servicio.categoria === filtroCategoria)
    : servicios;

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Banner */}
      <div className="mb-6">
        <img src={fondo1} alt="Banner" className="w-full object-cover h-64 rounded-lg shadow-md" />
      </div>
      {/* Selección de Categoría */}
      <div className="mb-4">
        <label className="text-gray-700 font-semibold mr-2">Filtrar por categoría:</label>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="border-gray-300 rounded-md p-2"
        >
          <option value="">Todas</option>
          {[...new Set(servicios.map((servicio) => servicio.categoria))].map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      </div>

      {/* Parte principal de la vista */}
      <div className="flex gap-6">
        <div className="flex-grow bg-white shadow-md rounded-md p-6">
          {/* Encabezado del negocio */}
          <div className="flex items-center mb-6">
            <img
              src={negocio.logo}
              alt="Logo del negocio"
              className="w-24 h-24 rounded-full mr-4 object-cover shadow-md"
            />
            <h2 className="text-3xl font-bold text-gray-800">{negocio.nombre}</h2>
          </div>

          {/* Servicios del negocio */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Servicios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviciosFiltrados.map((servicio) => (
                <div key={servicio.id} className="bg-[#3b3b3b] text-white p-6 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <h4 className="text-xl font-bold mb-2">{servicio.nombre}</h4>
                  <p className="mb-2"><strong>Duración:</strong> {servicio.duracion} minutos</p>
                  <p className="mb-2"><strong>Precio:</strong> ${servicio.precio}</p>
                  <p className="mb-4"><strong>Categoría:</strong> {servicio.categoria}</p>
                  <button
                    onClick={() => handleOpenModal(servicio)}
                    className="bg-[#855bff] text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
                  >
                    Ver descripción
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Información detallada del negocio */}
        <div className="w-96 bg-white shadow-md rounded-md p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Información del Negocio</h3>
          <p className="mb-2"><strong>Teléfono:</strong> {negocio.telefono}</p>
          <p className="mb-2"><strong>Dirección:</strong> {negocio.direccion}</p>
          <p className="mb-2"><strong>Correo:</strong> {negocio.correo}</p>
          <p className="mb-4"><strong>Descripción:</strong> {negocio.descripcion}</p>
          <p className="mb-4"><strong>Categoría:</strong> {negocio.categoria}</p>

          {/* Horario del negocio */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Horario</h3>
            {horarios.length > 0 ? (
              <ul className="space-y-2">
                {diasSemana.map((dia) => {
                  const horario = horarios.find(h => h.dia_semana === dia);
                  return (
                    <li key={dia} className="flex justify-between text-gray-700">
                      <span>{dia}</span>
                      <span>
                        {horario && horario.activo
                          ? `${horario.hora_inicio} - ${horario.hora_fin}`
                          : 'Cerrado'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No se encontraron horarios.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal para la descripción del servicio */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h4 className="text-2xl font-bold mb-4">{selectedServicio.nombre}</h4>
            <p className="mb-4">{selectedServicio.descripcion}</p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaCliente;



