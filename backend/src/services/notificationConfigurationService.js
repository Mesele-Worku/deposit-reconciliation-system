const notificationRepository = require("../repositories/notificationRepository");

const getConfig = async () => {
  return await notificationRepository.getNotificationConfig();
};

const updateConfig = async (data) => {
  await notificationRepository.updateNotificationConfig(data);

  return {
    message: "Notification configuration updated successfully",
  };
};

const getHistory = async () => {
  return await notificationRepository.getNotificationHistory();
};

module.exports = {
  getConfig,

  updateConfig,

  getHistory,
};
