import api from '../../api/api';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../components.css';

const MyRestaurants = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get(`/profile/${user._id}/my-restaurants`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const owner = response.data.owner || [];
        const admin = response.data.admin?.restaurant ? [response.data.admin.restaurant] : [];
        setRestaurants([...owner, ...admin]);
      } catch (err) {
        console.error(err.message);
        setError('Coulnt fetch restaurants. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, [user.token]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="p-5 font-sans">
      <button className='bg-[#258A00] text-white py-2 px-4 rounded hover:bg-[#2DA800]' onClick={() => navigate('/manage/restaurants/create')}>Create Restaurant</button>
      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : restaurants.length === 0 ? (
        <p className="text-center text-gray-600">No restaurants found.</p>
      ) : (
        <>
          <div className="gap-4 hidden md:grid grid-cols-3 mt-8">
            {restaurants.map((restaurant) => {
              const imageUrl = restaurant.images && restaurant.images.length > 0 
                ? `${BACKEND_URL}${restaurant.images[0].url}` 
                : "../icons/image-not-found.png";
              return (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
                >
                  <div onClick={() => navigate(`/manage/restaurants/${restaurant._id}`)}>
                    <img src={imageUrl} alt={restaurant.name} className="w-full h-40 object-cover rounded-md mb-4" />
                  </div>
                  <h2 className="text-lg font-semibold">{restaurant.name}</h2>
                  <p className="text-gray-600">{restaurant.adress}</p>
                </div>
              );
            })}
          </div>
        <div className="gap-4 md:hidden grid grid-cols-1 mt-8 justify-center items-center mx-auto">
          
            {restaurants.map((restaurant) => {
              const imageUrl = restaurant.images && restaurant.images.length > 0 
                ? `${BACKEND_URL}${restaurant.images[0].url}` 
                : "../icons/image-not-found.png";
              return (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
                >
                  <div onClick={() => navigate(`/manage/restaurants/${restaurant._id}`)}>
                    <img src={imageUrl} alt={restaurant.name} className="w-full h-40 object-cover rounded-md mb-4" />
                  </div>
                  <h2 className="text-lg font-semibold">{restaurant.name}</h2>
                  <p className="text-gray-600">{restaurant.adress}</p>
                </div>
              );
            })}
        </div>
        </>
      )}
    </div>
  );
}

export default MyRestaurants;