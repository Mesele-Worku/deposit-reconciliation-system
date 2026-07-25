// const coreRepository = require("../repositories/coreBankingRepository");

// const warehouseRepository = require("../repositories/warehouseRepository");

// const reconciliationRepository = require("../repositories/reconciliationRepository");

// const resultRepository = require("../repositories/resultRepository");

// const runReconciliation = async () => {
//   const runId = await reconciliationRepository.createRun(
//     new Date().toISOString().substring(0, 10),
//   );

//   try {
//     const core = await coreRepository.getDepositSummary();

//     console.log("CORE DATA:");
//     console.log(core);

//     const warehouse = await warehouseRepository.getDepositSummary();

//     console.log("WAREHOUSE DATA:");
//     console.log(warehouse);

//     // RULE 1

//     const rule1Difference = core.totalDeposit - warehouse.totalDeposit;

//     const rule1 = rule1Difference === 0;

//     await resultRepository.saveResult({
//       runId,

//       ruleName: "CORE VS WAREHOUSE TOTAL DEPOSIT",

//       status: rule1 ? "PASS" : "FAIL",

//       expected: core.totalDeposit,

//       actual: warehouse.totalDeposit,

//       difference: rule1Difference,

//       message: rule1 ? "Deposit matched" : "Deposit mismatch",
//     });

//     // RULE 2

//     const calculatedTotal =
//       warehouse.retailDeposit + warehouse.segmentationDeposit;

//     const rule2Difference = calculatedTotal - warehouse.totalDeposit;

//     const rule2 = rule2Difference === 0;

//     await resultRepository.saveResult({
//       runId,

//       ruleName: "Retail + Segmentation Validation",

//       status: rule2 ? "PASS" : "FAIL",

//       expected: warehouse.totalDeposit,

//       actual: calculatedTotal,

//       difference: rule2Difference,

//       message: rule2
//         ? "Retail and segmentation matched"
//         : "Retail and segmentation mismatch",
//     });

//     // RULE 3

//     const segments = warehouse.segments || {};

//     const segmentTotal = Object.values(segments).reduce((a, b) => a + b, 0);

//     const rule3Difference = segmentTotal - warehouse.segmentationDeposit;

//     const rule3 = rule3Difference === 0;

//     await resultRepository.saveResult({
//       runId,

//       ruleName: "Segment Total Validation",

//       status: rule3 ? "PASS" : "FAIL",

//       expected: warehouse.segmentationDeposit,

//       actual: segmentTotal,

//       difference: rule3Difference,

//       message: rule3 ? "Segments matched" : "Segments mismatch",
//     });

//     /*
//         COMPLETE RUN
//     */

//     await reconciliationRepository.updateRunStatus(runId, "COMPLETED");

//     return {
//       runId,

//       timestamp: new Date(),

//       monitoringStatus: "ACTIVE",

//       coreDeposit: core.totalDeposit,

//       warehouseDeposit: warehouse.totalDeposit,

//       retailDeposit: warehouse.retailDeposit,

//       segmentationDeposit: warehouse.segmentationDeposit,

//       segments: warehouse.segments,

//       rule1: {
//         name: "Warehouse Total Deposit Vs Core Total Deposit",

//         status: rule1 ? "PASS" : "FAIL",

//         difference: rule1Difference,
//       },

//       rule2: {
//         name: "Retail + Segmentation Validation",

//         status: rule2 ? "PASS" : "FAIL",

//         difference: rule2Difference,
//       },

//       rule3: {
//         name: "Segment Total Validation",

//         status: rule3 ? "PASS" : "FAIL",

//         difference: rule3Difference,
//       },
//     };
//   } catch (error) {
//     await reconciliationRepository.updateRunStatus(runId, "FAILED");

//     throw error;
//   }
// };

// module.exports = {
//   runReconciliation,
// };

const coreRepository = require("../repositories/coreBankingRepository");

const warehouseRepository = require("../repositories/warehouseRepository");

const reconciliationRepository = require("../repositories/reconciliationRepository");

const resultRepository = require("../repositories/resultRepository");

