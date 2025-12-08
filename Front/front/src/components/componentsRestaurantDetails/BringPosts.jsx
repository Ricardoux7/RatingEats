import api from '../../api/api';
import { useState, useEffect } from 'react';
import '../../components.css';

const BringPosts = ({ restaurantId, userToken }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
      <h2 className="text-3xl font-bold mb-4 text-center">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 items-center justify-center mx-auto py-4">
        {posts.length === 0 || posts === null ? (
          <p>No posts found.</p>
        ) : (
          posts
            .filter(post => post.image && post.image.url)
            .map((post) => {
              const imageUrl = `${BACKEND_URL}${post.image.url}`;
              return (
                <div
                  key={post._id}
                  className="w-[90%] max-w-md md:max-w-lg mx-auto border border-gray-300 rounded-xl shadow-md bg-white flex flex-col gap-4 p-4 md:p-6 overflow-hidden"
                >
                  <div className="w-full h-auto shrink-0 flex items-center justify-center overflow-hidden">
                    <div className="w-full aspect-video max-h-48 md:max-h-40 flex items-center justify-center overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={post.image.alt || ''}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-full h-full">
                    <p className="text-gray-800 text-base md:text-lg wrap-break-words mb-2">{post.content || <span className="italic text-gray-400">No comment</span>}</p>
                    <div className="flex flex-col justify-between mt-2 items-start">
                      <span className="text-xs text-gray-500">{post.createdAt ? post.createdAt.slice(0, 10) : ''}</span>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </>
  );
};

export default BringPosts;