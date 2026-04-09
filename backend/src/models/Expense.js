const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
      trim: true,
    },
    item: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
