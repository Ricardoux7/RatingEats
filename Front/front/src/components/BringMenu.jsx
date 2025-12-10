import api from '../api/api'; 
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

  if (isLoading) return <div>Loading menu...</div>;
  if (error) return <div>{error}</div>;

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
      { breakpoint: 0, settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Slider {...settings} className='mb-10'>
        {menuItems.map((item, index) => {
          const imagePath = item.url ? `${imageURL}${item.url}` : '';
          return (
            <div key={item._id || index} className="px-2 h-60 flex flex-col items-center hover:scale-105 transition-transform duration-500">
              {imagePath && (
                <Zoom>
                  <img
                    src={imagePath}
                    alt={item.name}
                    className="w-60 h-60 object-cover rounded-lg mb-2 cursor-pointer"
                  />
                </Zoom>
              )}
              <div className="text-center font-semibold">{item.name}</div>
            </div>
          )
        })}
      </Slider>
    </div>
  );
};

export default BringMenu;