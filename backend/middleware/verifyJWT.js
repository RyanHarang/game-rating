const jwt = require("jsonwebtoken");
const schemas = require("../models/schemas");
require("dotenv").config();

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // If no authorization header is present, continue to the next middleware
  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user in the database based on the decoded username and refresh token
    const user = await schemas.User.findOne({
      username: decoded.username,
      refreshToken: token,
    });

    // If the user is found, store the user data in the request and continue to the next middleware
    if (user) {
      req.user = user;
      return next();
    }

    // If the user is not found, return a 403 Forbidden response
    return res.sendStatus(403);
  } catch (err) {
    // If the token is invalid, return a 403 Forbidden response
    return res.sendStatus(403);
  }
};

module.exports = verifyJWT;
