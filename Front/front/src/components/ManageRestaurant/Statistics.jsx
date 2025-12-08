import api from '../../api/api';
import { useState, useEffect } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const Statistics = ({ restaurantId, userToken }) => {
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatingStatistics = async () => {
      try {
        const reviewsResponse = await api.get(`restaurants/${restaurantId}/reviews`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const restaurantResponse = await api.get(`restaurants/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const reviews = reviewsResponse.data;
        const totalReviews = reviews.length;
        const averageRating = restaurantResponse.data.averageRating || 0;
        const ratingStats = [
          { rating: 1, count: reviews.filter(r => r.rating === 1).length },     
          { rating: 2, count: reviews.filter(r => r.rating === 2).length },
          { rating: 3, count: reviews.filter(r => r.rating === 3).length },
          { rating: 4, count: reviews.filter(r => r.rating === 4).length },
          { rating: 5, count: reviews.filter(r => r.rating === 5).length }
        ];
        setStatistics({
          totalReviews,
          averageRating,
          ratingStats,
        });
      } catch (err) {
        setError('Could not fetch statistics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRatingStatistics();
  }, [restaurantId, userToken]);

  if (isLoading) return <p>Loading statistics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!statistics) return null;

  const data = {
    labels: statistics.ratingStats.map(stat => `${stat.rating} Stars`),
    datasets: [
      {
        label: `Average Rating: ${statistics.averageRating.toFixed(2)}`,
        data: statistics.ratingStats.map(stat => stat.count),
        backgroundColor: [
          '#253624',
          '#326130',
          '#326130', 
          '#368B2E',
          '#23B61E', 
          '#08E000F',
        ],
        borderWidth: 1,
      }]
  }

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed} reviews`;
          }
        }
      }
    }
  };

  return (
    <div >
      <div>
        <Doughnut data={data} options={options} />
        <div className='items-center text-2xl mx-auto w-fit mt-4 text-center'>
          <h3 className='text-[#565d6d]'>Avg: <span className='text-[#258A00] font-semibold'>{statistics.averageRating.toFixed(2)}</span></h3>
          <div className='flex flex-col items-center'>
            <div className='flex gap-2'>
              {Array.from({ length: 5 }).map((_, i) => (
                i < Math.round(statistics.averageRating) ? (
                  <img key={i} src="../../icons/star-green.svg" alt="star" className='w-6' />
                  ) : (
                    <img key={i} src="../../icons/star-gray-com.svg" alt="star" className='w-7' />
                  )
              ))}
            </div>
            <p className='text-[#565d6d]'>{`Total Reviews: ${statistics.totalReviews}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;