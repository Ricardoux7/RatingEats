import api from '../../api/api';
import { useEffect, useState } from 'react';

const BringMyReservations = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    try {
      const fetchReservations = async () => {
        const response = await api.get('/reservations/user', {
          headers: {
            Authorization: `Bearer ${userId}`,
          }
        })
        const confirmed = response.data.filter(reservation => reservation.state === 'confirmed');
        setReservations(confirmed);
        setIsLoading(false);
      }
      fetchReservations();
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setError('Internal server error. Please try again later.');
      }
    }
  })


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