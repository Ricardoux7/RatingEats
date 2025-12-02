import api from '../../api/api';
import React, { useEffect, useState } from 'react';

const ManagePosts = ({ restaurantId, userToken }) => {
  const [posts, setPosts] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect (() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/posts/${restaurantId}/pending`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, [restaurantId, userToken]);

  const PostPopup = ({ message }) => (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      <p>{message}</p>
    </div>
  );
  const acceptPost = async (postId) => {
    try {
      await api.patch(`/posts/${postId}/accept`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setPosts(posts.filter(post => post._id !== postId));
      setPopupMessage('Post has been accepted successfully!');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error accepting post:', err);
    }
  };
  
  const rejectPost = async (postId) => {
    try {
      await api.patch(`/posts/${postId}/reject`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setPosts(posts.filter(post => post._id !== postId));
      setPopupMessage('Post has been rejected successfully!');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage('');
      }, 2000);
    } catch (err) {
      console.error('Error rejecting post:', err);
    }
  };
  
  return (
    <>
    <h2 className='text-[1.5rem] font-bold ml-5'>Manage Posts</h2>
    <div className='border border-[#258A00] rounded-2xl mt-8 bg-white mx-auto p-5'>
      {posts.length === 0 ? (
        <p className='text-center'>No pending posts.</p>
      ) : (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start'>
        {posts.map((post) => {
          const imageUrl = post.image && post.image.url ? `${BACKEND_URL}${post.image.url}` : null;
          return (
            <div key={post._id} className='w-full border rounded-lg shadow-md text-[1.2rem] text-[#171a1f] break-words h-auto flex flex-col gap-1 p-4'>
              {imageUrl && <img src={imageUrl} alt="" className='w-full h-[200px]'/>}
              <p>Uploaded by: {post.authorUserId.username}</p>
              <p>Requested at: {post.createdAt.slice(0, 10)}</p>
              <p>{post.content}</p>
              <p className='bg-[#FEF9C3] px-2 rounded-full fit-content w-fit h-fit text-[#854D0E]'>{post.state}</p>
              <div className='flex items-end mt-auto'>
                <button onClick={() => acceptPost(post._id)} className='text-green-400 w-[50%] border-[#171a1f]'>Accept</button>
                <button onClick={() => rejectPost(post._id)} className='text-red-400 w-[50%] border-l border-[#171a1f]'>Reject</button>
              </div>
            </div>
          );
        })}
        {showPopup && <PostPopup message={popupMessage} />}
      </div>
      )}
    </div>
    </>
  );
}

export default ManagePosts;