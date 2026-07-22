// require("dotenv").config();

// const connectOracle = require("./src/config/oracle");

// async function test() {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//             SELECT SYSDATE
//             FROM DUAL
//             `,
//   );

//   console.log(result.rows);

//   await connection.close();
// }

// test();
require("dotenv").config();

const connectOracle = require("./src/config/oracle");

async function test() {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
            SELECT 
                COUNT(*) AS TOTAL_ROWS
            FROM TESTUSER.DEPOSIT_SUMMARY
            `,
  );

  console.log(result.rows);

  await connection.close();
}

test();
