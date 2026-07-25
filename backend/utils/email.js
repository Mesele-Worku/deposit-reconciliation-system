const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    family: 4,

    auth: {
      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const result = await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to,

    subject,

    text,

    html,
  });

  console.log("Email sent:", result.messageId);

  return result;
};

module.exports = {
  sendEmail,
};
