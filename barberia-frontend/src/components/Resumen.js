import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // "Nuevo" - Para obtener el estado de navegación

const Resumen = () => {
    const location = useLocation(); // "Nuevo" - Obtener los datos pasados con `navigate`
    const navigate = useNavigate();
    const seleccion = location.state || {}; // "Nuevo" - Obtener los datos seleccionados

    // Obtener nombres desde sessionStorage
    const negocioSeleccionado = JSON.parse(sessionStorage.getItem('negocioSeleccionado')) || {};
    const servicioSeleccionado = JSON.parse(sessionStorage.getItem('servicioSeleccionado')) || {};
    const empleadoSeleccionado = JSON.parse(sessionStorage.getItem('empleadoSeleccionado')) || {};

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2 style={{ color: 'purple' }}>Resumen de la Reserva</h2>
            <p>Confirma si los datos ingresados están correctos:</p>

            <div style={{ margin: '20px 0' }}></div>

            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '50%' }}>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>Negocio:</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{negocioSeleccionado.nombre || 'No definido'}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>Servicio:</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{servicioSeleccionado.nombre || 'No definido'}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>Profesional:</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{empleadoSeleccionado.nombre || 'No definido'}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>Fecha:</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{seleccion.fecha || 'No definido'}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>Hora:</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>
                            {seleccion.bloque
                                ? `${seleccion.bloque.hora_inicio} - ${seleccion.bloque.hora_fin}`
                                : 'No definido'}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'white',
                        color: 'black',
                        border: '1px solid gray',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Volver
                </button>
                <button
                    onClick={() => console.log('Reserva confirmada')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'purple',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Confirmar Reserva
                </button>
            </div>
        </div>
    );
};

export default Resumen;
