const cron = require("node-cron");

const reconciliationService = require("../services/reconciliationService");

const startScheduler = () => {
  /*
    Run every 30 minutes

    Format:

    second(optional)
    minute
    hour
    day
    month
    weekday

*/

  cron.schedule("*/30 * * * *", async () => {
    console.log("Scheduled reconciliation started...");

    try {
      const result = await reconciliationService.runReconciliation();

      console.log("Scheduled reconciliation completed");

      console.log(result);
    } catch (error) {
      console.error("Scheduled reconciliation failed", error.message);
    }
  });

  console.log("Reconciliation scheduler started");
};

module.exports = startScheduler;
