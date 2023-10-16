const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
require("dotenv").config();
const connectDB = require("./config/dbConfig");
const mongoose = require("mongoose");

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));

app.use(verifyJWT);

app.use("/users", require("./routes/user"));

const PORT = process.env.port || 3400;

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
});