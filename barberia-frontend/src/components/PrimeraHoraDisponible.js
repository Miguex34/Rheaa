// src/components/PrimeraHoraDisponible.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const PrimeraHoraDisponible = ({ negocioId, servicioId }) => {
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [bloquesPorProfesional, setBloquesPorProfesional] = useState({});
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null); // "Nuevo" - Estado para el bloque seleccionado
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // "Nuevo" - Inicializar navegación

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
        setBloqueSeleccionado(null); // "Nuevo" - Resetea el bloque seleccionado al cambiar el día

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

    const handleBloqueSeleccion = (bloque) => {
        setBloqueSeleccionado(bloque); // "Nuevo" - Almacena el bloque de horario seleccionado
    };

    const handleSiguiente = () => {
        const seleccion = {
            negocioId,
            servicioId,
            fecha: diaSeleccionado,
            bloque: bloqueSeleccionado,
        };
        navigate('/resumen', { state: seleccion }); // "Nuevo" - Redirigir a la página de resumen
    };

    const isDayDisabled = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const dia = diasDisponibles.find(d => d.fecha === formattedDate);
        return !(dia && dia.disponible);
    };

    // "Nuevo" - Función para dividir los bloques en filas de 5
    const dividirEnFilas = (arr, tamanio) => {
        const filas = [];
        for (let i = 0; i < arr.length; i += tamanio) {
            filas.push(arr.slice(i, i + tamanio));
        }
        return filas;
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
                                {/* "Nuevo" - Mostrar bloques en filas de 5 */}
                                {dividirEnFilas(bloques, 5).map((fila, filaIndex) => (
                                    <div key={filaIndex} style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                                        {fila.map((bloque, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleBloqueSeleccion({ ...bloque, fecha: diaSeleccionado })}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: bloqueSeleccionado?.hora_inicio === bloque.hora_inicio ? '#4CAF50' : '#f9f9f9',
                                                    color: bloqueSeleccionado?.hora_inicio === bloque.hora_inicio ? 'white' : 'black',
                                                    padding: '10px 15px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '5px',
                                                    minWidth: '110px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {bloque.hora_inicio} - {bloque.hora_fin}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No hay bloques de horario disponibles para este día.</p>
                    )}
                    {/* "Nuevo" - Botón de siguiente, visible solo cuando un bloque está seleccionado */}
                    {bloqueSeleccionado && (
                        <button
                            onClick={handleSiguiente}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Siguiente
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PrimeraHoraDisponible;
