// const connectOracle = require("../config/oracle");

// const getDepositSummary = async () => {
//   // const connection = await connectOracle();

//   //   const result = await connection.execute(
//   //     `
//   //         SELECT

//   //             TOTAL_DEPOSIT,
//   //             RETAIL_DEPOSIT,
//   //             SEGMENTATION_DEPOSIT

//   //         FROM TESTUSER.DEPOSIT_SUMMARY

//   //         WHERE SOURCE_SYSTEM='CORE'

//   //         ORDER BY BUSINESS_DATE DESC

//   //         FETCH FIRST 1 ROW ONLY

//   //         `,
//   //   );

//   //   await connection.close();

//   //   const row = result.rows[0];

//   return {
//     totalDeposit: 480563415325.44,

//     // retailDeposit: row[1],

//     // segmentationDeposit: row[2],
//   };
// };

// module.exports = {
//   getDepositSummary,
// };

// ---------------------- Read Data From Core ----------------------------------------
// const connectDb2 = require("../config/db2");

// const getDepositSummary = async () => {
//   const connection = await connectDb2();

//   try {
//     const result = await connection.query(`
//       WITH branches AS (
//         SELECT *
//         FROM (
//           SELECT DISTINCT
//             RIGHT(BRANCHSORTCODE, 4) AS branchcode4,
//             RIGHT(BRANCHSORTCODE, 3) AS branchcode,
//             BANKREGIONCODE,
//             b2.branchname,

//             CASE
//               WHEN SUBSTR(BRANCHSORTCODE, 5, 1) IN ('1', '2')
//               THEN 'OLD'
//               ELSE 'NEW'
//             END AS branchType,

//             ROW_NUMBER() OVER (
//               PARTITION BY
//                 RIGHT(BRANCHSORTCODE, 3),
//                 CASE
//                   WHEN SUBSTR(BRANCHSORTCODE, 5, 1) IN ('1', '2')
//                   THEN 'OLD'
//                   ELSE 'NEW'
//                 END
//               ORDER BY BRANCHSORTCODE
//             ) AS branch_order

//           FROM WASADMIN.BRANCH b2

//           LEFT JOIN AIB.AIB_BANKREGION br
//             ON RIGHT(br.BRANCHCODE, 4)
//                = RIGHT(b2.BRANCHSORTCODE, 4)

//           WHERE LOWER(b2.BRANCHNAME) NOT LIKE '%reserve%'
//             AND LOWER(b2.BRANCHNAME) NOT LIKE '%reser%'
//             AND LOWER(b2.BRANCHNAME) NOT LIKE '%reseve%'
//             AND RIGHT(BRANCHSORTCODE, 4)
//                 NOT IN ('1000', '2000', '1002', '2002', '9999')
//         ) b

//         WHERE b.branch_order = 1
//       ),

//       maxExchangeRate AS (
//         SELECT
//           FROMCURRENCYCODE,
//           MAX(DATELASTMODIFIED) AS maxDate

//         FROM WASADMIN.EXCHANGERATESHISTORY

//         WHERE DATE(DATELASTMODIFIED) <= (
//           SELECT DATE(BFCURRENTFREEZETIME)
//           FROM BANKFUSION.BFTB_PERSISTENTTAG
//         )

//         AND EXCHANGERATETYPE = 'MID'

//         GROUP BY FROMCURRENCYCODE
//       ),

//       withExchangeRate AS (
//         SELECT DISTINCT
//           er.FROMCURRENCYCODE,
//           er.RATE

//         FROM WASADMIN.EXCHANGERATESHISTORY er

//         INNER JOIN maxExchangeRate er2
//           ON er2.FROMCURRENCYCODE = er.FROMCURRENCYCODE
//          AND er.DATELASTMODIFIED = er2.maxDate

//         WHERE er.TOCURRENCYCODE = 'ETB'
//           AND er.EXCHANGERATETYPE = 'MID'

//         UNION

//         SELECT
//           'ETB',
//           1.0

//         FROM BANKFUSION.BFTB_PERSISTENTTAG
//       ),

//       ShadowBalanceConventional AS (
//         SELECT
//           SUM(sb.SHADOWCLEAREDBALANCE * e.RATE) AS DepositBalance,
//           br.branchcode,
//           br.branchType

//         FROM WASADMIN.ACCOUNT a

//         INNER JOIN WASADMIN.UBTB_SHADOWACCOUNTFREEZE sb
//           ON sb.ACCOUNTID = a.ACCOUNTID

//         INNER JOIN branches br
//           ON br.branchcode = RIGHT(a.BRANCHSORTCODE, 3)
//          AND br.branchtype =
//              CASE
//                WHEN SUBSTR(a.BRANCHSORTCODE, 5, 1) IN ('1', '2')
//                THEN 'OLD'
//                ELSE 'NEW'
//              END

