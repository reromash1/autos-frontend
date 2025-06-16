// src/pages/CarsPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CarList from '../components/cars/CarList';
import CarForm from '../components/cars/CarForm';

const CarsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddCar = () => {
    setSelectedCar(null);
    setShowForm(true);
  };

  const handleEditCar = (car) => {
    setSelectedCar(car);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="text-primary">Gestión de Modelos de Autos</h2>
        </Col>
        <Col className="text-end">
          <Button 
            variant="success" 
            onClick={handleAddCar}
            className="fw-bold"
          >
            <i className="bi bi-plus-circle me-2"></i> Nuevo Auto
          </Button>
        </Col>
      </Row>

      {showForm && (
        <div className="mb-4">
          <CarForm 
            car={selectedCar} 
            onClose={handleFormClose} 
          />
        </div>
      )}

      <CarList 
        key={refreshKey} 
        onEditCar={handleEditCar} 
      />
    </Container>
  );
};

export default CarsPage;