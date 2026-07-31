const express = require("express");

const router = express.Router();

const dashboardEventController = require(
    "../controllers/dashboardEventController"
);

// =====================================================
// SERVER-SENT EVENTS
// =====================================================

router.get(
    "/events",
    dashboardEventController.subscribe
);

module.exports = router;