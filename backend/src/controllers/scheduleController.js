// const scheduleRepository =
//     require("../repositories/scheduleRepository");





// const getSchedule = async (req, res) => {


//     try {


//         const data =
//             await scheduleRepository.getActiveSchedule();



//         res.json(data);


//     }

//     catch (error) {


//         res.status(500)
//             .json({

//                 message: error.message

//             });


//     }

// };






// const updateSchedule = async (req, res) => {


//     try {


//         await scheduleRepository.updateSchedule(
//             req.body
//         );



//         res.json({

//             message:
//                 "Schedule updated successfully"

//         });


//     }

//     catch (error) {


//         res.status(500)
//             .json({

//                 message: error.message

//             });


//     }


// };




// module.exports = {
//     getSchedule,
//     updateSchedule
// };

const schedulerService =
    require("../services/schedulerService");

const getSchedule = async (req, res) => {
    try {
        const schedule =
            await schedulerService.getSchedule();

        res.json(schedule);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const updateSchedule = async (req, res) => {
    try {

        const result =
            await schedulerService.updateSchedule(req.body);

        res.json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getSchedule,
    updateSchedule
};