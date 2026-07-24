// const coreData = require("../data/coreBankingMock");

// const getDepositSummary = async () => {

//     return coreData;

// };

// module.exports = {
//     getDepositSummary
// };

const connectOracle = require("../config/oracle");

const getDepositSummary = async () => {
    const connection = await connectOracle();

    const result = await connection.execute(
        `
        SELECT

            TOTAL_DEPOSIT,
            RETAIL_DEPOSIT,
            SEGMENTATION_DEPOSIT

        FROM TESTUSER.DEPOSIT_SUMMARY

        WHERE SOURCE_SYSTEM='CORE'

        ORDER BY BUSINESS_DATE DESC

        FETCH FIRST 1 ROW ONLY

        `,
    );

    await connection.close();

    const row = result.rows[0];

    return {
        totalDeposit: row[0],

        retailDeposit: row[1],

        segmentationDeposit: row[2],
    };
};

module.exports = {
    getDepositSummary,
};
