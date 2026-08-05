// OLD Scheduler
// const cron = require("node-cron");

// const scheduleRepository = require("../repositories/scheduleRepository");

// const reconciliationService = require("../services/reconciliationService");

// const jobRepository = require("../repositories/jobHistoryRepository");

// const startScheduler = () => {
//   /*
//         Scheduler runs every minute

//         It checks database schedule table
//     */

//   cron.schedule(
//     "* * * * *",

//     async () => {
//       try {
//         const schedule = await scheduleRepository.getActiveSchedule();

//         if (!schedule) {
//           console.log("No active reconciliation schedule");

//           return;
//         }

//         const now = new Date();

//         const currentTime = now.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//           timeZone: schedule.TIMEZONE,
//         });

//         const currentDay = now
//           .toLocaleDateString("en-US", {
//             weekday: "short",
//             timeZone: schedule.TIMEZONE,
//           })
//           .toUpperCase();

//         const allowedDays = schedule.DAYS_OF_WEEK.split(",");

//         if (
//           currentTime === schedule.RUN_TIME &&
//           allowedDays.includes(currentDay)
//         ) {
//           console.log("Starting scheduled reconciliation...");

//           let jobId;

//           try {
//             /*
//                            Create job history
//                         */

//             jobId = await jobRepository.createJob("SCHEDULED");

//             await reconciliationService.runReconciliation();

//             await jobRepository.completeJob(
//               jobId,

//               "SUCCESS",
//             );

//             console.log("Scheduled reconciliation completed");
//           } catch (error) {
//             if (jobId) {
//               await jobRepository.completeJob(
//                 jobId,

//                 "FAILED",

//                 error.message,
//               );
//             }

//             console.error(
//               "Scheduled reconciliation failed:",

//               error.message,
//             );
//           }
//         }
//       } catch (error) {
//         console.error(
//           "Scheduler Error:",

//           error.message,
//         );
//       }
//     },
//   );

//   console.log("Dynamic reconciliation scheduler started");
// };

// module.exports = startScheduler;

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
// let reconciliationRunning = false;
let reconciliationRunning = false;
let schedulerStarted = false;
let lastExecutionKey = null;
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
  if (schedulerStarted) {
    console.log("Scheduler already initialized. Skipping.");

    return;
  }

  schedulerStarted = true;

  console.log("Reconciliation scheduler started.");
  console.log("========== SCHEDULER INITIALIZED ==========");

  console.log("Process ID:", process.pid);
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
==========================================
PREVENT SAME DAY DUPLICATE EXECUTION
==========================================

Example:

2026-08-03_10:06

After first execution:

lastExecutionKey =
2026-08-03_10:06


Second cron check:

same key

skip

==========================================
*/

      const today = new Date().toISOString().substring(0, 10);

      const executionKey = `${today}_${schedule.RUN_TIME}`;

      if (lastExecutionKey === executionKey) {
        console.log("Schedule already executed for this time.");

        return;
      }

      /*
    Mark executed BEFORE starting
*/

      lastExecutionKey = executionKey;

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
