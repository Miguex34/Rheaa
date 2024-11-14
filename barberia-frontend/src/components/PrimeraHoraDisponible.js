import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const PrimeraHoraDisponible = ({ negocioId, servicioId }) => {
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [bloquesPorProfesional, setBloquesPorProfesional] = useState({});
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!negocioId || !servicioId) {
            setError("ID de negocio o servicio no está definido.");
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:5000/api/reserva-horario/disponibilidad/general/${negocioId}/${servicioId}`)
            .then(response => {
                console.log("Días disponibles recibidos:", response.data);
                setDiasDisponibles(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener disponibilidad:', error);
                setError("Error al obtener disponibilidad: " + error.message);
                setLoading(false);
            });
    }, [negocioId, servicioId]);

    const handleDiaSeleccion = (date) => {
        const dia = moment(date).format('YYYY-MM-DD');
        setDiaSeleccionado(dia);

        axios.get(`http://localhost:5000/api/reserva-horario/bloques/${negocioId}/${servicioId}/${dia}`)
            .then(response => {
                console.log("Bloques por profesional recibidos:", response.data);

                // Agrupar bloques por profesional
                const bloquesAgrupados = response.data.reduce((acc, bloque) => {
                    const { empleado, hora_inicio, hora_fin } = bloque;
                    if (!acc[empleado]) acc[empleado] = [];
                    acc[empleado].push({ hora_inicio, hora_fin });
                    return acc;
                }, {});

                setBloquesPorProfesional(bloquesAgrupados);
            })
            .catch(error => {
                console.error('Error al obtener bloques de horario:', error);
                setBloquesPorProfesional({});
            });
    };

    const isDayDisabled = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const dia = diasDisponibles.find(d => d.fecha === formattedDate);
        return !(dia && dia.disponible);
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <h2>Primera Hora Disponible</h2>

            {loading ? (
                <p>Cargando disponibilidad...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
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
                    {Object.keys(bloquesPorProfesional).length > 0 ? (
                        Object.entries(bloquesPorProfesional).map(([empleado, bloques], index) => (
                            <div key={empleado}>
                                <h4>Profesional: {empleado}</h4>
                                <ul>
                                    {bloques.length > 0 ? (
                                        bloques.map((bloque, idx) => (
                                            <li key={`${empleado}-${idx}`}>
                                                {bloque.hora_inicio} - {bloque.hora_fin}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No hay bloques de horario disponibles</li>
                                    )}
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
