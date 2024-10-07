import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CrearNegocio from './components/CrearNegocio';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crear-negocio" element={
          <PrivateRoute>
            <CrearNegocio />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
