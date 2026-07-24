
// const dashboardRepository =
//     require("../repositories/dashboardRepository");




// const getDashboardData = async () => {


//     const run =
//         await dashboardRepository.getLatestRun();



//     const scheduler =
//         await dashboardRepository.getScheduler();



//     const jobs =
//         await dashboardRepository.getJobStatistics();



//     const recentJobs =
//         await dashboardRepository.getRecentJobs();






//     let duration = null;



//     if (run && run.START_TIME && run.END_TIME) {


//         duration =
//             (
//                 new Date(run.END_TIME)
//                 -
//                 new Date(run.START_TIME)

//             ) / 1000;


//     }






//     return {


//         systemStatus:
//             "ACTIVE",



//         lastRun: {


//             runId:
//                 run?.RUN_ID || null,


//             status:
//                 run?.STATUS || null,


//             duration:
//                 duration
//                     ?
//                     `${duration} seconds`
//                     :
//                     null

//         },





//         scheduler,




//         jobs: {


//             total:
//                 jobs.TOTAL_JOBS || 0,


//             successful:
//                 jobs.SUCCESS_JOBS || 0,


//             failed:
//                 jobs.FAILED_JOBS || 0


//         },





//         recentJobs


//     };


// };





// module.exports = {

//     getDashboardData

// };


const dashboardRepository =
    require("../repositories/dashboardRepository");


const resultRepository =
    require("../repositories/resultRepository");


const coreRepository =
    require("../repositories/coreBankingRepository");


const warehouseRepository =
    require("../repositories/warehouseRepository");





const getDashboard = async () => {


    /*
        1. Monitoring Information
    */


    const latestRun =
        await dashboardRepository.getLatestRun();



    const scheduler =
        await dashboardRepository.getScheduler();



    const jobStatistics =
        await dashboardRepository.getJobStatistics();



    const recentJobs =
        await dashboardRepository.getRecentJobs();






    /*
        2. Deposit Information
    */


    const core =
        await coreRepository.getDepositSummary();



    const warehouse =
        await warehouseRepository.getDepositSummary();







    /*
        3. Reconciliation Rules
    */


    let rules = [];



    if (latestRun) {


        const results =
            await resultRepository.getResultsByRun(
                latestRun.RUN_ID
            );


        rules =
            results.map(rule => ({


                name:
                    rule.NAME || rule.name,


                status:
                    rule.STATUS || rule.status,


                difference:
                    rule.DIFFERENCE
                    ||
                    rule.difference
                    ||
                    0,


                expected:
                    rule.EXPECTED_VALUE
                    ||
                    rule.expected,


                actual:
                    rule.ACTUAL_VALUE
                    ||
                    rule.actual,


                message:
                    rule.MESSAGE
                    ||
                    rule.message


            }));


    }







    return {


        systemStatus:
            "ACTIVE",



        timestamp:
            new Date(),





        scheduler,





        jobs: {


            total:
                jobStatistics?.TOTAL_JOBS || 0,


            successful:
                jobStatistics?.SUCCESS_JOBS || 0,


            failed:
                jobStatistics?.FAILED_JOBS || 0


        },






        latestRun,



        recentJobs,








        deposits: {


            core:
                core.totalDeposit,


            warehouse:
                warehouse.totalDeposit,


            retail:
                warehouse.retailDeposit,


            segmentation:
                warehouse.segmentationDeposit



        },







        segments:
            warehouse.segments,






        rules: {


            rule1:
                rules[0] ||
                {
                    name:
                        "CORE VS WAREHOUSE TOTAL DEPOSIT",

                    status:
                        "PENDING",

                    difference: 0
                },



            rule2:
                rules[1] ||
                {
                    name:
                        "Retail + Segmentation Validation",

                    status:
                        "PENDING",

                    difference: 0
                },



            rule3:
                rules[2] ||
                {
                    name:
                        "Segment Total Validation",

                    status:
                        "PENDING",

                    difference: 0
                },
            summary: {

                total:
                    rules.length,


                passed:
                    rules.filter(
                        r => r.status === "PASS"
                    ).length,


                failed:
                    rules.filter(
                        r => r.status === "FAIL"
                    ).length

            }

        }


    };



};





module.exports = {

    getDashboard

};