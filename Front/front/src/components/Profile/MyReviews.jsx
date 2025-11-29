import api from '../../api/api';
import React, { useEffect, useState } from 'react';

const MyReviews = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/profile/reviews', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Coulnt fetch reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [user.token]);

  return (
    <div className="p-5 font-sans">
      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-300 rounded-lg p-4 bg-gray-100"
            >
              <p className="mb-2 font-semibold">{review.text}</p>
              <p className="mb-2">Rating: {review.rating}</p>
              <p className="mb-2 text-gray-600">
                Date: {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-2">Restaurant: {review.restaurantId?.name}</p>
              <p className="mb-2 italic">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReviews;