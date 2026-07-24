// const connectOracle = require("../config/oracle");



// const getActiveSchedule = async () => {


//     const connection = await connectOracle();


//     const result = await connection.execute(
//         `
//         SELECT
//             SCHEDULE_ID,
//             SCHEDULE_NAME,
//             RUN_TYPE,
//             RUN_TIME,
//             DAYS_OF_WEEK,
//             TIMEZONE,
//             STATUS

//         FROM TESTUSER.RECONCILIATION_SCHEDULE

//         WHERE STATUS='ACTIVE'
//         `,
//         [],
//         {
//             outFormat: require("oracledb").OUT_FORMAT_OBJECT
//         }
//     );


//     await connection.close();


//     return result.rows[0];

// };





// const updateSchedule = async (data) => {


//     const connection = await connectOracle();


//     await connection.execute(
//         `
// UPDATE TESTUSER.RECONCILIATION_SCHEDULE

// SET

// RUN_TIME=:runTime,

// DAYS_OF_WEEK=:days,

// STATUS=:status

// WHERE SCHEDULE_ID=:id
// `,
//         {

//             runTime: data.runTime,

//             days: data.days,

//             status: data.status,

//             id: data.id

//         },

//         {
//             autoCommit: true
//         }

//     );


//     await connection.close();


// };




// module.exports = {
//     getActiveSchedule,
//     updateSchedule
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
            outFormat: require("oracledb").OUT_FORMAT_OBJECT
        }
    );

    await connection.close();

    return result.rows[0];
};

const updateSchedule = async (schedule) => {
    const connection = await connectOracle();

    await connection.execute(
        `
        UPDATE TESTUSER.RECONCILIATION_SCHEDULE
        SET
            SCHEDULE_NAME = :scheduleName,
            RUN_TYPE      = :runType,
            RUN_TIME      = :runTime,
            DAYS_OF_WEEK  = :daysOfWeek,
            TIMEZONE      = :timezone,
            STATUS        = :status,
            UPDATED_DATE  = CURRENT_TIMESTAMP
        WHERE SCHEDULE_ID = :scheduleId
        `,
        {
            scheduleId: schedule.scheduleId,
            scheduleName: schedule.scheduleName,
            runType: schedule.runType,
            runTime: schedule.runTime,
            daysOfWeek: schedule.daysOfWeek,
            timezone: schedule.timezone,
            status: schedule.status
        },
        {
            autoCommit: true
        }
    );

    await connection.close();
};

module.exports = {
    getSchedule,
    updateSchedule
};