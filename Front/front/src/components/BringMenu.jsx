import api from '../api/api'; 
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const BringMenu = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageURL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get(`/restaurants/${restaurantId}`);
        setMenuItems(response.data.menu || response.data);
      } catch (err) {
        setError('Failed to fetch menu items.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuItems();
  }, [restaurantId]);

  if (isLoading) {
    return <div>Loading menu...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  
  }
  
  return (
    <>
    <div className="bring-menu-swiper">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className="h-[200px] w-full mx-auto mb-4 flex items-center justify-center"
        slidesPerView={4}
        breakpoints={{
          768: { 
            slidesPerView: 3,
          },
        }}
        spaceBetween={16}
      >
        {menuItems.map((item, index) => {
          const imagePath = item.url ? `${imageURL}${item.url}` : '';
          return (
            <SwiperSlide key={item._id || index}>
              <div className="flex flex-col items-center justify-center h-full gap-2">
                {imagePath && (
                  <Zoom >
                    <img
                      src={imagePath}
                      alt={item.name}
                      className="mx-auto max-h-48 object-contain cursor-pointer"
                  />
                  </Zoom>
                )}
                <div className="text-center font-semibold">{item.name}</div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
    </>
  )
};

export default BringMenu;