  // ...existing code...
  // ...existing code...
  /**
   * useFavorites Hook
   *
   * Hook personalizado para gestionar la lista de restaurantes favoritos del usuario.
   * Permite obtener, agregar y eliminar favoritos, y gestiona errores.
   *
   * Estado:
   * - favorites: Lista de restaurantes favoritos.
   * - error: Mensaje de error.
   *
   * Características:
   * - Obtiene favoritos desde la API.
   * - Permite alternar favoritos (agregar/eliminar).
   * - Muestra mensajes de error.
   *
   * Ejemplo de uso:
   * const { favorites, handleFavoriteToggle, error } = useFavorites();
   *
   * @module useFavorites
   */
  import api from '../api/api.js';
  import { useState, useEffect, use } from 'react';
  import { useAuth } from '../context/AuthContext.jsx';

  export function useFavorites() {
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchFavorites = async () => {
        if (user) {
          try {
            const response = await api.get(`/profile/favorites`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            setFavorites(response.data);
          } catch (err) {
          }
        }
      };
      fetchFavorites();
    }, [user]);
    const handleFavoriteToggle = async (restaurantId) => {
      if (!user) {
        setError("You need to be logged in to manage favorites.");
        return;
      }
      try {
        const isFavorite = favorites.some(fav => fav._id === restaurantId);
        if (isFavorite) { 
          await api.delete(`profile/favorites/${restaurantId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setFavorites(favorites.filter(fav => fav._id !== restaurantId));
        } else {
          await api.post(`profile/favorites/${restaurantId}`, {}, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setFavorites([...favorites, { _id: restaurantId }]);
        }
      } catch (err) {
        console.error("Error updating favorites:", err);
        if (err.response) {
          if (err.response.status === 401) {
            setError("You need to be logged in to managefavorites.");
          } else {
            setError("An error occurred while updating favorites.Please try again.");
          }
        }
      }
  }

return { favorites, handleFavoriteToggle, error};
}