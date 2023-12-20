const express = require("express");
const router = express.Router();
const schemas = require("../models/schemas");
const jwt = require("jsonwebtoken");
require("dotenv/config");

router.post("/rating", async (req, res) => {
  try {
    const { username, game, score } = req.body;
    const newRating = new schemas.Rating({ username, game, score });
    await newRating.save();
    res.send("Rating sent!");
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).send("Failed to send rating.");
  }
});

router.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new schemas.User({ username, password });
    await newUser.save();
    res.send("Registered!");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Failed to register.");
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
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "35d" }
    );
    await schemas.User.updateOne({ _id: user._id }, { refreshToken });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 35 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
