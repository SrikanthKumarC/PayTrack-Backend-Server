const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const headers = req.headers["authorization"];
  if (!headers) return res.status(401).json({ message: "Unauthorized access" });
  const token = headers.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Auth Failed!" });
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
