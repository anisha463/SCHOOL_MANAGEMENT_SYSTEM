const jwt = require("jsonwebtoken");
require("dotenv").config();

//this middleware will continue if the token is inside the local storage

module.exports = (req, res, next) => {
  // Get token from header
  const jwtToken = req.header("token");
  // Check if not token
  if (!jwtToken) {
    return res.json({ Status: false, code: 401, message: "Not Authorized" });
  }

  // Verify token
  try {
    //it is going to give use the user id (user:{id: user.id})
    const payload = jwt.verify(jwtToken, process.env.jwtTeacherSecret);
    req.user = payload.user;

    next();
  } catch (err) {
    console.log(err.message);

    return res.json({ Status: false, code: 401, message: "Invalid Token" });
  }
};
