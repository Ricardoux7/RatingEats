import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderMobile, HeaderDesktop } from '../components/Components.jsx';
import CreateReservation  from '../components/componentsRestaurantDetails/Reservation.jsx';
import Reviews  from '../components/componentsRestaurantDetails/Reviews.jsx';
import BringRestaurants from '../components/componentsRestaurantDetails/BringRestaurants.jsx';
import api from '../api/api'; 
import '../components.css';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [bringRestaurant, setBringRestaurant] = useState(null);
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
      <div className='w-12 h-12'></div>
    </div>;
  }
  if (error) {
    return <div>
      {error}
    </div>;
  }
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const imageUrl = restaurant.images && restaurant.images.length > 0 ? `${BACKEND_URL}${restaurant.images[0].url}` : '../icons/image-not-found.png';
  const imagesMenuUrl = restaurant.menu && restaurant.menu.length > 0;
  
  const ReservationPopup = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <img src="../icons/check.svg" alt="success" className="w-16 mb-4" />
        <h3 className="text-2xl font-bold mb-2 text-green-700">Reservation Created Successfully</h3>
        <p className="mb-4 text-gray-700">Your reservation has been successfully made.</p>
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={() => setReservationSuccess(false)}
        >
          Close
        </button>
      </div>
    </div>
  );


  return (
    <>
      {reservationSuccess && <ReservationPopup />}
      <HeaderMobile tab={tab} setTab={setTab} />
      <HeaderDesktop tab={tab} setTab={setTab} />
      {showImage && selectedImage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)] p-4 w-full h-full'>
          <div className='relative'>
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white"
            />
            <button
              className='absolute top-2 right-2 rounded-full p-2 bg-white hover:bg-gray-200'
              onClick={() => setShowImage(false)}
            >
              <img src="../icons/cancel.svg" alt="close" className='w-6'/>
            </button>
          </div>
        </div>
      )}
      {tab === 'general' && (
        <div>
          <div className="hidden md:grid md:grid-cols-3 gap-8 bg-white overflow-hidden transform transition duration-700">
            <div className="col-span-2 p-6">
              <div className='relative h-[600px] w-full z-0 rounded-2xl flex flex-row items-start'>
                <img src={imageUrl} alt={restaurant.name} className="w-full h-[600px] object-cover rounded-2xl  relative z-0" />
                <div className='absolute bottom-0 left-0 h-[50%] w-full rounded-2xl bg-linear-to-t from-black/70 via-black/30 to-transparent z-10 flex flex-col justify-end p-6'>
                  <h2 className="text-4xl font-bold text-white z-10">{restaurant.name}</h2>
                  <div className='flex items-end flex-row '>
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < Math.round(restaurant.averageRating) ? (
                        <img key={i} src="../icons/star.svg" alt="star" className='w-8 mb-1' />
                      ) : (
                        <img key={i} src="../icons/star-outline.svg" alt="star" className='w-10' />
                      )
                    ))}
                    <p className='text-[1.5rem] ml-2  text-white'>{restaurant.averageRating}</p>
                    <p className='text-[1.5rem] ml-4 text-white'>{' • ' + restaurant.categories[0]}</p>
                  </div>
                  <div className='flex items-center flex-row mt-2'>
                    <img src="../icons/location2.svg" alt="adress-icon" className="w-5" />
                    <span className="ml-2 text-white text-[2rem]">{restaurant.adress || "No specified adress"}</span>
                  </div>
                  <div className="mt-3 flex flex-col items-start space-y-2 h-full">
                    <p className="text-white mt-1 w-[70%] text-[1.5rem]">{restaurant.description || "No specified description"}</p>
                  </div>
                </div>
              </div>
              <div className='ml-4 mt-4 flex flex-col gap-4 w-[90%]'>
                <p className='text-[2rem] font-bold'>Restaurant details</p>
                <p className='text-[#171A1F] font-light text-[2rem] mt-4 mb-2'>Operating hours</p>
                {restaurant.schedule.map((item, i) => (
                  <p key={item._id} className='text-[#171A1F] text-[1.2rem]'>
                    {item.day}: {item.open} - {item.close}
                  </p>
                ))}
                <p className='text-[#171A1F] font-light text-[2rem] mt-4 mb-2'>Contact</p>
                <p className='text-[#171A1F] text-[1.5rem]'>{restaurant.phoneNumber}</p>
                <hr className='border-0 h-px bg-[#258A00] w-[60%] rounded-lg my-4' />
              </div>
              <h2 className='text-[2rem] font-bold text-[#171A1F] pb-4 ml-4'>Our Menu</h2>
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
                <hr className='border-0 h-px bg-[#258A00] w-[60%] rounded-lg my-4' />
                <h2 className='text-[2rem] font-bold text-[#171A1F] p-4'>Reviews</h2>
                <Reviews />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="w-full ">
                <CreateReservation onSuccess={() => setReservationSuccess(true)} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-100 md:hidden">
            <div className="bg-white overflow-hidden transform transition duration-700 hover:shadow-xl">
              <img src={imageUrl} alt={restaurant.name} className="w-full h-64 object-cover" />
              <div className="p-4 space-y-2">  
                <h2 className="text-2xl font-bold text-[#171A1F]">{restaurant.name}</h2>
                <div className='flex items-center flex-row'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    i < Math.round(restaurant.averageRating) ? (
                      <img key={i} src="../icons/star.svg" alt="star" className='w-6' />
                    ) : (
                      <img key={i} src="../icons/star-outline.svg" alt="star" className='w-8' />
                    )
                  ))}
                  <p className='text-[1rem] ml-2 text-[#5F6369]'>{restaurant.averageRating}</p>
                  <p className='text-[1rem] ml-4 text-[#5F6369]'>{'(' + restaurant.numReviews + ' reviews)'}</p>
                </div>
                <div className='flex items-center flex-row'>
                  <img src="../icons/location.svg" alt="adress-icon" className="w-5" />
                  <span className="ml-2 text-gray-600">{restaurant.adress || "No specified adress"}</span>
                </div>
                <div className="mt-3 flex flex-col items-start space-y-2 h-full">
                  <p className="text-gray-600 mt-1">{restaurant.description || "No specified description"}</p>
                </div>
                  <p className="text-[1rem] text-black-200 mt-2 w-fit flex flex-wrap gap-2">{Array.from({ length: restaurant.categories.length }).map((_, i) => <span key={i} className='bg-gray-200 rounded-full px-3 py-1'>{restaurant.categories[i]}</span>)}</p>
              </div>
              <h2 className='text-[2rem] font-bold text-[#171A1F] p-4'>Our Menu</h2>
              <div className='flex gap-4 p-4 object-cover overflow-x-scroll md:overflow-x-hidden mb-7'>
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
              <CreateReservation onSuccess={() => setReservationSuccess(true)}>
              </CreateReservation>
            </div>
            <h2 className='text-[2rem] font-bold text-[#171A1F] p-4'>Reviews</h2>
            <Reviews>
            </Reviews>
          </div>
          <BringRestaurants />
        </div>
      )}
      {tab === 'posts' && (
        <div className="hidden md:flex flex-col items-center justify-center mt-10">
          <h2 className="text-2xl font-bold mb-4">Posts</h2>
          <p className="text-gray-500">Aquí irán los posts del restaurante.</p>
        </div>
      )}
    </>
  );
}

export default RestaurantDetails;