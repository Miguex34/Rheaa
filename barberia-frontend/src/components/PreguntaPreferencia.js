import React, { useState } from 'react';
import PrimeraHoraDisponible from './PrimeraHoraDisponible';

const PreguntaPreferencia = () => {
    const [preferencia, setPreferencia] = useState(null);
    const servicioId = sessionStorage.getItem('servicioSeleccionado');

    const handlePreferenciaSeleccion = (opcion) => {
        setPreferencia(opcion);
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Pregunta de Preferencia</h1>
            <p>Servicio seleccionado con ID: {servicioId}</p>

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => handlePreferenciaSeleccion('primera-hora')}
                    style={{
                        margin: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Primera Hora Disponible
                </button>
                <button
                    onClick={() => handlePreferenciaSeleccion('profesional-especifico')}
                    style={{
                        margin: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#008CBA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Seleccionar Disponibilidad de Profesional
                </button>
            </div>

            {/* Renderizar según la preferencia seleccionada */}
            {preferencia === 'primera-hora' && <PrimeraHoraDisponible servicioId={servicioId} />}
            {preferencia === 'profesional-especifico' && (
                <p>Opción para seleccionar un profesional específico (se implementará en la Fase 2b).</p>
            )}
        </div>
    );
};

export default PreguntaPreferencia;
