const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(401);

  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409);

  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await User.create({ username, password: hashedPassword });
  
  console.log(result);

  res.sendStatus(201);
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(400);

  const findUser = await User.findOne({ username: username }).exec();
  if (!findUser) return res.sendStatus(403);
  const match = await bcrypt.compare(password, findUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { username: findUser.username },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "30s",
      }
    );
    const refreshToken = jwt.sign(
      { username: findUser.username },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "1d",
      }
    );
    findUser.refreshToken = refreshToken;
    const result = await findUser.save();
    console.log(result, 'loggedin');
    res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "None", maxAge: 86400000});
    return res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ message: "login failed" });
  }
};

module.exports = { createUser, handleLogin };
