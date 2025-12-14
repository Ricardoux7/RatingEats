/**
 * BringMyReservations Component
 *
 * Muestra las reservaciones confirmadas del usuario autenticado.
 * Obtiene las reservaciones desde la API y filtra solo las confirmadas.
 *
 * Props:
 * @param {string} userId - Token JWT del usuario autenticado.
 *
 * Estado:
 * - reservations: Array de reservaciones confirmadas.
 * - isLoading: Estado de carga.
 * - error: Mensaje de error.
 *
 * Características:
 * - Obtiene reservaciones del usuario desde la API.
 * - Filtra y muestra solo las reservaciones confirmadas.
 * - Muestra mensajes de error y feedback de carga.
 *
 * Ejemplo de uso:
 * <BringMyReservations userId={user.token} />
 *
 * @module BringMyReservations
 */
import api from '../../api/api';
import { useEffect, useState } from 'react';

const BringMyReservations = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /**
   * Efecto que obtiene las reservaciones del usuario desde la API y filtra solo las confirmadas.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/reservations/user', {
          headers: {
            Authorization: `Bearer ${userId}`,
          }
        });
        const confirmed = response.data.filter(reservation => reservation.state === 'confirmed');
        setReservations(confirmed);
        setIsLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 500) {
          setError('Internal server error. Please try again later.');
        }
      }
    };
    fetchReservations();
  }, [userId]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className='border border-[#2DA800] rounded-xl w-[90%] h-auto mx-auto p-6 my-6'>
      <h2 className="text-2xl font-bold mb-4 text-[#2DA800]">My confirmed reservations</h2>
      {reservations.length === 0 ? (
        <p>You have no confirmed reservations.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation._id} className="mb-4 p-4 border rounded-lg shadow">
              <p className='font-semibold'>Restaurant: <span className='font-normal'>{reservation.restaurantId.name}</span></p>
              <p className='font-semibold'>Date: <span className='font-normal'>{new Date(reservation.dateReservation).toLocaleDateString()}</span></p>
              <p className='font-semibold'>Time: <span className='font-normal'>{reservation.time}</span></p>
              <p className='font-semibold'>Number of guests: <span className='font-normal'>{reservation.numberOfGuests}</span></p>
              <p className='font-semibold'>Customer name: <span className='font-normal'>{reservation.customerName}</span></p>
              <p className='font-semibold'>Phone number: <span className='font-normal'>{reservation.phoneNumber}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}

export default BringMyReservations;