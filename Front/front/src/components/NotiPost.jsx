import api from '../api/api';

export const handleAcceptPost = async ({ userId, restaurantId, postId }) => {
  try {
    await api.post('/notifications/post/accepted', {
      userId,
      restaurantId,
      postId,
    });
  } catch (err) {
  }
};

export const handleRejectPost = async ({ userId, restaurantId, postId }) => {
  try {
    await api.post('/notifications/post/rejected', {
      userId,
      restaurantId,
      postId,
    });
  } catch (err) {
  }
};

