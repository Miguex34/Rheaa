// src/components/ProfesionalEspecifico.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom'; // Para la navegación

const ProfesionalEspecifico = ({ negocioId, servicioId }) => {
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [bloquesDisponibles, setBloquesDisponibles] = useState([]);
    const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null); // Estado para el bloque seleccionado
    const navigate = useNavigate(); // Hook para la navegación
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfesionales = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/reserva-horario/disponibilidad/empleados/${negocioId}/${servicioId}`);
                setEmpleados(response.data);
            } catch (error) {
                console.error('Error al obtener los profesionales:', error);
            }
        };
        fetchProfesionales();
    }, [negocioId, servicioId]);

    const handleSeleccionarEmpleado = async (empleado) => {
        setEmpleadoSeleccionado(empleado);
        setLoading(true);

        try {
            const response = await axios.get(`http://localhost:5000/api/reserva-horario/disponibilidad/empleado/${negocioId}/${servicioId}/${empleado.id}`);
            setDiasDisponibles(response.data);
        } catch (error) {
            console.error('Error al obtener disponibilidad del empleado:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBloqueSeleccionado = (bloque) => {
        setBloqueSeleccionado(bloque); // Guardar el bloque seleccionado
    };

    const handleSiguiente = () => {
        if (empleadoSeleccionado && bloqueSeleccionado) {
            navigate('/resumen', {
                state: {
                    negocioId,
                    servicioId,
                    empleadoId: empleadoSeleccionado.id,
                    fecha: bloqueSeleccionado.fecha,
                    bloque: bloqueSeleccionado,
                },
            });
        } else {
            alert('Por favor, selecciona un empleado y un bloque de horario antes de continuar.');
        }
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Selecciona un Profesional</h2>

            {/* Mostrar lista de empleados */}
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {empleados.length > 0 ? (
                    empleados.map((empleado) => (
                        <button
                            key={empleado.id}
                            onClick={() => handleSeleccionarEmpleado(empleado)}
                            style={{
                                margin: '10px',
                                padding: '15px 30px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                backgroundColor: empleadoSeleccionado?.id === empleado.id ? '#4CAF50' : '#f9f9f9',
                                color: empleadoSeleccionado?.id === empleado.id ? 'white' : 'black',
                                width: '200px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            {empleado.nombre}
                        </button>
                    ))
                ) : (
                    <p>No hay profesionales disponibles para este servicio.</p>
                )}
            </div>

            {/* Mostrar calendario de disponibilidad del empleado seleccionado */}
            {empleadoSeleccionado && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Disponibilidad de {empleadoSeleccionado.nombre}</h3>
                    <Calendar
                        onClickDay={(date) => {
                            const fechaSeleccionada = date.toISOString().split('T')[0];
                            const diaEncontrado = diasDisponibles.find((dia) => dia.fecha === fechaSeleccionada);
                            setBloquesDisponibles(diaEncontrado ? diaEncontrado.bloques : []);
                        }}
                        tileDisabled={({ date }) => {
                            const fechaTile = date.toISOString().split('T')[0];
                            const diaEncontrado = diasDisponibles.find((dia) => dia.fecha === fechaTile);
                            return !diaEncontrado || !diaEncontrado.disponible;
                        }}
                    />
                </div>
            )}

            {/* Mostrar bloques de horario disponibles en filas de 5 */}
            {bloquesDisponibles.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Bloques de horario disponibles</h3>
                    {dividirEnFilas(bloquesDisponibles, 5).map((fila, filaIndex) => (
                        <div key={filaIndex} style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                            {fila.map((bloque, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleBloqueSeleccionado({ ...bloque, fecha: diasDisponibles.find(d => d.bloques?.some(b => b === bloque))?.fecha || '' })}
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
            )}

            {/* Botón de siguiente */}
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
    );
};

export default ProfesionalEspecifico;
