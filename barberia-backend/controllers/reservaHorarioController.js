// controllers/reservaHorarioController.js
const HorarioNegocio = require('../models/HorarioNegocio');
const DisponibilidadEmpleado = require('../models/DisponibilidadEmpleado');
const Reserva = require('../models/Reserva');
const Servicio = require('../models/Servicio');
const moment = require('moment');
require('moment/locale/es'); // Cargar configuración en español para moment
moment.locale('es'); // Configurar moment para usar el español
const { Op } = require('sequelize');

// Funcion para obtener la disponibilidad de TODOS los empleados.
exports.obtenerDisponibilidadGeneral = async (req, res) => {
    const { negocioId, servicioId } = req.params;

    try {
        const diasDisponibles = [];

        // Obtener el horario general del negocio
        const horariosNegocio = await HorarioNegocio.findAll({
            where: { id_negocio: negocioId, activo: true },
        });

        // Obtener la duración del servicio
        const servicio = await Servicio.findByPk(servicioId);
        if (!servicio) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        const duracionServicio = servicio.duracion;

        // Iterar sobre las próximas 4 semanas (28 días)
        for (let i = 0; i < 28; i++) {
            const fecha = moment().add(i, 'days');
            const diaSemana = fecha.format('dddd');

            // Verificar si el negocio está abierto en este día de la semana
            const horarioNegocio = horariosNegocio.find(horario => horario.dia_semana.toLowerCase() === diaSemana.toLowerCase());
            if (!horarioNegocio) {
                diasDisponibles.push({ fecha: fecha.format('YYYY-MM-DD'), disponible: false });
                continue;
            }

            // Verificar disponibilidad de empleados para este día
            const empleadosDisponibles = await DisponibilidadEmpleado.findAll({
                where: {
                    id_negocio: negocioId,
                    dia_semana: diaSemana,
                    disponible: true
                },
            });

            // Construir bloques de horario según la disponibilidad de cada empleado
            const bloquesPorEmpleado = [];
            for (const empleado of empleadosDisponibles) {
                const bloquesEmpleado = [];

                let horaInicio = moment(`${fecha.format('YYYY-MM-DD')} ${empleado.hora_inicio}`);
                const horaFin = moment(`${fecha.format('YYYY-MM-DD')} ${empleado.hora_fin}`);

                while (horaInicio.clone().add(duracionServicio, 'minutes').isSameOrBefore(horaFin)) {
                    const horaFinBloque = horaInicio.clone().add(duracionServicio, 'minutes');

                    // Verificar si ya existe una reserva en este bloque
                    const reservaExistente = await Reserva.findOne({
                        where: {
                            id_negocio: negocioId,
                            id_empleado: empleado.id_usuario,
                            fecha: {
                                [Op.between]: [horaInicio.toDate(), horaFinBloque.toDate()]
                            }
                        }
                    });

                    if (!reservaExistente) {
                        bloquesEmpleado.push({
                            hora_inicio: horaInicio.format('HH:mm'),
                            hora_fin: horaFinBloque.format('HH:mm'),
                        });
                    }
                    horaInicio = horaFinBloque;
                }
                if (bloquesEmpleado.length > 0) {
                    bloquesPorEmpleado.push({
                        empleado: empleado.id_usuario,
                        bloques: bloquesEmpleado,
                    });
                }
            }

            diasDisponibles.push({
                fecha: fecha.format('YYYY-MM-DD'),
                disponible: bloquesPorEmpleado.length > 0,
                bloquesPorEmpleado,
            });
        }

        res.json(diasDisponibles);
    } catch (error) {
        console.error("Error al obtener disponibilidad general:", error);
        res.status(500).json({ error: error.message });
    }
};

// Funcion para obtener la disponibilidad de un empleado en especifico.
exports.obtenerDisponibilidadEmpleado = async (req, res) => {
    const { negocioId, servicioId, empleadoId } = req.params;

    try {
        const diasDisponibles = [];

        // Obtener el horario general del negocio
        const horariosNegocio = await HorarioNegocio.findAll({
            where: { id_negocio: negocioId, activo: true },
        });

        // Obtener la duración del servicio
        const servicio = await Servicio.findByPk(servicioId);
        if (!servicio) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        const duracionServicio = servicio.duracion;

        // Obtener la disponibilidad específica del empleado
        const disponibilidadEmpleado = await DisponibilidadEmpleado.findAll({
            where: { id_usuario: empleadoId, id_negocio: negocioId, disponible: true },
        });

        // Iterar sobre los próximos 28 días
        for (let i = 0; i < 28; i++) {
            const fecha = moment().add(i, 'days');
            const diaSemana = fecha.format('dddd');

            // Verificar si el negocio está abierto en este día
            const horarioNegocio = horariosNegocio.find(horario => horario.dia_semana.toLowerCase() === diaSemana.toLowerCase());
            if (!horarioNegocio) {
                diasDisponibles.push({ fecha: fecha.format('YYYY-MM-DD'), disponible: false });
                continue;
            }

            // Filtrar la disponibilidad del empleado para el día de la semana actual
            const horarioEmpleado = disponibilidadEmpleado.find(empleado => empleado.dia_semana.toLowerCase() === diaSemana.toLowerCase());
            if (!horarioEmpleado) {
                diasDisponibles.push({ fecha: fecha.format('YYYY-MM-DD'), disponible: false });
                continue;
            }

            // Crear bloques de tiempo disponibles para el empleado en este día
            const bloquesEmpleado = [];
            let horaInicio = moment(`${fecha.format('YYYY-MM-DD')} ${horarioEmpleado.hora_inicio}`);
            const horaFin = moment(`${fecha.format('YYYY-MM-DD')} ${horarioEmpleado.hora_fin}`);

            while (horaInicio.clone().add(duracionServicio, 'minutes').isSameOrBefore(horaFin)) {
                const horaFinBloque = horaInicio.clone().add(duracionServicio, 'minutes');

                // Verificar si el bloque ya está reservado
                const reservaExistente = await Reserva.findOne({
                    where: {
                        id_negocio: negocioId,
                        id_empleado: empleadoId,
                        fecha: {
                            [Op.between]: [horaInicio.toDate(), horaFinBloque.toDate()]
                        }
                    }
                });

                if (!reservaExistente) {
                    bloquesEmpleado.push({
                        hora_inicio: horaInicio.format('HH:mm'),
                        hora_fin: horaFinBloque.format('HH:mm'),
                    });
                }
                horaInicio = horaFinBloque;
            }

            diasDisponibles.push({
                fecha: fecha.format('YYYY-MM-DD'),
                disponible: bloquesEmpleado.length > 0,
                bloques: bloquesEmpleado,
            });
        }

        res.json(diasDisponibles);
    } catch (error) {
        console.error("Error al obtener disponibilidad de empleado:", error);
        res.status(500).json({ error: error.message });
    }
};


// Función para obtener el calendario de disponibilidad de un negocio específico para las próximas 4 semanas (patrón semanal)
exports.obtenerCalendarioDisponibilidad = async (req, res) => {
    const { negocioId } = req.params;
    const diasDisponibles = [];

    try {
        // Obtener la disponibilidad semanal del negocio (lunes a domingo)
        const horariosNegocio = await HorarioNegocio.findAll({
            where: {
                id_negocio: negocioId,
                activo: true
            }
        });

        console.log("Horarios del negocio:", horariosNegocio);

        // Obtener la disponibilidad semanal de los empleados del negocio (lunes a domingo)
        const disponibilidadEmpleados = await DisponibilidadEmpleado.findAll({
            where: {
                id_negocio: negocioId,
                disponible: true
            }
        });

        console.log("Disponibilidad de empleados:", disponibilidadEmpleados);

        // Iterar sobre los próximos 28 días y aplicar el patrón semanal
        for (let i = 0; i < 28; i++) {
            const fecha = moment().add(i, 'days');
            const diaSemana = fecha.format('dddd'); // Obtener el nombre del día en español

            console.log(`Revisando la fecha: ${fecha.format('YYYY-MM-DD')} (${diaSemana})`);

            // Paso 1: Verificar si el negocio está disponible en el día de la semana actual
            const horarioDia = horariosNegocio.find(horario => horario.dia_semana.toLowerCase() === diaSemana.toLowerCase());

            if (!horarioDia) {
                // Si el negocio está cerrado ese día en su patrón semanal, marcar como no disponible
                diasDisponibles.push({ fecha: fecha.format('YYYY-MM-DD'), disponible: false });
                console.log(`Negocio cerrado el día ${diaSemana}`);
                continue;
            }

            // Paso 2: Verificar si hay empleados disponibles para el día de la semana actual
            const empleadosDia = disponibilidadEmpleados.filter(empleado => empleado.dia_semana.toLowerCase() === diaSemana.toLowerCase());

            console.log(`Empleados disponibles el día ${diaSemana}:`, empleadosDia);

            // Verificar si algún empleado tiene disponibilidad que coincida con el horario del negocio
            const hayEmpleadoDisponible = empleadosDia.some(empleado => {
                const horaInicioEmpleado = moment(`${fecha.format('YYYY-MM-DD')} ${empleado.hora_inicio}`, 'YYYY-MM-DD HH:mm:ss');
                const horaFinEmpleado = moment(`${fecha.format('YYYY-MM-DD')} ${empleado.hora_fin}`, 'YYYY-MM-DD HH:mm:ss');
                const horaInicioNegocio = moment(`${fecha.format('YYYY-MM-DD')} ${horarioDia.hora_inicio}`, 'YYYY-MM-DD HH:mm:ss');
                const horaFinNegocio = moment(`${fecha.format('YYYY-MM-DD')} ${horarioDia.hora_fin}`, 'YYYY-MM-DD HH:mm:ss');
                
                // Comprobar si el horario del empleado se solapa con el horario del negocio
                const solapamiento = horaInicioEmpleado.isBefore(horaFinNegocio) && horaFinEmpleado.isAfter(horaInicioNegocio);
                console.log(`Comparando horarios para empleado ${empleado.id_usuario}: Negocio [${horaInicioNegocio.format('HH:mm')} - ${horaFinNegocio.format('HH:mm')}] vs Empleado [${horaInicioEmpleado.format('HH:mm')} - ${horaFinEmpleado.format('HH:mm')}] => Solapamiento: ${solapamiento}`);
                
                return solapamiento;
            });

            // Agregar el resultado final al calendario de disponibilidad
            diasDisponibles.push({ fecha: fecha.format('YYYY-MM-DD'), disponible: hayEmpleadoDisponible });
            console.log(`Resultado para ${fecha.format('YYYY-MM-DD')}: ${hayEmpleadoDisponible ? "Disponible" : "No disponible"}`);
        }

        // Devolver el calendario de disponibilidad al cliente
        res.json(diasDisponibles);
    } catch (error) {
        // Manejo de errores en caso de fallo en la consulta
        res.status(500).json({ error: error.message });
    }
};

