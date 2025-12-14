import api from '../../api/api';
import { useState, useEffect } from 'react';
import '../../components.css';
import {useAuth} from '../../context/AuthContext.jsx';

const BringPosts = ({ restaurantId, userToken, onDelete }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [succesMessage, setSuccesMessage] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);
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

  const deletePost = async (postId) => {
    try{
      await api.delete(`/posts/${postId}/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }
      })
      setPosts(posts.filter(post => post._id !== postId));
      setPopupMessage('Post has been deleted successfully!');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
      }, 2000);
    } catch (err) {
      setPopupMessage('Error deleting post.');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
      }, 2000);
    }
  }

  useEffect(() => {
    if (succesMessage) {
      const timer = setTimeout(() => {
        setSuccesMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
}, [succesMessage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
    {succesMessage && <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      <p>{succesMessage}</p>
    </div>}
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
                    <div className="w-full aspect-video max-h-48 md:max-h-40 flex items-center justify-center overflow-hidden relative">
                      <img
                        src={imageUrl}
                        alt={post.image.alt || ''}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      {onDelete  && <button onClick={() => { setSelectedPostId(post._id); setPopupMessage('Are you sure you want to delete this post?'); setShowPopup(true); }} className='bg-red-500 rounded-2xl absolute top-2 right-2 p-2 text-white'>Delete</button>}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-full h-full">
                    <p className="text-gray-800 text-base md:text-lg wrap-break-words mb-2">{post.content || <span className="italic text-gray-400">No comment</span>}</p>
                    <div className="flex flex-col justify-between mt-2 items-start">
                      <span className="text-xs text-gray-500">{post.createdAt ? post.createdAt.slice(0, 10) : ''}</span>
                    </div>
                  </div>
                  {showPopup &&  selectedPostId === post._id && <div key={selectedPostId} className="w-full bg-gray-100 text-[#21C45D] px-6 py-3 rounded-lg shadow-lg z-50 animation fadeInOut flex flex-col items-center text-center justify-center">
                  <p>{popupMessage}</p>
                  <div className='py-2'>
                    <button onClick={() => setShowPopup(false)} className="ml-4 bg-[#21C45D] text-white px-2 py-1 rounded">Close</button>
                    <button onClick={() => { setShowPopup(false); deletePost(selectedPostId); setSuccesMessage('Post has been deleted successfully!'); }} className="ml-4 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                </div>}
                </div>
              );
            })
        )}
      </div>
    </>
  );
};

export default BringPosts;