const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
require("dotenv").config();
const connectDB = require("./config/dbConfig");
const mongoose = require("mongoose");
const cors = require('cors');

connectDB();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/users", require("./routes/user"));
app.use("/api", require("./routes/api/transaction"));
app.use("/api", require("./routes/api/debt"));


const PORT = process.env.port || 3500;

mongoose.connection.once("open", () => {
  console.log("connected to MongoDB");
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
});
