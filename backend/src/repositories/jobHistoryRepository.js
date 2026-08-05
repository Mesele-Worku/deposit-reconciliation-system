// const connectOracle = require("../config/oracle");

// const oracledb = require("oracledb");

// const createJob = async (jobType) => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//             INSERT INTO APP_USER.REC_RECONCILIATION_JOB_HISTORY
//             (
//                 JOB_TYPE,
//                 STATUS
//             )

//             VALUES
//             (
//                 :jobType,
//                 'RUNNING'
//             )

//             RETURNING JOB_ID INTO :jobId
//             `,

//     {
//       jobType,

//       jobId: {
//         dir: oracledb.BIND_OUT,

//         type: oracledb.NUMBER,
//       },
//     },

//     {
//       autoCommit: true,
//     },
//   );

//   await connection.close();

//   return result.outBinds.jobId[0];
// };

// // NEW METHOD
// // Link Job with Reconciliation Run

// const updateJobRunId = async (jobId, runId) => {
//   const connection = await connectOracle();

//   await connection.execute(
//     `
//         UPDATE APP_USER.REC_RECONCILIATION_JOB_HISTORY

//         SET

//         RUN_ID=:runId

//         WHERE JOB_ID=:jobId

//         `,

//     {
//       runId,

//       jobId,
//     },

//     {
//       autoCommit: true,
//     },
//   );

//   await connection.close();
// };

// const completeJob = async (jobId, status, errorMessage = null) => {
//   const connection = await connectOracle();

//   await connection.execute(
//     `
//         UPDATE APP_USER.REC_RECONCILIATION_JOB_HISTORY

//         SET

//         STATUS=:status,

//         END_TIME=CURRENT_TIMESTAMP,

//         ERROR_MESSAGE=:errorMessage

//         WHERE JOB_ID=:jobId

//         `,

//     {
//       status,

//       errorMessage,

//       jobId,
//     },

//     {
//       autoCommit: true,
//     },
//   );

//   await connection.close();
// };

// const getLatestJobs = async () => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//             SELECT

//             JOB_ID,

//             RUN_ID,

//             JOB_TYPE,

//             START_TIME,

//             END_TIME,

//             STATUS,

//             ERROR_MESSAGE

//             FROM APP_USER.REC_RECONCILIATION_JOB_HISTORY

//             ORDER BY START_TIME DESC

//             FETCH FIRST 20 ROWS ONLY

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
//   createJob,

//   updateJobRunId,

//   completeJob,

//   getLatestJobs,
// };

const connectOracle = require("../config/oracle");
const oracledb = require("oracledb");

/*
========================================================
CREATE JOB
========================================================

Creates a job before reconciliation starts.

JOB_TYPE:
    MANUAL
    SCHEDULED

STATUS:
    RUNNING

RUN_ID is intentionally NULL here because the
reconciliation run is created inside reconciliationService.
*/
const createJob = async (jobType) => {
  let connection;

  try {
    connection = await connectOracle();

    const result = await connection.execute(
      `
            INSERT INTO APP_USER.REC_RECONCILIATION_JOB_HISTORY
            (
                JOB_TYPE,
                STATUS
            )
            VALUES
            (
                :jobType,
                'RUNNING'
            )
            RETURNING JOB_ID INTO :jobId
            `,
      {
        jobType,

        jobId: {
          dir: oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
      },
      {
        autoCommit: true,
      },
    );

    const jobId = result.outBinds.jobId[0];

    console.log(`Job created successfully. JOB_ID: ${jobId}`);

    return jobId;
  } catch (error) {
    console.error("Failed to create reconciliation job:", error.message);

    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

/*
========================================================
LINK JOB WITH RECONCILIATION RUN
========================================================

After reconciliationService creates:

    REC_RECONCILIATION_RUN

the generated RUN_ID is linked to the job.
*/
const updateJobRunId = async (jobId, runId) => {
  let connection;

  try {
    connection = await connectOracle();

    await connection.execute(
      `
            UPDATE APP_USER.REC_RECONCILIATION_JOB_HISTORY
            SET
                RUN_ID = :runId
            WHERE JOB_ID = :jobId
            `,
      {
        runId,
        jobId,
      },
      {
        autoCommit: true,
      },
    );

    console.log(`Job ${jobId} linked to reconciliation run ${runId}`);
  } catch (error) {
    console.error("Failed to link job with reconciliation run:", error.message);

    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

/*
========================================================
COMPLETE JOB
========================================================

Updates the job after reconciliation finishes.

SUCCESS:
    STATUS = SUCCESS
    END_TIME = current timestamp
    ERROR_MESSAGE = NULL

FAILED:
    STATUS = FAILED
    END_TIME = current timestamp
    ERROR_MESSAGE = actual error
*/
const completeJob = async (jobId, status, errorMessage = null) => {
  let connection;

  try {
    connection = await connectOracle();

    await connection.execute(
      `
            UPDATE APP_USER.REC_RECONCILIATION_JOB_HISTORY
            SET
                STATUS = :status,
                END_TIME = CURRENT_TIMESTAMP,
                ERROR_MESSAGE = :errorMessage
            WHERE JOB_ID = :jobId
            `,
      {
        status,
        errorMessage,
        jobId,
      },
      {
        autoCommit: true,
      },
    );

    console.log(`Job ${jobId} completed with status: ${status}`);
  } catch (error) {
    console.error("Failed to complete reconciliation job:", error.message);

    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

/*
========================================================
GET LATEST JOBS
========================================================

Used by:

    Dashboard
    Monitoring
    Scheduler status
    Job history

Returns the latest 20 jobs.
*/
const getLatestJobs = async () => {
  let connection;

  try {
    connection = await connectOracle();

    const result = await connection.execute(
      `
            SELECT
                JOB_ID,
                RUN_ID,
                JOB_TYPE,
                START_TIME,
                END_TIME,
                END_TIME,
                STATUS,
                ERROR_MESSAGE,
                CREATED_DATE
            FROM APP_USER.REC_RECONCILIATION_JOB_HISTORY
            ORDER BY START_TIME DESC
            FETCH FIRST 20 ROWS ONLY
            `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve reconciliation jobs:", error.message);

    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

/*
========================================================
GET LATEST JOB
========================================================

Useful for dashboard/status API.

Returns only the most recent job.
*/
const getLatestJob = async () => {
  let connection;

  try {
    connection = await connectOracle();

    const result = await connection.execute(
      `
            SELECT
                JOB_ID,
                RUN_ID,
                JOB_TYPE,
                START_TIME,
                END_TIME,
                STATUS,
                ERROR_MESSAGE,
                CREATED_DATE
            FROM APP_USER.REC_RECONCILIATION_JOB_HISTORY
            ORDER BY START_TIME DESC
            FETCH FIRST 1 ROW ONLY
            `,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error(
      "Failed to retrieve latest reconciliation job:",
      error.message,
    );

    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

/*
========================================================
EXPORT
========================================================
*/
module.exports = {
  createJob,
  updateJobRunId,
  completeJob,
  getLatestJobs,
  getLatestJob,
};
