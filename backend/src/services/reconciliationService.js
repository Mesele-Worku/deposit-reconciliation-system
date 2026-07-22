const coreRepository = require("../repositories/coreBankingRepository");
const warehouseRepository = require("../repositories/warehouseRepository");


const runReconciliation = async () => {

    const core =
        await coreRepository.getDepositSummary();
console.log("CORE DATA:");
console.log(core);

    const warehouse =
        await warehouseRepository.getDepositSummary();
console.log("WAREHOUSE DATA:");
console.log(warehouse);

    // Rule 1
    const rule1Difference =
        core.totalDeposit - warehouse.totalDeposit;


    const rule1 =
        rule1Difference === 0;



    // Rule 2
    const calculatedTotal =
        warehouse.retailDeposit +
        warehouse.segmentationDeposit;


    const rule2Difference =
        calculatedTotal - warehouse.totalDeposit;


    const rule2 =
        rule2Difference === 0;



    // Rule 3
    const segments = warehouse.segments || {};

const segmentTotal =
    Object.values(segments)
        .reduce((a, b) => a + b, 0);


    const rule3Difference =
        segmentTotal - warehouse.segmentationDeposit;


    const rule3 =
        rule3Difference === 0;



    return {

        timestamp:new Date(),

        coreDeposit:
            core.totalDeposit,

        warehouseDeposit:
            warehouse.totalDeposit,


        rule1:{
            status: rule1 ? "PASS":"FAIL",
            difference: rule1Difference
        },


        rule2:{
            status: rule2 ? "PASS":"FAIL",
            difference: rule2Difference
        },


        rule3:{
            status: rule3 ? "PASS":"FAIL",
            difference: rule3Difference
        }

    };

};


module.exports = {
    runReconciliation
};