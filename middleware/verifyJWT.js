const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const headers = req.headers["authorization"];
  if (!headers) return res.sendStatus(401);
  const token = headers.split(" ")[1];
  console.log(token);

  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Auth Failed!" });
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
