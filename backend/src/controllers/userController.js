// // const userService = require("../services/userService");

// // const getUsers = async (req, res) => {
// //   try {
// //     const users = await userService.getUsers();

// //     res.json(users);
// //   } catch (error) {
// //     res.status(500).json({
// //       message: error.message,
// //     });
// //   }
// // };

// // const createUser = async (req, res) => {
// //   try {
// //     await userService.createUser(req.body);

// //     res.json({
// //       message: "User created successfully",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       message: error.message,
// //     });
// //   }
// // };

// // const updateStatus = async (req, res) => {
// //   try {
// //     await userService.changeStatus(
// //       req.params.id,

// //       req.body.status,
// //     );

// //     res.json({
// //       message: "User status updated",
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       message: error.message,
// //     });
// //   }
// // };

// // module.exports = {
// //   getUsers,

// //   createUser,

// //   updateStatus,
// // };

// const userService = require("../services/userService");

// const getUsers = async (req, res) => {
//   try {
//     const users = await userService.getUsers(req.query.search || "");

//     res.json(users);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const createUser = async (req, res) => {
//   try {
//     await userService.createUser(req.body);

//     res.json({
//       message: "User created successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     const user = await userService.getUserById(req.params.id);

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     await userService.updateUser(req.params.id, req.body);

//     res.json({
//       message: "User updated successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const updateStatus = async (req, res) => {
//   try {
//     await userService.changeStatus(
//       req.params.id,

//       req.body.status,
//     );

//     res.json({
//       message: "Status updated",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const resetPassword = async (req, res) => {
//   try {
//     await userService.resetPassword(
//       req.params.id,

//       req.body.password,
//     );

//     res.json({
//       message: "Password reset successful",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// module.exports = {
//   getUsers,

//   createUser,

//   getUserById,

//   updateUser,

//   updateStatus,

//   resetPassword,
// };

const userService = require("../services/userService");

// Get users

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers(req.query.search || "");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user by id

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create User
const createUser = async (req, res) => {
  try {
    await userService.createUser(req.body);

    res.json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update user

const updateUser = async (req, res) => {
  try {
    await userService.updateUser(
      req.params.id,

      req.body,
    );

    res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Activate / Deactivate user

const updateStatus = async (req, res) => {
  try {
    await userService.changeStatus(
      req.params.id,

      req.body.status,

      req.user,
    );

    res.json({
      message: "User status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Reset password

const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(
      req.params.id,

      req.body.password,
    );

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,

  getUserById,

  createUser,

  updateUser,

  updateStatus,

  resetPassword,
};
