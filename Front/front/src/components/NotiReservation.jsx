/**
 * NotiReservation Handlers
 *
 * Funciones para enviar notificaciones relacionadas con reservaciones (aceptar, rechazar, cancelar, completar).
 * Llaman a la API para notificar al usuario correspondiente.
 *
 * @function handleAcceptReservation
 * @param {Object} params - Parámetros de la notificación.
 * @param {string} params.userId - ID del usuario.
 * @param {string} params.restaurantId - ID del restaurante.
 * @param {string} params.reservationId - ID de la reservación.
 * @returns {Promise<void>}
 *
 * @function handleRejectReservation
 * @param {Object} params - Parámetros de la notificación.
 * @param {string} params.userId - ID del usuario.
 * @param {string} params.restaurantId - ID del restaurante.
 * @param {string} params.reservationId - ID de la reservación.
 * @returns {Promise<void>}
 *
 * @function handleCancelReservationNoti
 * @param {Object} params - Parámetros de la notificación.
 * @param {string} params.userId - ID del usuario.
 * @param {string} params.restaurantId - ID del restaurante.
 * @param {string} params.reservationId - ID de la reservación.
 * @returns {Promise<void>}
 *
 * @function handleCompleteReservationNoti
 * @param {Object} params - Parámetros de la notificación.
 * @param {string} params.userId - ID del usuario.
 * @param {string} params.restaurantId - ID del restaurante.
 * @param {string} params.reservationId - ID de la reservación.
 * @returns {Promise<void>}
 *
 * @module NotiReservation
 */
import api from '../api/api';

export const handleAcceptReservation = async ({ userId, restaurantId, reservationId }) => {
  try {
    await api.post('/notifications/reservation/accepted', {
      userId,
      restaurantId,
      reservationId,
    });
  } catch (err) {
  }
};

export const handleRejectReservation = async ({ userId, restaurantId, reservationId }) => {
  try {
    await api.post('/notifications/reservation/rejected', {
      userId,
      restaurantId,
      reservationId,
    });
  } catch (err) {
  }
};

export const handleCancelReservationNoti = async ({ userId, restaurantId, reservationId }) => {
  try {
    await api.post('/notifications/reservation/canceled', {
      userId,
      restaurantId,
      reservationId,
    });
  } catch (err) {
  }
}

export const handleCompleteReservationNoti = async ({ userId, restaurantId, reservationId }) => {
  try {
    await api.post('/notifications/reservation/completed', {
      userId,
      restaurantId,
      reservationId,
    });
  } catch (err) {
  }
};