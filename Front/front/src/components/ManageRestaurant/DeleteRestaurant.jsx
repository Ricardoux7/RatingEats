/**
 * DeleteRestaurant Component
 *
 * Permite al propietario eliminar un restaurante de la plataforma.
 * Gestiona la confirmación, feedback visual y redirección tras la eliminación.
 *
 * Props:
 * @param {string} restaurantId - ID del restaurante a eliminar.
 *
 * Estado:
 * - isDeleting: Estado de carga.
 * - restaurant: Información del restaurante.
 * - error: Mensaje de error.
 * - showError: Controla la visibilidad del error.
 * - successfullyDeleted: Estado de éxito.
 * - successMessage: Mensaje de éxito.
 * - popUp: Controla la visibilidad del popup.
 *
 * Características:
 * - Solicita confirmación antes de eliminar.
 * - Muestra mensajes de éxito o error.
 * - Redirige tras eliminar exitosamente.
 *
 * Ejemplo de uso:
 * <DeleteRestaurant restaurantId={restaurantId} />
 *
 * @module DeleteRestaurant
 */
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const DeleteRestaurant = ({ restaurantId }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [restaurant, setRestaurant] = useState('');
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [successfullyDeleted, setSuccessfullyDeleted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await api.get(`/restaurants/${restaurantId}`);
        setRestaurant(response.data);
      } catch (err) {
        setRestaurant(null);
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await api.delete('/restaurants/' + restaurantId, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSuccessMessage('Restaurant deleted successfully.');
      setSuccessfullyDeleted(true);
      setTimeout(() => {
        setSuccessfullyDeleted(false);
        setSuccessMessage(null);
        navigate('/profile');
      }, 5000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setShowError(true);
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        setShowError(true);
        setError(err.response.data.errors.map(e => e.message).join(' '));
      } else {
        setShowError(true);
        setError('Could not delete the restaurant. Please try again later.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h2 className="text-2xl font-bold mb-4">Delete Restaurant</h2>
      {showError && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 border-2 border-red-200 animate-drop-in">
            <svg className="w-16 h-16 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <p className="text-red-600 text-lg font-semibold text-center">{error}</p>
            <button
              className="mt-2 px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all font-semibold"
              onClick={() => setShowError(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700" onClick={() => setPopUp(true)} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete Restaurant'}
      </button>
      {successfullyDeleted && successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 border-2 border-green-200 animate-drop-in">
            <svg className="w-16 h-16 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
            </svg>
            <p className="text-green-600 text-lg font-semibold text-center">{successMessage}</p>
            <p className="text-gray-500 text-center">You will be redirected in 5 seconds...</p>
          </div>
        </div>
      )}
      {popUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 border-2 border-red-200 animate-drop-in">
            <svg className="w-16 h-16 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <p className="text-red-600 font-semibold text-lg text-center">Are you sure you want to delete this restaurant <span className="font-bold">{restaurant.name}</span>? This action cannot be undone.</p>
            <div className="flex gap-6 mt-2 w-full justify-center">
              <button
                className="bg-red-600 text-white py-2 px-6 rounded-lg shadow hover:bg-red-700 transition-all font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                  setPopUp(false);
                  setError(null);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                className="bg-gray-200 text-black py-2 px-6 rounded-lg shadow hover:bg-gray-400 transition-all font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  setPopUp(false);
                  setShowError(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DeleteRestaurant;