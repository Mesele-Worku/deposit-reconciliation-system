const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/userRepository");

const login = async (username, password) => {
  const user = await userRepository.findByUsername(username);
  console.log("USER FROM DATABASE:");
  console.log(user);

  console.log("PASSWORD FROM REQUEST:");
  console.log(password);
  if (!user) {
    throw new Error("Invalid username or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.PASSWORD_HASH);

  if (!passwordMatch) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    {
      id: user.USER_ID,

      username: user.USERNAME,

      role: user.ROLE,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_EXPIRE,
    },
  );

  return {
    token,

    user: {
      username: user.USERNAME,

      name: user.FULL_NAME,

      role: user.ROLE,
    },
  };
};

module.exports = {
  login,
};
