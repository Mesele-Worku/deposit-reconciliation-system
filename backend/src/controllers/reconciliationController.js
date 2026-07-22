const reconciliationService =
require("../services/reconciliationService");


const getStatus = async (req, res) => {

    try {

        const result =
            await reconciliationService.runReconciliation();

        res.json(result);

    } catch(error) {

        res.status(500).json({
            message:error.message
        });

    }

};


module.exports = {
    getStatus
};