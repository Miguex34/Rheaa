import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Tus estilos globales
import App from './App'; // Tu componente principal

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Montar en el contenedor con id="root"
);
