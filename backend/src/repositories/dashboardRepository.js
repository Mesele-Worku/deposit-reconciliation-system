// const connectOracle = require("../config/oracle");

// const oracledb = require("oracledb");

// /*
//     Latest reconciliation run
// */
// const getLatestRun = async () => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//             SELECT

//                 RUN_ID,

//                 BUSINESS_DATE,

//                 START_TIME,

//                 END_TIME,

//                 STATUS,

//                 CREATED_BY,

//                 CREATED_DATE

//             FROM APP_USER.REC_RECONCILIATION_RUN

//             ORDER BY RUN_ID DESC

//             FETCH FIRST 1 ROWS ONLY

//             `,

//     [],

//     {
//       outFormat: oracledb.OUT_FORMAT_OBJECT,
//     },
//   );

//   await connection.close();

//   return result.rows[0] || null;
// };

// /*
//     Scheduler information
// */
// const getScheduler = async () => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//             SELECT *

//             FROM APP_USER.REC_RECONCILIATION_SCHEDULE

//             WHERE STATUS='ACTIVE'

//             FETCH FIRST 1 ROWS ONLY

//             `,

//     [],

//     {
//       outFormat: oracledb.OUT_FORMAT_OBJECT,
//     },
//   );

//   await connection.close();

//   return result.rows[0] || null;
// };

// /*
//     Job statistics
// */
// const getJobStatistics = async () => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//             SELECT

//             COUNT(*) TOTAL_JOBS,

//             SUM(
//                 CASE
//                     WHEN STATUS='SUCCESS'
//                     THEN 1
//                     ELSE 0
//                 END
//             ) SUCCESS_JOBS,

//             SUM(
//                 CASE
//                     WHEN STATUS='FAILED'
//                     THEN 1
//                     ELSE 0
//                 END
//             ) FAILED_JOBS,

//             SUM(
//                 CASE
//                     WHEN STATUS='RUNNING'
//                     THEN 1
//                     ELSE 0
//                 END
//             ) RUNNING_JOBS

//             FROM APP_USER.REC_RECONCILIATION_JOB_HISTORY

//             `,

//     [],

//     {
//       outFormat: oracledb.OUT_FORMAT_OBJECT,
//     },
//   );

//   await connection.close();

//   return result.rows[0];
// };

// /*
//     Recent Jobs
// */
// const getRecentJobs = async () => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//             SELECT

//                 JOB_ID,

//                 RUN_ID,

//                 JOB_TYPE,

//                 START_TIME,

//                 END_TIME,

//                 STATUS,

//                 ERROR_MESSAGE

//             FROM APP_USER.REC_RECONCILIATION_JOB_HISTORY

//             ORDER BY JOB_ID DESC

//             FETCH FIRST 06 ROWS ONLY

//             `,

//     [],

//     {
//       outFormat: oracledb.OUT_FORMAT_OBJECT,
//     },
//   );

//   await connection.close();

//   return result.rows;
// };

// module.exports = {
//   getLatestRun,

//   getScheduler,

//   getJobStatistics,

//   getRecentJobs,
// };

const connectOracle = require("../config/oracle");

const oracledb = require("oracledb");

const getLatestRun = async () => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
                SELECT
                    RUN_ID,
                    BUSINESS_DATE,
                    START_TIME,
                    END_TIME,
                    STATUS,
                    CREATED_BY,
                    CREATED_DATE

                FROM APP_USER.REC_RECONCILIATION_RUN

                ORDER BY RUN_ID DESC

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

const getScheduler = async () => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
                SELECT
                    SCHEDULE_ID,
                    SCHEDULE_NAME,
                    RUN_TYPE,
                    RUN_TIME,
                    DAYS_OF_WEEK,
                    TIMEZONE,
                    STATUS

                FROM APP_USER.REC_RECONCILIATION_SCHEDULE

                WHERE STATUS = 'ACTIVE'

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

const getJobStatistics = async () => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
                SELECT

                    COUNT(*) AS TOTAL_JOBS,

                    SUM(
                        CASE
                            WHEN STATUS = 'SUCCESS'
                            THEN 1
                            ELSE 0
                        END
                    ) AS SUCCESS_JOBS,

                    SUM(
                        CASE
                            WHEN STATUS = 'FAILED'
                            THEN 1
                            ELSE 0
                        END
                    ) AS FAILED_JOBS,

                    SUM(
                        CASE
                            WHEN STATUS = 'RUNNING'
                            THEN 1
                            ELSE 0
                        END
                    ) AS RUNNING_JOBS

                FROM APP_USER.REC_RECONCILIATION_JOB_HISTORY
                `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return result.rows[0];
  } finally {
    await connection.close();
  }
};

const getRecentJobs = async () => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
                SELECT
                    JOB_ID,
                    RUN_ID,
                    JOB_TYPE,
                    START_TIME,
                    END_TIME,
                    STATUS,
                    ERROR_MESSAGE

                FROM APP_USER.REC_RECONCILIATION_JOB_HISTORY

                ORDER BY JOB_ID DESC

                FETCH FIRST 6 ROWS ONLY
                `,
      [],
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
  getLatestRun,

  getScheduler,

  getJobStatistics,

  getRecentJobs,
};

