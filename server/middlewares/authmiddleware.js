const jwt = require("jsonwebtoken");
const config = require("../config");

const authMiddleware = async (req, res, next) => {
  const bearerHeader = req.headers.authorization; // Bearer sdfasfasdasd
  if (!bearerHeader) {
    res.sendStatus(401);
    return;
  }

  const token = bearerHeader.replace("Bearer ", "");
  if (!token) {
    res.sendStatus(401);
    return;
  }

  console.log(token);

  try {
    jwt.verify(token, config.SECRET_KEY);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
    return;
  }

  next();
};

module.exports = authMiddleware;
