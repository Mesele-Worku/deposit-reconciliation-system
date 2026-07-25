const email = require("../../utils/email");

const sendTestEmail = async (req, res) => {
  try {
    await email.sendEmail({
      to: req.body.email,

      subject: "EDRMS Test Email",

      text: "Email configuration is working",
    });

    res.json({
      message: "Test email sent",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendTestEmail,
};
