const authService = require("../services/authService");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = {
  login,
};
