

// const dashboardRepository = require("../repositories/dashboardRepository");

// const resultRepository = require("../repositories/resultRepository");

// const coreDepositRepository = require("../repositories/coreDepositRepository");

// const warehouseRepository = require("../repositories/warehouseRepository");

// const getDashboard = async () => {
//   /*
//     ============================================
//     1. MONITORING INFORMATION
//     ============================================
//     */

//   const latestRun = await dashboardRepository.getLatestRun();

//   const scheduler = await dashboardRepository.getScheduler();

//   const jobStatistics = await dashboardRepository.getJobStatistics();

//   const recentJobs = await dashboardRepository.getRecentJobs();

//   /*
//     ============================================
//     2. CORE DEPOSIT

//     IMPORTANT:
//     READ FROM ORACLE CACHE.

//     NEVER EXECUTE DB2 HERE.
//     ============================================
//     */

//   const core = await coreDepositRepository.getLatestDeposit();

//   /*
//     ============================================
//     3. WAREHOUSE DEPOSIT

//     Warehouse is already stored/loaded in Oracle,
//     so this is safe for dashboard.
//     ============================================
//     */

//   const warehouse = await warehouseRepository.getDepositSummary();

//   /*
//     ============================================
//     4. RECONCILIATION RULES
//     ============================================
//     */

//   let rules = [];

//   if (latestRun) {
//     const results = await resultRepository.getResultsByRun(latestRun.RUN_ID);

//     rules = results.map((rule) => ({
//       name: rule.NAME || rule.name,

//       status: rule.STATUS || rule.status,

//       difference: rule.DIFFERENCE ?? rule.difference ?? 0,

//       expected: rule.EXPECTED_VALUE ?? rule.expected,

//       actual: rule.ACTUAL_VALUE ?? rule.actual,

//       message: rule.MESSAGE || rule.message,
//     }));
//   }

//   /*
//     ============================================
//     5. CORE AMOUNT
//     ============================================
//     */

//   const coreDeposit = core ? Number(core.DEPOSIT_AMOUNT || 0) : 0;

//   /*
//     ============================================
//     6. RESPONSE
//     ============================================
//     */

//   return {
//     systemStatus: "ACTIVE",

//     timestamp: new Date(),

//     scheduler,

//     jobs: {
//       total: Number(jobStatistics?.TOTAL_JOBS || 0),

//       successful: Number(jobStatistics?.SUCCESS_JOBS || 0),

//       failed: Number(jobStatistics?.FAILED_JOBS || 0),

//       running: Number(jobStatistics?.RUNNING_JOBS || 0),
//     },

//     latestRun,

//     recentJobs,

//     /*
//         ============================================
//         DEPOSITS
//         ============================================
//         */

//     deposits: {
//       core: coreDeposit,

//       warehouse: Number(warehouse?.totalDeposit || 0),

//       retail: Number(warehouse?.retailDeposit || 0),

//       segmentation: Number(warehouse?.segmentationDeposit || 0),

//       coreSnapshot: core
//         ? {
//             businessDate: core.BUSINESS_DATE,

//             insertedDate: core.CREATED_DATE,

//             status: core.STATUS,

//             durationSeconds: core.QUERY_DURATION_SECONDS,
//           }
//         : null,
//     },

//     segments: warehouse?.segments || {},

//     /*
//         ============================================
//         RECONCILIATION RULES
//         ============================================
//         */

//     rules: {
//       rule1: rules[0] || {
//         name: "CORE VS WAREHOUSE TOTAL DEPOSIT",

//         status: "PENDING",

//         difference: 0,
//       },

//       rule2: rules[1] || {
//         name: "Retail + Segmentation Validation",

//         status: "PENDING",

//         difference: 0,
//       },

//       rule3: rules[2] || {
//         name: "Segment Total Validation",

//         status: "PENDING",

//         difference: 0,
//       },

//       summary: {
//         total: rules.length,

//         passed: rules.filter((r) => r.status === "PASS").length,

//         failed: rules.filter((r) => r.status === "FAIL").length,
//       },
//     },
//   };
// };

// module.exports = {
//   getDashboard,
// };


const dashboardRepository =
  require("../repositories/dashboardRepository");

const resultRepository =
  require("../repositories/resultRepository");