//         INNER JOIN withExchangeRate e
//           ON a.ISOCURRENCYCODE = e.FROMCURRENCYCODE

//         INNER JOIN WASADMIN.PRODUCTINHERITANCE p
//           ON a.PRODUCTCONTEXTCODE = p.PRODUCTCONTEXTCODE

//         WHERE (
//           (
//             p.PRODUCT_ACC_PRODUCTID IN (
//               'Savings',
//               'SpecialSAV',
//               'notice',
//               'CurrentAccount',
//               'fixdep'
//             )

//             AND p.UBSUBPRODUCTID NOT IN ('01432', '01438')

//             AND a.ACCOUNTID NOT IN (
//               '01304005574300',
//               '013041194227701'
//             )
//           )

//           OR (
//             (
//               a.ACCOUNTID = '01304005574300'
//               OR p.PRODUCT_ACC_PRODUCTID = 'OverDrafts'
//             )

//             AND sb.SHADOWCLEAREDBALANCE > 0
//           )
//         )

//         AND (
//           a.closed = 'N'
//           OR (
//             a.closed = 'Y'
//             AND sb.SHADOWCLEAREDBALANCE <> 0
//           )
//         )

//         GROUP BY
//           br.branchcode,
//           br.branchType
//       ),

//       ShadowBalanceIFB AS (
//         SELECT
//           SUM(sb.SHADOWCLEAREDBALANCE * e.RATE) AS DepositBalance,
//           br.branchcode,
//           br.branchType

//         FROM WASADMIN.ACCOUNT a

//         INNER JOIN WASADMIN.UBTB_SHADOWACCOUNTFREEZE sb
//           ON sb.ACCOUNTID = a.ACCOUNTID

//         INNER JOIN branches br
//           ON br.branchcode = RIGHT(a.BRANCHSORTCODE, 3)
//          AND br.branchtype =
//              CASE
//                WHEN SUBSTR(a.BRANCHSORTCODE, 5, 1) IN ('1', '2')
//                THEN 'OLD'
//                ELSE 'NEW'
//              END

//         INNER JOIN withExchangeRate e
//           ON a.ISOCURRENCYCODE = e.FROMCURRENCYCODE

//         INNER JOIN WASADMIN.PRODUCTINHERITANCE p
//           ON a.PRODUCTCONTEXTCODE = p.PRODUCTCONTEXTCODE

//         WHERE (
//           p.PRODUCT_ACC_PRODUCTID IN (
//             'IFBSpecialSAV',
//             'IFBSavings',
//             'IFBCurrent',
//             'MudarabaInvest'
//           )

//           OR p.UBSUBPRODUCTID IN ('01432', '01438')

//           OR a.ACCOUNTID = '013041194227701'
//         )

//         AND (
//           a.closed = 'N'
//           OR (
//             a.closed = 'Y'
//             AND sb.SHADOWCLEAREDBALANCE <> 0
//           )
//         )

//         GROUP BY
//           br.branchcode,
//           br.branchType
//       ),

//       Total_balance AS (
//         SELECT
//           db.branchcode,
//           db.DepositBalance,
//           db.branchType

//         FROM ShadowBalanceConventional db

//         UNION ALL

//         SELECT
//           db.branchcode,
//           db.DepositBalance,
//           db.branchType

//         FROM ShadowBalanceIFB db
//       )

//       SELECT
//         SUM(DepositBalance) AS TOTAL_BALANCE_CORE

//       FROM Total_balance
//     `);

//     console.log("DB2 Deposit Result:");
//     console.log(result);

//     if (!result || result.length === 0) {
//       return {
//         totalDeposit: 0,
//       };
//     }

//     const row = result[0];

//     return {
//       totalDeposit: Number(row.TOTAL_BALANCE_CORE || 0),
//     };
//   } catch (error) {
//     console.error("DB2 Deposit Query Failed:");
//     console.error(error);

//     throw error;
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// };

// module.exports = {
//   getDepositSummary,
// };

// const dashboardService =
//     require("../services/dashboardService");

// const getDashboard = async (req, res) => {

//     try {

//         const data =
//             await dashboardService
//                 .getDashboardData();

//         res.json(data);

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

//     getDashboard

// };

const connectDb2 = require("../config/db2");

// const getDepositSummaryFromCore = async () => {
//   let connection;

//   const queryStartTime = new Date();

//   try {
//     console.log("========================================");
//     console.log("Starting Core Banking DB2 deposit query");
//     console.log("Started:", queryStartTime.toISOString());
//     console.log("========================================");

//     connection = await connectDb2();

//     const result = await connection.query(`
//             WITH branches AS (
//                 SELECT *
//                 FROM (
//                     SELECT DISTINCT
//                         RIGHT(BRANCHSORTCODE, 4) AS branchcode4,
//                         RIGHT(BRANCHSORTCODE, 3) AS branchcode,
//                         BANKREGIONCODE,
//                         b2.branchname,

