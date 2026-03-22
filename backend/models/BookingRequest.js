const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  buyer: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  parkingRequired: {
    type: Boolean,
    default: false,
  },
  parkingSlot: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);
