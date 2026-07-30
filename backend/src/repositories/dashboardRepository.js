const connectOracle = require("../config/oracle");

const oracledb = require("oracledb");

/*
    Latest reconciliation run
*/
const getLatestRun = async () => {
  const connection = await connectOracle();

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


            FETCH FIRST 1 ROWS ONLY

            `,

    [],

    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows[0] || null;
};

/*
    Scheduler information
*/
const getScheduler = async () => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
            SELECT *

            FROM APP_USER.REC_RECONCILIATION_SCHEDULE

            WHERE STATUS='ACTIVE'

            FETCH FIRST 1 ROWS ONLY

            `,

    [],

    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows[0] || null;
};

/*
    Job statistics
*/
const getJobStatistics = async () => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
            SELECT

            COUNT(*) TOTAL_JOBS,


            SUM(
                CASE 
                    WHEN STATUS='SUCCESS'
                    THEN 1
                    ELSE 0
                END
            ) SUCCESS_JOBS,


            SUM(
                CASE 
                    WHEN STATUS='FAILED'
                    THEN 1
                    ELSE 0
                END
            ) FAILED_JOBS,


            SUM(
                CASE 
                    WHEN STATUS='RUNNING'
                    THEN 1
                    ELSE 0
                END
            ) RUNNING_JOBS


            FROM APP_USER.REC_RECONCILIATION_JOB_HISTORY

            `,

    [],

    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows[0];
};

/*
    Recent Jobs
*/
const getRecentJobs = async () => {
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


            ORDER BY JOB_ID DESC


            FETCH FIRST 06 ROWS ONLY


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
  getLatestRun,

  getScheduler,

  getJobStatistics,

  getRecentJobs,
};
