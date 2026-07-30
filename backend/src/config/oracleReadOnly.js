const oracledb = require("oracledb");

const connectOracleReadOnly = async () => {
  try {
    console.log(process.env.R_ORACLE_PASSWORD);
    const connection = await oracledb.getConnection({
      user: process.env.R_ORACLE_USER,

      password: process.env.R_ORACLE_PASSWORD,

      connectString: `${process.env.R_ORACLE_HOST}:${process.env.R_ORACLE_PORT}/${process.env.R_ORACLE_SERVICE}`,
      // privilege: oracledb.SYSDBA,
    });

    console.log("Oracle Database Connected Successfully");

    return connection;
  } catch (error) {
    console.log("Oracle Connection Failed");

    console.error(error.message);

    throw error;
  }
};

module.exports = connectOracleReadOnly;
