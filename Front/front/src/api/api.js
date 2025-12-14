/**
 * API Client
 *
 * Este módulo configura una instancia de Axios para interactuar con la API de RatingEats.
 * Incluye la configuración de la URL base, cabeceras y un interceptor para adjuntar el token JWT
 * almacenado en localStorage a cada solicitud saliente.
 *
 * Características:
 * - Base URL: http://localhost:3000/api
 * - Content-Type: application/json
 * - Interceptor de solicitud: agrega el token de autenticación si existe.
 *
 * Uso:
 *   import api from './api';
 *   api.get('/restaurants');
 *
 * @module api
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;