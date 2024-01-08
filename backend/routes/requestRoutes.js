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

// Route for creating requests when games are added
router.post("/submit-request", upload.single("image"), async (req, res) => {
  try {
    const { title, site } = req.body;
    const existingRequest = await schemas.Request.findOne({ title });
    if (existingRequest) {
      return res
        .status(400)
        .send("A request with the same title already exists.");
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
    const newRequest = new schemas.Request({
      title,
      site,
      imageUrl: s3Url,
    });
    await newRequest.save();
    res.send("Request submitted");
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).send("Failed to submit request");
  }
});

// Route for deleting requests when they are denied
router.delete("/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const request = await schemas.Request.findOne({ title });
    if (!request) {
      return res.status(404).send(`Request with title ${title} not found`);
    }
    const s3Url = game.imageUrl;
    const s3Key = getS3KeyFromUrl(s3Url);
    await deleteS3Object(s3Key);
    await schemas.Request.deleteOne({ title });
    res.send(`Request with title ${title} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting request with title ${title}`, error);
    res.status(500).send(`Failed to delete request with  title ${title}`);
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
