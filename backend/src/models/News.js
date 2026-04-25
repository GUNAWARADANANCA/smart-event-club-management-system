const mongoose = require('mongoose');

const adminRoles = ['event_admin', 'finance_admin', 'news_admin']

const newsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Sports", "Academic", "Winning"],
      required: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    accent: {
      type: String,
      required: true,
      trim: true,
      default: "#4CAF50",
    },
    color: {
      type: String,
      required: true,
      trim: true,
      default: "from-[#4CAF50] to-[#2E7D32]",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);