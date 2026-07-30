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

const connectOracle = require("./src/config/oracleReadOnly");

async function test() {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
            SELECT

*

FROM CBS.REC_DEPOSIT_SUMMARY_RECONCILATION

ORDER BY BUSINESS_DATE DESC

FETCH FIRST 1 ROW ONLY

            `,
  );

  console.log(result.rows);

  await connection.close();
}

test();
