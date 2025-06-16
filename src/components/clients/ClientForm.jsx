// src/components/clients/ClientForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { clienteService } from '../../services/api';

const ClientForm = ({ client, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre,
        email: client.email || '',
        telefono: client.telefono || ''
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (client) {
        await clienteService.update(client.clienteId, {
          clienteId: client.clienteId,
          ...formData
        });
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        await clienteService.create(formData);
        setFormData({
          nombre: '',
          email: '',
          telefono: ''
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err || (client ? 'Error al actualizar el cliente' : 'Error al crear el cliente'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-primary">
      <Card.Header className="bg-primary text-white">
        <Card.Title className="mb-0">
          {client ? 'Editar Cliente' : 'Nuevo Cliente'}
          <Button 
            variant="link" 
            className="float-end text-white" 
            onClick={onClose}
            disabled={loading}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </Card.Title>
      </Card.Header>
      
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            {client ? '¡Cliente actualizado con éxito!' : '¡Cliente creado con éxito!'}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Juan Pérez"
                  className="border-primary"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: juan@example.com"
                  className="border-primary"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: +1234567890"
                  className="border-primary"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="secondary" 
              className="me-2" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant={client ? "primary" : "success"} 
              type="submit"
              disabled={loading}
              className="fw-bold"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {client ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                client ? "Actualizar Cliente" : "Crear Cliente"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ClientForm;