const notificationService = require("./notificationService");

const runReconciliation = async () => {
  const runId = await reconciliationRepository.createRun(
    new Date().toISOString().substring(0, 10),
  );

  try {
    /*
        1. Get Core Banking Data
    */

    const core = await coreRepository.getDepositSummary();

    console.log("CORE DATA:");
    console.log(core);

    /*
        2. Get Warehouse Data
    */

    const warehouse = await warehouseRepository.getDepositSummary();

    console.log("WAREHOUSE DATA:");
    console.log(warehouse);

    /*
        RULE 1

        Core Deposit
        VS
        Warehouse Deposit
    */

    const rule1Difference = core.totalDeposit - warehouse.totalDeposit;

    const rule1 = rule1Difference === 0;

    await resultRepository.saveResult({
      runId,

      ruleName: "CORE VS WAREHOUSE TOTAL DEPOSIT",

      status: rule1 ? "PASS" : "FAIL",

      expected: core.totalDeposit,

      actual: warehouse.totalDeposit,

      difference: rule1Difference,

      message: rule1 ? "Deposit matched" : "Deposit mismatch",
    });

    /*
        RULE 2

        Retail + Segmentation
        Validation

    */

    const calculatedTotal =
      warehouse.retailDeposit + warehouse.segmentationDeposit;

    const rule2Difference = calculatedTotal - warehouse.totalDeposit;

    const rule2 = rule2Difference === 0;

    await resultRepository.saveResult({
      runId,

      ruleName: "Retail + Segmentation Validation",

      status: rule2 ? "PASS" : "FAIL",

      expected: warehouse.totalDeposit,

      actual: calculatedTotal,

      difference: rule2Difference,

      message: rule2
        ? "Retail and segmentation matched"
        : "Retail and segmentation mismatch",
    });

    /*
        RULE 3

        Segment Validation

    */

    const segments = warehouse.segments || {};

    const segmentTotal = Object.values(segments).reduce(
      (sum, value) => sum + value,
      0,
    );

    const rule3Difference = segmentTotal - warehouse.segmentationDeposit;

    const rule3 = rule3Difference === 0;

    await resultRepository.saveResult({
      runId,

      ruleName: "Segment Total Validation",

      status: rule3 ? "PASS" : "FAIL",

      expected: warehouse.segmentationDeposit,

      actual: segmentTotal,

      difference: rule3Difference,

      message: rule3 ? "Segments matched" : "Segments mismatch",
    });

    /*
        COMPLETE RUN
    */

    await reconciliationRepository.updateRunStatus(runId, "COMPLETED");

    /*
        SEND SUCCESS NOTIFICATION

    */

    await notificationService.reconciliationSuccess({
      RUN_ID: runId,

      CORE_DEPOSIT: core.totalDeposit,

      WAREHOUSE_DEPOSIT: warehouse.totalDeposit,
    });

    return {
      runId,

      timestamp: new Date(),

      monitoringStatus: "ACTIVE",

      coreDeposit: core.totalDeposit,

      warehouseDeposit: warehouse.totalDeposit,

      retailDeposit: warehouse.retailDeposit,

      segmentationDeposit: warehouse.segmentationDeposit,

      segments: warehouse.segments,

      rule1: {
        name: "Warehouse Total Deposit Vs Core Total Deposit",

        status: rule1 ? "PASS" : "FAIL",

        difference: rule1Difference,
      },

      rule2: {
        name: "Retail + Segmentation Validation",

        status: rule2 ? "PASS" : "FAIL",

        difference: rule2Difference,
      },

      rule3: {
        name: "Segment Total Validation",

        status: rule3 ? "PASS" : "FAIL",

        difference: rule3Difference,
      },
    };
  } catch (error) {
    console.error("Reconciliation failed:", error);

    await reconciliationRepository.updateRunStatus(runId, "FAILED");

    /*
        SEND FAILURE NOTIFICATION

    */

    await notificationService.reconciliationFailure({
      RUN_ID: runId,

      ERROR: error.message,
    });

    throw error;
  }
};

module.exports = {
  runReconciliation,
};
