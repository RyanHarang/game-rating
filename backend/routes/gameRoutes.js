const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const schemas = require("../models/schemas");
require("dotenv/config");

const upload = multer({
  storage: multer.memoryStorage(),
});

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

// Route for uploading games
router.post("/upload-game", upload.single("image"), async (req, res) => {
  try {
    const { title, site, imageUrl } = req.body;
    const existingGame = await schemas.Game.findOne({ title });
    if (existingGame) {
      return res.status(400).send("A game with the same title already exists.");
    }
    const newGame = new schemas.Game({
      title,
      site,
      imageUrl,
    });
    await newGame.save();
    res.send("Game added");
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).send("Failed to add game");
  }
});

// Route for filtering games
router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const currentUser = req.query.currentUser || "";
    let query = {};

    if (searchQuery) {
      const escapedSearchQuery = searchQuery.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      query.title = { $regex: new RegExp(escapedSearchQuery, "i") };
    }

    if (req.query.ratingFilter) {
      if (req.query.ratingFilter === "None") {
        const games = await schemas.Game.find(query).sort({ title: 1 });
        res.json(games);
      } else if (req.query.ratingFilter === "Ranked") {
        const aggregatePipeline = [
          {
            $match: query,
          },
          {
            $lookup: {
              from: "ratings",
              localField: "title",
              foreignField: "game",
              as: "ratings",
            },
          },
          {
            $unwind: "$ratings",
          },
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              site: { $first: "$site" },
              imageUrl: { $first: "$imageUrl" },
              avgRating: { $avg: "$ratings.score" },
            },
          },
          {
            $sort: { avgRating: -1 },
          },
        ];
        const games = await schemas.Game.aggregate(aggregatePipeline);
        res.json(games);
      } else {
        const ratedGames = await schemas.Rating.find({
          username: currentUser,
        }).distinct("game");
        if (!query.title) {
          query.title = {};
        }
        if (req.query.ratingFilter === "Rated") {
          query.title.$in = ratedGames;
        } else if (req.query.ratingFilter === "NotRated") {
          query.title.$nin = ratedGames;
        }

        const games = await schemas.Game.find(query).sort({ title: 1 });
        res.json(games);
      }
    }
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).send("Failed to fetch games");
  }
});

// Route for returning ratings for a game
router.get("/:name", async (req, res) => {
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

// Route for deleting games
router.delete("/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const game = await schemas.Game.findOne({ title });
    if (!game) {
      return res.status(404).send(`Game with title ${title} not found`);
    }
    const s3Url = game.imageUrl;
    const s3Key = getS3KeyFromUrl(s3Url);
    await deleteS3Object(s3Key);
    await schemas.Game.deleteOne({ title });
    await schemas.Rating.deleteMany({ game: title });
    res.send(
      `${title} and associated ratings, as well as S3 object, deleted successfully`
    );
  } catch (error) {
    console.error(`Error deleting ${title} and associated ratings:`, error);
    res.status(500).send(`Failed to delete ${title} and associated ratings`);
  }
});

// Route for updating games
router.put("/:title", upload.single("image"), async (req, res) => {
  const title = req.params.title;
  const newTitle = req.body.title;
  try {
    // Prevent games with duplicate names
    const existingGame = await schemas.Game.findOne({ title });
    if (!existingGame) {
      return res.status(404).send(`Game with title ${title} not found`);
    }
    const oldImageKey = getS3KeyFromUrl(existingGame.imageUrl);
    // If title is updated, update ratings as well with the new title
    if (title !== newTitle) {
      await schemas.Rating.updateMany(
        { game: title },
        { $set: { game: newTitle } }
      );
    }
    existingGame.title = newTitle || existingGame.title;
    existingGame.site = req.body.site || existingGame.site;
    if (req.file) {
      if (oldImageKey) {
        await deleteS3Object(oldImageKey);
      }
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
      const webpData = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();
      const webpKey = `${timestamp}_${req.file.originalname.replace(
        /\.[^/.]+$/,
        ""
      )}.webp`;

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: webpKey,
        Body: webpData,
        ContentType: "image/webp",
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);
      const s3Url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${webpKey}`;
      existingGame.imageUrl = s3Url;
    }
    await existingGame.save();
    res.send(`${title} updated successfully`);
  } catch (error) {
    console.error(`Error updating ${title}:`, error);
    res.status(500).send(`Failed to update ${title}`);
  }
});

// Additional methods for S3 behavior
function getS3KeyFromUrl(url) {
  try {
    const urlObject = new URL(url);
    return urlObject.pathname.substring(1);
  } catch (error) {
    console.error(`Error extracting S3 key from URL ${url}:`, error);
    throw error;
  }
}

async function deleteS3Object(key) {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
  });
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  };
  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    console.error(`Error deleting S3 object with key ${key}:`, error);
    throw error;
  }
}

module.exports = router;
