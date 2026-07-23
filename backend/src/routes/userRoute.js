// const express = require("express");

// const router = express.Router();

// const controller = require("../controllers/userController");

// const authenticate = require("../middleware/authMiddleware");

// const authorize = require("../middleware/roleMiddleware");

// // View users

// router.get(
//   "/",

//   authenticate,

//   authorize("ADMIN"),

//   controller.getUsers,
// );

// // Create user

// router.post(
//   "/",

//   //   authenticate,

//   //   authorize("ADMIN"),

//   controller.createUser,
// );

// // Activate/deactivate

// router.put(
//   "/:id/status",

//   authenticate,

//   authorize("ADMIN"),

//   controller.updateStatus,
// );

// module.exports = router;

const express = require("express");

const router = express.Router();

const controller = require("../controllers/userController");

const authenticate = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

// ADMIN only

router.get("/", authenticate, authorize("ADMIN"), controller.getUsers);
// Create user

router.post(
  "/",

  //   authenticate,

  //   authorize("ADMIN"),

  controller.createUser,
);

router.get("/:id", authenticate, authorize("ADMIN"), controller.getUserById);

router.put("/:id", authenticate, authorize("ADMIN"), controller.updateUser);

router.put(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  controller.updateStatus,
);

router.put(
  "/:id/reset-password",
  authenticate,
  authorize("ADMIN"),
  controller.resetPassword,
);

module.exports = router;
