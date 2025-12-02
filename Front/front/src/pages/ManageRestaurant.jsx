import api from '../api/api';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ManageReservations from '../components/ManageRestaurant/ManageReservations.jsx';
import ManagePosts from '../components/ManageRestaurant/ManagePosts.jsx';
import BringPosts from '../components/componentsRestaurantDetails/BringPosts.jsx';
import '../components.css';
import { useAuth } from '../context/AuthContext.jsx';
import { HeaderMobile, HeaderDesktop } from '../components/Components.jsx';
import Statistics from '../components/componentsRestaurantDetails/Statistics.jsx';

const MyRestaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('details');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const imageUrl = restaurant && restaurant.images && restaurant.images.length > 0 ? `${BACKEND_URL}${restaurant?.images[0].url}` : '/icons/image-not-found.png';
  const imagesMenuUrl = restaurant?.menu && restaurant.menu.length > 0;
  const navigate = useNavigate();

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

  return (
    <>
      <HeaderDesktop />
      <div className='hidden md:grid md:grid-cols-[1fr_3fr_1fr] gap-4 pb-10'>
        <aside className="hidden bg-white rounded-2xl p-4 md:flex md:flex-col gap-4">
          <button
            className='h-auto w-[70%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem]'
            onClick={() => setActiveSection('details')}
          >
            Restaurant Details
          </button>
          <button
            className='h-auto w-[70%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem]'
            onClick={() => setActiveSection('reservations')}
          >
            Reservations history
          </button>
          <button
            className='h-auto w-[70%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem]'
            onClick={() => setActiveSection('pending')}
          >
            Pending Reservations
          </button>
          <button
            className='h-auto w-[70%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem]'
            onClick={() => setActiveSection('posts')}
          >
            Posts Management
          </button>
          <button
            className='h-auto w-[70%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem]'
            onClick={() => setActiveSection('postsHistory')}
          >
            Posts History
          </button>
          <button
            className='h-auto w-[70%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[1.2rem]'
            onClick={() => setActiveSection('menu')}
          >
            Menu Management
          </button>
        </aside>
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {activeSection === 'details' && restaurant && (
                <div className="bg-white overflow-hidden transform transition duration-700 mt-8 shadow-lg rounded-2xl p-6">
                  <div className='relative h-[300px] w-full z-0 rounded-2xl flex flex-row items-start'>
                    <img src={imageUrl} alt={restaurant.name} className="w-full h-[300px] object-cover rounded-2xl relative z-0" />
                  </div>
                  <h2 className="text-4xl font-bold text-[#171A1F] mt-2 mr-2">{restaurant.name}</h2>
                  <div className='flex items-center flex-row w-[30%]'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < Math.round(restaurant.averageRating) ? (
                        <img key={i} src="../../icons/star.svg" alt="star" className='w-6 mt-5' />
                        ) : (
                        <img key={i} src="../../icons/star-outline.svg" alt="star" className='w-8 mt-5' />
                        )
                    ))}
                    <p className='text-[1.4rem] ml-2 text-[#171A1F] mt-5'>{restaurant.averageRating}</p>
                    <p className='text-[1.4rem] ml-4 text-[#171A1F] mt-5'>{restaurant.categories[0]}</p>
                  </div>
                  <div className='flex flex-row flex-wrap w-[60%] mt-2'>
                    <p className='text-[1.5rem] mr-1'>Cuisine: </p>
                    {restaurant.categories.map((category, idx) => (
                      <span key={category} className="text-[1.5rem] text-black-200 mr-2">
                        {category}{idx < restaurant.categories.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-col items-start space-y-2 h-full">
                    <p className="text-[#171A1F] mt-1 w-[70%] text-[1.5rem]">{restaurant.description || "Nspecified description"}</p>
                  </div>
                  <div className='flex items-center flex-row mt-2'>
                    <span className="text-[#171A1F] text-[1.2rem]">{restaurant.adress || "No specifieadress"}</span>
                  </div>
                  <p className='text-[#171A1F] font-bold text-[2rem] mt-4 mb-2'>Contact</p>
                  <p className='text-[#171A1F] text-[1rem]'>{restaurant.phoneNumber}</p>
                  <h2 className='text-[2rem] font-bold text-[#171A1F] pb-4 '>Our Menu</h2>
                  <div className='flex gap-4 p-4 object-cover overflow-x-scroll scrollbar-thin w-full menu-scrollbar'>
                    {imagesMenuUrl ? (
                      restaurant.menu.map((menuItem, i) => {
                        const menuImageUrl = `${BACKEND_URL}${menuItem.url}`;
                        return (
                          <div key={i} className='w-fit shrink-0'>
                            <img src={menuImageUrl} alt="Menu Image" className="w-[200px] h-[200px] object-cover rounded-lg cursor-pointer" onClick={() => { setSelectedImage(menuImageUrl); setShowImage(true); }} />
                          </div>
                        );
                      })
                    ) : (
                      <p>No menu images available</p>
                    )}
                  </div>
                  <div>
                  </div>
                </div>
              )}
              {activeSection === 'pending' && restaurant && (
                <ManageReservations restaurantId={restaurant._id} userToken={user.token} />
              )}
              {activeSection === 'posts' && restaurant && (
                <ManagePosts restaurantId={restaurant._id} userToken={user.token} />
              )}
              {activeSection === 'postsHistory' && restaurant && (
                <BringPosts restaurantId={restaurant._id} userToken={user.token} />
              )}
            </>
          )}
        </div>
        <aside className="hidden bg-white rounded-2xl p-4 items-center md:flex flex-col gap-4">
          <div className='ml-4 mt-4 flex flex-col gap-2'>
            <p className='text-[#171A1F] font-light text-[2rem] mt-4 mb-2'>Operating hours</p>
            {restaurant && restaurant.schedule ? (
              restaurant.schedule.map((item, i) => (
                <p key={item._id} className='text-[#171A1F] text-[1.5rem]'>
                  {item.day}: {item.open} - {item.close}
                </p>
              ))
            ) : (
              <p>No schedule available</p>
            )}
          </div>
          <Statistics restaurantId={id} userToken={user.token}/>
        </aside>
      </div>
    </>
  )
}

export default MyRestaurant;