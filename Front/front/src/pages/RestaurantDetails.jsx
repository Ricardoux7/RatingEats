/**
 * RestaurantDetails Component
 *
 * Página de detalles de un restaurante, muestra información, menú, imágenes, favoritos y permite reservar.
 *
 * Estado:
 * - restaurant: Objeto restaurante actual.
 * - isLoading: Estado de carga.
 * - error: Mensaje de error.
 * - reservationSuccess: Estado de éxito de reserva.
 * - tab: Sección activa (general, menú, etc.).
 *
 * Características:
 * - Obtiene y muestra detalles del restaurante.
 * - Permite marcar como favorito y reservar.
 * - Muestra menú, imágenes y tabs.
 *
 * Ejemplo de uso:
 * <RestaurantDetails />
 *
 * @module RestaurantDetails
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderMobile, HeaderDesktop } from '../components/Components.jsx';
import CreateReservation  from '../components/componentsRestaurantDetails/Reservation.jsx';
import BringPosts  from '../components/componentsRestaurantDetails/BringPosts.jsx';
import Reviews  from '../components/componentsRestaurantDetails/Reviews.jsx';
import BringRestaurants from '../components/componentsRestaurantDetails/BringRestaurants.jsx';
import BringMenu from '../components/BringMenu.jsx';
import Maps from '../components/Maps.jsx';
import api from '../api/api'; 
import UploadImage from '../components/ManageRestaurant/UploadPost.jsx';
import { useFavorites } from '../components/Favorites.jsx';
import Switch from '../components/FavoriteButton.jsx';
import '../components.css';


const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { favorites, handleFavoriteToggle } = useFavorites();
  const [reservationSuccess, setReservationSuccess] = useState(false);
  //const [bringRestaurant, setBringRestaurant] = useState(null);
  const [tab, setTab] = useState('general');
  const limitRestaurants = 3;

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        setError("Coulnt fetch restaurant details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (isLoading) {
    return <div className=' items-center justify-center min-h-screen flex flex-col'>
      <div className='w-12 h-12 loader-rotate'></div>
    </div>;
  }
  if (error) {
    return <div>
      {error}
    </div>;
  }
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const imageUrl = restaurant.images && restaurant.images.length > 0
    ? restaurant.images[0].url
    : '/icons/image-not-found.png';
  const imagesMenuUrl = restaurant.menu && restaurant.menu.length > 0;

  if(favorites.some(fav => fav._id === restaurant._id)){
    var isFavorite = true;
  } else {
    var isFavorite = false;
  }

  return (
    <>
      <HeaderMobile tab={tab} setTab={setTab} manage={false} />
      <HeaderDesktop tab={tab} setTab={setTab} />
      {tab === 'general' && (
        <div>
          <div className="hidden md:grid md:grid-cols-3 gap-8 bg-white overflow-hidden transform transition duration-700">
            <div className="col-span-2 p-6">
              <div className='relative h-[600px] w-full z-0 rounded-2xl flex flex-row items-start'>
                <img src={imageUrl} alt={restaurant.name} className="w-full h-[600px] object-cover rounded-2xl  relative z-0" />
                <div>
                  <div className='absolute top-4 right-4 z-20'>
                    <Switch restaurantId={id} 
                      id={`favorite-${restaurant._id}`}
                      isFav={isFavorite}
                      onChange={() => handleFavoriteToggle(restaurant._id)}
                      />
                  </div>
                </div>
                <div className='absolute bottom-0 left-0 h-[50%] w-full rounded-2xl bg-linear-to-t from-black/70 via-black/30 to-transparent z-10 flex flex-col justify-end p-6'>
                  <h2 className="text-4xl font-bold text-white z-10">{restaurant.name}</h2>
                  <div className='flex items-end flex-row '>
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < Math.round(restaurant.averageRating) ? (
                        <img key={i} src="/icons/star.svg" alt="star" className='w-8 mb-1' />
                      ) : (
                        <img key={i} src="/icons/star-outline.svg" alt="star" className='w-10' />
                      )
                    ))}
                    <p className='text-[1.5rem] ml-2  text-white'>{restaurant.averageRating}</p>
                    <p className='text-[1.5rem] ml-4 text-white'>{' • ' + restaurant.categories[0]}</p>
                  </div>
                  <div className='flex items-center flex-row mt-2'>
                    <img src="/icons/location2.svg" alt="adress-icon" className="w-5" />
                    <span className="ml-2 text-white text-[2rem]">{restaurant.adress || "No specified adress"}</span>
                  </div>
                  <div className="mt-3 flex flex-col items-start space-y-2 h-full">
                    <p className="text-white mt-1 w-[70%] text-[1.5rem]">{restaurant.description || "No specified description"}</p>
                  </div>
                </div>
              </div>
              <div className='ml-4 mt-4 flex flex-col gap-4 w-full'>
                <p className='text-[2rem] font-bold'>Restaurant details</p>
                <p className='text-[#171A1F] font-light text-[2rem] mt-4 mb-2'>Operating hours</p>
                <p className='text-[#171A1F] text-[1.5rem]'>{restaurant.schedule}</p>
                <p className='text-[#171A1F] font-light text-[2rem] mt-4 mb-2'>Contact</p>
                <p className='text-[#171A1F] text-[1.5rem]'>{restaurant.phoneNumber}</p>
                <hr className='border-0 h-px bg-[#258A00] w-full rounded-lg my-4' />
              </div>
              <h2 className='text-[2rem] font-bold text-[#171A1F] pb-4 ml-4'>Our Menu</h2>
              <div className='max-w-[800px] mx-auto'>
                {imagesMenuUrl ? (
                  <BringMenu
                    restaurantId={id}
                  />
                ) : (
                  <p>No menu images available</p>
                )}
              </div>
              <div>
                <hr className='border-0 h-px bg-[#258A00] w-full rounded-lg my-4' />
                <h2 className='text-[2rem] font-bold text-[#171A1F] p-4'>Reviews</h2>
                <Reviews />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="w-full gap-4 flex flex-col items-center justify-center bg-gray-100 border border-[#258A00] p-6 rounded-2xl shadow-md">
                <CreateReservation onSuccess={() => setReservationSuccess(true)} />
                <Maps geoLocation={restaurant.geoLocation} restaurantName={restaurant.name} />
                <UploadImage mode="postUpload" restaurantId={id} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-100 md:hidden">
            <div className="bg-white overflow-hidden transform transition duration-700 hover:shadow-xl w-full">
              <div className='relative h-64 w-full z-0 rounded-t-lg flex flex-row items-start'>
                <img src={imageUrl} alt={restaurant.name} className="w-full h-64 object-cover" />
                <div className='absolute top-4 right-4 z-20'>
                  <Switch restaurantId={id} 
                    id={`favorite-${restaurant._id}`}
                    isFav={isFavorite}
                    onChange={() => handleFavoriteToggle(restaurant._id)}
                    />
                </div>
              </div>
              <div className="p-4 space-y-2">  
                <h2 className="text-2xl font-bold text-[#171A1F]">{restaurant.name}</h2>
                <div className='flex items-center flex-row'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    i < Math.round(restaurant.averageRating) ? (
                      <img key={i} src="/icons/star.svg" alt="star" className='w-6' />
                    ) : (
                      <img key={i} src="/icons/star-outline.svg" alt="star" className='w-8' />
                    )
                  ))}
                  <p className='text-[1rem] ml-2 text-[#5F6369]'>{restaurant.averageRating}</p>
                  <p className='text-[1rem] ml-4 text-[#5F6369]'>{'(' + restaurant.numReviews + ' reviews)'}</p>
                </div>
                <div className='flex items-center flex-row'>
                  <img src="/icons/location.svg" alt="adress-icon" className="w-5" />
                  <span className="ml-2 text-gray-600">{restaurant.adress || "No specified adress"}</span>
                </div>
                <div className='mt-3 flex flex-col items-start space-y-2 h-full'>
                  <p className="text-gray-600 mt-1">Operating hours: {restaurant.schedule || "No specified"}</p>
                  <p className="text-gray-600 mt-1">Contact: {restaurant.phoneNumber || "No specified number"}</p>
                </div>
                <div className="mt-3 flex flex-col items-start space-y-2 h-full">
                  <p className="text-gray-600 mt-1">{restaurant.description || "No specified description"}</p>
                </div>
                  <p className="text-[1rem] text-black-200 mt-2 w-fit flex flex-wrap gap-2">{Array.from({ length: restaurant.categories.length }).map((_, i) => <span key={i} className='bg-gray-200 rounded-full px-3 py-1'>{restaurant.categories[i]}</span>)}</p>
              </div>
              <h2 className='text-[2rem] font-bold text-[#171A1F] p-4'>Our Menu</h2>
              <div className='max-w-[400px] mx-auto mb-4'>
                {imagesMenuUrl ? (
                  <BringMenu
                    restaurantId={id}

                  />
                ) : (
                  <p>No menu images available</p>
                )}
              </div>
              <CreateReservation onSuccess={() => setReservationSuccess(true)}>
              </CreateReservation>
            </div>
            <h2 className='text-[2rem] font-bold text-[#171A1F] p-4'>Reviews</h2>
            <Reviews>
            </Reviews>
            <Maps geoLocation={restaurant.geoLocation} restaurantName={restaurant.name} />
            <UploadImage mode="postUpload" restaurantId={id} />
          </div>
          <hr className='border-0 h-px bg-[#258A00] w-[60%] rounded-lg my-4' />
          <h2 className='text-[2rem] font-bold text-[#171A1F] p-4'>You might also like</h2>
          <BringRestaurants />
        </div>
      )}
      {tab === 'posts' && (
        <div>
          <BringPosts restaurantId={id} />
        </div>
      )}
    </>
  );
}

export default RestaurantDetails;