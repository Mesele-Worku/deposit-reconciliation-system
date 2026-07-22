console.log("→ loading", __filename);
const express = require("express");

const router = express.Router();

const {
    getStatus
} = require("../controllers/reconciliationController");


router.get(
    "/status",
    getStatus
);


module.exports = router;