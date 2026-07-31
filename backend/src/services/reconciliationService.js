// const coreRepository = require("../repositories/coreBankingRepository");

// const warehouseRepository = require("../repositories/warehouseRepository");

// const reconciliationRepository = require("../repositories/reconciliationRepository");

// const resultRepository = require("../repositories/resultRepository");

// const notificationService = require("./notificationService");

// const runReconciliation = async () => {
//   const businessDate = new Date().toISOString().substring(0, 10);

//   const runId = await reconciliationRepository.createRun(businessDate);

//   try {
//     /*
//     ===============================
//     GET SOURCE DATA
//     ===============================
//     */
//     // Load latest DWH data
//     await warehouseRepository.loadDepositSummary(businessDate);
//     const core = await coreRepository.getDepositSummary();

//     console.log("CORE DATA:");
//     console.log(core);
//     console.log(core.totalDeposit);
//     const warehouse = await warehouseRepository.getDepositSummary();

//     console.log("WAREHOUSE DATA:");
//     console.log(warehouse);

//     /*
//     ===============================
//     RULE 1
//     ===============================
//     */

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

//     /*
//     ===============================
//     RULE 2
//     ===============================
//     */

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

//     /*
//     ===============================
//     RULE 3
//     ===============================
//     */

//     const segments = warehouse.segments || {};

//     const segmentTotal = Object.values(segments).reduce(
//       (sum, value) => sum + value,
//       0,
//     );

//     const rule3Difference =
//       Math.round(segmentTotal) - Math.round(warehouse.segmentationDeposit);

//     const rule3 = rule3Difference === 0;

//     await resultRepository.saveResult({
//       runId,

//       ruleName: "Segment Total Validation",

//       status: rule3 ? "PASS" : "FAIL",

//       expected: Math.round(warehouse.segmentationDeposit),

//       actual: Math.round(segmentTotal),

//       difference: rule3Difference,

//       message: rule3 ? "Segments matched" : "Segments mismatch",
//     });

//     /*
//     ===============================
//     UPDATE RUN STATUS
//     ===============================
//     */

//     await reconciliationRepository.updateRunStatus(runId, "COMPLETED");

//     /*
//     ===============================
//     CHECK FAILED RULES
//     ===============================
//     */

//     const failedRules = [];

//     if (!rule1) {
//       failedRules.push({
//         name: "Core Vs Warehouse Deposit",
//         difference: rule1Difference,
//       });
//     }

//     if (!rule2) {
//       failedRules.push({
//         name: "Retail + Segmentation Validation",
//         difference: rule2Difference,
//       });
//     }

//     if (!rule3) {
//       failedRules.push({
//         name: "Segment Total Validation",
//         difference: rule3Difference,
//       });
//     }

//     /*
//     ===============================
//     SEND EMAIL
//     ===============================
//     */

//     if (failedRules.length === 0) {
//       await notificationService.reconciliationSuccess({
//         RUN_ID: runId,

//         BUSINESS_DATE: businessDate,

//         CORE_DEPOSIT: core.totalDeposit,

//         WAREHOUSE_DEPOSIT: warehouse.totalDeposit,
//       });
//     } else {
//       await notificationService.reconciliationFailure({
//         RUN_ID: runId,

//         BUSINESS_DATE: businessDate,

//         CORE_DEPOSIT: core.totalDeposit,

//         WAREHOUSE_DEPOSIT: warehouse.totalDeposit,

//         FAILED_RULES: failedRules,
//       });
//     }

//     /*
//     ===============================
//     RETURN RESULT
//     ===============================
//     */

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
//     console.error(error);

//     await reconciliationRepository.updateRunStatus(runId, "FAILED");

//     await notificationService.reconciliationFailure({
//       RUN_ID: runId,

//       BUSINESS_DATE: businessDate,

//       ERROR: error.message,
//     });

//     throw error;
//   }
// };

// module.exports = {
//   runReconciliation,
// };








// const coreRepository = require("../repositories/coreBankingRepository");

// const coreDepositRepository = require("../repositories/coreDepositRepository");

