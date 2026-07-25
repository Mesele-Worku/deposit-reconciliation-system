const notificationService = require("../services/notificationConfigurationService");

const getConfig = async (req, res) => {
  try {
    const result = await notificationService.getConfig();

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// const updateConfig = async (req, res) => {
//   try {
//     const result = await notificationService.updateConfig(req.body);
//     console.log(req.body);
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
const updateConfig = async (req, res) => {
  try {
    console.log("RAW BODY:");
    console.log(req.body);

    const data = {
      configId: req.body.CONFIG_ID,

      emailEnabled: req.body.EMAIL_ENABLED,

      emailTo: req.body.EMAIL_TO,

      subject: req.body.SUBJECT,
    };

    console.log("Mapped Notification Data:");
    console.log(data);

    await notificationService.updateConfig(data);

    res.json({
      message: "Notification configuration updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const result = await notificationService.getHistory();

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getConfig,

  updateConfig,

  getHistory,
};
