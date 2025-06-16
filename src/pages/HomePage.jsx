// src/pages/HomePage.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center py-5">
      <h1 className="mb-4 text-primary">Sistema de Gestión de Concesionaria</h1>
      
      <Card className="shadow-lg border-primary mb-5">
        <Card.Body className="p-5">
          <Card.Title className="fs-2 mb-4 text-primary">
            <i className="bi bi-car-front me-2"></i>
            Bienvenido al sistema de gestión
          </Card.Title>
          
          <Card.Text className="lead mb-4">
            Administra de manera eficiente tu concesionaria de automóviles con nuestra plataforma.
            Controla marcas, modelos, clientes y ventas en un solo lugar.
          </Card.Text>
          
          <div className="d-flex justify-content-center gap-4 mb-5">
            <div className="text-center">
              <div className="bg-primary p-3 rounded-circle d-inline-block mb-3">
                <i className="bi bi-tags text-white fs-1"></i>
              </div>
              <h5 className="text-primary">Marcas</h5>
              <p>Gestiona las marcas de vehículos</p>
              <Button as={Link} to="/marcas" variant="outline-primary">
                Ir a Marcas
              </Button>
            </div>
            
            <div className="text-center">
              <div className="bg-primary p-3 rounded-circle d-inline-block mb-3">
                <i className="bi bi-car-front text-white fs-1"></i>
              </div>
              <h5 className="text-primary">Autos</h5>
              <p>Administra los modelos disponibles</p>
              <Button as={Link} to="/autos" variant="outline-primary">
                Ir a Autos
              </Button>
            </div>
            
            <div className="text-center">
              <div className="bg-primary p-3 rounded-circle d-inline-block mb-3">
                <i className="bi bi-people text-white fs-1"></i>
              </div>
              <h5 className="text-primary">Clientes</h5>
              <p>Gestiona tu base de clientes</p>
              <Button as={Link} to="/clientes" variant="outline-primary">
                Ir a Clientes
              </Button>
            </div>
            
            <div className="text-center">
              <div className="bg-primary p-3 rounded-circle d-inline-block mb-3">
                <i className="bi bi-cash-coin text-white fs-1"></i>
              </div>
              <h5 className="text-primary">Ventas</h5>
              <p>Registra y controla tus ventas</p>
              <Button as={Link} to="/ventas" variant="outline-primary">
                Ir a Ventas
              </Button>
            </div>
          </div>
          
          <div className="bg-light p-4 rounded border">
            <h4 className="text-primary mb-3">Estadísticas rápidas</h4>
            <div className="d-flex justify-content-center gap-4">
              <div className="bg-primary text-white p-3 rounded text-center" style={{ minWidth: '150px' }}>
                <h5>Marcas</h5>
                <h2 className="mb-0">15</h2>
              </div>
              <div className="bg-primary text-white p-3 rounded text-center" style={{ minWidth: '150px' }}>
                <h5>Autos</h5>
                <h2 className="mb-0">42</h2>
              </div>
              <div className="bg-primary text-white p-3 rounded text-center" style={{ minWidth: '150px' }}>
                <h5>Clientes</h5>
                <h2 className="mb-0">87</h2>
              </div>
              <div className="bg-primary text-white p-3 rounded text-center" style={{ minWidth: '150px' }}>
                <h5>Ventas</h5>
                <h2 className="mb-0">156</h2>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HomePage;