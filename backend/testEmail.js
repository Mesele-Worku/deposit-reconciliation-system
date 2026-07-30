require("dotenv").config();

const { sendEmail } = require("./utils/email");

async function testEmail() {
  try {
    await sendEmail({
      to: "receiver@gmail.com",
      subject: "Testing Nodemailer",
      text: "This is a test email from Node.js",
      html: `
                <h2>Email Test</h2>
                <p>Nodemailer is working successfully.</p>
            `,
    });

    console.log("Test completed");
  } catch (error) {
    console.error("Email error:", error.message);
  }
}

testEmail();
