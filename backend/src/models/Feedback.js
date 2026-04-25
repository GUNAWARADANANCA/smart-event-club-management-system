const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "Anonymous" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: {
      type: String,
      required: true,
      enum: ["General", "Bug Report", "Feature Request", "UI/UX"],
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

    // --- Emotion analysis fields (populated by Claude after submission) ---
    emotionScore:    { type: Number, min: 0, max: 100, default: null },
    sentiment:       { type: String, enum: ["positive", "neutral", "negative", null], default: null },
    emotions: {
      joy:            Number,
      satisfaction:   Number,
      frustration:    Number,
      disappointment: Number,
      enthusiasm:     Number,
    },
    dominantEmotion: { type: String, default: null },
    emotionSummary:  { type: String, default: null },
    recommendation:  { type: String, enum: ["positive", "negative", null], default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);