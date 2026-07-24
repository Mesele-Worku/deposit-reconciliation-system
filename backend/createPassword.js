const bcrypt = require("bcrypt");

const createHash = async () => {
  const password = "DM2112+++";

  const hash = await bcrypt.hash(password, 10);

  console.log(hash);
};

createHash();
