const express = require("express");
const router = express.Router();
const schemas = require("../models/schemas");

router.post("/upload-rating", async (req, res) => {
  try {
    const { username, game, score } = req.body;
    const existingRating = await schemas.Rating.findOne({ username, game });
    if (existingRating) {
      existingRating.score = score;
      await existingRating.save();
      res.send("Rating updated");
    } else {
      const newRating = new schemas.Rating({ username, game, score });
      await newRating.save();
      res.send("Rating submitted");
    }
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).send("Failed to send rating");
  }
});

module.exports = router;
