// const email = require("../../utils/email");

// const reconciliationSuccess = async (data) => {
//   await email.sendEmail({
//     to: "meselew2112@gmail.com",

//     subject: "Reconciliation Completed Successfully",

//     text: `
// EDRMS Reconciliation Completed.

// Run ID:
// ${data.RUN_ID}


// Core Deposit:
// ${data.CORE_DEPOSIT}


// Warehouse Deposit:
// ${data.WAREHOUSE_DEPOSIT}

// `,

//     html: `
// <h2>
// Reconciliation Completed
// </h2>


// <p>
// Run ID:
// <b>${data.RUN_ID}</b>
// </p>


// <p>
// Core Deposit:
// <b>${data.CORE_DEPOSIT}</b>
// </p>


// <p>
// Warehouse Deposit:
// <b>${data.WAREHOUSE_DEPOSIT}</b>
// </p>

// `,
//   });
// };

// const reconciliationFailure = async (data) => {
//   await email.sendEmail({
//     to: "meselew2112@gmail.com",

//     subject: "Reconciliation Failed",

//     text: `
// Reconciliation failed.

// Run ID:
// ${data.RUN_ID}


// Error:
// ${data.ERROR}

// `,

//     html: `
// <h2 style="color:red">
// Reconciliation Failed
// </h2>


// <p>
// Run ID:
// ${data.RUN_ID}
// </p>


// <p>
// Error:
// ${data.ERROR}
// </p>

// `,
//   });
// };

// module.exports = {
//   reconciliationSuccess,

//   reconciliationFailure,
// };


const notificationRepository =
  require("../repositories/notificationRepository");

const email =
  require("../../utils/email");



const reconciliationSuccess = async (data) => {

  const config =
    await notificationRepository
      .getConfigByEvent(
        "RECONCILIATION_SUCCESS"
      );

  if (!config) {

    return;

  }

  if (config.EMAIL_ENABLED !== "YES") {

    return;

  }

  const subject =
    config.SUBJECT;

  const message = `

Enterprise Deposit Reconciliation Completed Successfully

Business Date:
${data.BUSINESS_DATE}

Run ID:
${data.RUN_ID}

Core Deposit:
${Number(data.CORE_DEPOSIT).toLocaleString()}

Warehouse Deposit:
${Number(data.WAREHOUSE_DEPOSIT).toLocaleString()}

Status:
SUCCESS

`;

  try {

    await email.sendEmail({

      to:
        config.EMAIL_TO,

      subject,

      text:
        message

    });

    await notificationRepository.saveHistory({

      runId:
        data.RUN_ID,

      notificationType:
        "EMAIL",

      recipient:
        config.EMAIL_TO,

      subject,

      message,

      status:
        "SENT"

    });

  }

  catch (error) {

    await notificationRepository.saveHistory({

      runId:
        data.RUN_ID,

      notificationType:
        "EMAIL",

      recipient:
        config.EMAIL_TO,

      subject,

      message:
        error.message,

      status:
        "FAILED"

    });

  }

};



const reconciliationFailure = async (data) => {

  const config =
    await notificationRepository
      .getConfigByEvent(
        "RECONCILIATION_FAILURE"
      );

  if (!config) {

    return;

  }

  if (config.EMAIL_ENABLED !== "YES") {

    return;

  }

  const subject =
    config.SUBJECT;

  let failedRules = "";

  if (data.FAILED_RULES) {

    data.FAILED_RULES.forEach(rule => {

      failedRules +=
        `• ${rule.name}
Difference: ${rule.difference}

`;

    });

  }

  const message = `

Enterprise Deposit Reconciliation FAILED

Business Date:
${data.BUSINESS_DATE}

Run ID:
${data.RUN_ID}

${data.ERROR ? "System Error:\n" + data.ERROR : ""}

${failedRules}

Core Deposit:
${Number(data.CORE_DEPOSIT || 0).toLocaleString()}

Warehouse Deposit:
${Number(data.WAREHOUSE_DEPOSIT || 0).toLocaleString()}

Please investigate immediately.

`;

  try {

    await email.sendEmail({

      to:
        config.EMAIL_TO,

      subject,

      text:
        message

    });

    await notificationRepository.saveHistory({

      runId:
        data.RUN_ID,

      notificationType:
        "EMAIL",

      recipient:
        config.EMAIL_TO,

      subject,

      message,

      status:
        "SENT"

    });

  }

  catch (error) {

    await notificationRepository.saveHistory({

      runId:
        data.RUN_ID,

      notificationType:
        "EMAIL",

      recipient:
        config.EMAIL_TO,

      subject,

      message:
        error.message,

      status:
        "FAILED"

    });

  }

};



module.exports = {

  reconciliationSuccess,

  reconciliationFailure

};