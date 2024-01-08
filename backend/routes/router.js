const express = require("express");
const router = express.Router();

const gameRoutes = require("./gameRoutes");
const userRoutes = require("./userRoutes");
const ratingRoutes = require("./ratingRoutes");
const requestRoutes = require("./requestRoutes");
router.use("/users", userRoutes);
router.use("/games", gameRoutes);
router.use("/ratings", ratingRoutes);
router.use("/requests", requestRoutes);

module.exports = router;
