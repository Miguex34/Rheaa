import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const ReservacionesPorEmpleado = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el token desde localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token no encontrado. Redirigiendo al login.');
          window.location.href = '/login'; // Redirigir al login si no hay token
          return;
        }

        // Solicitud al backend con el token
        const response = await axios.get('http://localhost:5000/api/reservas/empleados', {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en los headers
          },
        });

        // Guardar los datos en el estado
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div style={{ margin: '20px auto', maxWidth: '800px', background: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Reservaciones por Empleado</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="empleado" label={{ value: 'Empleado', position: 'bottom', dy: 20 }} />
          <YAxis label={{ value: 'Total Reservaciones', angle: -90, position: 'insideLeft', dx: -10 }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="total_reservaciones" fill="#82ca9d" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReservacionesPorEmpleado;
