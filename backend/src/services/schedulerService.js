const scheduleRepository =
    require("../repositories/scheduleRepository");

const getSchedule = async () => {
    return await scheduleRepository.getSchedule();
};

const updateSchedule = async (data) => {
    await scheduleRepository.updateSchedule(data);

    return {
        message: "Schedule updated successfully"
    };
};

module.exports = {
    getSchedule,
    updateSchedule
};