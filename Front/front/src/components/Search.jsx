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