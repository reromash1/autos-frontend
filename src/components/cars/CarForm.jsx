// src/components/cars/CarForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import { marcaService, modeloService } from '../../services/api';

const CarForm = ({ car, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    año: new Date().getFullYear(),
    color: '#3498db',
    precio: 0,
    stock: 0,
    marcaId: 0
  });
  
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await marcaService.getAll();
        setBrands(data);
        
        if (!car && data.length > 0) {
          setFormData(prev => ({ ...prev, marcaId: data[0].marcaId }));
        }
      } catch (err) {
        console.error('Error al cargar marcas:', err);
      }
    };

    fetchBrands();

    if (car) {
      setFormData({
        nombre: car.nombre,
        año: car.año,
        color: car.color || '#3498db',
        precio: car.precio,
        stock: car.stock,
        marcaId: car.marcaId
      });
    }
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'año' || name === 'precio' || name === 'stock' || name === 'marcaId' 
        ? Number(value) 
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (car) {
        await modeloService.update(car.modeloCarroId, formData);
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        await modeloService.create(formData);
        setFormData({
          nombre: '',
          año: new Date().getFullYear(),
          color: '#3498db',
          precio: 0,
          stock: 0,
          marcaId: brands.length > 0 ? brands[0].marcaId : 0
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err || (car ? 'Error al actualizar el auto' : 'Error al crear el auto'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-primary">
      <Card.Header className="bg-primary text-white">
        <Card.Title className="mb-0">
          {car ? 'Editar Modelo de Auto' : 'Nuevo Modelo de Auto'}
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
            {car ? '¡Auto actualizado con éxito!' : '¡Auto creado con éxito!'}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Modelo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Corolla"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Marca</Form.Label>
                <Form.Select
                  name="marcaId"
                  value={formData.marcaId}
                  onChange={handleChange}
                  required
                  className="border-primary"
                >
                  {brands.length === 0 ? (
                    <option>Cargando marcas...</option>
                  ) : brands.map(brand => (
                    <option key={brand.marcaId} value={brand.marcaId}>
                      {brand.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Año</Form.Label>
                <Form.Control
                  type="number"
                  name="año"
                  min="2020"
                  max="2030"
                  value={formData.año}
                  onChange={handleChange}
                  required
                  className="border-primary"
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    style={{ width: '50px', height: '38px' }}
                    className="me-2"
                  />
                  <Form.Control
                    type="text"
                    name="colorText"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="Código HEX"
                    className="border-primary"
                  />
                </div>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Precio ($)</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  min="1000"
                  step="0.01"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  className="border-primary"
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
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
              variant={car ? "primary" : "success"} 
              type="submit"
              disabled={loading}
              className="fw-bold"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {car ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                car ? "Actualizar Auto" : "Crear Auto"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CarForm;