// const warehouseRepository = require("../repositories/warehouseRepository");

// const reconciliationRepository = require("../repositories/reconciliationRepository");

// const resultRepository = require("../repositories/resultRepository");

// const notificationService = require("./notificationService");

// const dashboardEventService =
//   require("./dashboardEventService");

// /*
// =========================================================
// RUN RECONCILIATION
// =========================================================

// This function:

// 1. Creates reconciliation RUN
// 2. Executes expensive DB2 query
// 3. Saves Core Banking result into Oracle
// 4. Loads Warehouse data
// 5. Performs reconciliation rules
// 6. Saves reconciliation results
// 7. Updates RUN status
// 8. Sends notification
// 9. Returns reconciliation result

// IMPORTANT:
// The expensive DB2 query is executed ONLY here.

// The dashboard does NOT execute DB2.
// =========================================================
// */

// const runReconciliation = async ({ createdBy = "SYSTEM" } = {}) => {
//   /*
//     =====================================================
//     BUSINESS DATE
//     =====================================================
//     */

//   const businessDate = new Date().toISOString().substring(0, 10);

//   /*
//     =====================================================
//     CREATE RECONCILIATION RUN
//     =====================================================
//     */

//   const runId = await reconciliationRepository.createRun(businessDate);

//   console.log("Reconciliation Run Created:", runId);

//   try {
//     /*
//         =================================================
//         STEP 1
//         GET CORE BANKING DATA FROM DB2
//         =================================================

//         IMPORTANT:

//         This is the ONLY place where the expensive
//         DB2 query is executed.

//         Dashboard will NEVER call this function.
//         */

//     console.log("========================================");

//     console.log("Starting Core Banking data extraction...");

//     console.log("Run ID:", runId);

//     console.log("Business Date:", businessDate);

//     console.log("========================================");

//     const core = await coreRepository.getDepositSummaryFromCore();

//     console.log("Core deposit:", core.totalDeposit);

//     /*
//         =================================================
//         STEP 2
//         SAVE CORE RESULT INTO ORACLE
//         =================================================

//         IMPORTANT:

//         runId is now passed here.

//         This creates the relationship:

//         REC_RECONCILIATION_RUN
//                     |
//                     | RUN_ID
//                     ↓
//         REC_DEPOSIT_CORE
//         */

//     await coreDepositRepository.saveDeposit({
//       runId,

//       businessDate,

//       amount: core.totalDeposit,

//       queryStartTime: core.queryStartTime,

//       queryEndTime: core.queryEndTime,

//       durationSeconds: core.durationSeconds,

//       createdBy,
//     });

//     console.log("Core deposit snapshot saved successfully.");

//     /*
//         =================================================
//         STEP 3
//         LOAD WAREHOUSE DATA
//         =================================================

//         The warehouse repository loads the latest
//         warehouse deposit information into Oracle.
//         */

//     console.log("Loading Warehouse deposit data...");

//     // await warehouseRepository.loadDepositSummary(businessDate);

//     /*
//         =================================================
//         GET WAREHOUSE DATA
//         =================================================
//         */

//     const warehouse = await warehouseRepository.getDepositSummary();

//     console.log("Warehouse data:", warehouse);

//     /*
//         =================================================
//         STEP 4
//         RULE 1
//         CORE VS WAREHOUSE TOTAL DEPOSIT
//         =================================================
//         */

//     const coreAmount = Number(core.totalDeposit || 0);

//     const warehouseAmount = Number(warehouse.totalDeposit || 0);

//     const rule1Difference = coreAmount - warehouseAmount;

//     /*
//         Use a tolerance for monetary comparison.

//         Difference smaller than 0.01 ETB
//         is considered matched.
//         */

//     const rule1 = Math.abs(rule1Difference) < 0.01;

//     await resultRepository.saveResult({
//       runId,

//       ruleName: "CORE VS WAREHOUSE TOTAL DEPOSIT",

//       status: rule1 ? "PASS" : "FAIL",

//       expected: coreAmount,

//       actual: warehouseAmount,

//       difference: rule1Difference,

