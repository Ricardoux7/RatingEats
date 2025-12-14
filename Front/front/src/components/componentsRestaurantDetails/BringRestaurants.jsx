/**
 * BringRestaurants Component
 *
 * Muestra una selección aleatoria de restaurantes destacados.
 *
 * Características:
 * - Obtiene restaurantes desde la API.
 * - Muestra una selección aleatoria y única de restaurantes.
 * - Permite navegar a los detalles de cada restaurante.
 *
 * Estado:
 * - bringRestaurant: Array de restaurantes destacados.
 * - error: Mensaje de error.
 *
 * @module BringRestaurants
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api'; 
import { useNavigate } from 'react-router-dom';

const BringRestaurants = () => {
  const [bringRestaurant, setBringRestaurant] = useState([]);
  const [error, setError] = useState(null);
  const limitRestaurants = 6;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const getRandomRestaurants = (restaurants, limit) => {
    const unicos = [];
    const vistos = new Set();
    for (const r of restaurants) {
      if (!vistos.has(r._id)) {
        unicos.push(r);
        vistos.add(r._id);
      }
    }
    const shuffled = [...unicos].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  };

  const bringRestaurantFunction = async () => {
    try {
      const response = await api.get(`/restaurants`);
      const randomRestaurants = getRandomRestaurants(response.data.restaurants || response.data.data, limitRestaurants);
      setBringRestaurant(randomRestaurants);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Couldn't fetch restaurants. Please try again later.");
    }
  };

  useEffect(() => {
    bringRestaurantFunction();
  }, []);

  const handleViewDetails = (restaurant) => {
    navigate(`/restaurants/${restaurant._id}`);
  }

  return (
    
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full md:w-[60%]'>
        {bringRestaurant && bringRestaurant.map((restaurant) => {
          const restaurantImageUrl = restaurant.images && restaurant.images.length > 0 ? `${BACKEND_URL}${restaurant.images[0].url}` : '../icons/image-not-found.png';
          return (
            <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-[1.02]" onClick={() => handleViewDetails(restaurant)}>  
              <img className="w-full h-48 object-cover" src={restaurantImageUrl} alt={restaurant.images && restaurant.images[0]?.alt ? restaurant.images[0].alt : restaurant.name} />
              <div className="p-4">
                <h2 className="text-xl font-bold text-[#1D2025]">{restaurant.name}</h2>
                <p className="text-gray-600 mt-1">{restaurant.adress || "No specified address"}</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={i < Math.round(restaurant.averageRating) ? '../icons/star.svg' : '../icons/star-outline.svg'} alt="star" className="w-6" />
                  ))}
                  <p className="text-[1rem] ml-2 text-[#1D2025]">{restaurant.averageRating}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
  );
}

export default BringRestaurants;