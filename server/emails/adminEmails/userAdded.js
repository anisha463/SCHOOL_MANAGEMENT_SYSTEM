const nodemailer = require("nodemailer");
require("dotenv").config();

async function userAdded(to, subject, html) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.useraddedMail,
      pass: process.env.useraddedMailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },

    // secure: false, // true for 465, false for other ports
  });

  // send mail with defined transport object
  let info = {
    from: `"Web Accounts" ${process.env.useraddedMail}`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html,
  };

  await transporter.sendMail(info, function (err, data) {
    if (err) {
      console.log("an error ocured:", err.message);
    } else {
      console.log("Mail was sent successfully");
    }
  });
}
module.exports = userAdded;
