const Negocio = require('./models/Negocio');
const DuenoNegocio = require('./models/DuenoNegocio');
const Usuario = require('./models/Usuario');

// Define las asociaciones aquí
Negocio.hasMany(DuenoNegocio, { foreignKey: 'id_negocio' });
DuenoNegocio.belongsTo(Negocio, { foreignKey: 'id_negocio' });

Usuario.hasMany(DuenoNegocio, { foreignKey: 'id_dueno' });
DuenoNegocio.belongsTo(Usuario, { foreignKey: 'id_dueno' });

module.exports = { Negocio, DuenoNegocio, Usuario };
