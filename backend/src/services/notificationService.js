// // const email = require("../../utils/email");

// // const reconciliationSuccess = async (data) => {
// //   await email.sendEmail({
// //     to: "meselew2112@gmail.com",

// //     subject: "Reconciliation Completed Successfully",

// //     text: `
// // EDRMS Reconciliation Completed.

// // Run ID:
// // ${data.RUN_ID}

// // Core Deposit:
// // ${data.CORE_DEPOSIT}

// // Warehouse Deposit:
// // ${data.WAREHOUSE_DEPOSIT}

// // `,

// //     html: `
// // <h2>
// // Reconciliation Completed
// // </h2>

// // <p>
// // Run ID:
// // <b>${data.RUN_ID}</b>
// // </p>

// // <p>
// // Core Deposit:
// // <b>${data.CORE_DEPOSIT}</b>
// // </p>

// // <p>
// // Warehouse Deposit:
// // <b>${data.WAREHOUSE_DEPOSIT}</b>
// // </p>

// // `,
// //   });
// // };

// // const reconciliationFailure = async (data) => {
// //   await email.sendEmail({
// //     to: "meselew2112@gmail.com",

// //     subject: "Reconciliation Failed",

// //     text: `
// // Reconciliation failed.

// // Run ID:
// // ${data.RUN_ID}

// // Error:
// // ${data.ERROR}

// // `,

// //     html: `
// // <h2 style="color:red">
// // Reconciliation Failed
// // </h2>

// // <p>
// // Run ID:
// // ${data.RUN_ID}
// // </p>

// // <p>
// // Error:
// // ${data.ERROR}
// // </p>

// // `,
// //   });
// // };

// // module.exports = {
// //   reconciliationSuccess,

// //   reconciliationFailure,
// // };

// const notificationRepository =
//   require("../repositories/notificationRepository");

// const email =
//   require("../../utils/email");

// const reconciliationSuccess = async (data) => {

//   const config =
//     await notificationRepository
//       .getConfigByEvent(
//         "RECONCILIATION_SUCCESS"
//       );

//   if (!config) {

//     return;

//   }

//   if (config.EMAIL_ENABLED !== "YES") {

//     return;

//   }

//   const subject =
//     config.SUBJECT;

//   const message = `

// Enterprise Deposit Reconciliation Completed Successfully

// Business Date:
// ${data.BUSINESS_DATE}

// Run ID:
// ${data.RUN_ID}

// Core Deposit:
// ${Number(data.CORE_DEPOSIT).toLocaleString()}

// Warehouse Deposit:
// ${Number(data.WAREHOUSE_DEPOSIT).toLocaleString()}

// Status:
// SUCCESS

// `;

//   try {

//     await email.sendEmail({

//       to:
//         config.EMAIL_TO,

//       subject,

//       text:
//         message

//     });

//     await notificationRepository.saveHistory({

//       runId:
//         data.RUN_ID,

//       notificationType:
//         "EMAIL",

//       recipient:
//         config.EMAIL_TO,

//       subject,

//       message,

//       status:
//         "SENT"

//     });

//   }

//   catch (error) {

//     await notificationRepository.saveHistory({

//       runId:
//         data.RUN_ID,

//       notificationType:
//         "EMAIL",

//       recipient:
//         config.EMAIL_TO,

//       subject,

//       message:
//         error.message,

//       status:
//         "FAILED"

//     });

//   }

// };

// const reconciliationFailure = async (data) => {

//   const config =
//     await notificationRepository
//       .getConfigByEvent(
//         "RECONCILIATION_FAILURE"
//       );

//   if (!config) {

//     return;

//   }

//   if (config.EMAIL_ENABLED !== "YES") {

//     return;

//   }

//   const subject =
//     config.SUBJECT;

//   let failedRules = "";

//   if (data.FAILED_RULES) {

//     data.FAILED_RULES.forEach(rule => {

//       failedRules +=
//         `• ${rule.name}
// Difference: ${rule.difference}

// `;

//     });

//   }

//   const message = `

// Enterprise Deposit Reconciliation FAILED

// Business Date:
// ${data.BUSINESS_DATE}

// Run ID:
// ${data.RUN_ID}

// ${data.ERROR ? "System Error:\n" + data.ERROR : ""}

// ${failedRules}

// Core Deposit:
// ${Number(data.CORE_DEPOSIT || 0).toLocaleString()}

// Warehouse Deposit:
// ${Number(data.WAREHOUSE_DEPOSIT || 0).toLocaleString()}

