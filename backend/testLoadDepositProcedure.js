require("dotenv").config();

const connectOracle = require("./src/config/oracleReadOnly");

const loadDepositSummary = async (businessDate) => {
  const connection = await connectOracle();

  try {
    const result = await connection.execute(
      `
            BEGIN
                CBS.LOAD_DWH_DEPOSIT_SUMMARY(
                    TO_DATE(:businessDate, 'YYYY-MM-DD')
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

    console.log("Procedure executed successfully.");
    console.log(result);
  } catch (error) {
    console.error("Procedure execution failed:");
    console.error(error);
  } finally {
    await connection.close();
  }
};

async function test() {
  const businessDate = "2026-08-01";

  console.log("Starting LOAD_DWH_DEPOSIT_SUMMARY test...");

  await loadDepositSummary(businessDate);

  console.log("Test completed.");
}

test();
