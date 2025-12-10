import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { HeaderMobile, HeaderDesktop, SearchBarMobile, SearchBarDesktop} from '../components/Components.jsx';
import MainPage from './MainPage.jsx';
import Filter from "../components/Filter.jsx";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);
  return (
    <>
      <HeaderMobile />
      <HeaderDesktop />
      <SearchBarMobile />
      <SearchBarDesktop setRestaurants={setRestaurants} className="mt-40"/>
      <MainPage searchRestaurants={restaurants} setSearchRestaurants={setRestaurants} />
    </>
  );
};

export default HomePage;
