import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Servicios = () => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    categoria: '',
    id_empleados: [],
    id_negocio: null,
  });
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    cargarServicios();
    cargarEmpleados();
    obtenerIdNegocio();
  }, []);

  // Cargar el ID de negocio del usuario autenticado
  const obtenerIdNegocio = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const negocio = response.data.negocio;
      if (negocio && negocio.id) {
        setForm((prevForm) => ({ ...prevForm, id_negocio: negocio.id }));
      } else {
        console.error('No se encontró un negocio asociado al usuario.');
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  // Cargar lista de servicios
  const cargarServicios = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/servicios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  // Cargar lista de empleados
  const cargarEmpleados = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/empleados', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Manejar selección de empleados
  const handleEmpleadoSelect = (e) => {
    const { value, checked } = e.target;
    const empleadoId = parseInt(value, 10);
    setForm((prevForm) => ({
      ...prevForm,
      id_empleados: checked
        ? [...prevForm.id_empleados, empleadoId]
        : prevForm.id_empleados.filter((id) => id !== empleadoId),
    }));
  };

  // Crear o actualizar un servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingId
        ? `http://localhost:5000/api/servicios/${editingId}`
        : 'http://localhost:5000/api/servicios';
      const method = editingId ? 'put' : 'post';

      await axios[method](
        url,
        {
          nombre: form.nombre,
          descripcion: form.descripcion,
          duracion: parseInt(form.duracion, 10),
          precio: parseFloat(form.precio),
          categoria: form.categoria,
          id_negocio: form.id_negocio,
          id_empleados: form.id_empleados,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      cargarServicios();
      setForm({
        nombre: '',
        descripcion: '',
        duracion: '',
        precio: '',
        categoria: '',
        id_empleados: [],
        id_negocio: form.id_negocio,
      });
      setEditingId(null); // Restablece el modo de edición
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
    }
  };

  // Cargar datos en el formulario para edición
  const handleEdit = (servicio) => {
    setForm({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      duracion: servicio.duracion,
      precio: servicio.precio,
      categoria: servicio.categoria,
      id_empleados: servicio.empleados?.map((emp) => emp.id) || [],
      id_negocio: servicio.id_negocio,
    });
    setEditingId(servicio.id);
  };

  // Eliminar un servicio
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/servicios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarServicios();
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Gestión de Servicios</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del Servicio"
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del Servicio"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Duración (minutos)</label>
            <input
              type="number"
              name="duracion"
              value={form.duracion}
              onChange={handleChange}
              placeholder="Duración en minutos"
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="Precio"
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            placeholder="Categoría"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <h3 className="text-lg font-semibold mt-4 mb-2">Empleados Asignados</h3>
        <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {empleados.map((empleado) => (
            <label key={empleado.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={empleado.id}
                checked={form.id_empleados.includes(empleado.id)}
                onChange={handleEmpleadoSelect}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>{empleado.nombre} - {empleado.cargo}</span>
            </label>
          ))}
        </div>
        
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
          {editingId ? 'Actualizar Servicio' : 'Crear Servicio'}
        </button>
      </form>

      <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Lista de Servicios</h3>
      <ul className="space-y-4">
        {servicios.map((servicio) => (
          <li key={servicio.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xl font-bold text-gray-800">{servicio.nombre}</h4>
                <p className="text-gray-600">{servicio.descripcion}</p>
                <p className="text-sm text-gray-500">
                  <strong>Duración:</strong> {servicio.duracion} min &nbsp; | &nbsp;
                  <strong>Precio:</strong> ${servicio.precio}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Empleados:</strong> {servicio.empleados && servicio.empleados.length > 0
                    ? servicio.empleados.map((empleado) => empleado.nombre).join(', ')
                    : 'Ninguno'}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(servicio)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(servicio.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Servicios;
