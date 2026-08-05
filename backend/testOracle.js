require("dotenv").config();

const connectOracle = require("./src/config/oracle");

async function test() {
  let connection;

  try {
    connection = await connectOracle();
    // DELETE FROM APP_USER.REC_RECONCILIATION_RUN WHERE RUN_ID IN (207, 173)
    const sql = `
      
      DELETE FROM APP_USER.REC_RECONCILIATION_RUN WHERE RUN_ID IN (211)
    `;

    const result = await connection.execute(sql, [], {
      autoCommit: true,
    });

    console.log(`${result.rowsAffected} rows deleted.`);
  } catch (error) {
    console.error("DELETE FAILED:");
    console.error(error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

test();
