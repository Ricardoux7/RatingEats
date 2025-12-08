import Restaurant from '../../../../../Back/models/restaurant.models';
import api from '../../api/api';
import { useState, useEffect } from 'react';

const BringReservations = ({ restaurantId, userToken }) => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get(`/reservations/restaurant/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setReservations(response.data);
        setError(null);
      } catch (err) {
        setError('Could not fetch reservations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, [restaurantId, userToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const ReservationPopup = ({ message }) => (
    <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
      <p>{message}</p>
    </div>
  )

  const handleCancelReservation = async (reservationId) => {
    try {
      await api.patch(`/reservations/${reservationId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation._id !== reservationId)
      );
      setShowPopup(true);
      setMessage('Reservation cancelled successfully.');
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 5000);
    } catch (err) {
      console.error('Error cancelling the reservation:', err);
      setShowPopup(true);
      setMessage('Error cancelling the reservation. Please try again.');
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 5000);
    }
  }

  const handleCompleteReservation = async (reservationId) => {
    try {
      await api.patch(`/reservations/${reservationId}/complete`, {}, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation._id !== reservationId)
      );
      setShowPopup(true);
      setMessage('Reservation accepted successfully.');
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 5000);
    } catch (err) {
      console.error('Error marking as complete the reservation:', err);
      setShowPopup(true);
      setMessage('Error marking as complete the reservation. Please try again.');
      setTimeout(() => {
        setMessage(null);
        setShowPopup(false);
      }, 5000);
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-4">Reservations</h2>
      {showPopup && <ReservationPopup message={message} />}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-left border border-[#258A00] rounded-2xl bg-white shadow-md">
          <thead>
            <tr>
              <th className="w-1/5 px-2 py-2">Customer Name</th>
              <th className="w-1/5 px-2 py-2">Date</th>
              <th className="w-1/5 px-2 py-2">Time</th>
              <th className="w-1/5 px-2 py-2">Guests</th>
              <th className="w-1/5 px-2 py-2">Status</th>
              <th className="w-1/5 px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-600 py-4">
                  No reservations found.
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation._id} className="border-b border-gray-200">
                  <td className="text-gray-600 w-1/5 px-2 py-2">{reservation.customerName}</td>
                  <td className="text-gray-600 w-1/5 px-2 py-2">{reservation.dateReservation?.slice(0, 10)}</td>
                  <td className="text-gray-600 w-1/5 px-2 py-2">{reservation.time}</td>
                  <td className="text-gray-600 w-1/5 px-2 py-2">{reservation.numberOfGuests}</td>
                  <td className="w-1/5 px-2 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold w-fit
                      ${reservation.state === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : reservation.state === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {reservation.state || 'pending'}
                    </span>
                  </td>
                  <td className="w-1/5 px-2 py-2">
                    {reservation.state === 'confirmed' && (
                      <div className="flex flex-col gap-2">
                        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-xs" onClick={() => handleCompleteReservation(reservation._id)}>
                          Completed
                        </button>
                        <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-xs" onClick={() => handleCancelReservation(reservation._id)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BringReservations;