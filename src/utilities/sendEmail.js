/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require("nodemailer");

const { SMTP_USER_NAME, SMTP_USER_PASSWORD } = require("../../secret");

const sendEmail = ({ to, text, subject }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER_NAME,
      pass: SMTP_USER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `E-commerce Business  <${SMTP_USER_NAME}>`,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
