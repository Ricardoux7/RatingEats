import api from '../api/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ManageReservations from '../components/ManageRestaurant/ManageReservations.jsx';
import ManagePosts from '../components/ManageRestaurant/ManagePosts.jsx';
import BringPosts from '../components/componentsRestaurantDetails/BringPosts.jsx';
import BringReservations from '../components/ManageRestaurant/BringReservations.jsx';
import EditInfo from '../components/ManageRestaurant/EditInfo.jsx';
import '../components.css';
import { useAuth } from '../context/AuthContext.jsx';
import { HeaderMobile, HeaderDesktop } from '../components/Components.jsx';
import Statistics from '../components/ManageRestaurant/Statistics.jsx';
import ManageMenu from '../components/ManageRestaurant/ManageMenu.jsx';
import UploadPost from '../components/ManageRestaurant/UploadPost.jsx';
import UpdateBanner from '../components/ManageRestaurant/UpdateBanner.jsx';
import BringMenu from '../components/BringMenu.jsx';
import DeleteRestaurant from '../components/ManageRestaurant/DeleteREstaurant.jsx';
import AddOperator from '../components/ManageRestaurant/AddOperator.jsx';
import DeleteOperator from '../components/ManageRestaurant/DeleteOperator.jsx';

const MyRestaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [activeSection, setActiveSection] = useState('details');
  const [showBanner, setShowBanner] = useState(false);  
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const imageUrl = restaurant && restaurant.images && restaurant.images.length > 0 ? `${BACKEND_URL}${restaurant?.images[0].url}` : '/icons/image-not-found.png';
  const imagesMenuUrl = restaurant?.menu && restaurant.menu.length > 0;
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await api.get(`restaurants/manage/restaurant/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurant(response.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          navigate('/no-permission', { replace: true });
          console.log(err)
        } else if (err.response && err.response.status === 500) {
          setError('Internal server error. Please try again later.');
          console.log(err)
        } else {
          setError('Could not fetch restaurant. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleUpdate = (updatedRestaurant) => {
    setRestaurant(updatedRestaurant);
  };

  const handleUpdateBanner = async (newBannerUrl) => {
    try {
      const response = await api.get(`restaurants/manage/restaurant/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setRestaurant(response.data);
    } catch (err) {
      }
  }
  return (
    <>
      <HeaderDesktop />
      <HeaderMobile tab={activeSection} setTab={setActiveSection} manage={true} />
      <div className='hidden md:grid md:grid-cols-[1fr_3fr_1fr] gap-4 pb-10 '>
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
        <aside className="hidden bg-white rounded-2xl p-4 md:flex md:flex-col gap-4 break-words items-center">
          <button
            className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]'
            onClick={() => setActiveSection('details')}
          >
            Restaurant Details
          </button>
          <button
            className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]'
            onClick={() => setActiveSection('reservations')}
          >
            Reservations history
          </button>
          <button
            className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]'
            onClick={() => setActiveSection('pending')}
          >
            Pending Reservations
          </button>
          <button
            className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]'
            onClick={() => setActiveSection('posts')}
          >
            Posts Management
          </button>
          <button
            className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]'
            onClick={() => setActiveSection('postsHistory')}
          >
            Posts History
          </button>
          <button
            className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]'
            onClick={() => setActiveSection('menu')}
          >
            Menu Management
          </button>
          <button className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]' onClick={() => setActiveSection('editInfo')}>
            Edit information
          </button>
          <button className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]' onClick={() => setActiveSection('postsUpload')}>
            Upload posts
          </button>
          <button onClick={() => setActiveSection('addOperator')} className='h-auto w-[90%] border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]'>Add Operator</button>
          <button onClick={() => setActiveSection   ('deleteOperator')} className='h-auto w-[90%]     border-2 border-[#DEE1E6] bg-white text-black font-semibold rounded-md p-2 text-[80%]'>
            Delete Operator
          </button>
          <button className='h-auto w-[90%]  bg-red-600 text-white font-semibold rounded-md p-2 text-[80%]' onClick={() => setActiveSection('deleteRestaurant')}>Delete Restaurant</button>
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
                  <div className='relative w-full aspect-video rounded-2xl flex flex-row items-start' >
                    <button className='absolute top-2 right-2 z-10 bg-[#21C45D] bg-opacity-70 px-3 py-1 rounded-lg text-sm hover:bg-opacity-100 transition font-semibold text-white' onClick={() => setShowBanner(true)}
                      >Update banner
                      </button>
                      {showBanner && (
                        <UpdateBanner
                          restaurantId={restaurant._id}
                          onClose={() => setShowBanner(false)}
                          onBannerUpdate={handleUpdateBanner}
                        />
                      )}
                    <img src={imageUrl} alt={restaurant.name} className="w-full h-full object-cover rounded-2xl relative z-0" />
                  </div>
                  <h2 className="text-4xl font-bold text-[#171A1F] mt-2 mr-2">{restaurant.name}</h2>
                  <div className='flex items-center flex-row w-[30%]  break-words'>
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
                    <div className='max-w-[800px] mx-auto'>
                    <BringMenu restaurantId={restaurant._id} />
                    </div>*
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
                <BringPosts restaurantId={restaurant._id} userToken={user.token} onDelete={true} />
              )}
              {activeSection === 'reservations' && restaurant && (
                <BringReservations restaurantId={restaurant._id} userToken={user.token} />
              )}
              {activeSection === 'editInfo' && restaurant && (
                <EditInfo restaurantId={restaurant._id} userToken={user.token} onUpdate={handleUpdate} initialData={restaurant} />
              )}
              {activeSection === 'menu' && restaurant && (
                <ManageMenu restaurantId={restaurant._id} />
              )}
              {activeSection === 'postsUpload' && restaurant && (
                <UploadPost restaurantId={restaurant._id} />
              )}
              {activeSection === 'deleteRestaurant' && restaurant && (
                <DeleteRestaurant restaurantId={restaurant._id} userToken={user.token} />
              )}
              {activeSection === 'addOperator' && restaurant && (
                <AddOperator restaurantId={restaurant._id} userToken={user.token} />
              )}
              {activeSection === 'deleteOperator' && restaurant && (
                <DeleteOperator restaurantId={restaurant._id} userToken={user.token} />
              )}
            </>
          )}
        </div>
        <aside 
          className="hidden bg-white rounded-2xl p-4 items-center md:flex flex-col gap-4"
          style={{
            width: '100%',
            maxWidth: '350px',
            minWidth: '180px',
            transition: 'max-width 0.3s',
          }}
        >
          <div className='ml-4 mt-4 flex flex-col gap-2 w-full'>
            <p className='text-[#171A1F] font-light text-[2rem] mb-2'>Operating hours</p>
            {restaurant && restaurant.schedule ? (
                <p className='text-[#171A1F] text-[1.5rem]'>{restaurant.schedule}</p>
            ) : (
              <p>No schedule available</p>
            )}
          </div> 
          <div className="w-full max-w-full overflow-x-auto">
            <Statistics restaurantId={id} userToken={user.token} />
          </div>
        </aside>
      </div>
      <div className="flex flex-col md:hidden gap-4 p-4 pb-10">
        {activeSection === 'details' && restaurant && (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden py-2">
              <div className='relative h-[200px] w-full'>
                <button className='absolute top-2 right-2 z-10 bg-[#21C45D] bg-opacity-70 px-3 py-1 rounded-lg text-sm hover:bg-opacity-100 transition font-semibold text-white' onClick={() => setShowBanner(true)}
                      >Update banner
                </button>
                {showBanner && (
                  <UpdateBanner
                    restaurantId={restaurant._id}
                    onClose={() => setShowBanner(false)}
                  />
                )}
                <img src={imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-bold text-[#171A1F] p-4 pb-0">{restaurant.name}</h2>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2">
              <h2 className="text-2xl font-bold">Restaurant Details</h2>
              <p>{restaurant.description || "No description available"}</p>
              <p>{restaurant.adress || "No specifieadress"}</p>
              <p>{restaurant.schedule || "No schedule available"}</p>
              <div className='flex flex-row flex-wrap w-full mt-2'>
                <p className='text-2xl text-[#171A1F] mr-1 font-bold'>Cuisine: </p>
                  {restaurant.categories.map((category, idx) => (
                    <span key={category} className="mt-2 mr-1">
                      {category}{idx < restaurant.categories.length - 1 ? ', ' : ''}
                    </span>
                  ))}
              </div>
              <div className="mt-3 flex flex-col items-start space-y-2 h-full">
                <p className="">{restaurant.description || "Nspecified description"}</p>
              </div>
              <div className='flex items-center flex-row mt-2'>
                <span >{restaurant.adress || "No specifieadress"}</span>
              </div>
              <p className='text-[#171A1F] font-bold text-[1.5rem] mt-4 mb-2'>Contact</p>
              <p className='text-[1.5rem]'>{restaurant.phoneNumber}</p>
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
            </div>
          </>
        )}
        {activeSection === 'pending' && restaurant && (
          <ManageReservations restaurantId={restaurant._id} userToken={user.token} />
        )}
        {activeSection === 'posts' && restaurant && (
          <ManagePosts restaurantId={restaurant._id} userToken={user.token} />
        )}
        {activeSection === 'statistics' && (
          <Statistics restaurantId={id} userToken={user.token} />
        )}
        {activeSection === 'postsHistory' && restaurant && (
          <BringPosts restaurantId={restaurant._id} userToken={user.token} onDelete={true}/>
        )}
        {activeSection === 'reservations' && restaurant && (
          <BringReservations restaurantId={restaurant._id} userToken={user.token} />
        )}
        {activeSection === 'editInfo' && restaurant && (
          <EditInfo restaurantId={restaurant._id} userToken={user.token} onUpdate={handleUpdate} initialData={restaurant} />
        )}
        {activeSection === 'menu' && restaurant && (
          <ManageMenu restaurantId={restaurant._id} />
        )}
        {activeSection === 'postsUpload' && restaurant && (
          <UploadPost restaurantId={restaurant._id} />
        )}
        {activeSection === 'addOperator' && restaurant && (
          <AddOperator restaurantId={restaurant._id} userToken={user.token} />
        )}
        {activeSection === 'deleteOperator' && restaurant && (
          <DeleteOperator restaurantId={restaurant._id} userToken={user.token} />
        )}
        {activeSection === 'deleteRestaurant' && restaurant && (
          <DeleteRestaurant restaurantId={restaurant._id} userToken={user.token} />
        )}
      </div>
    </>
  )
}

export default MyRestaurant;