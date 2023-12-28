const express = require("express");
const router = express.Router();
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const schemas = require("../models/schemas");
require("dotenv/config");

router.get("/game/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const game = await schemas.Game.findOne({ title: name });
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    const ratings = await schemas.Rating.find({ game: name });
    res.json({ game, ratings });
  } catch (error) {
    console.error("Error fetching game details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/games/:title", async (req, res) => {
  const title = req.params.title;
  try {
    await schemas.Game.deleteOne({ title });
    await schemas.Rating.deleteMany({ game: title });
    res.send("Game and associated ratings deleted successfully");
  } catch (error) {
    console.error("Error deleting game and associated ratings:", error);
    res.status(500).send("Failed to delete game and associated ratings");
  }
});

router.post("/rating", async (req, res) => {
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

const upload = multer({
  storage: multer.memoryStorage(),
});

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

router.post("/upload-s3", upload.single("image"), async (req, res) => {
  try {
    const { title, site } = req.body;
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    const webpData = await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toBuffer();
    const webpKey = `${timestamp}_${req.file.originalname.replace(
      /\.[^/.]+$/,
      ""
    )}.webp`;
    const params = {
      Bucket: bucketName,
      Key: webpKey,
      Body: webpData,
      ContentType: "image/webp",
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const s3Url = `https://${bucketName}.s3.amazonaws.com/${webpKey}`;
    const newGame = new schemas.Game({
      title,
      site,
      imageUrl: s3Url,
    });
    await newGame.save();
    res.send("Game added");
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).send("Failed to add game");
  }
});

router.get("/games", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const escapedSearchQuery = searchQuery.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const games = await schemas.Game.find({
      title: { $regex: new RegExp(escapedSearchQuery, "i") },
    });
    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).send("Failed to fetch games");
  }
});

router.get("/allUsers", async (req, res) => {
  try {
    const users = await schemas.User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).send("Failed to fetch all users");
  }
});

router.post("/users", async (req, res) => {
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

router.delete("/users/:username", async (req, res) => {
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

module.exports = router;
