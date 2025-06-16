// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor mejorado para manejo de errores
api.interceptors.response.use(
  response => response.data,
  error => {
    let message = 'Error desconocido';
    
    if (error.response) {
      // Maneja diferentes formatos de error
      if (typeof error.response.data === 'string') {
        // Si el backend devuelve un string directo
        message = error.response.data;
      } else if (error.response.data?.errors) {
        // Maneja errores de validación de ASP.NET
        const validationErrors = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        message = `Errores de validación: ${validationErrors}`;
      } else {
        // Maneja otros formatos de error
        message = error.response.data?.detail || 
                  error.response.data?.message || 
                  error.response.data?.title || 
                  error.response.statusText;
      }
    } else if (error.message) {
      message = error.message;
    }
    
    console.error('API Error:', message, error.response?.data);
    return Promise.reject(message);
  }
);

// Servicios actualizados
export const marcaService = {
  getAll: () => api.get('/Marcas'),
  getById: (id) => api.get(`/Marcas/${id}`),
  create: (marca) => api.post('/Marcas', { nombre: marca.nombre, descripcion: marca.descripcion }),
  update: (id, marca) => api.put(`/Marcas/${id}`, { marcaId: id, ...marca }),
  delete: (id) => api.delete(`/Marcas/${id}`)
};

export const modeloService = {
  getAll: () => api.get('/ModelosCarro'),
  getById: (id) => api.get(`/ModelosCarro/${id}`),
  create: (modelo) => api.post('/ModelosCarro', modelo),
  update: (id, modelo) => api.put(`/ModelosCarro/${id}`, { modeloCarroId: id, ...modelo }),
  delete: (id) => api.delete(`/ModelosCarro/${id}`)
};

export const clienteService = {
  getAll: () => api.get('/Clientes'),
  getById: (id) => api.get(`/Clientes/${id}`),
  create: (cliente) => api.post('/Clientes', cliente),
  update: (id, cliente) => api.put(`/Clientes/${id}`, { clienteId: id, ...cliente }),
  delete: (id) => api.delete(`/Clientes/${id}`)
};

export const ventaService = {
  getAll: () => api.get('/Ventas'),
  create: (venta) => api.post('/Ventas', venta),
  update: (id, venta) => api.put(`/Ventas/${id}`, { ventaId: id, ...venta }),
  delete: (id) => api.delete(`/Ventas/${id}`)
};
