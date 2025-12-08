import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import api from '../api/api';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Prueba() {
  const [restaurant, setRestaurant] = useState({ menu: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await api.get(`/restaurants/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setRestaurant(response.data);
      } catch (err) {
        setError('Coulnt fetch restaurant. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurant();
  }, [id, user.token]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Prueba Page</h1>
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {restaurant.menu.map((menuItem, i) => (
          <SwiperSlide key={i}>
            <img
              src={`${BACKEND_URL}${menuItem.url}`}
              alt="Menu Image"
              className="w-full h-48 object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}