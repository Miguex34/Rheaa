const { WebpayPlus, Environment, Options } = require('transbank-sdk');

// Configuración para el ambiente de integración
const options = new Options(
  '597055555532', // Código de comercio de prueba
  '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C' // API Key
);

const transaction = new WebpayPlus.Transaction(options, Environment.Integration);
