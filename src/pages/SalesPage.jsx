import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Alert, Table } from 'react-bootstrap';
import { modeloService, clienteService, ventaService } from '../services/api';

const SalesPage = () => {
  const [formData, setFormData] = useState({
    modeloCarroId: '',
    clienteId: '',
    precioVenta: '',
    cantidad: 1
  });

  const [models, setModels] = useState([]);
  const [clients, setClients] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stockError, setStockError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [modelsData, clientsData, salesData] = await Promise.all([
          modeloService.getAll(),
          clienteService.getAll(),
          ventaService.getAll()
        ]);
        setModels(modelsData);
        setClients(clientsData);
        setSales(salesData);
      } catch (err) {
        setError('Error al cargar datos: ' + err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'cantidad' || name === 'precioVenta' ? Number(value) : value
    });
  };

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    const selectedModel = models.find(m => m.modeloCarroId == modelId);
    if (selectedModel) {
      setFormData({
        ...formData,
        modeloCarroId: modelId,
        precioVenta: selectedModel.precio
      });
    } else {
      setFormData({
        ...formData,
        modeloCarroId: modelId,
        precioVenta: ''
      });
    }
  };

  const handleEdit = (sale) => {
    setFormData({
      modeloCarroId: sale.modeloCarroId,
      clienteId: sale.clienteId,
      precioVenta: sale.precioVenta,
      cantidad: sale.cantidad
    });
    setEditingId(sale.ventaId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta venta?')) return;
    try {
      await ventaService.delete(id);
      const updatedSales = await ventaService.getAll();
      setSales(updatedSales);
    } catch (err) {
      setError('Error al eliminar la venta: ' + err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStockError(null);
    setSuccess(false);

    try {
      const selectedModel = models.find(m => m.modeloCarroId == formData.modeloCarroId);
      if (!selectedModel) {
        setError('Por favor selecciona un modelo válido');
        return;
      }

      if (selectedModel.stock < formData.cantidad && editingId === null) {
        setStockError(`Stock insuficiente. Disponible: ${selectedModel.stock}`);
        return;
      }

      if (editingId) {
        await ventaService.update(editingId, formData);
      } else {
        await ventaService.create(formData);
      }

      const [updatedModels, updatedSales] = await Promise.all([
        modeloService.getAll(),
        ventaService.getAll()
      ]);
      setModels(updatedModels);
      setSales(updatedSales);

      setSuccess(true);
      setEditingId(null);
      setFormData({
        modeloCarroId: '',
        clienteId: '',
        precioVenta: '',
        cantidad: 1
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al guardar la venta: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const totalVentas = sales.reduce((total, sale) => total + (sale.precioVenta * sale.cantidad), 0);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary">Registro de Ventas</h2>

      <div className="card shadow-sm mb-4 border-primary">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{editingId ? 'Editar Venta' : 'Registrar Nueva Venta'}</h5>
        </div>
        <div className="card-body">
          {loading && !sales.length ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando datos...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>Modelo de Auto</Form.Label>
                    <Form.Select
                      name="modeloCarroId"
                      value={formData.modeloCarroId}
                      onChange={handleModelChange}
                      required
                      className="border-primary"
                      disabled={!models.length}
                    >
                      <option value="">Seleccionar modelo</option>
                      {models.map(model => (
                        <option key={model.modeloCarroId} value={model.modeloCarroId}>
                          {model.nombre} ({model.marcaNombre}) - Stock: {model.stock}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio de Venta ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="precioVenta"
                      min="1"
                      step="0.01"
                      value={formData.precioVenta}
                      onChange={handleChange}
                      required
                      className="border-primary"
                    />
                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      name="cantidad"
                      min="1"
                      value={formData.cantidad}
                      onChange={handleChange}
                      required
                      className="border-primary"
                    />
                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cliente</Form.Label>
                    <Form.Select
                      name="clienteId"
                      value={formData.clienteId}
                      onChange={handleChange}
                      required
                      className="border-primary"
                      disabled={!clients.length}
                    >
                      <option value="">Seleccionar cliente</option>
                      {clients.map(client => (
                        <option key={client.clienteId} value={client.clienteId}>
                          {client.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {stockError && <Alert variant="danger">{stockError}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">
                {editingId ? '¡Venta actualizada con éxito!' : '¡Venta registrada con éxito!'}
              </Alert>}

              <div className="d-flex justify-content-end">
                <Button
                  variant={editingId ? 'warning' : 'primary'}
                  type="submit"
                  disabled={loading}
                  className="fw-bold px-4"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {editingId ? 'Actualizando...' : 'Registrando...'}
                    </>
                  ) : editingId ? 'Actualizar Venta' : 'Registrar Venta'}
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>

      <div className="card shadow-sm border-primary">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Historial de Ventas</h5>
          <div className="bg-light text-primary px-3 py-1 rounded fw-bold">
            Total: ${totalVentas.toLocaleString()}
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando ventas...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-receipt display-4 text-primary"></i>
              <p className="mt-3 fs-5">No hay ventas registradas</p>
              <p className="text-muted">Registra tu primera venta</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="m-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>Cliente</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.ventaId}>
                      <td>{sale.ventaId}</td>
                      <td>{new Date(sale.fechaVenta).toLocaleDateString()}</td>
                      <td className="fw-bold">{sale.modeloNombre}</td>
                      <td>{sale.marcaNombre}</td>
                      <td>{sale.clienteNombre}</td>
                      <td className="text-center">{sale.cantidad}</td>
                      <td>${sale.precioVenta.toLocaleString()}</td>
                      <td className="fw-bold">${(sale.precioVenta * sale.cantidad).toLocaleString()}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(sale)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(sale.ventaId)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-primary">
                    <td colSpan="7" className="fw-bold text-end">Total General:</td>
                    <td colSpan="2" className="fw-bold">${totalVentas.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default SalesPage;
