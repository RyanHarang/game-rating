const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const schemas = require("../models/schemas");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await schemas.User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", user: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:username", async (req, res) => {
  const username = req.params.username;
  try {
    await schemas.User.deleteOne({ username });
    await schemas.Rating.deleteMany({ username });
    res.send("User and associated ratings deleted successfully");
  } catch (error) {
    console.error("Error deleting user and associated ratings:", error);
    res.status(500).send("Failed to delete user and associated ratings");
  }
});

router.post("/upload-user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await schemas.User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new schemas.User({ username, password: hashedPassword });
    await newUser.save();
    res.send("Registered");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Failed to register");
  }
});

router.get("/all-users", async (req, res) => {
  try {
    const users = await schemas.User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).send("Failed to fetch all users");
  }
});

module.exports = router;
