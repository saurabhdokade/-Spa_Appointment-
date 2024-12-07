const fs = require('fs');
const Appointment = require('../models/appointmentModel');

// Function to save appointments to a text file
const saveAppointmentsToFile = (appointments) => {
  const data = JSON.stringify(appointments, null, 2); // Format data with 2 spaces
  fs.writeFileSync('appointments.txt', data, 'utf8');
};

// Function to load appointments from the text file
const loadAppointmentsFromFile = () => {
  try {
    const data = fs.readFileSync('appointments.txt', 'utf8');
    return JSON.parse(data); // Parse the data as JSON
  } catch (error) {
    return []; // Return an empty array if no file exists or error occurs
  }
};

// Create or modify an appointment
const bookOrModifyAppointment = async (req, res) => {
  const { name, phone, service, time, date, notes } = req.body;

  try {
    // Check if the appointment already exists in MongoDB
    let existingAppointment = await Appointment.findOne({ phone });

    if (existingAppointment) {
      // Modify the existing appointment
      existingAppointment.name = name;
      existingAppointment.service = service;
      existingAppointment.time = time;
      existingAppointment.date = date;
      existingAppointment.notes = notes;

      // Save updated appointment in MongoDB
      await existingAppointment.save();

      // Also save updated appointments in the text file
      const appointmentsFromFile = loadAppointmentsFromFile();
      const index = appointmentsFromFile.findIndex((appointment) => appointment.phone === phone);
      if (index !== -1) {
        appointmentsFromFile[index] = { name, phone, service, time, date, notes };
      }
      saveAppointmentsToFile(appointmentsFromFile);

      return res.status(200).json({ message: 'Appointment modified successfully!' });
    }

    // If no existing appointment, create a new one
    const newAppointment = new Appointment({ name, phone, service, time, date, notes });
    await newAppointment.save();

    // Save the new appointment in both MongoDB and the text file
    const appointmentsFromFile = loadAppointmentsFromFile();
    appointmentsFromFile.push({ name, phone, service, time, date, notes });
    saveAppointmentsToFile(appointmentsFromFile);

    res.status(201).json({ newAppointment, message: 'Appointment booked successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  const { phone } = req.body;

  try {
    // Delete the appointment from MongoDB
    const result = await Appointment.findOneAndDelete({ phone });

    if (!result) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Remove the appointment from the text file
    const appointmentsFromFile = loadAppointmentsFromFile();
    const filteredAppointments = appointmentsFromFile.filter((appointment) => appointment.phone !== phone);
    saveAppointmentsToFile(filteredAppointments);

    res.status(200).json({ message: 'Appointment canceled successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  bookOrModifyAppointment,
  cancelAppointment,
};