const coreDepositRepository =
  require("../repositories/coreDepositRepository");

const warehouseRepository =
  require("../repositories/warehouseRepository");

const getDashboard = async () => {

  /*
  ============================================
  1. MONITORING INFORMATION
  ============================================
  */

  const latestRun =
    await dashboardRepository.getLatestRun();

  const scheduler =
    await dashboardRepository.getScheduler();

  const jobStatistics =
    await dashboardRepository.getJobStatistics();

  const recentJobs =
    await dashboardRepository.getRecentJobs();


  /*
  ============================================
  2. CORE DEPOSIT
  ============================================

  Read from Oracle cache.

  NEVER execute DB2 here.
  ============================================
  */

  const core =
    await coreDepositRepository.getLatestDeposit();


  /*
  ============================================
  3. WAREHOUSE DEPOSIT
  ============================================
  */

  const warehouse =
    await warehouseRepository.getDepositSummary();


  /*
  ============================================
  4. RECONCILIATION RULES
  ============================================
  */

  let rules = [];

  if (latestRun) {

    const results =
      await resultRepository.getResultsByRun(
        latestRun.RUN_ID
      );

    rules = results.map((rule) => ({
      name:
        rule.NAME ||
        rule.name,

      status:
        rule.STATUS ||
        rule.status,

      difference:
        rule.DIFFERENCE ??
        rule.difference ??
        0,

      expected:
        rule.EXPECTED_VALUE ??
        rule.expected,

      actual:
        rule.ACTUAL_VALUE ??
        rule.actual,

      message:
        rule.MESSAGE ||
        rule.message,
    }));
  }


  /*
  ============================================
  5. CORE AMOUNT
  ============================================
  */

  const coreDeposit =
    core
      ? Number(core.DEPOSIT_AMOUNT || 0)
      : 0;


  /*
  ============================================
  6. RESPONSE
  ============================================
  */

  return {

    systemStatus: "ACTIVE",

    timestamp: new Date(),

    scheduler,

    jobs: {
      total:
        Number(
          jobStatistics?.TOTAL_JOBS || 0
        ),

      successful:
        Number(
          jobStatistics?.SUCCESS_JOBS || 0
        ),

      failed:
        Number(
          jobStatistics?.FAILED_JOBS || 0
        ),

      running:
        Number(
          jobStatistics?.RUNNING_JOBS || 0
        ),
    },

    latestRun,

    recentJobs,


    /*
    ============================================
    DEPOSITS
    ============================================
    */

    deposits: {

      core: coreDeposit,

      warehouse:
        Number(
          warehouse?.totalDeposit || 0
        ),

      retail:
        Number(
          warehouse?.retailDeposit || 0
        ),

      segmentation:
        Number(
          warehouse?.segmentationDeposit || 0
        ),

      coreSnapshot: core
        ? {
          businessDate:
            core.BUSINESS_DATE,

          insertedDate:
            core.CREATED_DATE,

          status:
            core.STATUS,

          durationSeconds:
            core.QUERY_DURATION_SECONDS,
        }
        : null,
    },


    segments:
      warehouse?.segments || {},


    /*
    ============================================
    RECONCILIATION RULES
    ============================================
    */

    rules: {

      rule1:
        rules.find(
          (r) =>
            r.name ===
            "CORE VS WAREHOUSE TOTAL DEPOSIT"
        ) || {
          name:
            "CORE VS WAREHOUSE TOTAL DEPOSIT",

          status: "PENDING",

          difference: 0,
        },

      rule2:
        rules.find(
          (r) =>
            r.name ===
            "Retail + Segmentation Validation"
        ) || {
          name:
            "Retail + Segmentation Validation",

          status: "PENDING",

          difference: 0,
        },

      rule3:
        rules.find(
          (r) =>
            r.name ===
            "Segment Total Validation"
        ) || {
          name:
            "Segment Total Validation",

          status: "PENDING",

          difference: 0,
        },

      summary: {

        total:
          rules.length,

        passed:
          rules.filter(
            (r) =>
              r.status === "PASS"
          ).length,

        failed:
          rules.filter(
            (r) =>
              r.status === "FAIL"
          ).length,
      },
    },
  };
};

module.exports = {
  getDashboard,
};