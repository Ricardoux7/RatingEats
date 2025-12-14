/**
 * Results Component
 *
 * Muestra los resultados de búsqueda de restaurantes según el término ingresado.
 * Obtiene los resultados desde la API y los muestra en una lista.
 *
 * Props:
 * @param {string} searchBar - Término de búsqueda ingresado por el usuario.
 *
 * Estado:
 * - restaurants: Lista de restaurantes encontrados.
 *
 * Características:
 * - Obtiene resultados desde la API según el término de búsqueda.
 * - Muestra mensajes de error en consola si ocurre un fallo.
 *
 * Ejemplo de uso:
 * <Results searchBar={searchTerm} />
 *
 * @module Results
 */
import api from '../api/api';
import { useEffect, useState } from 'react';

const Results = ({ searchBar }) => {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/search', { params: { searchBar: searchTerm } });
        setRestaurants(response.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    }
    fetchRestaurants();
  }, [searchBar]);
}

export default Results