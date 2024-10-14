// src/components/Cuenta.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cuenta = () => {
  const navigate = useNavigate();

  // Estado para el usuario logeado
  const [user, setUser] = useState({ nombre: '', correo: '' });

  // Estado para el formulario del negocio
  const [form, setForm] = useState({
    tipoNegocio: 'Barbería',
    numProfesionales: '1 - 2',
    horario: [
      { dia: 'Lunes', desde: '08:00', hasta: '19:00', cerrado: false },
      { dia: 'Martes', desde: '08:00', hasta: '19:00', cerrado: false },
      { dia: 'Miércoles', desde: '08:00', hasta: '19:00', cerrado: false },
      { dia: 'Jueves', desde: '08:00', hasta: '19:00', cerrado: false },
    ],
  });

  // Obtener los datos del usuario logeado al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Verificar si el token existe
    if (!token) {
      navigate('/login'); // Redirigir si no hay token
      return;
    }
  
    axios
      .get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.error('Error al obtener el usuario:', error);
        navigate('/login'); // Redirigir si hay error
      });
  }, [navigate]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.index) {
      const horario = [...form.horario];
      horario[dataset.index][name] = name === 'cerrado' ? e.target.checked : value;
      setForm({ ...form, horario });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Enviar los datos del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/negocio', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al actualizar el negocio:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        ¡Bienvenido <span className="text-purple-500">{user.nombre}</span>!
      </h1>
      <p className="mb-8">Comencemos con el proceso de completar la información de tu negocio.</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-6">
        <div>
          <label className="block font-semibold mb-2">Tipo de Negocio</label>
          <select
            name="tipoNegocio"
            value={form.tipoNegocio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Barbería">Barbería</option>
            <option value="Salón de Belleza">Salón de Belleza</option>
            <option value="Spa">Spa</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            ¿Cuántos Profesionales Atienden tu Negocio?
          </label>
          <select
            name="numProfesionales"
            value={form.numProfesionales}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="1 - 2">1 - 2</option>
            <option value="2 - 4">2 - 4</option>
            <option value="5 o más">5 o más</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Horario de Apertura</label>
          {form.horario.map((dia, index) => (
            <div key={index} className="flex items-center space-x-4 mb-2">
              <span className="w-20">{dia.dia}</span>
              <input
                type="time"
                name="desde"
                value={dia.desde}
                data-index={index}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="time"
                name="hasta"
                value={dia.hasta}
                data-index={index}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="cerrado"
                  checked={dia.cerrado}
                  data-index={index}
                  onChange={handleChange}
                />
                <span>Cerrado</span>
              </label>
            </div>
          ))}
        </div>

        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default Cuenta;

