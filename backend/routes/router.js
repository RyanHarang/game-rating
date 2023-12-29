const express = require("express");
const router = express.Router();

const gameRoutes = require("./gameRoutes");
const userRoutes = require("./userRoutes");
const ratingRoutes = require("./ratingRoutes");
router.use("/users", userRoutes);
router.use("/games", gameRoutes);
router.use("/ratings", ratingRoutes);

module.exports = router;