// const connectOracle = require("../config/oracle");

/*
====================================================
GET LATEST RECONCILIATION RUN
====================================================

IMPORTANT:
Always select the latest RUN_ID.

Do NOT use BUSINESS_DATE because multiple
reconciliation runs can have the same business date.
*/

// const getLatestRun = async () => {
//   let connection;

//   try {
//     connection = await connectOracle();

//     const result = await connection.execute(
//       `
//       SELECT
//           RUN_ID,
//           BUSINESS_DATE,
//           START_TIME,
//           END_TIME,
//           STATUS
//       FROM APP_USER.REC_RECONCILIATION_RUN
//       ORDER BY RUN_ID DESC
//       FETCH FIRST 1 ROW ONLY
//       `,
//       {},
//       {
//         outFormat: require("oracledb").OUT_FORMAT_OBJECT,
//       },
//     );

//     return result.rows.length > 0 ? result.rows[0] : null;
//   } catch (error) {
//     console.error("getLatestRun failed:", error);
//     throw error;
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// };

// /*
// ====================================================
// GET SCHEDULER
// ====================================================
// */

// const getScheduler = async () => {
//   let connection;

//   try {
//     connection = await connectOracle();

//     const result = await connection.execute(
//       `
//       SELECT
//           *
//       FROM APP_USER.REC_SCHEDULER_CONFIG
//       FETCH FIRST 1 ROW ONLY
//       `,
//       {},
//       {
//         outFormat: require("oracledb").OUT_FORMAT_OBJECT,
//       },
//     );

//     return result.rows.length > 0 ? result.rows[0] : null;
//   } catch (error) {
//     console.error("getScheduler failed:", error);
//     throw error;
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// };

// /*
// ====================================================
// GET JOB STATISTICS
// ====================================================
// */

// const getJobStatistics = async () => {
//   let connection;

//   try {
//     connection = await connectOracle();

//     const result = await connection.execute(
//       `
//       SELECT
//           COUNT(*) AS TOTAL_JOBS,

//           SUM(
//               CASE
//                   WHEN STATUS = 'SUCCESS'
//                   THEN 1
//                   ELSE 0
//               END
//           ) AS SUCCESS_JOBS,

//           SUM(
//               CASE
//                   WHEN STATUS = 'FAILED'
//                   THEN 1
//                   ELSE 0
//               END
//           ) AS FAILED_JOBS,

//           SUM(
//               CASE
//                   WHEN STATUS = 'RUNNING'
//                   THEN 1
//                   ELSE 0
//               END
//           ) AS RUNNING_JOBS

//       FROM APP_USER.RECONCILIATION_JOB_HISTORY
//       `,
//       {},
//       {
//         outFormat: require("oracledb").OUT_FORMAT_OBJECT,
//       },
//     );

//     return result.rows.length > 0 ? result.rows[0] : null;
//   } catch (error) {
//     console.error("getJobStatistics failed:", error);
//     throw error;
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// };

// /*
// ====================================================
// GET RECENT JOBS
// ====================================================
// */

// const getRecentJobs = async () => {
//   let connection;

//   try {
//     connection = await connectOracle();

//     const result = await connection.execute(
//       `
//       SELECT
//           JOB_HISTORY_ID,
//           RUN_ID,
//           JOB_TYPE,
//           START_TIME,
//           END_TIME,
//           STATUS,
//           ERROR_MESSAGE,
//           CREATED_DATE

//       FROM APP_USER.RECONCILIATION_JOB_HISTORY

//       ORDER BY JOB_HISTORY_ID DESC

//       FETCH FIRST 10 ROWS ONLY
//       `,
//       {},
//       {
//         outFormat: require("oracledb").OUT_FORMAT_OBJECT,
//       },
//     );

//     return result.rows;
//   } catch (error) {
//     console.error("getRecentJobs failed:", error);
//     throw error;
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// };

// /*
// ====================================================
// EXPORT
// ====================================================
// */

// module.exports = {
//   getLatestRun,
//   getScheduler,
//   getJobStatistics,
//   getRecentJobs,
// };
