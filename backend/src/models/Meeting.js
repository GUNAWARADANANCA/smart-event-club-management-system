const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    accessType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: 'Upcoming',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meeting', meetingSchema);
