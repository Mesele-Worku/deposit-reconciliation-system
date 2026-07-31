// const connectOracle = require("../config/oracle");

// const oracledb = require("oracledb");

// const saveDeposit = async ({
//   businessDate,
//   amount,
//   queryStartTime,
//   queryEndTime,
//   durationSeconds,
//   createdBy,
// }) => {
//   const connection = await connectOracle();

//   try {
//     await connection.execute(
//       `
//             INSERT INTO APP_USER.REC_DEPOSIT_CORE
//             (
//                 BUSINESS_DATE,
//                 DEPOSIT_AMOUNT,
//                 SOURCE_SYSTEM,
//                 STATUS,
//                 QUERY_START_TIME,
//                 QUERY_END_TIME,
//                 QUERY_DURATION_SECONDS,
//                 CREATED_BY
//             )
//             VALUES
//             (
//                 TO_DATE(:businessDate, 'YYYY-MM-DD'),
//                 :amount,
//                 'DB2',
//                 'SUCCESS',
//                 :queryStartTime,
//                 :queryEndTime,
//                 :durationSeconds,
//                 :createdBy
//             )
//             `,
//       {
//         businessDate,

//         amount: String(amount),

//         queryStartTime,

//         queryEndTime,

//         durationSeconds,

//         createdBy: createdBy || "SYSTEM",
//       },
//       {
//         autoCommit: true,
//       },
//     );

//     console.log("Core deposit saved to Oracle successfully");
//   } finally {
//     await connection.close();
//   }
// };

// const saveFailedDeposit = async ({
//   businessDate,
//   queryStartTime,
//   queryEndTime,
//   durationSeconds,
//   errorMessage,
//   createdBy,
// }) => {
//   const connection = await connectOracle();

//   try {
//     await connection.execute(
//       `
//             INSERT INTO APP_USER.REC_DEPOSIT_CORE
//             (
//                 BUSINESS_DATE,
//                 DEPOSIT_AMOUNT,
//                 SOURCE_SYSTEM,
//                 STATUS,
//                 QUERY_START_TIME,
//                 QUERY_END_TIME,
//                 QUERY_DURATION_SECONDS,
//                 CREATED_BY,
//                 ERROR_MESSAGE
//             )
//             VALUES
//             (
//                 TO_DATE(:businessDate, 'YYYY-MM-DD'),
//                 0,
//                 'DB2',
//                 'FAILED',
//                 :queryStartTime,
//                 :queryEndTime,
//                 :durationSeconds,
//                 :createdBy,
//                 :errorMessage
//             )
//             `,
//       {
//         businessDate,

//         queryStartTime,

//         queryEndTime,

//         durationSeconds,

//         createdBy: createdBy || "SYSTEM",

//         errorMessage: String(errorMessage).substring(0, 1000),
//       },
//       {
//         autoCommit: true,
//       },
//     );
//   } finally {
//     await connection.close();
//   }
// };

// const getLatestDeposit = async () => {
//   const connection = await connectOracle();

//   try {
//     const result = await connection.execute(
//       `
//             SELECT
//                 CORE_DEPOSIT_ID,
//                 BUSINESS_DATE,
//                 DEPOSIT_AMOUNT,
//                 SOURCE_SYSTEM,
//                 STATUS,
//                 QUERY_START_TIME,
//                 QUERY_END_TIME,
//                 QUERY_DURATION_SECONDS,
//                 CREATED_BY,
//                 CREATED_DATE,
//                 ERROR_MESSAGE

//             FROM APP_USER.REC_DEPOSIT_CORE

//             WHERE STATUS = 'SUCCESS'

//             ORDER BY
//                 CORE_DEPOSIT_ID DESC

//             FETCH FIRST 1 ROW ONLY
//             `,
//       [],
//       {
//         outFormat: oracledb.OUT_FORMAT_OBJECT,
//       },
//     );

//     return result.rows[0] || null;
//   } finally {
//     await connection.close();
//   }
// };

