const oracledb = require("oracledb");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function executeSQL(fileName) {
  const connection = await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
  });

  try {
    console.log(`Running ${fileName}...`);

    const sql = fs.readFileSync(
      path.join(__dirname, "../database", fileName),
      "utf8",
    );

    // Split SQL script on "/" lines (Oracle script separator)
    const statements = sql
      .split(/^\s*\/\s*$/gm)
      .map((s) => s.trim())
      .filter((s) => s.length);

    for (const statement of statements) {
      await connection.execute(statement);
    }

    await connection.commit();
    console.log(`${fileName} completed.`);
  } finally {
    await connection.close();
  }
}

async function run() {
  try {
    await executeSQL("01_create_tables.sql");
    await executeSQL("02_insert_sample_data.sql");
    await executeSQL("03_create_views.sql");
    await executeSQL("04_create_indexes.sql");

    console.log("Database setup completed successfully.");
  } catch (err) {
    console.error("Database setup failed:");
    console.error(err);
  }
}

run();
