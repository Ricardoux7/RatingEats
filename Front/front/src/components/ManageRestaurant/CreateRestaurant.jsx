/**
 * HandleCreate Component
 *
 * Permite a los usuarios crear un nuevo restaurante mediante un formulario por pasos (wizard).
 * Gestiona la validación de campos, feedback visual, y navegación entre pasos.
 *
 * Props:
 * @param {Object} user - Objeto de usuario autenticado.
 *
 * Estado:
 * - name, description, adress, phoneNumber, categories, geoLocation, schedule, capacity, email: Campos del formulario.
 * - error: Mensaje de error.
 * - message: Mensaje de éxito.
 * - showPopup: Controla la visibilidad del popup.
 * - restaurantId: ID del restaurante creado.
 * - activeIndex: Paso actual del wizard.
 *
 * Características:
 * - Formulario multi-paso para crear restaurante.
 * - Validación de campos y feedback visual.
 * - Navegación entre pasos y resumen final.
 *
 * Ejemplo de uso:
 * <HandleCreate user={user} />
 *
 * @module HandleCreate
 */
import api from '../../api/api';
import { useState, useRef} from 'react';
import { useAuth } from '../../context/AuthContext';
import { HeaderMobile, HeaderDesktop } from '../../components/Components.jsx';
import { useNavigate } from 'react-router-dom';
import '../../components.css';
import { Swiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
const inputStyles = "border border-[#DEE1E6] rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#258A00] transition";
const labelStyles = "w-full text-left font-semibold text-gray-700 mb-1";
import 'swiper/css';
const slideStyles = "h-80 flex flex-col items-center justify-center gap-3 px-4";

const HandleCreate = ({ user }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adress, setAdress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [categories, setCategories] = useState('');
  const [geoLocation, setGeoLocation] = useState('');
  const [schedule, setSchedule] = useState('');
  const [capacity, setCapacity] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const swiperRef = useRef(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const canGoNext = () => {
    switch (activeIndex) {
      case 1:
        return name.trim() && description.trim();
      case 2:
        return adress.trim() && phoneNumber.trim();
      case 3:
        return categories.trim() && geoLocation.trim();
      case 4:
        return schedule.trim() && capacity;
      case 5:
        return email.trim();
      default:
        return true;
    }
  };


  const handleCreateRestaurant = (e) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !description.trim() ||
      !adress.trim() ||
      !phoneNumber.trim() ||
      !categories.trim() ||
      !geoLocation.trim() ||
      !schedule.trim() ||
      !capacity ||
      !email.trim()
    ) {
      setError('All fields are required.');
      return;
    }
    try {
      const token = user.token;
      const newRestaurant = {
        name,
        description,
        adress,
        phoneNumber,
        categories: categories.split(',').map(cat => cat.trim()),
        geoLocation: [geoLocation.trim()],
        schedule,
        capacity: parseInt(capacity, 10),
        email,
      };
      api.post('/restaurants', newRestaurant, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessage('Restaurant created successfully!');
        setShowPopup(true);
        setError(null);
        setRestaurantId(response.data.restaurant._id);
      })
      .catch((err) => {
        console.error('Error creating restaurant:', err);
        setError(
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          'Couldnt create restaurant. Please try again later.'
        );
        setMessage(
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.message ||
          'Error creating restaurant'
        );
        setShowPopup(true);
      });
    } catch (err) {
      setShowPopup(true);
      console.error('Error creating restaurant:', err);
      setError(err.response.data.errors || JSON.stringify(err.response.data) || 'Couldnt create restaurant. Please try again later.');
      setMessage(error);
    }
  };

  function Logo() {
    return (
      <img src="/icons/logo2-convertido.png" alt="" className="mb-4 rounded-full shadow-lg" />
    );
  }

  function SlideNavButtons({ onPrev, onNext, disableNext, submit }) {
    return (
      <div className='flex gap-4 items-center'>
        {onPrev && (
          <button
            className='mt-4 bg-[#258A00] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#1e6b00] transition'
            onClick={onPrev}
            type="button"
          >Go back</button>
        )}
        {onNext && (
          <button
            className="mt-4 bg-[#258A00] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#1e6b00] transition"
            onClick={submit ? handleCreateRestaurant : onNext}
            type="button"
            disabled={disableNext}
          >
            Next
          </button>
        )}
      </div>
    );
  }

  const ShowPopup = () => {
    return (
      <div className={`fixed top-0 mt-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${error ? 'bg-red-100' : 'bg-green-100'} p-6 rounded-lg shadow-lg z-50 flex flex-col items-center`}>
        {message && <p className={`${error ? 'text-red-600' : 'text-green-600'} text-lg font-bold`}>{message}</p>}
        <button onClick={() => setShowPopup(false)}>Close</button>
        {!error && restaurantId && (
          <button
            className="mt-4 bg-[#258A00] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#1e6b00] transition"
            onClick={() => navigate(`/manage/restaurants/${restaurantId}`)}
            type="button"
          >Go to Manage Restaurant</button>
        )}
      </div>
    );
  }

  return (
    <>
      <HeaderMobile />
      <HeaderDesktop />
    <div className="p-5 font-sans bg-linear-to-br from-green-50 to-green-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-[#258A00] text-center">Create New Restaurant</h2>
      {showPopup && <ShowPopup />}
      <form onSubmit={handleCreateRestaurant} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 border border-blue-200 mx-auto">
        {<Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          controller={true}
          className="h-[500px] w-full mx-auto mb-8"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          allowSlideNext={canGoNext()}
        >
          <SwiperSlide>
            <div className={`${slideStyles} py-10 mt-15 text-center`}>
              <p className="text-xl font-semibold text-[#258A00] mb-2 flex flex-col items-center">We are very happy to have you here <span>At</span></p>
              <Logo />
              <button
                className="mt-4 bg-[#258A00] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#1e6b00] transition"
                onClick={(e) => {
                  e.preventDefault();
                  if (swiperRef.current) {
    swiperRef.current.slideNext();
  }
                }}
                type="button"
              >
                Get started
              </button>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={`${slideStyles} py-10 mt-15 text-center`}>
              <Logo />
              <label className={labelStyles}>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <label className={labelStyles}>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <SlideNavButtons
                onPrev={() => swiperRef.current.slidePrev()}
                onNext={() => swiperRef.current.slideNext()}
                disableNext={!name.trim() || !description.trim()}
                submit={false}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={`${slideStyles} py-10 mt-15 text-center`}>
              <Logo />
              <label className={labelStyles}>
                Adress:
                <input type="text" value={adress} onChange={(e) => setAdress(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <label className={labelStyles}>
                Phone:
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <SlideNavButtons
                onPrev={() => swiperRef.current.slidePrev()}
                onNext={() => swiperRef.current.slideNext()}
                disableNext={!adress.trim() || !phoneNumber.trim()}
                submit={false}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={`${slideStyles} py-10 mt-15 text-center`}>
              <Logo />
              <label className={labelStyles}>
                Categories:
                <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <label className={labelStyles}>
                GeoLocation:
                <input type="text" value={geoLocation} onChange={(e) => setGeoLocation(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <SlideNavButtons
                onPrev={() => swiperRef.current.slidePrev()}
                onNext={() => swiperRef.current.slideNext()}
                disableNext={!categories.trim() || !geoLocation.trim()}
                submit={false}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={`${slideStyles} py-10 mt-15 text-center`}>
              <Logo />
              <label className={labelStyles}>
                Schedule:
                <input type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <label className={labelStyles}>
                Capacity:
                <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <SlideNavButtons
                onPrev={() => swiperRef.current.slidePrev()}
                onNext={() => swiperRef.current.slideNext()}
                disableNext={!schedule.trim() || !capacity}
                submit={false}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={`${slideStyles} py-10 mt-15 text-center`}>
              <Logo />
              <label className={labelStyles}>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} required disabled={!!restaurantId}/>
              </label>
              <button
                type="submit"
                className="mt-4 bg-[#258A00] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#1e6b00] transition"
                disabled={!email.trim() || !!restaurantId}
              >
                Create
              </button>
            </div>
          </SwiperSlide>
        </Swiper>}
      </form>
    </div>
    </>
  );
}

export default HandleCreate;