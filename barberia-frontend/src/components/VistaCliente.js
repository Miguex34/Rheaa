// frontend/src/components/VistaCliente.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VistaCliente = () => {
  const [servicios, setServicios] = useState([]); // Servicios disponibles
  const [clienteForm, setClienteForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
  }); // Datos del cliente
  const [servicioId, setServicioId] = useState(''); // ID del servicio seleccionado
  const [fecha, setFecha] = useState(''); // Fecha de la cita
  const [hora, setHora] = useState(''); // Hora de la cita

  // Cargar los servicios disponibles al montar el componente
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/servicios');
        setServicios(response.data);
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      }
    };
    fetchServicios();
  }, []);

  // Manejar los cambios en los inputs
  const handleChange = (e) => {
    setClienteForm({ ...clienteForm, [e.target.name]: e.target.value });
  };

  // Manejar la selección del servicio
  const handleServicioChange = (e) => {
    setServicioId(e.target.value);
  };

  // Confirmar la reserva
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita recargar la página
    try {
      const reserva = {
        ...clienteForm,
        servicioId,
        fecha,
        hora,
      };
      await axios.post('http://localhost:5000/api/citas', reserva);
      alert('¡Reserva confirmada!');
    } catch (error) {
      console.error('Error al crear la cita:', error);
      alert('Hubo un error al confirmar la reserva.');
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-bold mb-6">Reserva tu cita</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={clienteForm.nombre}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input
            type="email"
            name="correo"
            value={clienteForm.correo}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={clienteForm.telefono}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Servicio</label>
          <select
            value={servicioId}
            onChange={handleServicioChange}
            className="mt-1 p-2 border rounded w-full"
            required
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre} - ${servicio.precio}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
};

export default VistaCliente;