//                         CASE
//                             WHEN SUBSTR(BRANCHSORTCODE, 5, 1) IN ('1', '2')
//                             THEN 'OLD'
//                             ELSE 'NEW'
//                         END AS branchType,

//                         ROW_NUMBER() OVER (
//                             PARTITION BY
//                                 RIGHT(BRANCHSORTCODE, 3),
//                                 CASE
//                                     WHEN SUBSTR(BRANCHSORTCODE, 5, 1) IN ('1', '2')
//                                     THEN 'OLD'
//                                     ELSE 'NEW'
//                                 END
//                             ORDER BY BRANCHSORTCODE
//                         ) AS branch_order

//                     FROM WASADMIN.BRANCH b2

//                     LEFT JOIN AIB.AIB_BANKREGION br
//                         ON RIGHT(br.BRANCHCODE, 4)
//                            = RIGHT(b2.BRANCHSORTCODE, 4)

//                     WHERE LOWER(b2.BRANCHNAME) NOT LIKE '%reserve%'
//                         AND LOWER(b2.BRANCHNAME) NOT LIKE '%reser%'
//                         AND LOWER(b2.BRANCHNAME) NOT LIKE '%reseve%'

//                         AND RIGHT(BRANCHSORTCODE, 4)
//                             NOT IN (
//                                 '1000',
//                                 '2000',
//                                 '1002',
//                                 '2002',
//                                 '9999'
//                             )
//                 ) b

//                 WHERE b.branch_order = 1
//             ),

//             maxExchangeRate AS (
//                 SELECT
//                     FROMCURRENCYCODE,
//                     MAX(DATELASTMODIFIED) AS maxDate

//                 FROM WASADMIN.EXCHANGERATESHISTORY

//                 WHERE DATE(DATELASTMODIFIED) <= (
//                     SELECT DATE(BFCURRENTFREEZETIME)
//                     FROM BANKFUSION.BFTB_PERSISTENTTAG
//                 )

//                 AND EXCHANGERATETYPE = 'MID'

//                 GROUP BY FROMCURRENCYCODE
//             ),

//             withExchangeRate AS (
//                 SELECT DISTINCT
//                     er.FROMCURRENCYCODE,
//                     er.RATE

//                 FROM WASADMIN.EXCHANGERATESHISTORY er

//                 INNER JOIN maxExchangeRate er2
//                     ON er2.FROMCURRENCYCODE = er.FROMCURRENCYCODE
//                     AND er.DATELASTMODIFIED = er2.maxDate

//                 WHERE er.TOCURRENCYCODE = 'ETB'
//                     AND er.EXCHANGERATETYPE = 'MID'

//                 UNION

//                 SELECT
//                     'ETB',
//                     1.0

//                 FROM BANKFUSION.BFTB_PERSISTENTTAG
//             ),

//             ShadowBalanceConventional AS (
//                 SELECT
//                     SUM(
//                         sb.SHADOWCLEAREDBALANCE * e.RATE
//                     ) AS DepositBalance,

//                     br.branchcode,
//                     br.branchType

//                 FROM WASADMIN.ACCOUNT a

//                 INNER JOIN WASADMIN.UBTB_SHADOWACCOUNTFREEZE sb
//                     ON sb.ACCOUNTID = a.ACCOUNTID

//                 INNER JOIN branches br
//                     ON br.branchcode =
//                         RIGHT(a.BRANCHSORTCODE, 3)

//                     AND br.branchtype =
//                         CASE
//                             WHEN SUBSTR(a.BRANCHSORTCODE, 5, 1)
//                                 IN ('1', '2')
//                             THEN 'OLD'
//                             ELSE 'NEW'
//                         END

//                 INNER JOIN withExchangeRate e
//                     ON a.ISOCURRENCYCODE =
//                         e.FROMCURRENCYCODE

//                 INNER JOIN WASADMIN.PRODUCTINHERITANCE p
//                     ON a.PRODUCTCONTEXTCODE =
//                         p.PRODUCTCONTEXTCODE

//                 WHERE (
//                     (
//                         p.PRODUCT_ACC_PRODUCTID IN (
//                             'Savings',
//                             'SpecialSAV',
//                             'notice',
//                             'CurrentAccount',
//                             'fixdep'
//                         )

//                         AND p.UBSUBPRODUCTID NOT IN (
//                             '01432',
//                             '01438'
//                         )

//                         AND a.ACCOUNTID NOT IN (
//                             '01304005574300',
//                             '013041194227701'
//                         )
//                     )

//                     OR (
//                         (
//                             a.ACCOUNTID =
//                                 '01304005574300'

//                             OR p.PRODUCT_ACC_PRODUCTID =
//                                 'OverDrafts'
//                         )

