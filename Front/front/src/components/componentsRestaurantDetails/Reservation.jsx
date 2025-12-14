import api from '../../api/api';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../components.css';

const CreateReservation = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState([]);
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [message, setMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setIsLoading(true);
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
    setMessage('');
    setError([]);
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
    if (response.data && response.data.state === 'confirmed') {
      setMessage('Reservation created and confirmed successfully!');
    } else {
      setMessage('Your reservation request was sent successfully!');
    }
      setShowPopup(true);
      setReservationDate('');
      setReservationTime('');
      setNumberOfPeople(1);
      setCustomerName('');
      setCustomerPhone('');
    } catch (err) {
      if (Array.isArray(err.response?.data?.errors)) {
        setError(err.response.data.errors);
      } else if (typeof err.response?.data?.message === 'string') {
        setError([err.response.data.message]);
      } else {
        setError(['Error creating reservation. Please try again.']);
      }
      setMessage('Error creating reservation. Please try again.');
      setShowPopup(true);
    } finally {
      setIsLoading(false);
    }
  }
  if (isLoading) {
  return (
    <div>
      <svg className="loader-loader" viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
}
  return (
    <>
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className={`bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 border-2 animate-drop-in ${message && message.includes('Error') ? 'border-red-200' : 'border-green-200'}`}>
          {message && message.includes('Error') ? (
            <svg className="w-16 h-16 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-16 h-16 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
            </svg>
          )}
          <p className={`${message && message.includes('Error') ? 'text-red-600' : 'text-green-600'} text-lg font-semibold text-center`}>{message}</p>
          <button
            className="px-4 py-2 bg-[#258A00] text-white rounded hover:bg-[#45A049]"
            onClick={() => setShowPopup(false)}
          >
            Close
          </button>
        </div>
      </div>
    )}
    <div className='flex flex-col md:hidden items-center justify-center w-full bg-[#ECFFE6] p-4 '>
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
          {error.filter(e => e.toLowerCase().includes('date')).map((e, i) => (
            <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>
          ))}
        </label>
        <label className='flex flex-col'>
          <p className='font-bold text-[#171A1F]'>Time:</p>
          <input
            type="time"
            value={reservationTime}
            onChange={(e) => setReservationTime(e.target.value)}
            className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
          />
          {error.filter(e => e.toLowerCase().includes('time')).map((e, i) => (
            <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>
          ))}
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
            {error.filter(e => e.toLowerCase().includes('people')).map((e, i) => (
              <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>
            ))}
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
            {error.filter(e => e.toLowerCase().includes('name')).map((e, i) => (
              <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>
            ))}
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
            {error.filter(e => e.toLowerCase().includes('phone')).map((e, i) => (
              <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>
            ))}
        </label>
        <button
          type="submit"
          disabled={!reservationDate || !reservationTime || !numberOfPeople || !customerName || !customerPhone}
          className='h-12 w-full bg-[#258A00] text-white font-bold rounded-md hover:bg-[#45A049] transition-colors'
        >
          Submit
        </button>
      </form>
    </div>
    <div>
      <div className='hidden md:flex flex-col items-center justify-center w-full h-auto gap-5 bg-white p-4 sticky top-8 z-10 border-b mx-auto border-gray-300'>
        <h2 className='font-bold text-4xl text-[#171A1F] mb-4'>Make a reservation</h2>
        <p className='text-2xl justify-center'>Secure your spot for a delightful dining experience.</p>
        <form onSubmit={handleReservationSubmit} className='w-full max-w-lg flex flex-col gap-4 mx-auto'>
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
            {error.filter(e => e.toLowerCase().includes('date')).map((e, i) => <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>)}
          </label>
          <label className='flex flex-col'>
            <p className='font-bold text-[#171A1F]'>Time:</p>
            <input
              type="time"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              className='h-12 w-full bg-[#DEE1E6] rounded-md p-4'
            />
            {error.filter(e => e.toLowerCase().includes('time')).map((e, i) => <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>)}
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
            {error.filter(e => e.toLowerCase().includes('people')).map((e, i) => <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>)}
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
            {error.filter(e => e.toLowerCase().includes('name')).map((e, i) => <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>)}
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
            {error.filter(e => e.toLowerCase().includes('phone')).map((e, i) => <div key={i} className='text-red-600 font-medium mt-2'>{e}</div>)}
          </label>
          <button
            type="submit"
            className='h-12 w-full bg-[#258A00] text-white font-bold rounded-md hover:bg-[#45A049] transition-colors'
            disabled={!reservationDate || !reservationTime || !numberOfPeople || !customerName || !customerPhone}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default CreateReservation;