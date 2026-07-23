// console.log("→ loading", __filename);
// const express = require("express");

// const router = express.Router();

// const {
//     getStatus
// } = require("../controllers/reconciliationController");

// router.get(
//     "/status",
//     getStatus
// );

// module.exports = router;

const express = require("express");

const router = express.Router();

// Controller
const reconciliationController = require("../controllers/reconciliationController");

// Authentication middleware
const authenticate = require("../middleware/authMiddleware");

// Role authorization middleware
const authorize = require("../middleware/roleMiddleware");

/*
    GET reconciliation status

    Allowed roles:
    - ADMIN
    - OPERATOR
    - VIEWER

    All authenticated users can monitor dashboard
*/

router.get(
  "/status",

  authenticate,

  authorize("ADMIN", "OPERATOR", "VIEWER"),

  reconciliationController.getStatus,
);

/*
    POST run reconciliation

    Allowed roles:
    - ADMIN
    - OPERATOR

    VIEWER cannot execute reconciliation
*/

router.post(
  "/run",

  authenticate,

  authorize("ADMIN", "OPERATOR"),

  reconciliationController.run,
);

module.exports = router;
