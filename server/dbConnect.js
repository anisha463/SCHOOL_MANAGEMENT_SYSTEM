const mysql = require("mysql");
require("dotenv").config();
// Create Connection

const db = mysql.createConnection({
  host: process.env.DB_URL,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected");
});

module.exports = db;