// const getDepositByBusinessDate = async (businessDate) => {
//   const connection = await connectOracle();

//   try {
//     const result = await connection.execute(
//       `
//             SELECT
//                 CORE_DEPOSIT_ID,
//                 BUSINESS_DATE,
//                 DEPOSIT_AMOUNT,
//                 SOURCE_SYSTEM,
//                 STATUS,
//                 QUERY_START_TIME,
//                 QUERY_END_TIME,
//                 QUERY_DURATION_SECONDS,
//                 CREATED_BY,
//                 CREATED_DATE,
//                 ERROR_MESSAGE

//             FROM APP_USER.REC_DEPOSIT_CORE

//             WHERE BUSINESS_DATE =
//                 TO_DATE(:businessDate, 'YYYY-MM-DD')

//             AND STATUS = 'SUCCESS'

//             ORDER BY
//                 CORE_DEPOSIT_ID DESC

//             FETCH FIRST 1 ROW ONLY
//             `,
//       {
//         businessDate,
//       },
//       {
//         outFormat: oracledb.OUT_FORMAT_OBJECT,
//       },
//     );

//     return result.rows[0] || null;
//   } finally {
//     await connection.close();
//   }
// };

// module.exports = {
//   saveDeposit,
//   saveFailedDeposit,
//   getLatestDeposit,
//   getDepositByBusinessDate,
// };

const connectOracle = require("../config/oracle");
const oracledb = require("oracledb");

/*
=========================================================
SAVE SUCCESSFUL CORE DEPOSIT SNAPSHOT
=========================================================
*/
const saveDeposit = async ({
  runId,
  businessDate,
  amount,
  queryStartTime,
  queryEndTime,
  durationSeconds,
  createdBy,
}) => {
  const connection = await connectOracle();

  try {
    await connection.execute(
      `
            INSERT INTO APP_USER.REC_DEPOSIT_CORE
            (
                RUN_ID,
                BUSINESS_DATE,
                DEPOSIT_AMOUNT,
                SOURCE_SYSTEM,
                CURRENCY_CODE,
                STATUS,
                QUERY_START_TIME,
                QUERY_END_TIME,
                QUERY_DURATION_SECONDS,
                CREATED_BY
            )
            VALUES
            (
                :runId,
                TO_DATE(:businessDate, 'YYYY-MM-DD'),
                :amount,
                'DB2',
                'ETB',
                'SUCCESS',
                :queryStartTime,
                :queryEndTime,
                :durationSeconds,
                :createdBy
            )
            `,
      {
        runId,

        businessDate,

        // Keep the full DB2 numeric value as a string
        // so Oracle receives the decimal value correctly.
        amount: String(amount),

        queryStartTime,

        queryEndTime,

        durationSeconds,

        createdBy: createdBy || "SYSTEM",
      },
      {
        autoCommit: true,
      },
    );

    console.log("Core deposit snapshot saved to Oracle successfully");
  } catch (error) {
    console.error("Failed to save core deposit snapshot:", error.message);

    throw error;
  } finally {
    await connection.close();
  }
};

/*
=========================================================
SAVE FAILED CORE DEPOSIT EXTRACTION
=========================================================
*/
const saveFailedDeposit = async ({
  runId,
  businessDate,
  queryStartTime,
  queryEndTime,
  durationSeconds,
  errorMessage,
  createdBy,
}) => {
  const connection = await connectOracle();

  try {
    await connection.execute(
      `
            INSERT INTO APP_USER.REC_DEPOSIT_CORE
            (
                RUN_ID,
                BUSINESS_DATE,
                DEPOSIT_AMOUNT,
                SOURCE_SYSTEM,
                CURRENCY_CODE,
                STATUS,
                QUERY_START_TIME,
                QUERY_END_TIME,
                QUERY_DURATION_SECONDS,
                CREATED_BY,
                ERROR_MESSAGE
            )
            VALUES
            (
                :runId,
                TO_DATE(:businessDate, 'YYYY-MM-DD'),
                0,
                'DB2',
                'ETB',
                'FAILED',
                :queryStartTime,
                :queryEndTime,
                :durationSeconds,
                :createdBy,
                :errorMessage
            )
            `,
      {
        runId,

        businessDate,

        queryStartTime,

        queryEndTime,

        durationSeconds,

        createdBy: createdBy || "SYSTEM",

        errorMessage: String(errorMessage || "").substring(0, 1000),
      },
      {
        autoCommit: true,
      },
    );

    console.log("Failed core deposit extraction saved to Oracle");
  } catch (error) {
    console.error("Failed to save failed core deposit:", error.message);

    throw error;
  } finally {
    await connection.close();
  }
};

