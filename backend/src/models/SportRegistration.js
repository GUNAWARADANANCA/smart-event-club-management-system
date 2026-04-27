const mongoose = require('mongoose');

const sportRegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  scheduledDate: {
    type: String,
  },
  scheduledTime: {
    type: String,
  },
});

module.exports = mongoose.model('SportRegistration', sportRegistrationSchema);
