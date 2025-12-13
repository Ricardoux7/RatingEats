import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { HeaderProfile, HeaderProfileDesktop } from '../components/Components.jsx';
import  EditProfile  from '../components/Profile/EditProfile.jsx';
import  MyReviews from '../components/Profile/MyReviews.jsx';
import MyRestaurants from '../components/Profile/MyRestaurants.jsx';
import { useFavorites } from '../components/Favorites.jsx';
import Switch from "../components/FavoriteButton.jsx";

const Profile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const { favorites, handleFavoriteToggle } = useFavorites();
  const [title, setTitle] = useState('My Profile');
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const response = await api.get('/profile', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          });
          const data = response.data || response.data.data
          setUserData(data);
      } catch (err) {
          setError(err.message || 'Error fetching user data');
        } finally {
          setIsLoading(false);
        }
      };
    fetchUserData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  return (
    <>
      <section className='block md:hidden'>
        <HeaderProfile title={title} setTitle={setTitle} name={userData ? userData.name : ''}/>
        {title === 'My Profile' &&
        <div className=''>
          <div className='flex flex-col items-center justify-center gap-2 text-center mt-10 mb-10 border-2 rounded-2xl border-[#D9D9D9] pb-10 w-[90%] mx-auto'>
            <img src="../icons/user.svg" alt="user" className='rounded-full w-50 h-50 bg-gray-200 mt-10' />
            <p className='text-black'>{userData ? `${userData.name ?? ''} ${userData.lastName ?? ''}` : ''}</p>
            <p>@{userData ? userData.username : ''}</p>
            <button className={showEdit ? "border border-red-500 rounded-xl w-[65%] h-13 items-center justify-center flex mt-10 gap-1 text-red-500" : "border border-[#2DA800] rounded-xl w-[65%] h-13 items-center justify-center flex mt-10 gap-1 text-[#2DA800]"} onClick={() => setShowEdit(!showEdit)}>
              {showEdit ? 'Close' : 'Edit Profile'}
            </button>
          </div>
          {showEdit && <EditProfile id={userData._id} user={userData} onClose={() => setShowEdit(false)} />}
          <div className='w-[90%] mx-auto mb-10 gap-4 flex flex-col'>
            <h2 className='text-[2rem] font-bold text-[#1D2025]'>About {userData ? userData.name : ''}</h2>
            <p className='text-[#45484C]'>{userData ? userData.biography : ''}</p>
            <div className='flex flex-row items-center mt-4 gap-2'>
              <img src="../icons/calendar.svg" alt="calendar" className='w-10' />
              <p>Joined on {userData ? userData.createdAt.slice(0, 10) : 'Unknown'}</p>
            </div>
            <div className='mt-5'>
              <p className='text-[2rem]'>Favorite Restaurants</p>
                {favorites.length === 0 ? (
                  <p>No favorite restaurants added yet.</p>
                ) : (
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                    {favorites.map((restaurant) => {
                      const imageUrl = restaurant.images && restaurant.images.length > 0 ? `${BACKEND_URL}${restaurant.images[0].url}` : "../icons/image-not-found.png";
                      return (
                        <div key={restaurant._id} className="p-4 mb-4 rounded-lg cursor-pointer transition" onClick={() => navigate(`/restaurants/${restaurant._id}`)}> 
                          <div>
                            <div className='relative'>
                              <img src={imageUrl} alt={restaurant.name} className="w-full h-[120px] object-cover mb-2 rounded-lg" />
                              <div className='absolute top-2 right-2 z-10'>
                                <Switch 
                                  id={`favorite-${restaurant._id}`}
                                  isFav={Array.isArray(favorites) && favorites.some(fav => fav._id === restaurant._id)}
                                  onChange={() => handleFavoriteToggle(restaurant._id)}
                                />
                              </div>
                            </div>
                            <h3 className='text-xl font-semibold'>{restaurant.name}</h3>
                            <p className='text-[#565D6D] font-bold'>{restaurant.categories[0] || 'No specified category'}</p>
                            <div className='flex flex-row gap-1 items-center'>
                              <img src="../icons/star-outline2.svg" alt="star" className='w-8'/>
                              <p className='text-[1rem] font-normal'>{restaurant.averageRating}</p>
                            </div>
                            <p className='text-[#2DA800] cursor-pointer'>See details</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
        }
        {title === 'My Reviews' && <MyReviews user={userData} />}
      </section>
      <section className='hidden md:block'>
        <HeaderProfileDesktop title={title} setTitle={setTitle} name={userData ? `${userData.name ?? ''} ${userData.lastName ?? ''}` : ''} className='cursor-pointer' />
        {title === 'My Profile' &&
        <div className='md:grid grid-cols-[350px_1fr]'>
          <div className='left-0 h-full w-full flex flex-col items-center'>
            <img src="../icons/user.svg" alt="user" className='rounded-full w-50 h-50 bg-gray-200 mt-10' />
            <p className='text-black text-[1.5rem] font-bold'>{userData ? `${userData.name ?? ''} ${userData.lastName ?? ''}` : ''}</p>
            <p className='text-black text-[1rem]'>@{userData ? userData.username : ''}</p>
            <div className='flex items-center gap-2'>
              <img src="../icons/calendar.svg" alt="calendar" className='w-10' />
              <p>joined on {userData ? userData.createdAt.slice(0, 10) : 'Unknown'}</p>
            </div>
            <button className={showEdit ? "border border-red-500 rounded-xl w-[65%] h-13 items-center justify-center flex mt-10 gap-1 text-red-500 cursor-pointer" : "border border-[#2DA800] rounded-xl w-[65%] h-13 items-center justify-center flex mt-10 gap-1 text-[#2DA800] cursor-pointer"} onClick={() => setShowEdit(!showEdit)}><img src={showEdit ? "../icons/close.svg" : "../icons/pencil.svg"} alt="edit" className='w-5'/>{showEdit ? 'Close' : 'Edit Profile'}</button>
          </div>
          <div className='mt-20'>
            {showEdit && <EditProfile id={userData._id} user={userData} onClose={() => setShowEdit(false)} />}
            <p className='text-[2rem] font-bold'>About {userData ? userData.name : ''}</p>
            <p className='text-[#45484C] text-[1.5rem]'>{userData ? userData.biography : ''}</p>
            <div>
              <p className='text-[2rem] mt-10 mb-5 font-medium'>Favorite Restaurants</p>
              <div className='flex flex-wrap md:items-center md:justify-center xl:justify-start'>{favorites.map((restaurant) => {
                const imageUrl = restaurant.images && restaurant.images.length > 0 ? `${BACKEND_URL}${restaurant.images[0].url}` : "../icons/image-not-found.png";
                return (
                  <div key={restaurant._id} className="p-4 mb-4 rounded-lg cursor-pointer transition border-b border-gray-200 " onClick={() => navigate(`/restaurants/${restaurant._id}`)}> 
                    <div className='w-[400px] h-[450px] border-r border-gray-200 flex flex-col gap-2'>
                      <div className='relative'>
                      <img src={imageUrl} alt={restaurant.name} className="w-[400px] h-[250px] object-cover mb-2 rounded-lg" />
                      <div className='absolute top-2 right-2 z-10'>
                        <Switch 
                          id={`favorite-${restaurant._id}`}
                          isFav={Array.isArray(favorites) && favorites.some(fav => fav._id === restaurant._id)}
                          onChange={() => handleFavoriteToggle(restaurant._id)}
                        />
                        </div>
                      </div>

                      <h3 className='text-xl text-[1.5rem] font-medium'>{restaurant.name}</h3>
                      <div className='flex flex-row items-center  '>
                        <p className='text-white font-bold bg-gray-600 border rounded-4xl px-3 py-1 w-fit'>{restaurant.categories[0] || 'No specified category'}</p>
                        <img src="../icons/star-outline2.svg" alt="star" className='w-12'/>
                        <p className='text-[1.5rem] font-semibold mb-1'>{restaurant.averageRating}</p>
                      </div>
                      <button className='text-white bg-[#2DA800] h-[50px] w-full rounded-xl flex items-center justify-center cursor-pointer'>See details</button>
                    </div>
                  </div>
                );
              })}</div>
            </div>
          </div>
      </div>
      }
      {title === 'My Reviews' && <MyReviews user={userData} />}
      </section>
      <section className='hidden md:block'>
      {title === 'My Restaurants' && <MyRestaurants user={userData} />}
      </section>
      <section className='block md:hidden'>
      {title === 'My Restaurants' && <MyRestaurants user={userData} />}
      </section>
    </>
  )
}
export default Profile