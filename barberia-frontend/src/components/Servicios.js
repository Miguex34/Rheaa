import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', duracion: '', precio: '', disponible: true });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/servicios', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setServicios(response.data);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/servicios/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessage({ type: 'success', text: 'Servicio actualizado con éxito' });
      } else {
        await axios.post('http://localhost:5000/api/servicios', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessage({ type: 'success', text: 'Servicio creado con éxito' });
      }
      setForm({ nombre: '', descripcion: '', duracion: '', precio: '', disponible: true });
      setIsEditing(false);
      fetchServicios();
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
      setMessage({ type: 'error', text: 'Error al guardar el servicio' });
    }
  };

  const handleEdit = (servicio) => {
    setForm(servicio);
    setIsEditing(true);
    setEditingId(servicio.id);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Servicios</h1>
      {message && (
        <div
          className={`p-2 rounded ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white mb-4`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del Servicio"
          value={form.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="duracion"
          placeholder="Duración (minutos)"
          value={form.duracion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            name="disponible"
            checked={form.disponible}
            onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
          />
          <label className="ml-2">Disponible</label>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {isEditing ? 'Actualizar Servicio' : 'Agregar Servicio'}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Lista de Servicios</h2>
        {servicios.map((servicio) => (
          <div key={servicio.id} className="bg-white p-4 rounded shadow-md mb-2">
            <h3 className="text-lg font-bold">{servicio.nombre}</h3>
            <p>{servicio.descripcion}</p>
            <p>Duración: {servicio.duracion} minutos</p>
            <p>Precio: ${servicio.precio}</p>
            <button
              onClick={() => handleEdit(servicio)}
              className="bg-yellow-500 text-white p-2 rounded mt-2"
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
