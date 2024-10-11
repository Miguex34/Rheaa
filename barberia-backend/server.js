const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Solo una vez
require('./models/associations');


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
    
    // Sincronizar las tablas sin duplicarlas
    return sequelize.sync({ force: false, alter: true });  // Asegura que no se dupliquen las tablas y que se actualicen solo si es necesario
  })
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
  })
  .catch((err) => {
    console.error('Error al conectar o sincronizar la base de datos:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
