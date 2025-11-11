import { Reservation } from '../models/reservations.models.js';
import asyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurant.models.js';

const createReservation = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;
    const staffRestaurantId = req.user.restaurantId;
    const { restaurantId, dateReservation, time, numberOfGuests, customerName, phoneNumber } = req.body;
    const restaurant = await Restaurant.findOne({ _id: restaurantId, isDeleted: false});
    
    let stateReservation = 'pending';
    const isStaff = (userRole === 'owner' || userRole === 'operator');
    const isOperatorOfDestination = isStaff && staffRestaurantId && (staffRestaurantId.toString() === restaurantId.toString());

    if (isOperatorOfDestination) {
        stateReservation = 'confirmed';
    }
    const reservation = new Reservation({
        userId,
        restaurantId,
        dateReservation,
        time,
        numberOfGuests,
        customerName,
        phoneNumber,
        state: stateReservation
    })
    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
})

const getReservationsToUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const reservations = await Reservation.find({ userId })
        .sort({ dateReservation: -1 })
        .populate('restaurantId', 'name');
    if (!reservations || reservations.length === 0) {
        res.status(404);
        throw new Error('There are no reservations for this user');
    }
    res.status(200).json(reservations); 
})

const getReservationsToRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const { state } = req.query;
    let query = { 
        restaurantId 
    };
    if (state) {
        query.state = state;
    }
    const reservations = await Reservation.find(query)
        .sort({ dateReservation: 1, time: 1 }) 
        .populate('userId', 'customerName phoneNumber'); 

    res.status(200).json(reservations);
});

const confirmReservation = asyncHandler(async (req, res) => {
    const reservationId = req.params.reservationId;
    const reservation = await Reservation.findOneAndUpdate(
        { 
            _id: reservationId, 
            state: 'pending' 
        },
        { 
            state: 'confirmed' 
        },
        { new: true, runValidators: true } 
    );

    if (!reservation) {
        res.status(404);
        throw new Error('Reservation not found or cannot be confirmed (must be pending).');
    }

    res.status(200).json({ message: 'Reservation successfully confirmed.', reservation });
});

const rejectReservation = asyncHandler(async (req, res) => {
    const reservationId = req.params.reservationId;
    const reservation = await Reservation.findOneAndUpdate(
        {
            _id: reservationId,
            state: 'pending'
        },
        {
            state: 'rejected',
        },
        { new: true, runValidators: true }
    );
    if (!reservation) {
        res.status(404);
        throw new Error('Reservation not found or cannot be rejected (must be pending).');
    }
    res.status(200).json({ 
        message: 'Reservation rejected successfully.', 
        reservation: reservation
    });
});

const cancelReservation = asyncHandler(async (req, res) => {
    const reservationId = req.params.reservationId;
    const userId = req.user._id;
    const reservation = await Reservation.findById(reservationId).select('userId restaurantId state');
    if (!reservation) {
        res.status(400);
        throw new Error('Reservation not found');
    }
    if (!userId) {
        res.status(400);
        throw new Error('User not found');
    }
    
    const isCustomerOwner = String(reservation.userId) === String(userId);
    const isRestaurantStaff = (req.user.role === 'owner' || req.user.role === 'operator') && (String(req.user.restaurantId) === String(reservation.restaurantId));
    if (!isRestaurantStaff && !isCustomerOwner) {
        res.status(403);
        throw new Error('You do not have permission to cancel this reservation.');
    }
    if (reservation.state === 'completed' || reservation.state === 'cancelled') {
        res.status(400);
        throw new Error(`Reservation is already ${reservation.state}.`);
    }
    const updatedReservation = await Reservation.findOneAndUpdate(
        {
            _id: reservationId,
        },
        { state: 'cancelled' },
        { new: true, runValidators: true }
    )

    res.status(200).json({ 
        message: 'Reservation cancelled successfully.', 
        reservation: updatedReservation
    });
})

const markAsCompleted = asyncHandler(async (req, res) => {
    const reservationId = req.params.reservationId;
    const reservation = await Reservation.findOneAndUpdate(
        {
            _id: reservationId,
            state: { $in: ['pending', 'confirmed'] }
        },
        { state: 'completed' },
        { new: true, runValidators: true }
    );

    if (!reservation) {
        res.status(404);
        throw new Error('Reservation not found or cannot be completed (must be confirmed).');
    }

    res.status(200).json({ message: 'Reservation successfully completed.', reservation });
});

export { createReservation, getReservationsToUser, getReservationsToRestaurant, confirmReservation, rejectReservation, cancelReservation, markAsCompleted };