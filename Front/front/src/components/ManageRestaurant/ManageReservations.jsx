/**
 * ManageReservations Component
 *
 * Permite a los administradores gestionar las reservaciones pendientes de un restaurante (aceptar o rechazar).
 * Muestra la lista de reservaciones y permite acciones sobre ellas.
 *
 * Props:
 * @param {string} restaurantId - ID del restaurante.
 *
 * Estado:
 * - reservations: Lista paginada de reservaciones.
 * - isLoading: Estado de carga.
 * - error: Mensaje de error.
 * - firstLoad: Indica si es la primera carga.
 * - popupMessage: Mensaje de feedback.
 * - showPopup: Controla la visibilidad del popup.
 *
 * Características:
 * - Permite aceptar o rechazar reservaciones.
 * - Muestra mensajes de éxito o error.
 *
 * Ejemplo de uso:
 * <ManageReservations restaurantId={id} />
 *
 * @module ManageReservations
 */
import api from '../../api/api';
import { useState, useEffect, useParams } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { handleAcceptReservation, handleRejectReservation } from '../NotiReservation.jsx';

const ManageReservations = ({ restaurantId }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState({ docs: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/reservations/manage/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setReservations(response.data);
      setError(null);
    } catch (err) {
      setError('Coulnt fetch reservations. Please try again later.');
    } finally {
      setIsLoading(false);
      setFirstLoad(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user.token, restaurantId]);

  const acceptReservation = async (reservationId) => {
    try {
      await api.patch(`reservations/${reservationId}/confirm`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setPopupMessage('Reservation accepted successfully.');
      setShowPopup(true);
      fetchReservations();
      handleAcceptReservation({
        userId: reservations.docs.find(r => r._id === reservationId)?.userId,
        restaurantId: restaurantId,
        reservationId: reservationId,
      });
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error accepting reservation:', err);
    }
  };

  const rejectReservation = async (reservationId) => {
    try {
      await api.patch(`reservations/${reservationId}/reject`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setPopupMessage('Reservation rejected successfully.');
      setShowPopup(true);
      fetchReservations();
      handleRejectReservation({
        userId: reservations.docs.find(r => r._id === reservationId)?.userId,
        restaurantId: restaurantId,
        reservationId: reservationId,
      });
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error rejecting reservation:', err);
    }
  };
  
  const ReservationPopup = ({ message }) => (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]">
      {message}
    </div>
  );

  return ( 
  <div className="p-5 font-sans">
    {firstLoad ? (
      <p className="text-center text-gray-600">Loading...</p>    
    ) : error ? (
      <p className="text-center text-red-500">{error}</p>
    ) : (
      <div className='w-full'>
        {isLoading && (
            <p className="text-center text-gray-400 text-sm">Updating...</p>
          )}
        <h2 className="text-2xl font-bold mb-4">Pending reservations</h2>
        <div className='border border-[#258A00] rounded-2xl p-4 mt-8 bg-white'>
          {(!reservations.docs || reservations.docs.length === 0) ? (
            <p className="text-center text-gray-600">No reservations found.</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className='min-w-full table-fixed text-left'>
                <thead className=''>
                  <tr>
                    <th className="w-1/5 text-center">Customer Name</th>
                    <th className="w-1/5 text-center">Date</th>
                    <th className="w-1/5 text-center">Time</th>
                    <th className="w-1/5 text-center">Guests</th>
                    <th className="w-1/5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.docs.map((reservation) => (
                    <tr key={reservation._id} className="border-b border-gray-200">
                      <td className="text-gray-600 w-1/5 text-center align-middle">{reservation.customerName}</td>
                      <td className="text-gray-600 w-1/5 text-center align-middle">{reservation.dateReservation.slice(0, 10)}</td>
                      <td className="text-gray-600 w-1/5 text-center align-middle">{reservation.time}</td>
                      <td className="text-gray-600 w-1/5 text-center align-middle">{reservation.numberOfGuests}</td>
                      <td className='flex justify-center items-center gap-4'>
                        <button className='bg-[#258A00] text-white p-2 rounded' style={{minWidth: '60px'}} onClick={() => acceptReservation(reservation._id)}>Accept</button>
                        <button className='bg-red-500 text-white p-2 rounded' style={{minWidth: '60px'}} onClick={() => rejectReservation(reservation._id)}>Reject</button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {showPopup && <ReservationPopup message={popupMessage} />}
      </div>
    )}
  </div>);
};
export default ManageReservations;