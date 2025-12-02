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
              className="border border-[#258A00] rounded-lg p-4 bg-white w-[80%]"
            >
              <div className='flex justify-between items-start'>
                <div className='flex flex-row text-2xl gap-1'>
                  <p className="mb-2 text-[2rem] font-normal text-[#171A1F]">{review.restaurantId?.name}</p>
                  {Array.from({ length: 5 }).map((_, i) => (
                    i < Math.round(review.rating) ? (
                      <img key={i} src="../../icons/star-green.svg" alt="star" className='w-6 mb-2'/>
                    ) : (
                      <img key={i} src="../../icons/star-gray-com.svg" alt="star" className='w-6 mb-2' />
                    )
                  ))}
                </div>
                <button className='text-[#B70000] flex items-center gap-1 border-2 border-[#D9D9D9] rounded-lg p-2 font-semibold'><img src="../icons/delete.svg" alt="delete" className='w-6' /> Delete</button>
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