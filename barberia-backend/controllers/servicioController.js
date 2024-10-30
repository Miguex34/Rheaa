// servicioController.js
const Servicio = require('../models/Servicio');
const EmpleadoNegocio = require('../models/EmpleadoNegocio');
const EmpleadoServicio = require('../models/EmpleadoServicio');
const Negocio = require('../models/Negocio');
const Usuario = require('../models/Usuario');

// servicioController.js
const { validationResult } = require('express-validator');




// Crear un nuevo servicio y asignar empleados
exports.createServicio = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, descripcion, duracion, precio, categoria, id_negocio, id_empleados } = req.body;

  try {
    const nuevoServicio = await Servicio.create({
      nombre,
      descripcion,
      duracion,
      precio,
      categoria,
      disponible: true,
      id_negocio
    });

    if (id_empleados && Array.isArray(id_empleados) && id_empleados.length > 0) {
      const empleadoServicioData = id_empleados.map((id_empleado) => ({
        id_servicio: nuevoServicio.id,
        id_empleado,
      }));
      await EmpleadoServicio.bulkCreate(empleadoServicioData);
    }

    res.status(201).json(nuevoServicio);
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
};


// Actualizar un servicio existente
exports.updateServicio = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { nombre, descripcion, duracion, precio, categoria, id_negocio, id_empleados } = req.body;

  try {
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    await servicio.update({
      nombre,
      descripcion,
      duracion,
      precio,
      categoria,
      id_negocio
    });

    // Actualizar las asociaciones de empleados
    await EmpleadoServicio.destroy({ where: { id_servicio: id } });

    if (id_empleados && Array.isArray(id_empleados) && id_empleados.length > 0) {
      const empleadoServicioData = id_empleados.map((id_empleado) => ({
        id_servicio: id,
        id_empleado,
      }));
      await EmpleadoServicio.bulkCreate(empleadoServicioData);
    }

    res.status(200).json(servicio);
  } catch (error) {
    console.error('Error al actualizar el servicio:', error);
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
};

// Obtener empleados asignados a un servicio específico
exports.getEmpleadosByServicio = async (req, res) => {
  try {
    const { id_servicio } = req.params;
    const servicio = await Servicio.findByPk(id_servicio, {
      include: [
        {
          model: EmpleadoNegocio,
          as: 'empleados', // Asegúrate de que coincide con el alias en `associations.js`
          through: {
            model: EmpleadoServicio,
            attributes: [],
          },
          attributes: ['id', 'nombre', 'correo', 'cargo'],
        },
      ],
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json(servicio.empleados);
  } catch (error) {
    console.error('Error al obtener empleados asignados:', error);
    res.status(500).json({ error: 'Error al obtener empleados asignados' });
  }
};
exports.getServicioById = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: 'empleados',
          through: {
            model: EmpleadoServicio,
            attributes: [],
          },
          attributes: ['id', 'nombre', 'correo', 'cargo']
        }
      ]
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json(servicio);
  } catch (error) {
    console.error('Error al obtener el servicio:', error);
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};
// Obtener un servicio por ID
exports.getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({
      include: [
        {
          model: Usuario,
          as: 'empleados', // Debe coincidir con el alias en `associations.js`
          through: {
            model: EmpleadoServicio,
            attributes: [], // Omite atributos de la tabla intermedia
          },
          attributes: ['id', 'nombre', 'correo', 'cargo']
        }
      ]
    });

    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

// Eliminar un servicio y sus asociaciones
exports.deleteServicio = async (req, res) => {
  const { id } = req.params;

  try {
    // Elimina las asociaciones en EmpleadoServicio
    await EmpleadoServicio.destroy({ where: { id_servicio: id } });

    // Elimina el servicio
    const result = await Servicio.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.status(200).json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el servicio:', error);
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};


exports.getServiciosByNegocio = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({ where: { id_negocio: req.params.id_negocio } });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};