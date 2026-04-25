const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 5000 },
    options: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 4 && arr.every((v) => String(v || '').trim().length > 0),
        message: 'Question options must have 4 non-empty values',
      },
    },
    correctAnswer: { type: Number, required: true, min: 1, max: 4 },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 500 },
    description: { type: String, default: '', trim: true, maxlength: 5000 },
    timeLimit: { type: Number, required: true, min: 1, max: 600 },
    eventId: { type: Number, required: true },
    closeDate: { type: String, default: null },
    questions: { type: [quizQuestionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);

