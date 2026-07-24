const connectOracle = require("../config/oracle");

const createRun = async (businessDate) => {
    const connection = await connectOracle();

    const result = await connection.execute(
        `
    INSERT INTO TESTUSER.RECONCILIATION_RUN
    (
        BUSINESS_DATE,
        STATUS,
        CREATED_BY
    )
    VALUES
    (
        TO_DATE(:businessDate,'YYYY-MM-DD'),
        'RUNNING',
        'SYSTEM'
    )
    RETURNING RUN_ID INTO :runId
    `,
        {
            businessDate,

            runId: {
                dir: require("oracledb").BIND_OUT,
                type: require("oracledb").NUMBER,
            },
        },
        {
            autoCommit: true,
        },
    );

    await connection.close();

    return result.outBinds.runId[0];
};

const updateRunStatus = async (runId, status) => {
    const connection = await connectOracle();

    await connection.execute(
        `
UPDATE TESTUSER.RECONCILIATION_RUN

SET

STATUS=:status,

END_TIME=CURRENT_TIMESTAMP


WHERE RUN_ID=:runId

`,
        {
            status,
            runId,
        },
        {
            autoCommit: true,
        },
    );

    await connection.close();
};

module.exports = {
    createRun,
    updateRunStatus,
};
