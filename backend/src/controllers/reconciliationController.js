// const reconciliationService =
//     require("../services/reconciliationService");

// const jobRepository =
//     require("../repositories/jobHistoryRepository");

// /*
//     Manual reconciliation execution

//     ADMIN / OPERATOR
// */

// const run = async (req, res) => {

//     let jobId;

//     try {

//         /*
//             1. Create Job History
//         */

//         jobId =
//             await jobRepository.createJob(
//                 "MANUAL"
//             );

//         /*
//             2. Execute reconciliation

//             This creates:
//             - RECONCILIATION_RUN
//             - RECONCILIATION_RESULT

//             Returns runId
//         */

//         const result =
//             await reconciliationService
//                 .runReconciliation();

//         /*
//             3. Link Job with Run

//             JOB_HISTORY.RUN_ID = RUN_ID
//         */

//         await jobRepository.updateJobRunId(

//             jobId,

//             result.runId

//         );
//         /*
//             4. Complete Job
//         */

//         await jobRepository.completeJob(

//             jobId,

//             "SUCCESS"

//         );
//         res.status(200).json({

//             message:
//                 "Reconciliation completed successfully",

//             jobId,

//             data:
//                 result

//         });

//     }

//     catch (error) {

//         console.error(
//             "Manual reconciliation failed:",
//             error.message
//         );

//         if (jobId) {

//             await jobRepository.completeJob(

//                 jobId,

//                 "FAILED",

//                 error.message

//             );

//         }
//         res.status(500).json({

//             message:
//                 "Reconciliation failed",

//             error:
//                 error.message

//         });

//     }

// };

// /*
//     Dashboard status API

//     Viewer/Admin/Operator

// */

// const getStatus = async (req, res) => {

//     try {

//         const latestJobs =
//             await jobRepository.getLatestJobs();

//         const latestJob =
//             latestJobs[0];

//         res.json({

//             schedulerStatus:
//                 "ACTIVE",

//             lastExecution:
//                 latestJob || null,

//             message:
//                 "EDRMS monitoring active"

//         });

//     }

//     catch (error) {

//         res.status(500)
//             .json({

//                 message:
//                     error.message

//             });

//     }

// };

// module.exports = {

//     run,

//     getStatus

// };

const reconciliationService = require("../services/reconciliationService");
const jobRepository = require("../repositories/jobHistoryRepository");

/*
=========================================================
MANUAL RECONCILIATION EXECUTION
ADMIN / OPERATOR
=========================================================
*/
const run = async (req, res) => {
  let jobId = null;

  try {
    /*
        =================================================
        1. CREATE JOB HISTORY
        =================================================
        */

    jobId = await jobRepository.createJob("MANUAL");

    console.log("Manual reconciliation job created:", jobId);

    /*
        =================================================
        2. EXECUTE RECONCILIATION
        =================================================

        runReconciliation():

        - Creates REC_RECONCILIATION_RUN
        - Executes expensive DB2 query
        - Stores CORE result in REC_DEPOSIT_CORE
        - Loads warehouse data
        - Performs reconciliation
        - Stores reconciliation results
        - Updates reconciliation run status
        - Sends notification

        It returns:
            {
                runId,
                ...
            }
        */

    const result = await reconciliationService.runReconciliation({
      createdBy: req.user?.username || "SYSTEM",
    });

    /*
        =================================================
        3. LINK JOB TO RECONCILIATION RUN
        =================================================
        */

    await jobRepository.updateJobRunId(jobId, result.runId);

    /*
        =================================================
        4. MARK JOB AS SUCCESS
        =================================================
        */

    await jobRepository.completeJob(jobId, "SUCCESS");

    /*
        =================================================
        5. RETURN RESPONSE
        =================================================
        */

    return res.status(200).json({
      message: "Reconciliation completed successfully",

      jobId,

      runId: result.runId,

      data: result,
    });
  } catch (error) {
    /*
        =================================================
        RECONCILIATION FAILED
        =================================================
        */

    console.error("Manual reconciliation failed:", error);

    /*
        =================================================
        MARK JOB AS FAILED
        =================================================
        */

    if (jobId) {
      try {
        await jobRepository.completeJob(jobId, "FAILED", error.message);
      } catch (jobError) {
        console.error("Failed to update job history:", jobError.message);
      }
    }

    /*
        =================================================
        RETURN ERROR
        =================================================
        */

    return res.status(500).json({
      message: "Reconciliation failed",

      jobId,

      error: error.message,
    });
  }
};

/*
=========================================================
DASHBOARD / MONITORING STATUS
VIEWER / ADMIN / OPERATOR
=========================================================
*/
const getStatus = async (req, res) => {
  try {
    const latestJobs = await jobRepository.getLatestJobs();

    const latestJob = latestJobs.length > 0 ? latestJobs[0] : null;

    return res.status(200).json({
      schedulerStatus: "ACTIVE",

      lastExecution: latestJob,

      message: "EDRMS monitoring active",
    });
  } catch (error) {
    console.error("Get reconciliation status failed:", error.message);

    return res.status(500).json({
      message: "Failed to get reconciliation status",

      error: error.message,
    });
  }
};

module.exports = {
  run,
  getStatus,
};
