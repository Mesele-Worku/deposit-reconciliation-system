// const express = require("express");


// const router = express.Router();


// const controller =
//     require("../controllers/scheduleController");



// const authenticate =
//     require("../middleware/authMiddleware");


// const authorize =
//     require("../middleware/roleMiddleware");





// router.get(
//     "/",
//     authenticate,
//     controller.getSchedule
// );





// router.put(
//     "/",
//     authenticate,

//     authorize(
//         "ADMIN"
//     ),

//     controller.updateSchedule
// );




// module.exports = router;


const express = require("express");

const router = express.Router();

const scheduleController =
    require("../controllers/scheduleController");

router.get(
    "/",
    scheduleController.getSchedule
);

router.put(
    "/",
    scheduleController.updateSchedule
);

module.exports = router;