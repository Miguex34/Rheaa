import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    telefono: '', // Incluir el teléfono
    rol: 'dueño', // Establecemos el rol como dueño por defecto
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [formErrors, setFormErrors] = useState({
    telefono: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar que el número de teléfono tenga exactamente 8 dígitos
    if (!/^\d{8}$/.test(formData.telefono)) {
      setFormErrors({ telefono: 'El número de teléfono debe contener exactamente 8 dígitos.' });
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        nombre: formData.nombre,
        correo: formData.correo,
        contraseña: formData.contraseña,
        telefono: `+569${formData.telefono}`,  // Incluye el prefijo +569
        rol: formData.rol,
      });
      console.log(response.data);
      setResponseMessage('Usuario registrado exitosamente');
    } catch (error) {
      console.error('Error en la petición:', error.response.data);
      setResponseMessage(`Error al registrar usuario: ${error.response.data.detalle || 'Error desconocido'}`);
    }
  };
  

  // Validar formato del número de teléfono chileno
  const validatePhone = (telefono) => {
    const chilePhoneRegex = /^\+56\s?9\s?\d{8}$/;
    return chilePhoneRegex.test(telefono);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrar una Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700">Nombre Completo</label>
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
            <label htmlFor="correo" className="block text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-gray-700">Teléfono</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +56 9
              </span>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full p-2 border ${formErrors.telefono ? 'border-red-500' : 'border-gray-300'} rounded-l-none mt-1`}
                pattern="[0-9]{8}" // Solo permitirá 8 dígitos
                maxLength="8" // Limitar el input a un máximo de 8 caracteres
                placeholder="12345678"
                required
              />
            </div>
            {formErrors.telefono && (
              <span className="text-red-500 text-sm">{formErrors.telefono}</span>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="contraseña" className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          {/* Eliminamos el campo select para el rol */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Crear Cuenta
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
