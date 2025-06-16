// src/pages/ClientsPage.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ClientList from '../components/clients/ClientList';
import ClientForm from '../components/clients/ClientForm';

const ClientsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddClient = () => {
    setSelectedClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
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
          <h2 className="text-primary">Gestión de Clientes</h2>
        </Col>
        <Col className="text-end">
          <Button 
            variant="success" 
            onClick={handleAddClient}
            className="fw-bold"
          >
            <i className="bi bi-plus-circle me-2"></i> Nuevo Cliente
          </Button>
        </Col>
      </Row>

      {showForm && (
        <div className="mb-4">
          <ClientForm 
            client={selectedClient} 
            onClose={handleFormClose} 
          />
        </div>
      )}

      <ClientList 
        key={refreshKey} 
        onEditClient={handleEditClient} 
      />
    </Container>
  );
};

export default ClientsPage;