// const warehouseData = require("../data/warehouseMock");

// const getDepositSummary = async () => {

//     return warehouseData;

// };

// module.exports = {
//     getDepositSummary
// };

const oracledb = require("oracledb");
const connectOracle = require("../config/oracleReadOnly");
// const loadDepositSummary = async (businessDate) => {
//   const connection = await connectOracle();
//   try {
//     await connection.execute(
//       `
//     BEGIN
//        CBS.LOAD_DWH_DEPOSIT_SUMMARY(
//        TO_DATE(:businessDate, 'YYYY-MM-DD')
//        );
//     END;
//     `,
//       { businessDate },
//       { autoCommit: true },
//     );
//     console.log("DWH Deposit Summary loaded.");
//   } finally {
//     await connection.close();
//   }
// };

const loadDepositSummary = async (businessDate) => {
  const connection = await connectOracle();

  try {
    console.log("Executing CBS.LOAD_DWH_DEPOSIT_SUMMARY:", businessDate);

    const result = await connection.execute(
      `
            BEGIN
                CBS.LOAD_DWH_DEPOSIT_SUMMARY(
                    TO_DATE(:businessDate,'YYYY-MM-DD')
                );
            END;
            `,
      {
        businessDate,
      },
      {
        autoCommit: true,
      },
    );

    console.log("Procedure completed");

    console.log(result);
  } catch (error) {
    console.error("Procedure failed:", error);

    throw error;
  } finally {
    await connection.close();
  }
};

const getRecentDepositSummary = async () => {
  const connection = await connectOracle();

  const summary = await connection.execute(
    `
SELECT
TOTAL_DEPOSIT,
RETAIL_TOTAL_DEPOSIT,
 SEGMENT_TOTAL_DEPOSIT,
 TOTAL_CONVENTIONAL,
 TOTAL_IFB,
 CONVENTIONAL_RETAIL_TOTAL,
 CONVENTIONAL_SEGMENT_TOTAL,
 IFB_RETAIL_TOTAL,
 IFB_SEGMENT_TOTAL,
 CORPORATE,
 IFBCRM,
  SME,
  BUSINESS,
  GOVERNMENT,
  MULTINATIONAL,
  BUSINESS_DATE

FROM CBS.REC_DEPOSIT_SUMMARY_RECONCILATION

ORDER BY BUSINESS_DATE DESC

FETCH FIRST 6 ROWS ONLY

`,
    [],
    {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    },
  );
  await connection.close();
  return summary.rows;
};

const getDepositSummary = async () => {
  const connection = await connectOracle();

  const summary = await connection.execute(
    `
SELECT

BUSINESS_DATE,

TOTAL_DEPOSIT,
RETAIL_TOTAL_DEPOSIT,
SEGMENT_TOTAL_DEPOSIT,
TOTAL_CONVENTIONAL,
TOTAL_IFB,
CONVENTIONAL_RETAIL_TOTAL,
CONVENTIONAL_SEGMENT_TOTAL,
IFB_RETAIL_TOTAL,
IFB_SEGMENT_TOTAL,
CORPORATE,
IFBCRM,
SME,
BUSINESS,
GOVERNMENT,
MULTINATIONAL

FROM CBS.REC_DEPOSIT_SUMMARY_RECONCILATION

ORDER BY BUSINESS_DATE DESC

FETCH FIRST 1 ROW ONLY

`,
  );

  await connection.close();

  const row = summary.rows[0];

  const segmentObject = {
    corporate: row[10],

    ifbcrm: row[11],

    sme: row[12],

    business: row[13],

    government: row[14],

    multinational: row[15],
  };

  return {
    totalDeposit: row[1],

    retailDeposit: row[2],

    segmentationDeposit: row[3],

    totalConventional: row[4],

    totalIFB: row[5],

    conventionalRetail: row[6],

    conventionalSegment: row[7],

    ifbRetail: row[8],

    ifbSegment: row[9],

    segments: segmentObject,
  };
};

module.exports = {
  getDepositSummary,
  loadDepositSummary,
  getRecentDepositSummary,
};
