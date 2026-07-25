const email = require("../../utils/email");

const reconciliationSuccess = async (data) => {
  await email.sendEmail({
    to: "meselew2112@gmail.com",

    subject: "Reconciliation Completed Successfully",

    text: `
EDRMS Reconciliation Completed.

Run ID:
${data.RUN_ID}


Core Deposit:
${data.CORE_DEPOSIT}


Warehouse Deposit:
${data.WAREHOUSE_DEPOSIT}

`,

    html: `
<h2>
Reconciliation Completed
</h2>


<p>
Run ID:
<b>${data.RUN_ID}</b>
</p>


<p>
Core Deposit:
<b>${data.CORE_DEPOSIT}</b>
</p>


<p>
Warehouse Deposit:
<b>${data.WAREHOUSE_DEPOSIT}</b>
</p>

`,
  });
};

const reconciliationFailure = async (data) => {
  await email.sendEmail({
    to: "meselew2112@gmail.com",

    subject: "Reconciliation Failed",

    text: `
Reconciliation failed.

Run ID:
${data.RUN_ID}


Error:
${data.ERROR}

`,

    html: `
<h2 style="color:red">
Reconciliation Failed
</h2>


<p>
Run ID:
${data.RUN_ID}
</p>


<p>
Error:
${data.ERROR}
</p>

`,
  });
};

module.exports = {
  reconciliationSuccess,

  reconciliationFailure,
};
