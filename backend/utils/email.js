// const nodemailer = require("nodemailer");

// const sendEmail = async ({ to, subject, text, html }) => {
//   const transporter = nodemailer.createTransport({
//     host: "mail.awashbank.com",

//     port: 25,

//     secure: false,

//     family: 4,

//     // dns: {
//     //   family: 4,
//     // },

//     auth: {
//       user: process.env.EMAIL_USER,

//       pass: process.env.EMAIL_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

//   const result = await transporter.sendMail({
//     from: from || process.env.EMAIL_FROM,

//     to,

//     subject,

//     text,

//     html,
//   });

//   console.log("Email sent:", result.messageId);

//   return result;
// };

// module.exports = {
//   sendEmail,
// };

const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: "mail.awashbank.com",
    port: 25,
    secure: false,
    family: 4,

    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASSWORD,
    // },

    tls: {
      rejectUnauthorized: false,
    },
  });

  const result = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
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
