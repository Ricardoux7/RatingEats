/**
 * NotiPost Handlers
 *
 * Funciones para enviar notificaciones de aceptación o rechazo de posts.
 * Llaman a la API para notificar al usuario correspondiente.
 *
 * @function handleAcceptPost
 * @param {Object} params - Parámetros de la notificación.
 * @param {string} params.userId - ID del usuario.
 * @param {string} params.restaurantId - ID del restaurante.
 * @param {string} params.postId - ID del post.
 * @returns {Promise<void>}
 *
 * @function handleRejectPost
 * @param {Object} params - Parámetros de la notificación.
 * @param {string} params.userId - ID del usuario.
 * @param {string} params.restaurantId - ID del restaurante.
 * @param {string} params.postId - ID del post.
 * @returns {Promise<void>}
 *
 * @module NotiPost
 */
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

