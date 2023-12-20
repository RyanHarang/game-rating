const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  entryDate: { type: Date, default: Date.now },
});

const ratingSchema = new Schema({
  username: { type: String, required: true },
  game: { type: String, required: true },
  score: { type: Number, required: true },
  entryDate: { type: Date, default: Date.now },
});
// name, schema, database
const User = mongoose.model("User", userSchema, "users");
const Rating = mongoose.model("Rating", ratingSchema, "rating_form");
const mySchemas = { User: User, Rating: Rating };

module.exports = mySchemas;
