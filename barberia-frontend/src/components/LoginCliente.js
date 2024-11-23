import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = ({ closeModal, setAuth }) => {
  const [formData, setFormData] = useState({ correo: '', contraseña: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/clientes/loginc', formData);
      
      // Guarda el token en localStorage
      localStorage.setItem('token', response.data.token);
  
      // Muestra el mensaje del backend
      
      // Actualiza el estado de autenticación a verdadero
      setAuth(true);
      toast.success('¡Sesión iniciada correctamente!');

      // Cierra el modal después del login exitoso
      closeModal();
  
      // Limpia los errores si hubo alguno antes
      setError('');
    } catch (error) {
      setError('Credenciales inválidas');
      console.error('Error al iniciar sesión:', error);
    }
  };
  

  return (
    <form onSubmit={handleLogin} className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
      {error && <p className="text-red-500">{error}</p>}
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Correo</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleInputChange}
          className="border rounded w-full py-2 px-3"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Contraseña</label>
        <input
          type="password"
          name="contraseña"
          value={formData.contraseña}
          onChange={handleInputChange}
          className="border rounded w-full py-2 px-3"
          required
        />
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
        <button type="button" onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default LoginForm;