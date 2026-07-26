// const connectOracle = require("../config/oracle");

// const getNotificationHistory = async () => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
// SELECT

//     NOTIFICATION_ID,
//     RUN_ID,
//     NOTIFICATION_TYPE,
//     RECIPIENT,
//     SUBJECT,
//     MESSAGE,
//     STATUS,
//     CREATED_DATE

// FROM TESTUSER.NOTIFICATION_HISTORY

// ORDER BY CREATED_DATE DESC

// `,
//     [],
//     {
//       outFormat: require("oracledb").OUT_FORMAT_OBJECT,
//     },
//   );

//   await connection.close();

//   return result.rows;
// };

// const getNotificationConfig = async () => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
// SELECT

//     CONFIG_ID,
//     EVENT_TYPE,
//     EMAIL_ENABLED,
//     EMAIL_TO,
//     SUBJECT,
//     CREATED_DATE

// FROM TESTUSER.NOTIFICATION_CONFIG

// ORDER BY CONFIG_ID

// `,
//     [],
//     {
//       outFormat: require("oracledb").OUT_FORMAT_OBJECT,
//     },
//   );

//   await connection.close();

//   return result.rows;
// };

// const updateNotificationConfig = async (data) => {
//   const connection = await connectOracle();

//   const result = await connection.execute(
//     `
// UPDATE TESTUSER.NOTIFICATION_CONFIG

// SET

//     EMAIL_ENABLED = :emailEnabled,

//     EMAIL_TO = :emailTo,

//     SUBJECT = :subject,

//     UPDATED_DATE = CURRENT_TIMESTAMP


// WHERE CONFIG_ID = :configId

// `,
//     {
//       emailEnabled: data.emailEnabled,

//       emailTo: data.emailTo,

//       subject: data.subject,

//       configId: data.configId,
//     },
//     {
//       autoCommit: true,
//     },
//   );
//   console.log("Rows updated:", result.rowsAffected);
//   await connection.close();
// };

// module.exports = {
//   getNotificationHistory,

//   getNotificationConfig,

//   updateNotificationConfig,
// };

const connectOracle =
  require("../config/oracle");

const oracledb =
  require("oracledb");



/*
================================================
GET NOTIFICATION HISTORY
================================================
*/

const getNotificationHistory = async () => {


  const connection =
    await connectOracle();


  try {


    const result =
      await connection.execute(

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
          outFormat:
            oracledb.OUT_FORMAT_OBJECT
        }

      );


    return result.rows;


  }

  finally {

    await connection.close();

  }

};





/*
================================================
GET ALL CONFIGURATION
================================================
*/

const getNotificationConfig = async () => {


  const connection =
    await connectOracle();


  try {


    const result =
      await connection.execute(

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
          outFormat:
            oracledb.OUT_FORMAT_OBJECT
        }

      );


    return result.rows;


  }

  finally {

    await connection.close();

  }

};






/*
================================================
GET CONFIG BY EVENT TYPE

Example:
RECONCILIATION_SUCCESS
RECONCILIATION_FAILURE

================================================
*/

const getConfigByEvent = async (eventType) => {


  const connection =
    await connectOracle();


  try {


    const result =
      await connection.execute(

        `
                SELECT

                    CONFIG_ID,
                    EVENT_TYPE,
                    EMAIL_ENABLED,
                    EMAIL_TO,
                    SUBJECT

                FROM TESTUSER.NOTIFICATION_CONFIG

                WHERE EVENT_TYPE = :eventType

                `,

        {
          eventType
        },

        {
          outFormat:
            oracledb.OUT_FORMAT_OBJECT
        }

      );


    return result.rows[0];


  }

  finally {

    await connection.close();

  }

};






/*
================================================
UPDATE CONFIGURATION

Admin Notification Management Page

================================================
*/

const updateNotificationConfig = async (data) => {


  const connection =
    await connectOracle();


  try {


    const result =
      await connection.execute(

        `
                UPDATE TESTUSER.NOTIFICATION_CONFIG

                SET

                    EMAIL_ENABLED = :emailEnabled,

                    EMAIL_TO = :emailTo,

                    SUBJECT = :subject

                WHERE CONFIG_ID = :configId

                `,

        {

          emailEnabled:
            data.emailEnabled,

          emailTo:
            data.emailTo,

          subject:
            data.subject,

          configId:
            data.configId

        },

        {
          autoCommit: true
        }

      );


    console.log(
      "Rows updated:",
      result.rowsAffected
    );


    return {

      updated:
        result.rowsAffected

    };


  }

  finally {

    await connection.close();

  }

};







/*
================================================
SAVE NOTIFICATION HISTORY

================================================
*/

const saveHistory = async (data) => {


  const connection =
    await connectOracle();


  try {


    await connection.execute(

      `
            INSERT INTO TESTUSER.NOTIFICATION_HISTORY
            (

                RUN_ID,

                NOTIFICATION_TYPE,

                RECIPIENT,

                SUBJECT,

                MESSAGE,

                STATUS

            )

            VALUES

            (

                :runId,

                :notificationType,

                :recipient,

                :subject,

                :message,

                :status

            )

            `,

      {


        runId:
          data.runId,


        notificationType:
          data.notificationType,


        recipient:
          data.recipient,


        subject:
          data.subject,


        message:
          data.message,


        status:
          data.status


      },


      {

        autoCommit: true

      }

    );


  }

  finally {

    await connection.close();

  }

};







module.exports = {


  getNotificationHistory,


  getNotificationConfig,


  getConfigByEvent,


  updateNotificationConfig,


  saveHistory


};