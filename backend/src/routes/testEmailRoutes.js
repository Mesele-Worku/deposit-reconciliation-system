const router = require("express").Router();

const controller = require("../controllers/testEmailController");

router.post("/email", controller.sendTestEmail);

module.exports = router;
