/**
 * HomePage Component
 *
 * Página principal de la aplicación RatingEats tras iniciar sesión.
 * Muestra los headers, barras de búsqueda, filtros y la lista principal de restaurantes.
 *
 * Estado:
 * - restaurants: Lista de restaurantes filtrados por búsqueda.
 * - searchError: Mensaje de error de búsqueda.
 * - showMobileFilter: Controla la visibilidad del filtro móvil.
 * - filters: Filtros aplicados (categorías, rating).
 *
 * Características:
 * - Redirige a login si el usuario no está autenticado.
 * - Permite buscar y filtrar restaurantes.
 * - Renderiza la página principal con filtros y resultados.
 *
 * Ejemplo de uso:
 * <HomePage />
 *
 * @module HomePage
 */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { HeaderMobile, HeaderDesktop, SearchBarMobile, SearchBarDesktop} from '../components/Components.jsx';
import MainPage from './MainPage.jsx';
import Filter from "../components/Filter.jsx";


const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState({ categories: [], rating: null });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <HeaderMobile />
      <HeaderDesktop />
      <SearchBarMobile 
        setRestaurants={setRestaurants} 
        searchError={searchError} 
        setSearchError={setSearchError} 
        onFilterClick={() => setShowMobileFilter((prev) => !prev)}
      />
      {showMobileFilter && (
        <Filter filters={filters} setFilters={setFilters} onFilterClick={true} />
      )}
      <SearchBarDesktop setRestaurants={setRestaurants} searchError={searchError} setSearchError={setSearchError} className="mt-40"/>
      <MainPage 
      searchRestaurants={restaurants} 
      setSearchRestaurants={setRestaurants} 
      searchError={searchError} 
      filters={filters} 
      setFilters={setFilters}
      />
    </>
  );
};

export default HomePage;
