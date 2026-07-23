// // const bcrypt = require("bcrypt");

// // const userRepository = require("../repositories/userRepository");

// // const getUsers = async () => {
// //   return await userRepository.getUsers();
// // };

// // const createUser = async (data) => {
// //   const hash = await bcrypt.hash(data.password, 10);

// //   await userRepository.createUser({
// //     username: data.username,

// //     passwordHash: hash,

// //     fullName: data.fullName,

// //     role: data.role,
// //   });
// // };

// // const changeStatus = async (id, status) => {
// //   return await userRepository.updateStatus(id, status);
// // };

// // module.exports = {
// //   getUsers,

// //   createUser,

// //   changeStatus,
// // };

// const bcrypt = require("bcrypt");

// const userRepository = require("../repositories/userRepository");

// const getUsers = async (search) => {
//   return await userRepository.getUsers(search);
// };

// const createUser = async (data) => {
//   const hash = await bcrypt.hash(data.password, 10);

//   await userRepository.createUser({
//     username: data.username,

//     passwordHash: hash,

//     fullName: data.fullName,

//     role: data.role,
//   });
// };

// const getUserById = async (id) => {
//   return await userRepository.getUserById(id);
// };

// const updateUser = async (id, data) => {
//   return await userRepository.updateUser(id, data);
// };

// const changeStatus = async (id, status, loggedInUser) => {
//   // Get target user
//   const targetUser = await userRepository.getUserById(id);

//   // Prevent user disabling himself

//   if (status === "INACTIVE" && targetUser.USERNAME === loggedInUser.username) {
//     throw new Error("Cannot deactivate your own account");
//   }

//   // Prevent disabling last ADMIN

//   if (status === "INACTIVE" && targetUser.ROLE === "ADMIN") {
//     const admins = await userRepository.getActiveAdmins();

//     if (admins.length <= 1) {
//       throw new Error("Cannot deactivate the last active ADMIN");
//     }
//   }

//   return await userRepository.updateStatus(id, status);
// };

// const resetPassword = async (id, password) => {
//   const hash = await bcrypt.hash(password, 10);

//   return await userRepository.resetPassword(id, hash);
// };

// module.exports = {
//   getUsers,

//   createUser,

//   getUserById,

//   updateUser,

//   changeStatus,

//   resetPassword,
// };

const bcrypt = require("bcrypt");

const userRepository = require("../repositories/userRepository");

// Get all users

const getUsers = async (search) => {
  return await userRepository.getUsers(search);
};

// Get single user

const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

// Create User

const createUser = async (data) => {
  const hash = await bcrypt.hash(data.password, 10);

  await userRepository.createUser({
    username: data.username,

    passwordHash: hash,

    fullName: data.fullName,

    role: data.role,
  });
};

// Update user

const updateUser = async (id, data) => {
  return await userRepository.updateUser(id, data);
};

// Change user status

const changeStatus = async (id, status, loggedInUser) => {
  const targetUser = await userRepository.getUserById(id);

  if (!targetUser) {
    throw new Error("User not found");
  }

  // Prevent disabling yourself

  if (status === "INACTIVE" && targetUser.USERNAME === loggedInUser.username) {
    throw new Error("You cannot deactivate your own account");
  }

  // Prevent disabling last ADMIN

  if (status === "INACTIVE" && targetUser.ROLE === "ADMIN") {
    const admins = await userRepository.getActiveAdmins();

    if (admins.length <= 1) {
      throw new Error("Cannot deactivate the last active ADMIN");
    }
  }

  return await userRepository.updateStatus(id, status);
};

// Reset password

const resetPassword = async (id, password) => {
  const hash = await bcrypt.hash(password, 10);

  return await userRepository.resetPassword(id, hash);
};

module.exports = {
  getUsers,

  getUserById,

  createUser,

  updateUser,

  changeStatus,

  resetPassword,
};
