const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Solo una vez

// Importa tus rutas
const userRoutes = require('./routes/userRoutes');
const negocioRoutes = require('./routes/negocioRoutes');
const citaRoutes = require('./routes/citaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const disponibilidadRoutes = require('./routes/disponibilidadRoutes');

const app = express();

// Middleware para procesar JSON y CORS
app.use(cors());
app.use(express.json());

// Usar las rutas
app.use('/api/users', userRoutes); 
app.use('/api/negocios', negocioRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);

// Conectar a la base de datos y sincronizar tablas
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    
    // Sincronizar las tablas solo si es necesario
    return sequelize.sync({ alter: true });  // Alter asegura la actualización de la estructura sin borrar datos
  })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((err) => {
    console.error('Error al conectar o sincronizar la base de datos:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
