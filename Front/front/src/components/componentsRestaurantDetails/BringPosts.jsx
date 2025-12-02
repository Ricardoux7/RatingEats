import api from '../../api/api';
import { useState, useEffect } from 'react';
import { HeaderDesktop } from '../components.jsx';
import { HeaderMobile } from '../components.jsx';
import { useParams } from 'react-router-dom';
import '../../components.css';

const BringPosts = ({ restaurantId, userToken }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const imageURL = posts.image && posts.image.url ? `${BACKEND_URL}${post.image.url}` : null;


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/${restaurantId}/posts`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError('Couldnt fetch posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [restaurantId, userToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-4">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 items-center justify-center mx-auto">
        {posts.length === 0 || posts === null ? (
          <p>No posts found.</p>
        ) : (
          posts.filter(post => post.image && post.image.url)
          .map((post) => {
              const imageUrl = `${BACKEND_URL}${post.image.url}`;
            return (
              <div key={post._id} className="border border-gray-300 rounded-lg p-4 mb-4 w-[60%]">
                <img src={imageUrl} alt={post.image.alt || ''} />
                <p className="text-gray-600 break-words">{post.content}</p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default BringPosts;