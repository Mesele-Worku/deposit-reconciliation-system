const express = require("express");

const router = express.Router();

const controller = require("../controllers/notificationController");

router.get("/config", controller.getConfig);

router.put("/config", controller.updateConfig);

router.get("/history", controller.getHistory);

module.exports = router;
