// src/components/clients/ClientList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { clienteService } from '../../services/api';

const ClientList = ({ onEditClient }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clienteService.getAll();
        setClients(data);
      } catch (err) {
        setError('Error al cargar los clientes: ' + err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await clienteService.delete(id);
        setClients(prev => prev.filter(client => client.clienteId !== id));
      } catch (err) {
        setError('Error al eliminar el cliente: ' + err);
        console.error(err);
      }
    }
  };

  return (
    <div className="card shadow-sm border-primary">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Clientes Registrados</h5>
      </div>

      <div className="card-body">
        {loading && (
          <div className="text-center my-4 py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando clientes...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!loading && (
          <>
            <div className="table-responsive">
              <Table striped bordered hover className="m-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Ventas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.clienteId}>
                      <td>{client.clienteId}</td>
                      <td className="fw-bold">{client.nombre}</td>
                      <td>{client.email || '-'}</td>
                      <td>{client.telefono || '-'}</td>
                      <td className="text-center">
                        <Badge bg="primary" className="fs-6">
                          {client.ventasRealizadas || 0}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => onEditClient(client)}
                        >
                          <i className="bi bi-pencil"></i> Editar
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(client.clienteId)}
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {clients.length === 0 && (
              <div className="text-center text-muted py-5">
                <i className="bi bi-people display-4 text-primary"></i>
                <p className="mt-3 fs-5">No hay clientes registrados</p>
                <p className="text-muted">Comienza agregando un nuevo cliente</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientList;
