import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar'; // Suponiendo que usas un componente de calendario

const ProfesionalEspecifico = ({ negocioId, servicioId }) => {
    const [profesionales, setProfesionales] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Obtener profesionales del negocio que ofrecen el servicio
        axios.get(`http://localhost:5000/api/empleados/negocio/${negocioId}/servicio/${servicioId}`)
            .then(response => setProfesionales(response.data))
            .catch(error => console.error('Error al obtener los profesionales:', error));
    }, [negocioId, servicioId]);

    const handleEmpleadoSeleccionado = (empleadoId) => {
        setEmpleadoSeleccionado(empleadoId);
        setLoading(true);

        // Obtener la disponibilidad del empleado seleccionado
        axios.get(`http://localhost:5000/api/reserva-horario/disponibilidad/empleado/${negocioId}/${servicioId}/${empleadoId}`)
            .then(response => {
                setDiasDisponibles(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener disponibilidad del empleado:', error);
                setLoading(false);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Seleccionar Profesional</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {profesionales.map(profesional => (
                    <button
                        key={profesional.id}
                        onClick={() => handleEmpleadoSeleccionado(profesional.id)}
                        style={{
                            padding: '15px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        {profesional.nombre}
                    </button>
                ))}
            </div>

            {loading && <p>Cargando disponibilidad...</p>}

            {empleadoSeleccionado && diasDisponibles.length > 0 && (
                <div>
                    <h3>Disponibilidad para el empleado seleccionado</h3>
                    <Calendar
                        tileDisabled={({ date }) => {
                            const fecha = date.toISOString().split('T')[0];
                            const diaDisponible = diasDisponibles.find(dia => dia.fecha === fecha);
                            return !diaDisponible || !diaDisponible.disponible;
                        }}
                        onClickDay={(date) => {
                            const fecha = date.toISOString().split('T')[0];
                            const diaSeleccionado = diasDisponibles.find(dia => dia.fecha === fecha);
                            if (diaSeleccionado && diaSeleccionado.disponible) {
                                console.log('Bloques disponibles:', diaSeleccionado.bloques);
                            } else {
                                console.log('No hay bloques disponibles para esta fecha.');
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfesionalEspecifico;
