/**
 * MyReviews Component
 *
 * Muestra todas las reseñas realizadas por el usuario autenticado.
 * Permite eliminar reseñas y muestra feedback visual.
 *
 * Props:
 * @param {Object} user - Objeto de usuario autenticado.
 *
 * Estado:
 * - reviews: Lista de reseñas del usuario.
 * - isLoading: Estado de carga.
 * - error: Mensaje de error.
 *
 * Características:
 * - Obtiene y muestra las reseñas del usuario desde la API.
 * - Permite eliminar reseñas y actualiza la lista localmente.
 * - Muestra mensajes de error y feedback de carga.
 *
 * Ejemplo de uso:
 * <MyReviews user={user} />
 *
 * @module MyReviews
 */
import api from '../../api/api';
import React, { useEffect, useState } from 'react';
import DeleteReview from '../DeleteReview.jsx';

const MyReviews = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Efecto que obtiene las reseñas del usuario desde la API.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/profile/reviews`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(reviews && reviews.length===0 ? 'No reviews found' : 'Coulnt fetch reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [reviews]);

  if (!user) {
    return <p className="text-center text-red-500">User not found. Please log in again.</p>;
  }

  return (
    <div className="p-5 font-sans mt-5">
      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-[#258A00] rounded-lg p-4 bg-white w-full"
            >
              <div className='flex justify-between items-start'>
                <div className='flex flex-row flex-wrap text-2xl gap-1 w-1/2 items-center'>
                  <p className="mb-2 text-[2rem] font-normal text-[#171A1F]">{review.restaurantId?.name}</p>
                  {Array.from({ length: 5 }).map((_, i) => (
                    i < Math.round(review.rating) ? (
                      <img key={i} src="/icons/star-green.svg" alt="star" className='h-6 mb-2'/>
                    ) : (
                      <img key={i} src="/icons/star-gray-com.svg" alt="star" className='h-6 mb-2' />
                    )
                  ))}
                </div>
                <DeleteReview reviewId={review._id} onDelete={() => setReviews(reviews.filter((r) => r._id !== review._id))}/>
              </div>
              <p className="mb-2 text-[1rem] text-[#171A1F]">{review.comment}</p>
              <p className="mb-2 text-[1rem]">
                Date: {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReviews;