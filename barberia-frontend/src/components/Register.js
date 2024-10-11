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
  
    // Imprimir los datos del formulario para verificar
    console.log('Datos enviados:', formData);
  
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrar una Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre Completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nombreNegocio"
            placeholder="Nombre del Negocio"
            value={formData.nombreNegocio}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telefonoNegocio"
            placeholder="Teléfono del Negocio"
            value={formData.telefonoNegocio}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="direccionNegocio"
            placeholder="Dirección del Negocio"
            value={formData.direccionNegocio}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="horario_inicio"
            placeholder="Horario de Inicio"
            value={formData.horario_inicio}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="horario_cierre"
            placeholder="Horario de Cierre"
            value={formData.horario_cierre}
            onChange={handleChange}
            required
          />

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Registrar y Crear Negocio
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

export default Register;
