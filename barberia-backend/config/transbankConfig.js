const Transbank = require('transbank-sdk');

const commerceCode = '597055555532'; // Código de Comercio para Webpay Plus (ambiente integración)
const apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

const WebpayPlus = new Transbank.WebpayPlus.Transaction({
  commerceCode,
  apiKey,
  environment: Transbank.Environment.Integration, // Ambiente de Integración
});

module.exports = WebpayPlus;
