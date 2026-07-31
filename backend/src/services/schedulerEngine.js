// const cron = require("node-cron");

// const schedulerRepository = require("../repositories/scheduleRepository");

// const reconciliationService = require("./reconciliationService");

// const jobRepository = require("../repositories/jobHistoryRepository");

// const startScheduler = () => {
//   /*
//         Run every minute

//         * * * * *
//         | | | | |
//         | | | | |
//         | | | | +---- Day of week
//         | | | +------ Month
//         | | +-------- Day
//         | +---------- Hour
//         +------------ Minute

//     */

//   cron.schedule("* * * * *", async () => {
//     try {
//       const schedule = await schedulerRepository.getSchedule();

//       if (!schedule) {
//         return;
//       }

//       if (schedule.STATUS !== "ACTIVE") {
//         return;
//       }

//       const now = new Date();

//       const currentTime = now.toLocaleTimeString("en-GB", {
//         hour: "2-digit",
//         minute: "2-digit",
//         timeZone: schedule.TIMEZONE,
//       });

//       if (currentTime !== schedule.RUN_TIME) {
//         return;
//       }

//       console.log("Automatic reconciliation started");

//       /*
//                     Create Job
//                 */

//       const jobId = await jobRepository.createJob("SCHEDULED");

//       /*
//                     Execute reconciliation
//                 */

//       const result = await reconciliationService.runReconciliation();

//       /*
//                     Link job with run
//                 */

//       await jobRepository.updateJobRunId(
//         jobId,

//         result.runId,
//       );

//       await jobRepository.completeJob(
//         jobId,

//         "SUCCESS",
//       );

//       console.log("Automatic reconciliation completed");
//     } catch (error) {
//       console.error("Scheduler failed:", error.message);
//     }
//   });
// };

// module.exports = {
//   startScheduler,
// };

// // const cron = require("node-cron");

// // const schedulerRepository = require("../repositories/scheduleRepository");

// // const reconciliationService = require("./reconciliationService");

// // const jobRepository = require("../repositories/jobHistoryRepository");

// // /*
// // ========================================
// // Prevent duplicate execution
// // ========================================
// // */

// // let isRunning = false;

// // let lastExecutionKey = "";

// // const startScheduler = () => {
// //   console.log("Scheduler started...");

// //   /*
// //         Run every minute

// //         * * * * *
// //         | | | | |
// //         | | | | +---- Day of week
// //         | | | +------ Month
// //         | | +-------- Day
// //         | +---------- Hour
// //         +------------ Minute
// //     */

// //   cron.schedule("* * * * *", async () => {
// //     try {
// //       const schedule = await schedulerRepository.getSchedule();

// //       if (!schedule) {
// //         return;
// //       }

// //       if (schedule.STATUS !== "ACTIVE") {
// //         return;
// //       }

// //       const now = new Date();

// //       const currentTime = now.toLocaleTimeString("en-GB", {
// //         hour: "2-digit",
// //         minute: "2-digit",
// //         timeZone: schedule.TIMEZONE,
// //       });

// //       /*
// //             Ensure only HH:mm is compared
// //             */

// //       const scheduleTime = String(schedule.RUN_TIME).substring(0, 5);

// //       if (currentTime !== scheduleTime) {
// //         return;
// //       }

// //       /*
// //             Prevent running twice
// //             */

// //       const executionKey = `${now.toISOString().substring(0, 10)}_${scheduleTime}`;

// //       if (executionKey === lastExecutionKey) {
// //         console.log("Scheduler already executed for this schedule.");

// //         return;
// //       }

// //       /*
// //             Prevent overlapping execution
// //             */

// //       if (isRunning) {
// //         console.log("Previous reconciliation is still running.");

// //         return;
// //       }

// //       isRunning = true;

// //       lastExecutionKey = executionKey;

// //       console.log("Automatic reconciliation started");

// //       /*
// //             Create Job
// //             */

// //       const jobId = await jobRepository.createJob("SCHEDULED");

// //       /*
// //             Execute reconciliation
// //             */

// //       const result = await reconciliationService.runReconciliation();

// //       /*
// //             Link Job
// //             */

// //       await jobRepository.updateJobRunId(jobId, result.runId);

// //       /*
// //             Complete Job
// //             */

