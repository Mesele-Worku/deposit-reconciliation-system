const connectOracle = require("../config/oracle");

const saveResult = async (data) => {
  const connection = await connectOracle();

  await connection.execute(
    `
INSERT INTO TESTUSER.RECONCILIATION_RESULT

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
:diff,
:p_message
)

`,

    {
      runId: data.runId,

      ruleName: data.ruleName,

      status: data.status,

      expected: data.expected,

      actual: data.actual,

      diff: data.difference,

      p_message: data.message,
    },

    {
      autoCommit: true,
    },
  );

  await connection.close();
};

module.exports = {
  saveResult,
};
