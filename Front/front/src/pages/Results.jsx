/*import api from '../api/api';
import { useEffect, useState } from 'react';
import renderRestaurantCard from '../pages/MainPage';

const Results = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    rating: null,
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const params = {};
        if (filters.categories.length > 0) {
          params.categories = filters.categories.join(',');
        }
        if (filters.rating !== null) {
          params.rating = filters.rating;
        }
        const response = await api.get('/filter', { params });
        setRestaurants(response.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    }
    fetchRestaurants();
  }, [filters]);

  return (
    <div>
      <Navbar />
      <Filter filters={filters || { categories: [], rating: null }} setFilters={setFilters} />
      <div>
        {restaurants.map(restaurant => (
          renderRestaurantCard(restaurant)
        ))}
      </div>
    </div>
  );
}

export default Results;*/