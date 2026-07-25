const scheduleRepository = require("../repositories/scheduleRepository");

const getSchedule = async () => {
  return await scheduleRepository.getSchedule();
};

const saveSchedule = async (data) => {
  return await scheduleRepository.saveSchedule(data);
};

module.exports = {
  getSchedule,
  saveSchedule,
};
