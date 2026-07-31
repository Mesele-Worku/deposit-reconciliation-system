// require("dotenv").config();

// const { sendEmail } = require("./utils/email");

// async function testEmail() {
//   try {
//     await sendEmail({
//       to: "henokas@awashbank.com",
//       subject: "Testing Nodemailer",
//       text: "This is a test email from Node.js",
//       html: `
//                 <h2>Email Test</h2>
//                 <p>Hello Henok.</p>
//             `,
//     });

//     console.log("Test completed");
//   } catch (error) {
//     console.error("Email error:", error.message);
//   }
// }

// testEmail();

require("dotenv").config();

const { sendEmail } = require("./utils/email");

async function testEmail() {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASSWORD:",
      process.env.EMAIL_PASSWORD ? "PASSWORD EXISTS" : "PASSWORD MISSING",
    );
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
    await sendEmail({
      to: "henokas@awashbank.com",
      subject: "Testing Nodemailer",
      text: "This is a test email from Node.js",
      html: `
        <h2>Email Test</h2>
        <p>Hello Henok.</p>
      `,
    });

    console.log("Test completed");
  } catch (error) {
    console.error("Email error:", error.message);
  }
}

testEmail();
