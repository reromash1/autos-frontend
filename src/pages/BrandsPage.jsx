// src/pages/BrandsPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form, Alert, Card } from 'react-bootstrap';
import { marcaService } from '../services/api';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    marcaId: null,
    nombre: '',
    descripcion: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true); // Activar carga inicial
      setError(null);   // Limpiar errores previos
      try {
        const data = await marcaService.getAll();
        setBrands(data);
      } catch (err) {
        console.error('Error al cargar marcas:', err);
        setError('Error al conectar con la base de datos o al cargar las marcas.');
      } finally {
        setLoading(false); // Siempre desactiva carga
      }
    };

    fetchBrands();
  }, []);


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
      if (editingId) {
        await marcaService.update(editingId, {
          marcaId: editingId,
          nombre: formData.nombre,
          descripcion: formData.descripcion
        });

        const updatedBrands = brands.map(brand =>
          brand.marcaId === editingId ? {
            ...brand,
            nombre: formData.nombre,
            descripcion: formData.descripcion
          } : brand
        );

        setBrands(updatedBrands);
        setSuccess(true);
        setEditingId(null);
      } else {
        const newBrand = await marcaService.create({
          nombre: formData.nombre,
          descripcion: formData.descripcion
        });

        setBrands([...brands, newBrand]);
        setSuccess(true);
      }

      setFormData({
        marcaId: null,
        nombre: '',
        descripcion: ''
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err || (editingId ? 'Error al actualizar la marca' : 'Error al crear la marca'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setFormData({
      marcaId: brand.marcaId,
      nombre: brand.nombre,
      descripcion: brand.descripcion || ''
    });
    setEditingId(brand.marcaId);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta marca?')) {
      try {
        await marcaService.delete(id);
        setBrands(brands.filter(brand => brand.marcaId !== id));
        setError(null); // Limpiar errores previos
      } catch (err) {
        // Mostrar el mensaje de error específico del backend
        setError(err);
        console.error(err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      marcaId: null,
      nombre: '',
      descripcion: ''
    });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary">Gestión de Marcas</h2>


      <Card className="shadow-sm mb-4 border-primary">
        <Card.Header className="bg-primary text-white">
          <Card.Title className="mb-0">
            {editingId ? 'Editar Marca' : 'Agregar Nueva Marca'}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la Marca</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Toyota"
                    className="border-primary"
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Ej: Fabricante japonés"
                    className="border-primary"
                  />
                </Form.Group>
              </Col>

              <Col md={2} className="d-flex">
                <div className="mt-auto w-100">
                  {editingId && (
                    <Button
                      variant="secondary"
                      className="me-2 w-100 mb-2"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button
                    variant={editingId ? "primary" : "success"}
                    type="submit"
                    disabled={loading}
                    className="w-100 fw-bold"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {editingId ? "Actualizando..." : "Creando..."}
                      </>
                    ) : editingId ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </Col>


            </Row>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success">
                {editingId ? '¡Marca actualizada con éxito!' : '¡Marca creada con éxito!'}
              </Alert>
            )}
          </Form>
        </Card.Body>
      </Card>


      <Card className="shadow-sm border-primary">
        <Card.Header className="bg-primary text-white">
          <Card.Title className="mb-0">Marcas Registradas</Card.Title>
        </Card.Header>
        <Card.Body>
          {brands.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-tags display-4 text-primary"></i>
              <p className="mt-3 fs-5">No hay marcas registradas</p>
              <p className="text-muted">Comienza agregando una nueva marca</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="m-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map(brand => (
                    <tr key={brand.marcaId}>
                      <td>{brand.marcaId}</td>
                      <td className="fw-bold">{brand.nombre}</td>
                      <td>{brand.descripcion || '-'}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(brand)}
                        >
                          <i className="bi bi-pencil"></i> Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(brand.marcaId)}
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BrandsPage;