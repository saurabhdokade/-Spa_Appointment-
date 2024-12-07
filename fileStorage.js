const fs = require('fs');
const path = require('path');

// Define the path to the appointments.txt file
const appointmentsFilePath = path.join(__dirname, '../data/appointments.txt');

// Function to load appointments from the file
const loadAppointmentsFromFile = () => {
  try {
    const fileData = fs.readFileSync(appointmentsFilePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    // If the file does not exist or is empty, return an empty array
    return [];
  }
};

// Function to save appointments to the file
const saveAppointmentsToFile = (appointments) => {
  try {
    const data = JSON.stringify(appointments, null, 2); // Pretty print with 2 spaces
    fs.writeFileSync(appointmentsFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving appointments to file:', error);
  }
};

module.exports = {
  loadAppointmentsFromFile,
  saveAppointmentsToFile
};
