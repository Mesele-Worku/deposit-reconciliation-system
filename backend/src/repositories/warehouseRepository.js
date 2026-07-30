// const warehouseData = require("../data/warehouseMock");

// const getDepositSummary = async () => {

//     return warehouseData;

// };

// module.exports = {
//     getDepositSummary
// };

const { autoCommit } = require("oracledb");
const connectOracle = require("../config/oracleReadOnly");
const loadDepositSummary = async (businessDate) => {
  const connection = await connectOracle();
  try {
    await connection.execute(
      `
    BEGIN
       CBS.LOAD_DWH_DEPOSIT_SUMMARY(
       TO_DATE(:businessDate, 'YYYY-MM-DD')
       );
    END;
    `,
      { businessDate },
      { autoCommit: true },
    );
    console.log("DWH Deposit Summary loaded.");
  } finally {
    await connection.close();
  }
};

const getDepositSummary = async () => {
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
  MULTINATIONAL

FROM CBS.REC_DEPOSIT_SUMMARY_RECONCILATION

ORDER BY BUSINESS_DATE DESC

FETCH FIRST 1 ROW ONLY

`,
  );

  await connection.close();

  const row = summary.rows[0];

  const segmentObject = {
    corporate: row[9],
    ifbcrm: row[10],
    sme: row[11],
    business: row[12],
    government: row[13],
    multinational: row[14],
  };

  return {
    totalDeposit: row[0],
    retailDeposit: row[1],
    segmentationDeposit: row[2],
    totalConventional: row[3],
    totalIFB: row[4],
    conventionalRetail: row[5],
    conventionalSegment: row[6],
    ifbRetail: row[7],
    ifbSegment: row[8],
    segments: segmentObject,
  };
};

module.exports = {
  getDepositSummary,
  loadDepositSummary,
};
