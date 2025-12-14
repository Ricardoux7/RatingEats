/**
 * DeleteReview Component
 *
 * Permite eliminar una reseña de un restaurante.
 * Muestra un botón y un popup de confirmación antes de eliminar.
 *
 * Props:
 * @param {string} reviewId - ID de la reseña a eliminar.
 * @param {Function} onDelete - Callback tras eliminar la reseña.
 * @param {Function} onError - Callback en caso de error.
 *
 * Estado:
 * - isDeleting: Estado de carga.
 * - error: Mensaje de error.
 * - showConfirm: Controla la visibilidad del popup de confirmación.
 *
 * Características:
 * - Elimina la reseña mediante la API.
 * - Muestra confirmación antes de eliminar.
 * - Muestra mensajes de error y feedback de carga.
 *
 * Ejemplo de uso:
 * <DeleteReview reviewId={id} onDelete={cb} />
 *
 * @module DeleteReview
 */
import api from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

const DeleteReview = ({ reviewId, onDelete, onError }) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Elimina la reseña mediante la API y gestiona el feedback visual.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await api.delete(`/restaurants/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setShowConfirm(false);
      if (onDelete) onDelete();
    } catch (err) {
      let msg = 'Could not delete review. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      }
      setError(msg);
      if (onError) onError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete Review'}
      </button>
      {showConfirm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white w-[70%] p-6 rounded shadow-lg flex flex-col items-center">
            <p className="text-red-600 font-semibold mb-4">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteReview;
