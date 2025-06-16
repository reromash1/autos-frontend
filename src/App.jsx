// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import BrandsPage from './pages/BrandsPage';
import CarsPage from './pages/CarsPage';
import ClientsPage from './pages/ClientsPage';
import SalesPage from './pages/SalesPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4 pb-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marcas" element={<BrandsPage />} />
          <Route path="/autos" element={<CarsPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/ventas" element={<SalesPage />} />
        </Routes>
      </div>
      
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>Sistema de Gestión de Concesionaria</h5>
              <p className="mb-0">Plataforma integral para la administración de vehículos, clientes y ventas.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">&copy; {new Date().getFullYear()} Concesionaria. Todos los derechos reservados.</p>
              <p className="mb-0">Desarrollado con React y ASP.NET Core</p>
            </div>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;