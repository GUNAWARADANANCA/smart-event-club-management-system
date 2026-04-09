const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// CREATE feedback
router.post("/", async (req, res) => {
  try {
    const { name, rating, category, subject, message } = req.body;

    if (!rating || !category || !subject || !message) {
      return res.status(400).json({
        message: "Rating, category, subject, and message are required",
      });
    }

    const feedback = new Feedback({
      name: name?.trim() || "Anonymous",
      rating,
      category,
      subject,
      message,
    });

    const savedFeedback = await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: savedFeedback,
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({
      message: "Failed to submit feedback",
    });
  }
});

// GET all feedbacks
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Feedbacks fetched successfully",
      feedbacks,
    });
  } catch (error) {
    console.error("Get feedbacks error:", error);
    res.status(500).json({
      message: "Failed to fetch feedbacks",
    });
  }
});

// GET feedback stats
router.get("/stats", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    const totalFeedbacks = feedbacks.length;

    const averageRating =
      totalFeedbacks > 0
        ? (
            feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalFeedbacks
          ).toFixed(1)
        : "0.0";

    res.status(200).json({
      totalFeedbacks,
      averageRating,
      responseRate: "100%",
    });
  } catch (error) {
    console.error("Get feedback stats error:", error);
    res.status(500).json({
      message: "Failed to fetch feedback stats",
    });
  }
});

// GET single feedback by id
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      feedback,
    });
  } catch (error) {
    console.error("Get single feedback error:", error);
    res.status(500).json({
      message: "Failed to fetch feedback",
    });
  }
});

module.exports = router;