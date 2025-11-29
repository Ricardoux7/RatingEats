import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { HeaderMobile, HeaderDesktop, SearchBarMobile, SearchBarDesktop} from '../components/Components.jsx';
import MainPage from './MainPage.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
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
      <SearchBarDesktop />
        <main>
          <MainPage />
        </main>
    </>
  );
};

export default HomePage;