//       message: rule1 ? "Deposit matched" : "Deposit mismatch",
//     });

//     /*
//         =================================================
//         STEP 5
//         RULE 2
//         RETAIL + SEGMENTATION
//         =================================================
//         */

//     const retailDeposit = Number(warehouse.retailDeposit || 0);

//     const segmentationDeposit = Number(warehouse.segmentationDeposit || 0);

//     const calculatedTotal = retailDeposit + segmentationDeposit;

//     const rule2Difference = calculatedTotal - warehouseAmount;

//     const rule2 = Math.abs(rule2Difference) < 0.01;

//     await resultRepository.saveResult({
//       runId,

//       ruleName: "Retail + Segmentation Validation",

//       status: rule2 ? "PASS" : "FAIL",

//       expected: warehouseAmount,

//       actual: calculatedTotal,

//       difference: rule2Difference,

//       message: rule2
//         ? "Retail and segmentation matched"
//         : "Retail and segmentation mismatch",
//     });

//     /*
//         =================================================
//         STEP 6
//         RULE 3
//         SEGMENT TOTAL
//         =================================================
//         */

//     const segments = warehouse.segments || {};

//     const segmentTotal = Object.values(segments).reduce(
//       (sum, value) => sum + Number(value || 0),
//       0,
//     );

//     const rule3Difference = segmentTotal - segmentationDeposit;

//     const rule3 = Math.abs(rule3Difference) < 0.01;

//     await resultRepository.saveResult({
//       runId,

//       ruleName: "Segment Total Validation",

//       status: rule3 ? "PASS" : "FAIL",

//       expected: segmentationDeposit,

//       actual: segmentTotal,

//       difference: rule3Difference,

//       message: rule3 ? "Segments matched" : "Segments mismatch",
//     });

//     /*
//         =================================================
//         STEP 7
//         COLLECT FAILED RULES
//         =================================================
//         */

//     const failedRules = [];

//     if (!rule1) {
//       failedRules.push({
//         name: "Core Vs Warehouse Deposit",

//         difference: rule1Difference,
//       });
//     }

//     if (!rule2) {
//       failedRules.push({
//         name: "Retail + Segmentation Validation",

//         difference: rule2Difference,
//       });
//     }

//     if (!rule3) {
//       failedRules.push({
//         name: "Segment Total Validation",

//         difference: rule3Difference,
//       });
//     }

//     /*
//         =================================================
//         STEP 8
//         UPDATE RECONCILIATION RUN STATUS
//         =================================================

//         The reconciliation process itself completed.

//         PASS/FAIL is represented by the individual
//         reconciliation results.
//         */

//     await reconciliationRepository.updateRunStatus(runId, "COMPLETED");

//     /*
//         =================================================
//         STEP 9
//         SEND NOTIFICATION
//         =================================================
//         */

//     if (failedRules.length === 0) {
//       await notificationService.reconciliationSuccess({
//         RUN_ID: runId,

//         BUSINESS_DATE: businessDate,

//         CORE_DEPOSIT: coreAmount,

//         WAREHOUSE_DEPOSIT: warehouseAmount,
//       });
//     } else {
//       await notificationService.reconciliationFailure({
//         RUN_ID: runId,

//         BUSINESS_DATE: businessDate,

//         CORE_DEPOSIT: coreAmount,

//         WAREHOUSE_DEPOSIT: warehouseAmount,

//         FAILED_RULES: failedRules,
//       });
//     }

//     /*
//         =================================================
//         STEP 10
//         RETURN RESULT
//         =================================================
//         */

//     return {
//       runId,

//       businessDate,

//       timestamp: new Date(),

//       monitoringStatus: "ACTIVE",

//       /*
//             CORE
//             */

//       coreDeposit: coreAmount,

//       /*
//             WAREHOUSE
//             */

//       warehouseDeposit: warehouseAmount,

//       retailDeposit: retailDeposit,

//       segmentationDeposit: segmentationDeposit,

//       /*
//             SEGMENTS
//             */

//       segments: segments,

//       /*
//             RULE 1
//             */

//       rule1: {
//         name: "Warehouse Total Deposit Vs Core Total Deposit",

