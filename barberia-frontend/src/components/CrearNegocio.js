import React, { useState } from 'react';
import axios from 'axios';

const CrearNegocio = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    horario_inicio: '',
    horario_cierre: '',
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Obtener el token desde el almacenamiento local
      const response = await axios.post(
        'http://localhost:5000/api/negocio/crear',
        formData, // Enviar solo los datos relevantes (sin el correo)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        }
      );
      setResponseMessage('Negocio creado exitosamente!');
    } catch (error) {
      setResponseMessage(`Error al crear el negocio: ${error.response?.data?.error || 'Error desconocido'}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear Negocio</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700">Nombre del Negocio</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-gray-700">Teléfono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="direccion" className="block text-gray-700">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="horario_inicio" className="block text-gray-700">Horario de Inicio</label>
            <input
              type="time"
              id="horario_inicio"
              name="horario_inicio"
              value={formData.horario_inicio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="horario_cierre" className="block text-gray-700">Horario de Cierre</label>
            <input
              type="time"
              id="horario_cierre"
              name="horario_cierre"
              value={formData.horario_cierre}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Crear Negocio
          </button>
        </form>
        {responseMessage && (
          <div className="mt-4 text-center text-red-500">
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearNegocio;
