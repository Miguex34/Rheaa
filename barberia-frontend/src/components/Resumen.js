import React from 'react';
import { useNavigate } from 'react-router-dom';

const Resumen = () => {
    const navigate = useNavigate();

    const negocioSeleccionado = JSON.parse(sessionStorage.getItem('negocioSeleccionado'));
    const servicioSeleccionado = JSON.parse(sessionStorage.getItem('servicioSeleccionado'));
    const empleadoSeleccionado = JSON.parse(sessionStorage.getItem('empleadoSeleccionado'));
    const bloqueSeleccionado = JSON.parse(sessionStorage.getItem('bloqueSeleccionado'));
    const fechaSeleccionada = sessionStorage.getItem('fechaSeleccionada');

    const handleVolver = () => {
        navigate('/pregunta-preferencia'); // Redirige a `Pregunta de Preferencia.`
    };

    if (!negocioSeleccionado || !servicioSeleccionado || !empleadoSeleccionado || !bloqueSeleccionado) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>Error: No hay datos para mostrar. Por favor, vuelve a seleccionar tus preferencias.</p>
                <button
                    onClick={handleVolver}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#855bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h3>Resumen de la Reserva</h3>
            <p>Confirma si los datos ingresados están correctos:</p>
            <table style={{ margin: '0 auto', textAlign: 'left' }}>
                <tbody>
                    <tr>
                        <td><b>Negocio:</b></td>
                        <td>{negocioSeleccionado.nombre}</td>
                    </tr>
                    <tr>
                        <td><b>Servicio:</b></td>
                        <td>{servicioSeleccionado.nombre}</td>
                    </tr>
                    <tr>
                        <td><b>Profesional:</b></td>
                        <td>{empleadoSeleccionado.empleadoNombre}</td>
                    </tr>
                    <tr>
                        <td><b>Fecha:</b></td>
                        <td>{fechaSeleccionada}</td>
                    </tr>
                    <tr>
                        <td><b>Hora:</b></td>
                        <td>{bloqueSeleccionado.hora_inicio} - {bloqueSeleccionado.hora_fin}</td>
                    </tr>
                </tbody>
            </table>
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleVolver}
                    style={{
                        marginRight: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#ccc',
                        color: 'black',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Volver
                </button>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#855bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
};

export default Resumen;