//         status: rule1 ? "PASS" : "FAIL",

//         expected: coreAmount,

//         actual: warehouseAmount,

//         difference: rule1Difference,
//       },

//       /*
//             RULE 2
//             */

//       rule2: {
//         name: "Retail + Segmentation Validation",

//         status: rule2 ? "PASS" : "FAIL",

//         expected: warehouseAmount,

//         actual: calculatedTotal,

//         difference: rule2Difference,
//       },

//       /*
//             RULE 3
//             */

//       rule3: {
//         name: "Segment Total Validation",

//         status: rule3 ? "PASS" : "FAIL",

//         expected: segmentationDeposit,

//         actual: segmentTotal,

//         difference: rule3Difference,
//       },

//       /*
//             SUMMARY
//             */

//       summary: {
//         totalRules: 3,

//         passed: [rule1, rule2, rule3].filter(Boolean).length,

//         failed: failedRules.length,
//       },
//     };
//   } catch (error) {
//     /*
//         =================================================
//         RECONCILIATION FAILED
//         =================================================
//         */

//     console.error("========================================");

//     console.error("Reconciliation failed");

//     console.error("Run ID:", runId);

//     console.error("Error:", error.message);

//     console.error("========================================");

//     /*
//         =================================================
//         UPDATE RUN STATUS
//         =================================================
//         */

//     try {
//       await reconciliationRepository.updateRunStatus(runId, "FAILED");
//     } catch (statusError) {
//       console.error(
//         "Failed to update reconciliation run status:",
//         statusError.message,
//       );
//     }

//     /*
//         =================================================
//         SAVE CORE FAILURE SNAPSHOT
//         =================================================

//         If the DB2 query fails, there may be no
//         queryStartTime available from core.

//         We therefore save a FAILED record.

//         IMPORTANT:
//         runId is also stored here.
//         */

//     try {
//       await coreDepositRepository.saveFailedDeposit({
//         runId,

//         businessDate,

//         queryStartTime: null,

//         queryEndTime: new Date(),

//         durationSeconds: null,

//         errorMessage: error.message,

//         createdBy,
//       });
//     } catch (saveError) {
//       console.error("Could not save core failure snapshot:", saveError.message);
//     }

//     /*
//         =================================================
//         SEND FAILURE NOTIFICATION
//         =================================================
//         */

//     try {
//       await notificationService.reconciliationFailure({
//         RUN_ID: runId,

//         BUSINESS_DATE: businessDate,

//         ERROR: error.message,
//       });
//     } catch (notificationError) {
//       console.error(
//         "Failed to send failure notification:",
//         notificationError.message,
//       );
//     }

//     /*
//         =================================================
//         RE-THROW ERROR
//         =================================================
//         */

//     throw error;
//   }
// };

// module.exports = {
//   runReconciliation,
// };




const coreRepository = require("../repositories/coreBankingRepository");
const coreDepositRepository = require("../repositories/coreDepositRepository");
const warehouseRepository = require("../repositories/warehouseRepository");
const reconciliationRepository = require("../repositories/reconciliationRepository");
const resultRepository = require("../repositories/resultRepository");
const notificationService = require("./notificationService");

// Optional: dashboard event service.
// If this file does not exist yet, remove these two lines and
// the dashboard notification section below.
const dashboardEventService = require("./dashboardEventService");

/*
=========================================================
RUN RECONCILIATION
=========================================================

This function:

1. Creates reconciliation RUN
2. Gets Core Banking data from DB2
3. Saves Core Banking snapshot into Oracle
4. Gets Warehouse data from Oracle
5. Executes reconciliation rules
6. Saves reconciliation results
7. Updates reconciliation RUN status
8. Sends notification
9. Notifies dashboard immediately
10. Returns reconciliation result

IMPORTANT:

The expensive DB2 query is executed ONLY here.

The dashboard does NOT execute DB2.
*/

