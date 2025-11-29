import React, { useState, useEffect } from "react";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import SkeletonsMainPage from "../components/SkeletonsMainPage.jsx";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState(null);
  const limit = 10;
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/restaurants?page=${page}&limit=${limit}`,
          {}
        );
        setRestaurants(response.data.restaurants || response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError("Coulnt fetch restaurants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [page, user]);

  const filteredRestaurants = filter
    ? restaurants.filter((restaurant) =>
        restaurant.categories.includes(filter)
      )
    : restaurants;

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  /*const addToFavorites = async (restaurantId) => {
    try {
      await api.post()
    }
  };*/

  const getRestaurantId = (restaurant) => {
    return restaurant._id || restaurant.id;
  }
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const renderRestaurantCard = (restaurant) => {
  const handleViewDetails = () => {
    navigate(`/restaurants/${restaurant._id}`);
  }
  const imageUrl = restaurant.images && restaurant.images.length > 0 ? `${BACKEND_URL}${restaurant.images[0].url}` : "../icons/image-not-found.png";
    return (
      <div
        key={restaurant._id}
        className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-[1.02]"
        onClick={handleViewDetails}
      >
        <img
          className="w-full h-48 object-cover "
          src={imageUrl}
          alt={
            restaurant.images && restaurant.images[0]?.alt
              ? restaurant.images[0].alt
              : restaurant.name
          }
        />
        <div className="p-4">
          <h2 className="text-xl font-bold text-[#1D2025]">
            {restaurant.name}
          </h2>
          <p className="text-gray-600 mt-1">
            {restaurant.adress || "No specified address"}
          </p>
          <p className="bg-gray-200 rounded-full px-3 py-1 text-sm text-black-200 mt-2 w-fit">
            {restaurant.categories[0] || "No specified category"}
          </p>
          <div className="mt-3 flex flex-col items-start space-y-2 h-full">
            <span className="text-lg font-semibold text-[#21C45D]">
              {restaurant.averageRating
                ? `${restaurant.averageRating.toFixed(1)} ⭐`
                : "No ratings yet"}
            </span>
            <button className="bg-[#21C45D] text-white px-3 py-1 rounded-full text-sm hover:bg-[#61ec94] transition duration-200 mt-auto h-10" onClick={() => window.location.href = `/restaurants/${getRestaurantId(restaurant)}`}>
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mt-5  text-[#2DA800]">
          Discover
        </h1>
        <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-lg ${
            filter === null ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("Italian")}
          className={`px-4 py-2 rounded-lg ${
            filter === "Italian" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Italian
        </button>
        <button
          onClick={() => setFilter("Latina")}
          className={`px-4 py-2 rounded-lg ${
            filter === "Latina" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Latina
        </button>
        <button
          onClick={() => setFilter("Chinese")}
          className={`px-4 py-2 rounded-lg ${
            filter === "Chinese" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Chinese
        </button>
      </div>
        {isLoading && (
          <div className="text-center py-10 ">
            <SkeletonsMainPage />
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && restaurants.length === 0 && !error && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              There's no restaurants to show right now.
            </p>
          </div>
        )}

        {!isLoading && restaurants.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredRestaurants.map(renderRestaurantCard)}
            </div>
            <div className="mt-12 flex justify-center items-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isLoading}
                className={`px-4 py-2 border rounded-lg transition duration-200 ${
                  page === 1 || isLoading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-[#1D2025]"
                }`}
              >
                Anterior
              </button>
              <span className="text-lg font-medium text-[#1D2025]">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages || isLoading}
                className={`px-4 py-2 border rounded-lg transition duration-200 ${
                  page === totalPages || isLoading
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-[#1D2025]"
                }`}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MainPage;