/*
=========================================================
GET LATEST SUCCESSFUL CORE DEPOSIT
=========================================================
Used by Dashboard.

IMPORTANT:
This function DOES NOT execute DB2.
It only reads Oracle.
=========================================================
*/
const getLatestDeposit = async () => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
            SELECT
                CORE_DEPOSIT_ID,
                RUN_ID,
                BUSINESS_DATE,
                DEPOSIT_AMOUNT,
                SOURCE_SYSTEM,
                CURRENCY_CODE,
                STATUS,
                QUERY_START_TIME,
                QUERY_END_TIME,
                QUERY_DURATION_SECONDS,
                CREATED_BY,
                CREATED_DATE,
                ERROR_MESSAGE

            FROM APP_USER.REC_DEPOSIT_CORE

            WHERE STATUS = 'SUCCESS'

            ORDER BY CORE_DEPOSIT_ID DESC

            FETCH FIRST 1 ROW ONLY
            `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return result.rows[0] || null;
  } finally {
    await connection.close();
  }
};

/*
=========================================================
GET CORE DEPOSIT BY BUSINESS DATE
=========================================================
*/
const getDepositByBusinessDate = async (businessDate) => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
            SELECT
                CORE_DEPOSIT_ID,
                RUN_ID,
                BUSINESS_DATE,
                DEPOSIT_AMOUNT,
                SOURCE_SYSTEM,
                CURRENCY_CODE,
                STATUS,
                QUERY_START_TIME,
                QUERY_END_TIME,
                QUERY_DURATION_SECONDS,
                CREATED_BY,
                CREATED_DATE,
                ERROR_MESSAGE

            FROM APP_USER.REC_DEPOSIT_CORE

            WHERE BUSINESS_DATE =
                TO_DATE(:businessDate, 'YYYY-MM-DD')

            AND STATUS = 'SUCCESS'

            ORDER BY CORE_DEPOSIT_ID DESC

            FETCH FIRST 1 ROW ONLY
            `,
      {
        businessDate,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return result.rows[0] || null;
  } finally {
    await connection.close();
  }
};

/*
=========================================================
GET CORE DEPOSIT FOR A SPECIFIC RECONCILIATION RUN
=========================================================
*/
const getDepositByRunId = async (runId) => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
            SELECT
                CORE_DEPOSIT_ID,
                RUN_ID,
                BUSINESS_DATE,
                DEPOSIT_AMOUNT,
                SOURCE_SYSTEM,
                CURRENCY_CODE,
                STATUS,
                QUERY_START_TIME,
                QUERY_END_TIME,
                QUERY_DURATION_SECONDS,
                CREATED_BY,
                CREATED_DATE,
                ERROR_MESSAGE

            FROM APP_USER.REC_DEPOSIT_CORE

            WHERE RUN_ID = :runId

            ORDER BY CORE_DEPOSIT_ID DESC

            FETCH FIRST 1 ROW ONLY
            `,
      {
        runId,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return result.rows[0] || null;
  } finally {
    await connection.close();
  }
};

module.exports = {
  saveDeposit,
  saveFailedDeposit,
  getLatestDeposit,
  getDepositByBusinessDate,
  getDepositByRunId,
};