// Please investigate immediately.

// `;

//   try {

//     await email.sendEmail({

//       to:
//         config.EMAIL_TO,

//       subject,

//       text:
//         message

//     });

//     await notificationRepository.saveHistory({

//       runId:
//         data.RUN_ID,

//       notificationType:
//         "EMAIL",

//       recipient:
//         config.EMAIL_TO,

//       subject,

//       message,

//       status:
//         "SENT"

//     });

//   }

//   catch (error) {

//     await notificationRepository.saveHistory({

//       runId:
//         data.RUN_ID,

//       notificationType:
//         "EMAIL",

//       recipient:
//         config.EMAIL_TO,

//       subject,

//       message:
//         error.message,

//       status:
//         "FAILED"

//     });

//   }

// };

// module.exports = {

//   reconciliationSuccess,

//   reconciliationFailure

// };

const notificationRepository = require("../repositories/notificationRepository");

const email = require("../../utils/email");

/*
====================================================
SUCCESS NOTIFICATION
====================================================
*/

const reconciliationSuccess = async (data) => {
  const config = await notificationRepository.getConfigByEvent(
    "RECONCILIATION_SUCCESS",
  );

  if (!config) {
    return;
  }

  if (config.EMAIL_ENABLED !== "YES") {
    return;
  }

  const subject =
    config.SUBJECT || "Deposit Reconciliation Completed Successfully";

  const coreDeposit = Number(data.CORE_DEPOSIT || 0);

  const warehouseDeposit = Number(data.WAREHOUSE_DEPOSIT || 0);

  /*
  ==================================================
  PLAIN TEXT EMAIL
  ==================================================
  */

  const text = `
Enterprise Deposit Reconciliation & Monitoring System

RECONCILIATION COMPLETED SUCCESSFULLY

Business Date: ${data.BUSINESS_DATE}
Run ID: ${data.RUN_ID}

Core Banking Deposit:
${coreDeposit.toLocaleString()}

Enterprise Data Warehouse Deposit:
${warehouseDeposit.toLocaleString()}

Status:
SUCCESS

This is an automated notification from the Enterprise Deposit Reconciliation & Monitoring System.
  `;

  /*
  ==================================================
  MODERN HTML EMAIL
  ==================================================
  */

  const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>Reconciliation Completed</title>

</head>


<body style="
  margin:0;
  padding:0;
  background-color:#f4f6f8;
  font-family:Arial, Helvetica, sans-serif;
  color:#1f2937;
">

<table width="100%"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="background:#f4f6f8;padding:35px 15px;">

<tr>

<td align="center">

<table width="680"
       cellpadding="0"
       cellspacing="0"
       border="0"
       style="
         max-width:680px;
         width:100%;
         background:#ffffff;
         border-radius:12px;
         overflow:hidden;
         box-shadow:0 3px 15px rgba(0,0,0,0.08);
       ">


<!-- HEADER -->

<tr>

<td style="
  background:#232A78;
  padding:28px 35px;
">

<table width="100%">

<tr>

<td>

<div style="
  color:#ffffff;
  font-size:21px;
  font-weight:bold;
">

Enterprise Deposit Reconciliation

</div>

<div style="
  color:#dbe2ff;
  font-size:13px;
  margin-top:6px;
">

Monitoring & Control System

</div>

</td>

<td align="right">

<div style="
  background:#ffffff;
  color:#232A78;
  padding:8px 14px;
  border-radius:20px;
  font-size:12px;
  font-weight:bold;
">

EDRMS

</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- SUCCESS BANNER -->

<tr>

<td style="padding:32px 35px 20px;">

<div style="
  background:#ecfdf3;
  border:1px solid #b7ebc6;
  border-radius:10px;
  padding:20px;
">

<table>

<tr>

<td style="
  font-size:27px;
  vertical-align:middle;
  padding-right:12px;
">

✓

</td>

<td>

<div style="
  color:#15803d;
  font-size:18px;
  font-weight:bold;
">

Reconciliation Completed Successfully

</div>

<div style="
  color:#166534;
  font-size:13px;
  margin-top:5px;
">

All reconciliation validations completed successfully.

</div>

</td>

</tr>

</table>

</div>

</td>

</tr>


<!-- RUN INFORMATION -->

<tr>

<td style="padding:5px 35px 20px;">

<div style="
  font-size:14px;
  font-weight:bold;
  color:#111827;
  margin-bottom:12px;
">

Run Information

</div>

<table width="100%"
       cellpadding="0"
       cellspacing="0"
       style="
         border:1px solid #e5e7eb;
         border-radius:8px;
       ">

<tr>

<td style="
  padding:13px;
  color:#6b7280;
  font-size:13px;
  border-bottom:1px solid #e5e7eb;
">

Business Date

</td>

<td align="right"
    style="
      padding:13px;
      font-size:13px;
      font-weight:bold;
      border-bottom:1px solid #e5e7eb;
">

${data.BUSINESS_DATE}

</td>

</tr>


<tr>

<td style="
  padding:13px;
  color:#6b7280;
  font-size:13px;
">

Run ID

</td>

<td align="right"
    style="
      padding:13px;
      font-size:13px;
      font-weight:bold;
">

${data.RUN_ID}

</td>

</tr>

</table>

</td>

</tr>


<!-- DEPOSIT SUMMARY -->

<tr>

<td style="padding:5px 35px 30px;">

<div style="
  font-size:14px;
  font-weight:bold;
  color:#111827;
  margin-bottom:12px;
">

Deposit Reconciliation Summary

</div>

<table width="100%"
       cellpadding="0"
       cellspacing="0">

<tr>

<!-- CORE -->

<td width="48%"
    style="
      background:#f8fafc;
      border:1px solid #e5e7eb;
      border-radius:10px;
      padding:20px;
    ">

<div style="
  color:#6b7280;
  font-size:12px;
  text-transform:uppercase;
  letter-spacing:.5px;
">

Core Banking

</div>

<div style="
  color:#111827;
  font-size:22px;
  font-weight:bold;
  margin-top:8px;
">

${coreDeposit.toLocaleString()}

</div>

<div style="
  color:#6b7280;
  font-size:11px;
  margin-top:5px;
">

Total Deposit

</div>

</td>


<td width="4%"></td>


<!-- WAREHOUSE -->

<td width="48%"
    style="
      background:#f8fafc;
      border:1px solid #e5e7eb;
      border-radius:10px;
      padding:20px;
    ">

<div style="
  color:#6b7280;
  font-size:12px;
  text-transform:uppercase;
  letter-spacing:.5px;
">

Enterprise Data Warehouse

</div>

<div style="
  color:#111827;
  font-size:22px;
  font-weight:bold;
  margin-top:8px;
">

${warehouseDeposit.toLocaleString()}

</div>

<div style="
  color:#6b7280;
  font-size:11px;
  margin-top:5px;
">

Total Deposit

</div>

</td>

</tr>

</table>

</td>

</tr>


<!-- STATUS -->

<tr>

<td style="
  padding:0 35px 30px;
">

<table width="100%"
       style="
         background:#f8fafc;
         border-radius:8px;
       ">

<tr>

<td style="padding:15px 18px;">

<span style="
  color:#6b7280;
  font-size:13px;
">

Reconciliation Status

</span>

</td>

<td align="right"
    style="padding:15px 18px;">

<span style="
  display:inline-block;
  background:#dcfce7;
  color:#166534;
  padding:6px 13px;
  border-radius:20px;
  font-size:12px;
  font-weight:bold;
">

● SUCCESS

</span>

</td>

</tr>

</table>

</td>

</tr>


<!-- FOOTER -->

<tr>

<td style="
  background:#f8fafc;
  border-top:1px solid #e5e7eb;
  padding:22px 35px;
">

<div style="
  color:#6b7280;
  font-size:11px;
  line-height:18px;
">

This is an automated notification generated by the

<strong>Enterprise Deposit Reconciliation & Monitoring System (EDRMS)</strong>.

<br>

Please do not reply directly to this email.

</div>

<div style="
  color:#9ca3af;
  font-size:10px;
  margin-top:10px;
">

© ${new Date().getFullYear()} — Automated System Notification

</div>

</td>

</tr>


</table>

</td>

</tr>

</table>

</body>

</html>
`;

  try {
    await email.sendEmail({
      to: config.EMAIL_TO,

      subject,

      text,

      html,
    });

    await notificationRepository.saveHistory({
      runId: data.RUN_ID,

      notificationType: "EMAIL",

      recipient: config.EMAIL_TO,

      subject,

      message: text,

      status: "SENT",
    });
  } catch (error) {
    await notificationRepository.saveHistory({
      runId: data.RUN_ID,

      notificationType: "EMAIL",

      recipient: config.EMAIL_TO,

      subject,

      message: error.message,

      status: "FAILED",
    });
  }
};

/*
====================================================
FAILURE NOTIFICATION
====================================================
*/

const reconciliationFailure = async (data) => {
  const config = await notificationRepository.getConfigByEvent(
    "RECONCILIATION_FAILURE",
  );

  if (!config) {
    return;
  }

  if (config.EMAIL_ENABLED !== "YES") {
    return;
  }

  const subject = config.SUBJECT || "Deposit Reconciliation Failed";

  const coreDeposit = Number(data.CORE_DEPOSIT || 0);

  const warehouseDeposit = Number(data.WAREHOUSE_DEPOSIT || 0);

  /*
  ==================================================
  FAILED RULES
  ==================================================
  */

  let failedRulesText = "";

  let failedRulesHtml = "";

  if (data.FAILED_RULES && data.FAILED_RULES.length > 0) {
    data.FAILED_RULES.forEach((rule) => {
      failedRulesText += `• ${rule.name} — Difference: ${rule.difference}\n`;

      failedRulesHtml += `

<tr>

<td style="
  padding:14px 16px;
  border-bottom:1px solid #fee2e2;
">

<div style="
  color:#991b1b;
  font-size:13px;
  font-weight:bold;
">

${rule.name}

</div>

<div style="
  color:#7f1d1d;
  font-size:12px;
  margin-top:4px;
">

Difference:
<strong>
${Number(rule.difference || 0).toLocaleString()}
</strong>

</div>

</td>

</tr>

`;
    });
  }

  /*
  ==================================================
  SYSTEM ERROR
  ==================================================
  */

  const systemError = data.ERROR ? data.ERROR : "";

  /*
  ==================================================
  PLAIN TEXT
  ==================================================
  */

  const text = `

Enterprise Deposit Reconciliation & Monitoring System

RECONCILIATION FAILED

Business Date:
${data.BUSINESS_DATE}

Run ID:
${data.RUN_ID}

${systemError ? `System Error:\n${systemError}\n` : ""}

Failed Rules:
${failedRulesText}

Core Banking Deposit:
${coreDeposit.toLocaleString()}

Enterprise Data Warehouse Deposit:
${warehouseDeposit.toLocaleString()}

Please investigate this reconciliation run immediately.

`;

  /*
  ==================================================
  MODERN HTML
  ==================================================
  */

  const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>Reconciliation Failed</title>

</head>


<body style="
  margin:0;
  padding:0;
  background:#f4f6f8;
  font-family:Arial, Helvetica, sans-serif;
  color:#1f2937;
">


<table width="100%"
       cellpadding="0"
       cellspacing="0"
       style="
         background:#f4f6f8;
         padding:35px 15px;
       ">

<tr>

<td align="center">


<table width="680"
       cellpadding="0"
       cellspacing="0"
       style="
         max-width:680px;
         width:100%;
         background:#ffffff;
         border-radius:12px;
         overflow:hidden;
         box-shadow:0 3px 15px rgba(0,0,0,0.08);
       ">


<!-- HEADER -->

<tr>

<td style="
  background:#232A78;
  padding:28px 35px;
">

<div style="
  color:#ffffff;
  font-size:21px;
  font-weight:bold;
">

Enterprise Deposit Reconciliation

</div>

<div style="
  color:#dbe2ff;
  font-size:13px;
  margin-top:6px;
">

Monitoring & Control System

</div>

</td>

</tr>


<!-- FAILURE -->

<tr>

<td style="padding:32px 35px 20px;">

<div style="
  background:#fef2f2;
  border:1px solid #fecaca;
  border-radius:10px;
  padding:20px;
">

<table>

<tr>

<td style="
  font-size:27px;
  vertical-align:middle;
  padding-right:12px;
">

!

</td>

<td>

<div style="
  color:#b91c1c;
  font-size:18px;
  font-weight:bold;
">

Reconciliation Failed

</div>

<div style="
  color:#991b1b;
  font-size:13px;
  margin-top:5px;
">

One or more reconciliation validations require investigation.

</div>

</td>

</tr>

</table>

</div>

</td>

</tr>


<!-- RUN DETAILS -->

<tr>

<td style="padding:5px 35px 25px;">

<div style="
  font-size:14px;
  font-weight:bold;
  margin-bottom:12px;
">

Run Information

</div>


<table width="100%"
       cellpadding="0"
       cellspacing="0"
       style="
         border:1px solid #e5e7eb;
         border-radius:8px;
       ">


<tr>

<td style="
  padding:13px;
  color:#6b7280;
  font-size:13px;
  border-bottom:1px solid #e5e7eb;
">

Business Date

</td>

<td align="right"
    style="
      padding:13px;
      font-weight:bold;
      font-size:13px;
      border-bottom:1px solid #e5e7eb;
">

${data.BUSINESS_DATE}

</td>

</tr>


<tr>

<td style="
  padding:13px;
  color:#6b7280;
  font-size:13px;
">

Run ID

</td>

<td align="right"
    style="
      padding:13px;
      font-weight:bold;
      font-size:13px;
">

${data.RUN_ID}

</td>

</tr>


</table>

</td>

</tr>


<!-- FAILED RULES -->

${
  failedRulesHtml
    ? `

<tr>

<td style="padding:0 35px 25px;">

<div style="
  font-size:14px;
  font-weight:bold;
  color:#991b1b;
  margin-bottom:12px;
">

Failed Validation Rules

</div>


<table width="100%"
       cellpadding="0"
       cellspacing="0"
       style="
         background:#fff7f7;
         border:1px solid #fecaca;
         border-radius:8px;
       ">

${failedRulesHtml}

</table>

</td>

</tr>

`
    : ""
}


<!-- SYSTEM ERROR -->

${
  systemError
    ? `

<tr>

<td style="padding:0 35px 25px;">

<div style="
  font-size:14px;
  font-weight:bold;
  margin-bottom:10px;
">

System Error

</div>

<div style="
  background:#111827;
  color:#f9fafb;
  padding:15px;
  border-radius:8px;
  font-family:monospace;
  font-size:12px;
  line-height:18px;
  overflow-wrap:anywhere;
">

${systemError}

</div>

</td>

</tr>

`
    : ""
}


<!-- DEPOSIT SUMMARY -->

<tr>

<td style="padding:0 35px 30px;">

<div style="
  font-size:14px;
  font-weight:bold;
  margin-bottom:12px;
">

Deposit Summary

</div>


<table width="100%"
       cellpadding="0"
       cellspacing="0">

<tr>


<td width="48%"
    style="
      background:#f8fafc;
      border:1px solid #e5e7eb;
      border-radius:10px;
      padding:20px;
    ">

<div style="
  color:#6b7280;
  font-size:12px;
">

CORE BANKING

</div>

<div style="
  font-size:21px;
  font-weight:bold;
  margin-top:8px;
">

${coreDeposit.toLocaleString()}

</div>

</td>


<td width="4%"></td>


<td width="48%"
    style="
      background:#f8fafc;
      border:1px solid #e5e7eb;
      border-radius:10px;
      padding:20px;
    ">

<div style="
  color:#6b7280;
  font-size:12px;
">

DATA WAREHOUSE

</div>

<div style="
  font-size:21px;
  font-weight:bold;
  margin-top:8px;
">

${warehouseDeposit.toLocaleString()}

</div>

</td>


</tr>

</table>

</td>

</tr>


<!-- ACTION -->

<tr>

<td style="padding:0 35px 30px;">

<div style="
  background:#fff7ed;
  border:1px solid #fed7aa;
  border-radius:8px;
  padding:15px 18px;
  color:#9a3412;
  font-size:13px;
">

<strong>Action Required:</strong>

Please investigate the failed validation rules and take the necessary corrective action.

</div>

</td>

</tr>


<!-- FOOTER -->

<tr>

<td style="
  background:#f8fafc;
  border-top:1px solid #e5e7eb;
  padding:22px 35px;
">

<div style="
  color:#6b7280;
  font-size:11px;
  line-height:18px;
">

This is an automated notification generated by the

<strong>
Enterprise Deposit Reconciliation & Monitoring System (EDRMS)
</strong>.

<br>

Please do not reply directly to this email.

</div>

<div style="
  color:#9ca3af;
  font-size:10px;
  margin-top:10px;
">

© ${new Date().getFullYear()} — Automated System Notification

</div>

</td>

</tr>


</table>

</td>

</tr>

</table>


</body>

</html>

`;

  try {
    await email.sendEmail({
      to: config.EMAIL_TO,

      subject,

      text,

      html,
    });

    await notificationRepository.saveHistory({
      runId: data.RUN_ID,

      notificationType: "EMAIL",

      recipient: config.EMAIL_TO,

      subject,

      message: text,

      status: "SENT",
    });
  } catch (error) {
    await notificationRepository.saveHistory({
      runId: data.RUN_ID,

      notificationType: "EMAIL",

      recipient: config.EMAIL_TO,

      subject,

      message: error.message,

      status: "FAILED",
    });
  }
};

module.exports = {
  reconciliationSuccess,

  reconciliationFailure,
};
