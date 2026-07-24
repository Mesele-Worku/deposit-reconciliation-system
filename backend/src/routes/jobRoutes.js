const express = require("express");


const router =
    express.Router();


const controller =
    require("../controllers/jobController");


const authenticate =
    require("../middleware/authMiddleware");



router.get(
    "/",
    authenticate,
    controller.getJobs
);



module.exports = router;