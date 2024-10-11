// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    telefono: '',
    nombreNegocio: '',
    telefonoNegocio: '',
    direccionNegocio: '',
    horario_inicio: '',
    horario_cierre: '',
    rol: 'dueño',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/panel-reservas');
    } catch (error) {
      console.error('Error al registrar:', error);
      setResponseMessage('Error al registrar el usuario');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="w-full max-w-5xl bg-gray-800 rounded-lg shadow-lg p-6 md:p-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              ¡Crea Tu <span className="text-purple-400">Cuenta</span>!
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                name="nombre"
                placeholder="Introduce tu Nombre Completo"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                name="correo"
                placeholder="Introduce tu Correo Electrónico"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                name="contraseña"
                placeholder="Introduce tu Contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="tel"
                name="telefono"
                placeholder="+56"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              ¡Registra Tu <span className="text-purple-400">Negocio</span>!
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                name="nombreNegocio"
                placeholder="Nombre del Negocio"
                value={formData.nombreNegocio}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="direccionNegocio"
                placeholder="Dirección del Negocio"
                value={formData.direccionNegocio}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="time"
                name="horario_inicio"
                placeholder="Horario de Apertura"
                value={formData.horario_inicio}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="time"
                name="horario_cierre"
                placeholder="Horario de Cierre"
                value={formData.horario_cierre}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="tel"
                name="telefonoNegocio"
                placeholder="Teléfono de la empresa"
                value={formData.telefonoNegocio}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </form>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition duration-300"
          >
            Crear Cuenta
          </button>
        </div>

        {responseMessage && (
          <div className="mt-4 text-center text-red-500">
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
