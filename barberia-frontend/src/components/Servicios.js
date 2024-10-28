import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Servicios = () => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    categoria: '',
    id_empleado: '',
    disponible: true,
  });
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    cargarServicios();
    cargarEmpleados();
  }, []);

  const cargarServicios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/empleados');
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/servicios/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/servicios', form);
      }
      setForm({ nombre: '', descripcion: '', duracion: '', precio: '', categoria: '', id_empleado: '', disponible: true });
      cargarServicios();
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
    }
  };

  const handleEdit = (servicio) => {
    setForm(servicio);
    setEditingId(servicio.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/servicios/${id}`);
      cargarServicios();
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Servicios</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Nombre del Servicio</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Duración (minutos)</label>
          <input
            type="number"
            name="duracion"
            value={form.duracion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Precio</label>
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Empleado</label>
          <select
            name="id_empleado"
            value={form.id_empleado || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccione un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Disponible</label>
          <input
            type="checkbox"
            name="disponible"
            checked={form.disponible}
            onChange={handleChange}
            className="mr-2"
          />
          <span>Marcar si el servicio está disponible</span>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {editingId ? 'Actualizar Servicio' : 'Agregar Servicio'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{servicio.nombre}</h3>
            <p className="mb-2">{servicio.descripcion}</p>
            <p className="mb-2">Duración: {servicio.duracion} minutos</p>
            <p className="mb-2">Precio: ${servicio.precio}</p>
            <p className="mb-2">Categoría: {servicio.categoria}</p>
            <p className="mb-2">Empleado asignado: {empleados.find((e) => e.id === servicio.id_empleado)?.nombre || 'N/A'}</p>
            <p className="mb-2">Disponible: {servicio.disponible ? 'Sí' : 'No'}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(servicio)}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(servicio.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
