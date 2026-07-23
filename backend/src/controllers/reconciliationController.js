// const reconciliationService =
// require("../services/reconciliationService");

// const getStatus = async (req, res) => {

//     try {

//         const result =
//             await reconciliationService.runReconciliation();

//         res.json(result);

//     } catch(error) {

//         res.status(500).json({
//             message:error.message
//         });

//     }

// };

// module.exports = {
//     getStatus
// };

const reconciliationService = require("../services/reconciliationService");

const run = async (req, res) => {
  try {
    const result = await reconciliationService.runReconciliation();

    res.json({
      message: "Reconciliation completed successfully",

      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getStatus = async (req, res) => {
  try {
    const result = await reconciliationService.runReconciliation();

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  run,

  getStatus,
};
