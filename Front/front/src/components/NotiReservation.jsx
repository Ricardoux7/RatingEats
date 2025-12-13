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