import React from 'react';
import { useLocation } from 'react-router-dom'; // "Nuevo" - Para obtener el estado de navegación

const Resumen = () => {
    const location = useLocation(); // "Nuevo" - Obtener los datos pasados con `navigate`
    const seleccion = location.state || {}; // "Nuevo" - Obtener los datos seleccionados

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Resumen de Reserva</h2>
            <p>Este es el resumen de los datos seleccionados:</p>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '50%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Campo</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>ID del Negocio</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{seleccion.negocioId || 'No definido'}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>ID del Servicio</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{seleccion.servicioId || 'No definido'}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>ID del Empleado</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{seleccion.empleadoId || 'No definido'}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>Fecha</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{seleccion.fecha || 'No definido'}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>Bloque Horario</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>
                            {seleccion.bloque
                                ? `${seleccion.bloque.hora_inicio} - ${seleccion.bloque.hora_fin}`
                                : 'No definido'}
                        </td>
                    </tr>
                </tbody>
            </table>
            <button style={{ marginTop: '20px' }} onClick={() => console.log('Reserva confirmada')}>
                Confirmar Reserva
            </button>
        </div>
    );
};

export default Resumen;
