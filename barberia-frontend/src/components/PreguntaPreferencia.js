import React, { useState } from 'react';
import PrimeraHoraDisponible from './PrimeraHoraDisponible';
import ProfesionalEspecifico from './ProfesionalEspecifico';

const PreguntaPreferencia = () => {
    // Leer `negocioId` y `servicioId` desde `sessionStorage`
    const negocioId = sessionStorage.getItem('negocioSeleccionado');
    const servicioId = sessionStorage.getItem('servicioSeleccionado');

    const [preferencia, setPreferencia] = useState(null);

    const handlePreferenciaSeleccion = (opcion) => {
        setPreferencia(opcion);
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Pregunta de Preferencia</h1>
            <p>Servicio seleccionado con ID: {servicioId}</p>
    
            <div style={{ marginTop: '20px' }}>
                {/* Botón para Primera Hora Disponible */}
                <button
                    onClick={() => handlePreferenciaSeleccion('primera-hora')}
                    style={{
                        margin: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
                >
                    Primera Hora Disponible
                </button>
    
                {/* Botón para Seleccionar Disponibilidad de Profesional */}
                <button
                    onClick={() => handlePreferenciaSeleccion('profesional-especifico')}
                    style={{
                        margin: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#008CBA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#007bb5')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#008CBA')}
                >
                    Seleccionar Disponibilidad de Profesional
                </button>
            </div>
    
            {/* Renderizado Condicional según la preferencia seleccionada */}
            {preferencia === 'primera-hora' && (
                <PrimeraHoraDisponible negocioId={negocioId} servicioId={servicioId} />
            )}
            {preferencia === 'profesional-especifico' && (
                <ProfesionalEspecifico negocioId={negocioId} servicioId={servicioId} />
            )}
        </div>
    );
};

export default PreguntaPreferencia;