//                         AND sb.SHADOWCLEAREDBALANCE > 0
//                     )
//                 )

//                 AND (
//                     a.closed = 'N'

//                     OR (
//                         a.closed = 'Y'
//                         AND sb.SHADOWCLEAREDBALANCE <> 0
//                     )
//                 )

//                 GROUP BY
//                     br.branchcode,
//                     br.branchType
//             ),

//             ShadowBalanceIFB AS (
//                 SELECT
//                     SUM(
//                         sb.SHADOWCLEAREDBALANCE * e.RATE
//                     ) AS DepositBalance,

//                     br.branchcode,
//                     br.branchType

//                 FROM WASADMIN.ACCOUNT a

//                 INNER JOIN WASADMIN.UBTB_SHADOWACCOUNTFREEZE sb
//                     ON sb.ACCOUNTID = a.ACCOUNTID

//                 INNER JOIN branches br
//                     ON br.branchcode =
//                         RIGHT(a.BRANCHSORTCODE, 3)

//                     AND br.branchtype =
//                         CASE
//                             WHEN SUBSTR(a.BRANCHSORTCODE, 5, 1)
//                                 IN ('1', '2')
//                             THEN 'OLD'
//                             ELSE 'NEW'
//                         END

//                 INNER JOIN withExchangeRate e
//                     ON a.ISOCURRENCYCODE =
//                         e.FROMCURRENCYCODE

//                 INNER JOIN WASADMIN.PRODUCTINHERITANCE p
//                     ON a.PRODUCTCONTEXTCODE =
//                         p.PRODUCTCONTEXTCODE

//                 WHERE (
//                     p.PRODUCT_ACC_PRODUCTID IN (
//                         'IFBSpecialSAV',
//                         'IFBSavings',
//                         'IFBCurrent',
//                         'MudarabaInvest'
//                     )

//                     OR p.UBSUBPRODUCTID IN (
//                         '01432',
//                         '01438'
//                     )

//                     OR a.ACCOUNTID =
//                         '013041194227701'
//                 )

//                 AND (
//                     a.closed = 'N'

//                     OR (
//                         a.closed = 'Y'
//                         AND sb.SHADOWCLEAREDBALANCE <> 0
//                     )
//                 )

//                 GROUP BY
//                     br.branchcode,
//                     br.branchType
//             ),

//             Total_balance AS (
//                 SELECT
//                     db.branchcode,
//                     db.DepositBalance,
//                     db.branchType

//                 FROM ShadowBalanceConventional db

//                 UNION ALL

//                 SELECT
//                     db.branchcode,
//                     db.DepositBalance,
//                     db.branchType

//                 FROM ShadowBalanceIFB db
//             )

//             SELECT
//                 SUM(DepositBalance) AS TOTAL_BALANCE_CORE

//             FROM Total_balance
//         `);

//     const queryEndTime = new Date();

//     const durationSeconds = (queryEndTime - queryStartTime) / 1000;

//     console.log("========================================");
//     console.log("DB2 Deposit Query Completed");
//     console.log("Finished:", queryEndTime.toISOString());
//     console.log("Duration:", durationSeconds, "seconds");
//     console.log("========================================");

//     if (!result || result.length === 0) {
//       throw new Error("DB2 deposit query returned no result");
//     }

//     const row = result[0];

//     if (
//       row.TOTAL_BALANCE_CORE === null ||
//       row.TOTAL_BALANCE_CORE === undefined
//     ) {
//       throw new Error("DB2 deposit query returned NULL amount");
//     }

//     return {
//       totalDeposit: String(row.TOTAL_BALANCE_CORE),

//       queryStartTime,

//       queryEndTime,

//       durationSeconds,
//     };
//   } catch (error) {
//     console.error("DB2 Deposit Query Failed:");

//     console.error(error);

//     throw error;
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// };

/*
=========================================================
MOCK CORE BANKING DATA
=========================================================

USE THIS WHILE TESTING.

This does NOT connect to DB2.
It returns immediately.
=========================================================
*/

const getDepositSummaryFromCore = async () => {
  const queryStartTime = new Date();

  /*
    Simulate a small amount of processing time.
    */

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const queryEndTime = new Date();

  const durationSeconds = (queryEndTime - queryStartTime) / 1000;

  /*
    IMPORTANT:

    Choose an amount that you know exists in your
    warehouse/mock data.

    Example:
    */

  const mockDeposit = "480563415325.438934";

  console.log("========================================");

  console.log("USING MOCK CORE BANKING DATA");

  console.log("Mock Core Deposit:", mockDeposit);

  console.log("========================================");

  return {
    totalDeposit: mockDeposit,

    queryStartTime,

    queryEndTime,

    durationSeconds,
  };
};
module.exports = {
  getDepositSummaryFromCore,
};
