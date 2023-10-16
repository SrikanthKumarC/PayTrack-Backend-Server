const User = require("./../model/User");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.status(200).send(await User.find());
});

module.exports = router;
