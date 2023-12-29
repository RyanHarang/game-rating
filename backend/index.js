const express = require("express");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const router = require("./routes/router");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.options("*", cors(corsOptions));
app.use(compression());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
