const connectOracle = require("../config/oracle");

const oracledb = require("oracledb");

const createJob = async (jobType) => {
  const connection = await connectOracle();

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

  await connection.close();

  return result.outBinds.jobId[0];
};

// NEW METHOD
// Link Job with Reconciliation Run

const updateJobRunId = async (jobId, runId) => {
  const connection = await connectOracle();

  await connection.execute(
    `
        UPDATE APP_USER.REC_RECONCILIATION_JOB_HISTORY

        SET

        RUN_ID=:runId

        WHERE JOB_ID=:jobId

        `,

    {
      runId,

      jobId,
    },

    {
      autoCommit: true,
    },
  );

  await connection.close();
};

const completeJob = async (jobId, status, errorMessage = null) => {
  const connection = await connectOracle();

  await connection.execute(
    `
        UPDATE APP_USER.REC_RECONCILIATION_JOB_HISTORY

        SET

        STATUS=:status,

        END_TIME=CURRENT_TIMESTAMP,

        ERROR_MESSAGE=:errorMessage


        WHERE JOB_ID=:jobId

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

  await connection.close();
};

const getLatestJobs = async () => {
  const connection = await connectOracle();

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


            ORDER BY START_TIME DESC


            FETCH FIRST 20 ROWS ONLY

            `,

    [],

    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows;
};

module.exports = {
  createJob,

  updateJobRunId,

  completeJob,

  getLatestJobs,
};
