import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const Cuenta = () => {
  const navigate = useNavigate();

  // Estado para el usuario logeado
  const [user, setUser] = useState({ nombre: '', correo: '', id_negocio: null });

  // Estado para los horarios, inicializado como un array vacío por defecto
  const [horarios, setHorarios] = useState([]);

  // Obtener el usuario logeado y su negocio al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    axios
      .get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log('Usuario autenticado:', response.data);
        setUser(response.data);
  
        const negocio = response.data.negocio;
        if (negocio && negocio.id) {
          console.log('Cargando horarios para el negocio:', negocio.id);
          fetchHorarios(negocio.id);
        } else {
          console.error('El usuario no tiene un negocio asociado:', negocio);
          alert('No se encontró un negocio asociado. Verifica tus datos.');
        }
      })
      .catch((error) => {
        console.error('Error al obtener el usuario:', error);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  // Función para obtener los horarios desde el backend
  const fetchHorarios = async (id_negocio) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/horarios/negocio/${id_negocio}`);

      // Asegúrate de que la respuesta es un array
      const fetchedHorarios = Array.isArray(response.data) ? response.data.map(horario => ({
        dia: horario.dia_semana,
        desde: horario.hora_inicio,
        hasta: horario.hora_fin,
        cerrado: !horario.activo
      })) : diasSemana.map((dia) => ({
        dia: dia,
        desde: '08:00',  // Valores predeterminados
        hasta: '19:00',
        cerrado: false,
      }));
      
      setHorarios(fetchedHorarios);
    } catch (error) {
      console.error('Error al obtener los horarios:', error);
      setHorarios(diasSemana.map((dia) => ({
        dia: dia,
        desde: '08:00',  // Valores predeterminados
        hasta: '19:00',
        cerrado: false,
      })));
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    const nuevosHorarios = [...horarios];
  
    nuevosHorarios[dataset.index][name] = value;
  
    setHorarios(nuevosHorarios);
  };

  // Enviar los datos del formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (!user.negocio.id) {
        alert('No se encontró un negocio asociado al usuario.');
        return;
      }
  
      const horariosFormateados = horarios.map(h => ({
        dia: h.dia,
        desde: h.desde,
        hasta: h.hasta,
        cerrado: h.cerrado
      }));
  
      const response = await axios.put(
        `http://localhost:5000/api/horarios/negocio/${user.negocio.id}`,
        { horario: horariosFormateados },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert('Horarios actualizados correctamente.');
  
      // Verifica si `response.data` es un array
      if (Array.isArray(response.data)) {
        // Formatear los datos del backend a la estructura del frontend
        const horariosActualizados = response.data.map(h => ({
          dia: h.dia_semana,
          desde: h.hora_inicio,
          hasta: h.hora_fin,
          cerrado: !h.activo,
        }));
  
        // Actualizar los horarios en el estado
        setHorarios(horariosActualizados);
      } else {
        console.error('La respuesta del servidor no es un array:', response.data);
        alert('Error inesperado: la respuesta del servidor no tiene el formato esperado.');
      }
    } catch (error) {
      console.error('Error al actualizar los horarios:', error);
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
          <label className="block font-semibold mb-2">Horario de Apertura</label>
          {Array.isArray(horarios) && horarios.length > 0 && horarios.map((dia, index) => (
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
