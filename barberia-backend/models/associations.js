const Usuario = require('./Usuario');
const Negocio = require('./Negocio');

// Definir las relaciones entre los modelos
Usuario.hasMany(Negocio, { foreignKey: 'id_dueno' });
Negocio.belongsTo(Usuario, { foreignKey: 'id_dueno' });

module.exports = { Usuario, Negocio };