// //       await jobRepository.completeJob(jobId, "SUCCESS");

// //       console.log("Automatic reconciliation completed");
// //     } catch (error) {
// //       console.error("Scheduler failed:", error);
// //     } finally {
// //       isRunning = false;
// //     }
// //   });
// // };

// // module.exports = {
// //   startScheduler,
// // };

// const cron = require("node-cron");

// const scheduleRepository = require("../repositories/scheduleRepository");

// const reconciliationService = require("./reconciliationService");

// const jobRepository = require("../repositories/jobHistoryRepository");

// let isRunning = false;

// /*
//     Scheduler runs every minute

//     It checks:
//     - Is scheduler active?
//     - Is current time equal to configured time?
//     - Is another reconciliation already running?

// */

// const startScheduler = () => {
//   console.log("Scheduler started");

//   cron.schedule("* * * * *", async () => {
//     try {
//       /*
//                 Prevent duplicate execution

//                 Example:
//                 Query takes 1 hour
//                 Scheduler should not start again
//             */

//       if (isRunning) {
//         console.log("Reconciliation already running");

//         return;
//       }

//       const schedule = await scheduleRepository.getSchedule();

//       if (!schedule) {
//         return;
//       }

//       if (schedule.STATUS !== "ACTIVE") {
//         return;
//       }

//       const now = new Date();

//       const currentTime = now.toLocaleTimeString("en-GB", {
//         hour: "2-digit",
//         minute: "2-digit",
//         timeZone: schedule.TIMEZONE,
//       });

//       if (currentTime !== schedule.RUN_TIME) {
//         return;
//       }

//       /*
//                 Start reconciliation
//             */

//       isRunning = true;

//       console.log("Automatic reconciliation started");

//       /*
//                 Create job history
//             */

//       const jobId = await jobRepository.createJob("SCHEDULED");

//       try {
//         /*
//                     Execute reconciliation

//                     This will:
//                     - create REC_RECONCILIATION_RUN
//                     - load core deposit if required
//                     - load warehouse
//                     - compare
//                     - save result
//                     - notify
//                 */

//         const result = await reconciliationService.runReconciliation();

//         /*
//                     Link job with run
//                 */

//         await jobRepository.updateJobRunId(jobId, result.runId);

//         /*
//                     Mark job success
//                 */

//         await jobRepository.completeJob(
//           jobId,

//           "SUCCESS",
//         );

//         console.log("Automatic reconciliation completed");
//       } catch (error) {
//         console.error("Reconciliation failed:", error.message);

//         await jobRepository.completeJob(
//           jobId,

//           "FAILED",

//           error.message,
//         );

//         throw error;
//       }
//     } catch (error) {
//       console.error("Scheduler Error:", error.message);
//     } finally {
//       isRunning = false;
//     }
//   });
// };

// module.exports = {
//   startScheduler,
// };

const cron = require("node-cron");

const schedulerRepository = require("../repositories/scheduleRepository");

const reconciliationService = require("./reconciliationService");

const jobRepository = require("../repositories/jobHistoryRepository");

/*
========================================================
SCHEDULER STATE
========================================================

Prevents two reconciliation processes from running
at the same time.

Example:

DB2 query is still running
        ↓
next cron execution happens
        ↓
scheduler sees reconciliationRunning = true
        ↓
does NOT start another reconciliation
*/
let reconciliationRunning = false;

/*
========================================================
CHECK WHETHER CURRENT TIME MATCHES SCHEDULE
========================================================
*/
const isScheduledTime = (schedule) => {
  if (!schedule || schedule.STATUS !== "ACTIVE") {
    return false;
  }

  const now = new Date();

  const currentTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: schedule.TIMEZONE,
  });

  /*
        Oracle RUN_TIME should normally be:

        09:00
        13:30
        17:45

        We compare it with the current time.
    */

  return currentTime === schedule.RUN_TIME;
};

