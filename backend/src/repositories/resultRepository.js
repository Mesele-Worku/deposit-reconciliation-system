// const connectOracle = require("../config/oracle");

// const saveResult = async (data) => {
//   const connection = await connectOracle();

//   await connection.execute(
//     `
//         INSERT INTO APP_USER.REC_RECONCILIATION_RESULT
//         (
//             RUN_ID,
//             RULE_NAME,
//             STATUS,
//             EXPECTED_VALUE,
//             ACTUAL_VALUE,
//             DIFFERENCE,
//             MESSAGE
//         )
//         VALUES
//         (
//             :runId,
//             :ruleName,
//             :status,
//             :expected,
//             :actual,
//             :difference,
//             :message
//         )
//         `,

//     {
//       runId: data.runId,

//       ruleName: data.ruleName,

//       status: data.status,

//       expected: data.expected,

//       actual: data.actual,

//       difference: data.difference,

//       message: data.message,
//     },

//     {
//       autoCommit: true,
//     },
//   );

//   await connection.close();
// };

// const getResultsByRun = async (runId) => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//             SELECT

//                 RULE_NAME AS NAME,

//                 STATUS,

//                 EXPECTED_VALUE,

//                 ACTUAL_VALUE,

//                 DIFFERENCE,

//                 MESSAGE

//             FROM APP_USER.REC_RECONCILIATION_RESULT

//             WHERE RUN_ID = :runId

//             ORDER BY RESULT_ID

//             `,

//     {
//       runId,
//     },

//     {
//       outFormat: require("oracledb").OUT_FORMAT_OBJECT,
//     },
//   );

//   await connection.close();

//   return result.rows;
// };

// module.exports = {
//   saveResult,

//   getResultsByRun,
// };

const connectOracle = require("../config/oracle");

const oracledb = require("oracledb");

const saveResult = async (data) => {
  const connection = await connectOracle();

  try {
    await connection.execute(
      `
            INSERT INTO APP_USER.REC_RECONCILIATION_RESULT
            (
                RUN_ID,
                RULE_NAME,
                STATUS,
                EXPECTED_VALUE,
                ACTUAL_VALUE,
                DIFFERENCE,
                MESSAGE
            )
            VALUES
            (
                :runId,
                :ruleName,
                :status,
                :expected,
                :actual,
                :difference,
                :message
            )
            `,
      {
        runId: data.runId,

        ruleName: data.ruleName,

        status: data.status,

        expected: data.expected,

        actual: data.actual,

        difference: data.difference,

        message: data.message,
      },
      {
        autoCommit: true,
      },
    );
  } finally {
    await connection.close();
  }
};

const getResultsByRun = async (runId) => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
                SELECT

                    RESULT_ID,

                    RULE_NAME AS NAME,

                    STATUS,

                    EXPECTED_VALUE,

                    ACTUAL_VALUE,

                    DIFFERENCE,

                    MESSAGE

                FROM APP_USER.REC_RECONCILIATION_RESULT

                WHERE RUN_ID = :runId

                ORDER BY RESULT_ID
                `,
      {
        runId,
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return result.rows;
  } finally {
    await connection.close();
  }
};

module.exports = {
  saveResult,

  getResultsByRun,
};
