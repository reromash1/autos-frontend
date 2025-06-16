// src/components/layout/Navbar.jsx
import React from 'react';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-car-front me-2"></i>
          <span className="fw-bold">Concesionaria</span>
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/marcas" 
              className={isActive('/marcas') ? 'active fw-bold' : ''}
            >
              <i className="bi bi-tags me-1"></i> Marcas
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/autos" 
              className={isActive('/autos') ? 'active fw-bold' : ''}
            >
              <i className="bi bi-car-front me-1"></i> Autos
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/clientes" 
              className={isActive('/clientes') ? 'active fw-bold' : ''}
            >
              <i className="bi bi-people me-1"></i> Clientes
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/ventas" 
              className={isActive('/ventas') ? 'active fw-bold' : ''}
            >
              <i className="bi bi-cash-coin me-1"></i> Ventas
            </Nav.Link>
          </Nav>
          
          <div className="d-flex">
            <div className="text-white me-3">
              <i className="bi bi-person-circle me-1"></i> Admin
            </div>
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;