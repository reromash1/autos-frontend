// src/components/cars/CarList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { modeloService } from '../../services/api';

const CarList = ({ onEditCar }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await modeloService.getAll();
        setCars(data);
      } catch (err) {
        setError('Error al cargar los autos: ' + err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este auto?')) {
      try {
        await modeloService.delete(id);
        setCars(cars.filter(car => car.modeloCarroId !== id));
      } catch (err) {
        setError('Error al eliminar el auto: ' + err);
        console.error(err);
      }
    }
  };

  if (loading) return (
    <div className="text-center my-5 py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-2">Cargando autos...</p>
    </div>
  );
  
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-primary">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Modelos Registrados</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <Table striped bordered hover className="m-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Color</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Marca</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.modeloCarroId}>
                  <td>{car.modeloCarroId}</td>
                  <td className="fw-bold">{car.nombre}</td>
                  <td>{car.año}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div 
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          backgroundColor: car.color || '#3498db',
                          borderRadius: '50%',
                          marginRight: '8px'
                        }} 
                      />
                      {car.color}
                    </div>
                  </td>
                  <td>${car.precio.toLocaleString()}</td>
                  <td>
                    <Badge bg={car.stock > 0 ? 'success' : 'danger'}>
                      {car.stock}
                    </Badge>
                  </td>
                  <td>{car.marcaNombre}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => onEditCar(car)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(car.modeloCarroId)}
                    >
                      <i className="bi bi-trash"></i> Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        {cars.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-car-front display-4 text-primary"></i>
            <p className="mt-3 fs-5">No hay modelos de autos registrados</p>
            <p className="text-muted">Comienza agregando un nuevo modelo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;