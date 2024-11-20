import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Soporte = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({ nombre: '', correo: '', id_negocio: null });
  const [asunto, setAsunto] = useState('');
  const [negocio, setNegocio] = useState({ id: null, nombre: '' });
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [imagen, setImagen] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    axios.get('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setUser(response.data);
    })
    .catch((error) => {
      console.error('Error al obtener el usuario:', error);
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!asunto || !descripcion) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('asunto', asunto);
    formData.append('descripcion', descripcion);
    formData.append('prioridad', prioridad);
    formData.append('id_negocio', negocio.id);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/api/soportes', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Solicitud de soporte enviada correctamente.');
      setAsunto('');
      setDescripcion('');
      setPrioridad('media');
      setImagen(null);
    } catch (error) {
      console.error('Error al enviar solicitud de soporte:', error);
      setErrorMessage('Hubo un problema al enviar la solicitud.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Soporte</h2>

      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Asunto:</label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            maxLength="100"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            maxLength="500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Prioridad:</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Imagen (opcional):</label>
          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
};

export default Soporte;

