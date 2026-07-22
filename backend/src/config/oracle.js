const oracledb = require("oracledb");

const connectOracle = async () => {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,

      password: process.env.ORACLE_PASSWORD,

      connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`,

      privilege: oracledb.SYSDBA,
    });

    console.log("Oracle Database Connected Successfully");

    return connection;
  } catch (error) {
    console.log("Oracle Connection Failed");

    console.error(error.message);

    throw error;
  }
};

module.exports = connectOracle;
