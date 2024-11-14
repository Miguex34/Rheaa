// src/components/PrimeraHoraDisponible.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const PrimeraHoraDisponible = ({ servicioId }) => {
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [bloquesPorProfesional, setBloquesPorProfesional] = useState([]);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener los días disponibles para el servicio al montar el componente
        axios.get(`http://localhost:5000/api/disponibilidad/general/${servicioId}`)
            .then(response => {
                console.log("Días disponibles recibidos:", response.data); // Imprimir datos para verificación
                setDiasDisponibles(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener disponibilidad:', error);
                setLoading(false);
            });
    }, [servicioId]);

    const handleDiaSeleccion = (dia) => {
        setDiaSeleccionado(dia);
        // Solicitar bloques de horario para el día y servicio seleccionados
        axios.get(`http://localhost:5000/api/disponibilidad/bloques/${servicioId}/${dia}`)
            .then(response => setBloquesPorProfesional(response.data))
            .catch(error => console.error('Error al obtener bloques de horario:', error));
    };

    // Función para deshabilitar días que no están disponibles en el calendario
    const isDayDisabled = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const dia = diasDisponibles.find(d => d.fecha === formattedDate);
        return !(dia && dia.disponible); // Deshabilitar si no está disponible o no existe en `diasDisponibles`
    };
    
    return (
        <div style={{ marginTop: '20px' }}>
            <h2>Primera Hora Disponible</h2>

            {loading ? (
                <p>Cargando disponibilidad...</p>
            ) : (
                <div>
                    <h3>Seleccione un día:</h3>
                    <Calendar
                        onChange={handleDiaSeleccion}
                        tileDisabled={({ date }) => isDayDisabled(date)}
                    />
                </div>
            )}

            {diaSeleccionado && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Horarios para el día {diaSeleccionado}</h3>
                    {bloquesPorProfesional.length > 0 ? (
                        bloquesPorProfesional.map((profesional) => (
                            <div key={profesional.empleado}>
                                <h4>Profesional: {profesional.empleado}</h4>
                                <ul>
                                    {profesional.bloques.map((bloque, index) => (
                                        <li key={index}>
                                            {bloque.hora_inicio} - {bloque.hora_fin}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No hay bloques de horario disponibles para este día.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PrimeraHoraDisponible;