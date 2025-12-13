
import api from '../api/api.js';
import React, { useEffect, useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications().sort;
  }, []);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='fixed mt-20 flex flex-col w-[80%] md:w-[30%] bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 right-4 overflow-y-scroll max-h-[400px]'>
      <h2 className='font-bold text-2xl text-[#2DA800] text-center'>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif._id} className='border border-[#2DA800] rounded-lg p-2 mb-2 flex flex-col'><p>{notif.message}</p><p>{new Date(notif.date).toLocaleDateString()}</p></li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;