// Función para obtener los bloques de horarios disponibles para una fecha específica
exports.obtenerBloquesDisponibles = async (req, res) => {
    const { negocioId, servicioId, fecha } = req.params;
    
    try {
        const diaSemana = moment(fecha).format('dddd'); // Obtener el día de la semana

        // Paso 1: Obtener la duración del servicio
        const servicio = await Servicio.findByPk(servicioId);
        if (!servicio) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }
        const duracionServicio = servicio.duracion; // Duración en minutos

        // Paso 2: Obtener el horario del negocio para el día específico
        const horarioNegocio = await HorarioNegocio.findOne({
            where: { id_negocio: negocioId, dia_semana: diaSemana, activo: true }
        });
        if (!horarioNegocio) {
            return res.status(404).json({ message: 'El negocio está cerrado en esta fecha' });
        }

        const negocioInicio = moment(`${fecha} ${horarioNegocio.hora_inicio}`, 'YYYY-MM-DD HH:mm');
        const negocioFin = moment(`${fecha} ${horarioNegocio.hora_fin}`, 'YYYY-MM-DD HH:mm');

        // Paso 3: Obtener disponibilidad de empleados en ese día
        const empleadosDisponibles = await DisponibilidadEmpleado.findAll({
            where: {
                id_negocio: negocioId,
                dia_semana: diaSemana,
                disponible: true
            }
        });
        if (empleadosDisponibles.length === 0) {
            return res.status(404).json({ message: 'No hay empleados disponibles en esta fecha' });
        }

        // Paso 4: Generar bloques de tiempo y verificar reservas existentes
        const bloquesDisponibles = [];

        for (let empleado of empleadosDisponibles) {
            const empInicio = moment(`${fecha} ${empleado.hora_inicio}`, 'YYYY-MM-DD HH:mm');
            const empFin = moment(`${fecha} ${empleado.hora_fin}`, 'YYYY-MM-DD HH:mm');

            let bloqueInicio = moment.max(empInicio, negocioInicio); // Máximo entre horario negocio y empleado
            const finHorario = moment.min(empFin, negocioFin); // Mínimo entre horario negocio y empleado

            while (bloqueInicio.clone().add(duracionServicio, 'minutes').isSameOrBefore(finHorario)) {
                const bloqueFin = bloqueInicio.clone().add(duracionServicio, 'minutes');

                // Verificar si el bloque ya está reservado
                const reservaExistente = await Reserva.findOne({
                    where: {
                        id_negocio: negocioId,
                        id_empleado: empleado.id_usuario,
                        fecha: {
                            [Op.between]: [bloqueInicio.toDate(), bloqueFin.toDate()]
                        }
                    }
                });

                if (!reservaExistente) {
                    // Bloque disponible si no hay reserva
                    bloquesDisponibles.push({
                        empleado: empleado.id_usuario,
                        hora_inicio: bloqueInicio.format('HH:mm'),
                        hora_fin: bloqueFin.format('HH:mm')
                    });
                }
                // Avanzar al siguiente bloque
                bloqueInicio = bloqueFin;
            }
        }

        res.json(bloquesDisponibles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};