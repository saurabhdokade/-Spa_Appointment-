const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
     type: String,
     required: true
     },
  phone: {
     type: String,
     required: true,
     unique: true
     },
  service: { 
    type: String,
    required: true
 },
  time: {
     type: String,
     required: true
     },
  date: { 
    type: String,
    required: true },
  notes: {
     type: String
   },
},
 { 
    timestamps: true
 });

module.exports = mongoose.model('Appointment', appointmentSchema);
