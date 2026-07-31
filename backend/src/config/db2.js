const ibmdb = require("ibm_db");

const connectDB2 = async () => {
  const connectionString =
    `DATABASE=${process.env.DB2_DATABASE};` +
    `HOSTNAME=${process.env.DB2_HOST};` +
    `PORT=${process.env.DB2_PORT};` +
    `PROTOCOL=TCPIP;` +
    `UID=${process.env.DB2_USER};` +
    `PWD=${process.env.DB2_PASSWORD};`;

  console.log("DB2 connection:");
  console.log("Host:", process.env.DB2_HOST);
  console.log("Port:", process.env.DB2_PORT);
  console.log("Database:", process.env.DB2_DATABASE);
  console.log("User:", process.env.DB2_USER);

  try {
    const connection = await ibmdb.open(connectionString);

    console.log("DB2 Database Connected Successfully");

    return connection;
  } catch (error) {
    console.error("DB2 Connection Failed:");
    console.error(error);

    throw error;
  }
};

module.exports = connectDB2;