const runReconciliation = async ({ createdBy = "SYSTEM" } = {}) => {
    /*
    =======================================================
    STEP 1
    BUSINESS DATE
    =======================================================
    */

    const businessDate = new Date().toISOString().substring(0, 10);

    /*
    =======================================================
    STEP 2
    CREATE RECONCILIATION RUN
    =======================================================
    */

    const runId = await reconciliationRepository.createRun(businessDate);

    console.log("========================================");
    console.log("Reconciliation Run Created");
    console.log("Run ID:", runId);
    console.log("Business Date:", businessDate);
    console.log("Created By:", createdBy);
    console.log("========================================");

    try {
        /*
        =====================================================
        STEP 3
        GET CORE BANKING DATA
        =====================================================
    
        This executes the expensive DB2 query.
    
        IMPORTANT:
        Do NOT call this from dashboardService.
        */

        console.log("Starting Core Banking data extraction...");

        const core = await coreRepository.getDepositSummaryFromCore();

        console.log("Core Banking data received:");
        console.log(core);

        const coreAmount = Number(core?.totalDeposit || 0);

        console.log("Core deposit:", coreAmount);

        /*
        =====================================================
        STEP 4
        SAVE CORE SNAPSHOT INTO ORACLE
        =====================================================
        */

        await coreDepositRepository.saveDeposit({
            runId,

            businessDate,

            amount: coreAmount,

            queryStartTime: core?.queryStartTime || null,

            queryEndTime: core?.queryEndTime || null,

            durationSeconds: core?.durationSeconds || null,

            createdBy,
        });

        console.log("Core deposit snapshot saved successfully.");

        /*
        =====================================================
        STEP 5
        GET WAREHOUSE DATA
        =====================================================
    
        Warehouse data is already available in Oracle.
    
        We intentionally do NOT call DB2 here.
        */

        console.log("Getting Warehouse deposit data...");

        const warehouse =
            await warehouseRepository.getDepositSummary();

        console.log("Warehouse data received:");
        console.log(warehouse);

        const warehouseAmount =
            Number(warehouse?.totalDeposit || 0);

        const retailDeposit =
            Number(warehouse?.retailDeposit || 0);

        const segmentationDeposit =
            Number(warehouse?.segmentationDeposit || 0);

        /*
        =====================================================
        STEP 6
        RULE 1
        CORE VS WAREHOUSE TOTAL DEPOSIT
        =====================================================
        */

        const rule1Difference =
            coreAmount - warehouseAmount;

        /*
        Monetary tolerance:
        anything below 0.01 ETB is considered equal.
        */

        const rule1 =
            Math.abs(rule1Difference) < 0.01;

        await resultRepository.saveResult({
            runId,

            ruleName:
                "CORE VS WAREHOUSE TOTAL DEPOSIT",

            status:
                rule1 ? "PASS" : "FAIL",

            expected:
                coreAmount,

            actual:
                warehouseAmount,

            difference:
                rule1Difference,

            message:
                rule1
                    ? "Deposit matched"
                    : "Deposit mismatch",
        });

        console.log(
            "Rule 1:",
            rule1 ? "PASS" : "FAIL"
        );

        /*
        =====================================================
        STEP 7
        RULE 2
        RETAIL + SEGMENTATION VALIDATION
        =====================================================
        */

        const calculatedTotal =
            retailDeposit + segmentationDeposit;

        const rule2Difference =
            calculatedTotal - warehouseAmount;

        const rule2 =
            Math.abs(rule2Difference) < 0.01;

        await resultRepository.saveResult({
            runId,

            ruleName:
                "Retail + Segmentation Validation",

            status:
                rule2 ? "PASS" : "FAIL",

            expected:
                warehouseAmount,

            actual:
                calculatedTotal,

            difference:
                rule2Difference,

            message:
                rule2
                    ? "Retail and segmentation matched"
                    : "Retail and segmentation mismatch",
        });

        console.log(
            "Rule 2:",
            rule2 ? "PASS" : "FAIL"
        );

        /*
        =====================================================
        STEP 8
        RULE 3
        SEGMENT TOTAL VALIDATION
        =====================================================
        */

        const segments =
            warehouse?.segments || {};

        const segmentTotal =
            Object.values(segments).reduce(
                (sum, value) =>
                    sum + Number(value || 0),
                0
            );

        const rule3Difference =
            segmentTotal - segmentationDeposit;

        const rule3 =
            Math.abs(rule3Difference) < 0.01;

        await resultRepository.saveResult({
            runId,

            ruleName:
                "Segment Total Validation",

            status:
                rule3 ? "PASS" : "FAIL",

            expected:
                segmentationDeposit,

            actual:
                segmentTotal,

            difference:
                rule3Difference,

            message:
                rule3
                    ? "Segments matched"
                    : "Segments mismatch",
        });

        console.log(
            "Rule 3:",
            rule3 ? "PASS" : "FAIL"
        );

        /*
        =====================================================
        STEP 9
        COLLECT FAILED RULES
        =====================================================
        */

        const failedRules = [];

        if (!rule1) {
            failedRules.push({
                name:
                    "Core Vs Warehouse Deposit",

                difference:
                    rule1Difference,
            });
        }

        if (!rule2) {
            failedRules.push({
                name:
                    "Retail + Segmentation Validation",

                difference:
                    rule2Difference,
            });
        }

        if (!rule3) {
            failedRules.push({
                name:
                    "Segment Total Validation",

                difference:
                    rule3Difference,
            });
        }

        /*
        =====================================================
        STEP 10
        UPDATE RUN STATUS
        =====================================================
    
        IMPORTANT:
    
        The reconciliation RUN itself completed successfully.
    
        Individual rules contain PASS/FAIL.
    
        Therefore RUN status is COMPLETED here.
    
        If your database/dashboard expects SUCCESS instead
        of COMPLETED, change this to "SUCCESS".
        */

        await reconciliationRepository.updateRunStatus(
            runId,
            "COMPLETED"
        );

        console.log(
            `Reconciliation Run ${runId} marked as COMPLETED.`
        );

        /*
        =====================================================
        STEP 11
        SEND NOTIFICATION
        =====================================================
        */

        try {
            if (failedRules.length === 0) {
                await notificationService.reconciliationSuccess({
                    RUN_ID: runId,

                    BUSINESS_DATE: businessDate,

                    CORE_DEPOSIT: coreAmount,

                    WAREHOUSE_DEPOSIT: warehouseAmount,
                });

                console.log(
                    "Success notification sent."
                );
            } else {
                await notificationService.reconciliationFailure({
                    RUN_ID: runId,

                    BUSINESS_DATE: businessDate,

                    CORE_DEPOSIT: coreAmount,

                    WAREHOUSE_DEPOSIT: warehouseAmount,

                    FAILED_RULES: failedRules,
                });

                console.log(
                    "Failure notification sent."
                );
            }
        } catch (notificationError) {
            /*
            Notification failure should NOT make an otherwise
            successful reconciliation fail.
            */

            console.error(
                "Notification error:",
                notificationError.message
            );
        }

        /*
        =====================================================
        STEP 12
        NOTIFY DASHBOARD
        =====================================================
    
        This is used for immediate dashboard refresh.
    
        The dashboard frontend can listen for the event
        through Server-Sent Events (SSE).
    
        If dashboardEventService is implemented using SSE,
        all connected dashboard clients will be notified
        immediately after reconciliation finishes.
        */

        try {
            if (
                dashboardEventService &&
                typeof dashboardEventService.emitReconciliationCompleted ===
                "function"
            ) {
                dashboardEventService.emitReconciliationCompleted({
                    runId,

                    businessDate,

                    status: "COMPLETED",
                });

                console.log(
                    "Dashboard reconciliation-completed event emitted."
                );
            }
        } catch (dashboardEventError) {
            /*
            Dashboard notification failure should NOT make
            reconciliation fail.
            */

            console.error(
                "Dashboard event error:",
                dashboardEventError.message
            );
        }

        /*
        =====================================================
        STEP 13
        BUILD RESULT
        =====================================================
        */

        const reconciliationResult = {
            runId,

            businessDate,

            timestamp: new Date(),

            monitoringStatus: "ACTIVE",

            /*
            CORE
            */

            coreDeposit:
                coreAmount,

            /*
            WAREHOUSE
            */

            warehouseDeposit:
                warehouseAmount,

            retailDeposit:
                retailDeposit,

            segmentationDeposit:
                segmentationDeposit,

            /*
            SEGMENTS
            */

            segments:
                segments,

            /*
            RULE 1
            */

            rule1: {
                name:
                    "Warehouse Total Deposit Vs Core Total Deposit",

                status:
                    rule1 ? "PASS" : "FAIL",

                expected:
                    coreAmount,

                actual:
                    warehouseAmount,

                difference:
                    rule1Difference,
            },

            /*
            RULE 2
            */

            rule2: {
                name:
                    "Retail + Segmentation Validation",

                status:
                    rule2 ? "PASS" : "FAIL",

                expected:
                    warehouseAmount,

                actual:
                    calculatedTotal,

                difference:
                    rule2Difference,
            },

            /*
            RULE 3
            */

            rule3: {
                name:
                    "Segment Total Validation",

                status:
                    rule3 ? "PASS" : "FAIL",

                expected:
                    segmentationDeposit,

                actual:
                    segmentTotal,

                difference:
                    rule3Difference,
            },

            /*
            SUMMARY
            */

            summary: {
                totalRules: 3,

                passed:
                    [rule1, rule2, rule3]
                        .filter(Boolean)
                        .length,

                failed:
                    failedRules.length,
            },
        };

        /*
        =====================================================
        RETURN RESULT
        =====================================================
        */

        console.log("========================================");
        console.log(
            `Reconciliation ${runId} completed successfully.`
        );
        console.log("========================================");

        return reconciliationResult;
    } catch (error) {
        /*
        =====================================================
        RECONCILIATION FAILED
        =====================================================
        */

        console.error("========================================");
        console.error("RECONCILIATION FAILED");
        console.error("Run ID:", runId);
        console.error("Error:", error.message);
        console.error("========================================");

        /*
        =====================================================
        STEP 1
        UPDATE RUN STATUS TO FAILED
        =====================================================
        */

        try {
            await reconciliationRepository.updateRunStatus(
                runId,
                "FAILED"
            );
        } catch (statusError) {
            console.error(
                "Failed to update reconciliation run status:",
                statusError.message
            );
        }

        /*
        =====================================================
        STEP 2
        SAVE CORE FAILURE SNAPSHOT
        =====================================================
        */

        try {
            await coreDepositRepository.saveFailedDeposit({
                runId,

                businessDate,

                queryStartTime:
                    null,

                queryEndTime:
                    new Date(),

                durationSeconds:
                    null,

                errorMessage:
                    error.message,

                createdBy,
            });
        } catch (saveError) {
            console.error(
                "Could not save core failure snapshot:",
                saveError.message
            );
        }

        /*
        =====================================================
        STEP 3
        SEND FAILURE NOTIFICATION
        =====================================================
        */

        try {
            await notificationService.reconciliationFailure({
                RUN_ID: runId,

                BUSINESS_DATE: businessDate,

                ERROR: error.message,
            });
        } catch (notificationError) {
            console.error(
                "Failed to send failure notification:",
                notificationError.message
            );
        }

        /*
        =====================================================
        STEP 4
        NOTIFY DASHBOARD ABOUT FAILURE
        =====================================================
        */

        try {
            if (
                dashboardEventService &&
                typeof dashboardEventService.emitReconciliationCompleted ===
                "function"
            ) {
                dashboardEventService.emitReconciliationCompleted({
                    runId,

                    businessDate,

                    status: "FAILED",
                });
            }
        } catch (dashboardEventError) {
            console.error(
                "Dashboard failure event error:",
                dashboardEventError.message
            );
        }

        /*
        =====================================================
        STEP 5
        RE-THROW ERROR
        =====================================================
        */

        throw error;
    }
};

/*
=========================================================
EXPORT
=========================================================

THIS IS CRITICAL.

Your scheduler is calling:

reconciliationService.runReconciliation()

Therefore runReconciliation MUST be exported here.
*/

module.exports = {
    runReconciliation,
};