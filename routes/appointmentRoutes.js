const express = require('express');
const router = express.Router();
const { bookOrModifyAppointment, cancelAppointment } = require('../controllers/appointmentController');

// Route for booking or modifying an appointment
router.post('/submit-booking', bookOrModifyAppointment);

// Route for canceling an appointment
router.post('/cancel-appointment', cancelAppointment);

module.exports = router;
