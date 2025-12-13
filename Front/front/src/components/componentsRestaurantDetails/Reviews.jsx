import api from '../../api/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DeleteReview from '../DeleteReview';

const Reviews = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [visibleCount, setVisibleCount] = useState(5);
  const token = localStorage.getItem('userToken');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/restaurants/${id}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Coulnt fetch reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleMoreReviews = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const leaveReview = async (e) => {
    e.preventDefault();
    if (review.rating < 1 || review.rating > 5) {
      setError('Please select a rating (at least 1 star).');
      setShowPopup(true);
      return;
    }
    try {
      await api.post(`/restaurants/${id}/reviews`, review, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await api.get(`/restaurants/${id}/reviews`);
      setReviews(response.data);
      setReview({ rating: 0, comment: '' });
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 409 ) {
        setError('You have already submitted a review for this restaurant.');
        setShowPopup(true);
      } else if (err.response && err.response.status === 400) {
        setError('Invalid review. Please check your rating and comment.');
        setShowPopup(true);
      } else if (err.response && err.response.status === 403) {
        setError('You must be logged in to submit a review.');
        setShowPopup(true);
      } else if (err.response && err.response.status === 500) {
        setError('Server error. Please try again later.');
        setShowPopup(true);
      } else {
        console.error('Error submitting review:', err);
        setError('Could not submit review. Please try again later.');
        setShowPopup(true);
      }
    }
  }

  return (
    <div className="w-full md:w-[90%] md:ml-4 px-2 md:px-0 py-4">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-90 z-50 ">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center gap-4 text-center">
            <img src="../icons/error.svg" alt="error" className='w-20'/>
            <p className="text-red-600 text-lg font-bold mb-4">
              {error}
            </p>
            <button
              className="mt-2 px-4 py-2 bg-[#258A00] text-white rounded hover:bg-[#45A049]"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isLoading ? (
        <div>Loading reviews...</div>
      ) : (
        <div>
          <form onSubmit={leaveReview} className='bg-gray-100 my-6 flex flex-col gap-10 w-full h-auto items-center rounded-xl'>
            <div className="flex flex-col ml-2 w-full">
              <label htmlFor="rating" className='font-bold mb-1 text-[#171A1F] text-[2rem] ml-4'>Write a review</label>
              <div className="flex gap-1 ml-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReview({ ...review, rating: star })}
                    className="focus:outline-none"
                  >
                    <img
                      src={star <= review.rating ? "../icons/star-green.svg" : "../icons/star-light-green.svg"}
                      alt={`${star} star`}
                      className="w-8 transition-transform hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className='w-[90%]'>
              <label htmlFor="comment" className='font-semibold mb-1 flex flex-col'>Comment:</label>
              <textarea id="comment" name="comment" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#258A00] w-full min-h-[60px]" placeholder="Write your comment..."></textarea>
            </div>
            <button type="submit" className='bg-[#258A00] hover:bg-[#45A049] text-white font-semibold rounded px-4 py-2 my-2 transition-colors w-[90%] mx-auto'>Submit</button>
          </form>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {[...reviews].sort((a, b) => {
            if (a.userId?._id === user?._id) return -1;
            if (b.userId?._id === user?._id) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          }).slice(0, visibleCount).map((review) => (
            <div key={review._id} className="mb-4 p-3 rounded-lg bg-gray-100 shadow-sm flex flex-col gap-1 md:p-4 md:gap-2">
              {review.userId?._id === user?._id && (
                <div>
                  <p className="text-sm text-gray-500">You</p>
                  <div className='flex justify-end'>
                    <DeleteReview reviewId={review._id} onDelete={() => setReviews(reviews.filter((r) => r._id !== review._id))} />
                  </div>
                </div>
              )}
              <h2 className="text-base md:text-xl font-semibold wrap-break-word">
                {review.userId?.username || 'Usuario'}
              </h2>
              <div className='flex items-center'>
                {Array.from({ length: 5 }).map((_, i) => (
                  i < Math.round(review.rating) ? (
                    <img key={i} src="../icons/star-green.svg" alt="star" className='w-6' />
                  ) : (
                    <img key={i} src="../icons/star-light-green.svg" alt="star" className='w-6' />
                  )
                ))}
              </div>
              <p className="mt-1 md:mt-2 text-md md:text-base wrap-break-word">{review.comment}</p>
            </div>
          ))}
          {visibleCount < reviews.length && (
            <button onClick={handleMoreReviews} className='mt-2 px-3 py-1 bg-[#258A00] text-white rounded text-sm md:text-base'>See More Reviews</button>
          )}
        </div>
      )}
    </div>
  );
}

export default Reviews;