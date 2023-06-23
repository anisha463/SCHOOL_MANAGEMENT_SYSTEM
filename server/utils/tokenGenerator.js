const jwt = require("jsonwebtoken");
require("dotenv").config();

function tokenGenerator(id, jwtSecret) {
  const payload = {
    user: id,
  };
  return jwt.sign(payload, jwtSecret, { expiresIn: "1hr" });
}

module.exports = tokenGenerator;
