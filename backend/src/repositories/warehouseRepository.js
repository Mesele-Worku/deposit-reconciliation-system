// const warehouseData = require("../data/warehouseMock");

// const getDepositSummary = async () => {

//     return warehouseData;

// };

// module.exports = {
//     getDepositSummary
// };

const connectOracle = require("../config/oracle");

const getDepositSummary = async () => {
    const connection = await connectOracle();

    const summary = await connection.execute(
        `
SELECT

TOTAL_DEPOSIT,
RETAIL_DEPOSIT,
SEGMENTATION_DEPOSIT

FROM TESTUSER.DEPOSIT_SUMMARY

WHERE SOURCE_SYSTEM='DWH'

ORDER BY BUSINESS_DATE DESC

FETCH FIRST 1 ROW ONLY

`,
    );

    const segments = await connection.execute(
        `
SELECT

SEGMENT_NAME,
AMOUNT

FROM TESTUSER.SEGMENT_DEPOSIT

WHERE SOURCE_SYSTEM='DWH'

`,
    );

    await connection.close();

    const row = summary.rows[0];

    const segmentObject = {};

    segments.rows.forEach((item) => {
        segmentObject[item[0]] = item[1];
    });

    return {
        totalDeposit: row[0],

        retailDeposit: row[1],

        segmentationDeposit: row[2],

        segments: segmentObject,
    };
};

module.exports = {
    getDepositSummary,
};
