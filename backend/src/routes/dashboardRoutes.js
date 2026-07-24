// const express =
//     require("express");


// const router =
//     express.Router();


// const controller =
//     require("../controllers/dashboardController");



// router.get(

//     "/status",

//     controller.getDashboard

// );



// module.exports = router;


const express = require("express");

const router = express.Router();


const dashboardController =
    require("../controllers/dashboardController");



router.get(
    "/status",
    dashboardController.getStatus
);



module.exports = router;