const express = require("express");
const router = express.Router();
const schemas = require("../models/schemas");

router.post("/rating", async (req, res) => {
  try {
    const { username, game, score } = req.body;
    const newRating = new schemas.Rating({ username, game, score });
    await newRating.save();
    res.send("Rating sent");
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).send("Failed to send rating");
  }
});

router.post("/games", async (req, res) => {
  try {
    const { title, site, image } = req.body;
    const newGame = new schemas.Game({ title, site, image });
    await newGame.save();
    res.send("Game added");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Failed to add game");
  }
});

router.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new schemas.User({ username, password });
    await newUser.save();
    res.send("Registered");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Failed to register");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await schemas.User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = password !== "" && password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