/*
========================================================
EXECUTE SCHEDULED RECONCILIATION
========================================================
*/
const executeScheduledReconciliation = async () => {
  /*
    ----------------------------------------------------
    Prevent concurrent reconciliation
    ----------------------------------------------------
    */

  if (reconciliationRunning) {
    console.log(
      "Reconciliation is already running. Skipping scheduled execution.",
    );

    return;
  }

  let jobId = null;

  try {
    /*
        =================================================
        1. LOCK SCHEDULER
        =================================================
        */

    reconciliationRunning = true;

    console.log("=================================================");

    console.log("Automatic reconciliation started");

    console.log("=================================================");

    /*
        =================================================
        2. CREATE JOB
        =================================================

        Creates:

        JOB_TYPE = SCHEDULED
        STATUS   = RUNNING

        RUN_ID remains NULL initially.
        */

    jobId = await jobRepository.createJob("SCHEDULED");

    console.log(`Scheduled job created. JOB_ID: ${jobId}`);

    /*
        =================================================
        3. RUN RECONCILIATION
        =================================================

        This will:

        1. Create reconciliation run
        2. Execute DB2 Core Banking query
        3. Store Core result in Oracle
        4. Load/read DWH result
        5. Perform reconciliation
        6. Save reconciliation results
        7. Send notification

        The expensive DB2 query is therefore executed
        ONLY here when reconciliation actually runs.
        */

    const result = await reconciliationService.runReconciliation();

    console.log("Reconciliation completed.");

    console.log(`RUN_ID: ${result.runId}`);

    /*
        =================================================
        4. LINK JOB TO RECONCILIATION RUN
        =================================================

        JOB_HISTORY.RUN_ID = RECONCILIATION_RUN.RUN_ID
        */

    await jobRepository.updateJobRunId(jobId, result.runId);

    /*
        =================================================
        5. MARK JOB AS SUCCESS
        =================================================
        */

    await jobRepository.completeJob(jobId, "SUCCESS");

    console.log(`Scheduled job ${jobId} completed successfully.`);

    console.log("=================================================");

    console.log("Automatic reconciliation completed successfully");

    console.log("=================================================");

    /*
        Return result in case another caller needs it.
        */

    return result;
  } catch (error) {
    /*
        =================================================
        6. HANDLE FAILURE
        =================================================
        */

    console.error("Automatic reconciliation failed:");

    console.error(error);

    /*
        -------------------------------------------------
        Mark JOB_HISTORY as FAILED
        -------------------------------------------------
        */

    if (jobId) {
      try {
        await jobRepository.completeJob(jobId, "FAILED", error.message);

        console.log(`Scheduled job ${jobId} marked as FAILED.`);
      } catch (jobError) {
        /*
                If updating JOB_HISTORY itself fails,
                don't hide the original reconciliation error.
                */

        console.error("Failed to update job status:", jobError.message);
      }
    }

    /*
        -------------------------------------------------
        Re-throw original error
        -------------------------------------------------
        */

    throw error;
  } finally {
    /*
        =================================================
        7. RELEASE LOCK
        =================================================
        */

    reconciliationRunning = false;

    console.log("Scheduler lock released.");
  }
};

/*
========================================================
START SCHEDULER
========================================================
*/
const startScheduler = () => {
  console.log("Reconciliation scheduler started.");

  /*
    ====================================================
    RUN EVERY MINUTE
    ====================================================

    We check the database schedule every minute.

    Cron:
        * * * * *

    Meaning:
        every minute
    */

  cron.schedule("* * * * *", async () => {
    try {
      /*
                =========================================
                1. GET ACTIVE SCHEDULE
                =========================================
                */

      const schedule = await schedulerRepository.getSchedule();

      /*
                -----------------------------------------
                No schedule configured
                -----------------------------------------
                */

      if (!schedule) {
        console.log("No reconciliation schedule configured.");

        return;
      }

      /*
                -----------------------------------------
                Schedule disabled
                -----------------------------------------
                */

      if (schedule.STATUS !== "ACTIVE") {
        return;
      }

      /*
                =========================================
                2. CHECK SCHEDULED TIME
                =========================================
                */

      const shouldRun = isScheduledTime(schedule);

      if (!shouldRun) {
        return;
      }

      /*
                =========================================
                3. EXECUTE RECONCILIATION
                =========================================
                */

      await executeScheduledReconciliation();
    } catch (error) {
      console.error("Scheduler execution error:", error.message);
    }
  });
};

/*
========================================================
EXPORT
========================================================
*/

module.exports = {
  startScheduler,
  executeScheduledReconciliation,
};
