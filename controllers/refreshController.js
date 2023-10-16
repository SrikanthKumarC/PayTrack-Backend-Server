const User = require("../model/User");
const jwt = require("jsonwebtoken");
const refreshTokenHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Error JWT" });
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.status(403)

    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_SECRET,
      { expiresIn: "30s" }
    );

    res.json({ accessToken });
  });
};

module.exports = {refreshTokenHandler};
