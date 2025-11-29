import api from '../../api/api';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import '../../components.css';

const CreateReservation = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        setError('Coulnt fetch restaurant details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError(null);
    try {
      const token = localStorage.getItem('userToken');
      const response = await api.post(`/reservations`, {
        restaurantId: id,
        dateReservation: reservationDate,
        time: reservationTime,
        numberOfGuests: numberOfPeople,
        customerName: customerName,
        phoneNumber: customerPhone,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      setSuccessMessage(response.data.message || 'Reservation created successfully!');
      setShowPopup(true);
      setReservationDate('');
      setReservationTime('');
      setNumberOfPeople(1);
      setCustomerName('');
      setCustomerPhone('');
    } catch (err) {
      setError('Error creating reservation:', err);
    } finally {
      setIsLoading(false);
    }
  }
  if (isLoading) {
  return (
    <div>
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
}
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
          {successMessage && <p className="text-green-600 text-lg font-bold">{successMessage}</p>}
          {error && <p className="text-red-600 text-lg font-bold">{error}</p>}
          <button
            className="mt-4 px-4 py-2 bg-[#258A00] text-white rounded hover:bg-[#45A049]"
            onClick={() => setShowPopup(false)}
          >
            Close
          </button>
        </div>
      </div>
    )}
    <div className='flex flex-col md:hidden items-center justify-center w-full bg-[#ECFFE6] p-4'>
      <h2 className='font-bold text-4xl self-start text-[#171A1F] mb-4'>Make a reservation</h2>
      <form onSubmit={handleReservationSubmit} className='w-full flex flex-col gap-4'>
        <label className='flex flex-col'>
          <p className='font-bold text-[#171A1F]'>Date:</p>
          <input
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
            placeholder='DD/MM/YYYY'
            min={new Date().toISOString().split('T')[0]}
          />
        </label>
        <label className='flex flex-col'>
          <p className='font-bold text-[#171A1F]'>Time:</p>
          <input
            type="time"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
          />
        </label>
        <label className='flex flex-col'>
          <p className='font-bold text-[#171A1F]'>Number of People:</p>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            min="1"
            className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
          />
        </label>
        <label className='flex flex-col'>
          <p className='font-bold text-[#171A1F]'>Customer Name:</p>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
            placeholder='John Doe'
          />
        </label>
        <label className='flex flex-col'>
          <p className='font-bold text-[#171A1F]'>Customer Phone:</p>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
            placeholder='+584141234567'
          />
        </label>
        <button
          type="submit"
          disabled={!reservationDate || !reservationTime || !numberOfPeople || !customerName || !customerPhone}
          className='h-12 w-full bg-[#258A00] text-white font-bold rounded-md hover:bg-[#45A049] transition-colors'
        >
          Submit
        </button>
        {error && <div className='text-red-600 font-medium mt-2 w-[100px] h-[50px] z-50'>{error}</div>}
        {successMessage && <div className='text-green-600 font-medium mt-2 w-[100px] h-[50px] z-50'>{successMessage}</div>}
      </form>
    </div>
    <div>
      <div className='hidden md:flex flex-col items-center justify-center w-full h-auto bg-white p-4 sticky top-8 z-10 border-b mx-auto border-gray-300'>
        <h2 className='font-bold text-4xl text-[#171A1F] mb-4'>Make a reservation</h2>
        <p className='text-2xl justify-center'>Secure your spot for a delightful dining experience.</p>
        <form onSubmit={handleReservationSubmit} className='w-full flex flex-col gap-4'>
          <label className='flex flex-col'>
            <p className='font-bold text-[#171A1F]'>Date:</p>
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
              placeholder='DD/MM/YYYY'
              min = {new Date().toISOString().split('T')[0]}
            />
          </label>
          <label className='flex flex-col'>
            <p className='font-bold text-[#171A1F]'>Time:</p>
            <input
              type="time"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
            />
          </label>
          <label className='flex flex-col'>
            <p className='font-bold text-[#171A1F]'>Number of People:</p>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              min="1"
              className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
            />
          </label>
          <label className='flex flex-col'>
            <p className='font-bold text-[#171A1F]'>Customer Name:</p>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
              placeholder='John Doe'
            />
          </label>
          <label className='flex flex-col'>
            <p className='font-bold text-[#171A1F]'>Customer Phone:</p>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
              placeholder='+584141234567'
            />
          </label>
          <button
            type="submit"
            className='h-12 w-full bg-[#258A00] text-white font-bold rounded-md hover:bg-[#45A049] transition-colors'
            disabled={!reservationDate || !reservationTime || !numberOfPeople || !customerName || !customerPhone}
          >
            Submit
          </button>
          {error && <div className='text-red-600 font-medium mt-2'>{error}</div>}
          {successMessage && <div className='text-green-600 font-medium mt-2 '>{successMessage}</div>}        
        </form>
      </div>
    </div>
    </>
  );
}



export default CreateReservation;