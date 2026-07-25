const connectOracle = require("../config/oracle");

const getNotificationHistory = async () => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
SELECT

    NOTIFICATION_ID,
    RUN_ID,
    NOTIFICATION_TYPE,
    RECIPIENT,
    SUBJECT,
    MESSAGE,
    STATUS,
    CREATED_DATE

FROM TESTUSER.NOTIFICATION_HISTORY

ORDER BY CREATED_DATE DESC

`,
    [],
    {
      outFormat: require("oracledb").OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows;
};

const getNotificationConfig = async () => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
SELECT

    CONFIG_ID,
    EVENT_TYPE,
    EMAIL_ENABLED,
    EMAIL_TO,
    SUBJECT,
    CREATED_DATE

FROM TESTUSER.NOTIFICATION_CONFIG

ORDER BY CONFIG_ID

`,
    [],
    {
      outFormat: require("oracledb").OUT_FORMAT_OBJECT,
    },
  );

  await connection.close();

  return result.rows;
};

const updateNotificationConfig = async (data) => {
  const connection = await connectOracle();

  const result = await connection.execute(
    `
UPDATE TESTUSER.NOTIFICATION_CONFIG

SET

    EMAIL_ENABLED = :emailEnabled,

    EMAIL_TO = :emailTo,

    SUBJECT = :subject,

    UPDATED_DATE = CURRENT_TIMESTAMP


WHERE CONFIG_ID = :configId

`,
    {
      emailEnabled: data.emailEnabled,

      emailTo: data.emailTo,

      subject: data.subject,

      configId: data.configId,
    },
    {
      autoCommit: true,
    },
  );
  console.log("Rows updated:", result.rowsAffected);
  await connection.close();
};

module.exports = {
  getNotificationHistory,

  getNotificationConfig,

  updateNotificationConfig,
};
