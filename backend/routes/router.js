const express = require("express");
const router = express.Router();
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
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
    const uniqueKey = `${timestamp}_${req.file.originalname}`;
    const params = {
      Bucket: bucketName,
      Key: uniqueKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const s3Url = `https://${bucketName}.s3.amazonaws.com/${uniqueKey}`;
    const newGame = new schemas.Game({
      title,
      site,
      imageUrl: s3Url,
    });
    await newGame.save();
    res.send("Game added");
  } catch (error) {
    console.error("Error adding game and uploading image to S3:", error);
    res.status(500).send("Failed to add game and upload image to S3");
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
    // const searchQuery = req.query.search || "";
    // const games = await schemas.Game.find({
    //   title: { $regex: new RegExp(searchQuery, "i") },
    // });
    res.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).send("Failed to fetch games");
  }
});

router.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new schemas.User({ username, password: hashedPassword });
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
