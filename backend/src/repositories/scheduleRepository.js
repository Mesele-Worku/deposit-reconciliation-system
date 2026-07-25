// const connectOracle = require("../config/oracle");

// const getSchedule = async () => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
//         SELECT
//             SCHEDULE_ID,
//             SCHEDULE_NAME,
//             RUN_TYPE,
//             RUN_TIME,
//             DAYS_OF_WEEK,
//             TIMEZONE,
//             STATUS
//         FROM TESTUSER.RECONCILIATION_SCHEDULE
//         FETCH FIRST 1 ROWS ONLY
//         `,
//     [],
//     {
//       outFormat: require("oracledb").OUT_FORMAT_OBJECT,
//     },
//   );

//   await connection.close();

//   return result.rows[0];
// };

// const updateSchedule = async (schedule) => {
//   const connection = await connectOracle();

//   await connection.execute(
//     `
//         UPDATE TESTUSER.RECONCILIATION_SCHEDULE
//         SET
//             SCHEDULE_NAME = :scheduleName,
//             RUN_TYPE      = :runType,
//             RUN_TIME      = :runTime,
//             DAYS_OF_WEEK  = :daysOfWeek,
//             TIMEZONE      = :timezone,
//             STATUS        = :status,
//             UPDATED_DATE  = CURRENT_TIMESTAMP
//         WHERE SCHEDULE_ID = :scheduleId
//         `,
//     {
//       scheduleId: schedule.scheduleId,
//       scheduleName: schedule.scheduleName,
//       runType: schedule.runType,
//       runTime: schedule.runTime,
//       daysOfWeek: schedule.daysOfWeek,
//       timezone: schedule.timezone,
//       status: schedule.status,
//     },
//     {
//       autoCommit: true,
//     },
//   );

//   await connection.close();
// };

// module.exports = {
//   getSchedule,
//   updateSchedule,
// };

const connectOracle = require("../config/oracle");

const getSchedule = async () => {
  const connection = await connectOracle();

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
        FROM TESTUSER.RECONCILIATION_SCHEDULE
        FETCH FIRST 1 ROWS ONLY
        `,
    [],
    {
      outFormat: require("oracledb").OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows[0];
};

const saveSchedule = async (schedule) => {
  const connection = await connectOracle();

  const existing = await connection.execute(
    `
        SELECT SCHEDULE_ID
        FROM TESTUSER.RECONCILIATION_SCHEDULE
        FETCH FIRST 1 ROWS ONLY
        `,
    [],
    {
      outFormat: require("oracledb").OUT_FORMAT_OBJECT,
    },
  );

  if (existing.rows.length === 0) {
    await connection.execute(
      `
            INSERT INTO TESTUSER.RECONCILIATION_SCHEDULE
            (
                SCHEDULE_NAME,
                RUN_TYPE,
                RUN_TIME,
                DAYS_OF_WEEK,
                TIMEZONE,
                STATUS,
                CREATED_BY
            )
            VALUES
            (
                :scheduleName,
                :runType,
                :runTime,
                :daysOfWeek,
                :timezone,
                :status,
                'ADMIN'
            )
            `,
      {
        scheduleName: schedule.SCHEDULE_NAME,
        runType: schedule.RUN_TYPE,
        runTime: schedule.RUN_TIME,
        daysOfWeek: schedule.DAYS_OF_WEEK,
        timezone: schedule.TIMEZONE,
        status: schedule.STATUS,
      },
      {
        autoCommit: true,
      },
    );
  } else {
    await connection.execute(
      `
            UPDATE TESTUSER.RECONCILIATION_SCHEDULE
            SET
                SCHEDULE_NAME = :scheduleName,
                RUN_TYPE = :runType,
                RUN_TIME = :runTime,
                DAYS_OF_WEEK = :daysOfWeek,
                TIMEZONE = :timezone,
                STATUS = :status,
                UPDATED_DATE = CURRENT_TIMESTAMP
            WHERE SCHEDULE_ID = :scheduleId
            `,
      {
        scheduleId: existing.rows[0].SCHEDULE_ID,
        scheduleName: schedule.SCHEDULE_NAME,
        runType: schedule.RUN_TYPE,
        runTime: schedule.RUN_TIME,
        daysOfWeek: schedule.DAYS_OF_WEEK,
        timezone: schedule.TIMEZONE,
        status: schedule.STATUS,
      },
      {
        autoCommit: true,
      },
    );
  }

  await connection.close();
};

module.exports = {
  getSchedule,
  saveSchedule,
};
