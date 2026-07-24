const reconciliationService =
    require("../services/reconciliationService");


const jobRepository =
    require("../repositories/jobHistoryRepository");





/*
    Manual reconciliation execution

    ADMIN / OPERATOR
*/

const run = async (req, res) => {


    let jobId;



    try {



        /*
            1. Create Job History
        */

        jobId =
            await jobRepository.createJob(
                "MANUAL"
            );






        /*
            2. Execute reconciliation

            This creates:
            - RECONCILIATION_RUN
            - RECONCILIATION_RESULT

            Returns runId
        */

        const result =
            await reconciliationService
                .runReconciliation();

        /*
            3. Link Job with Run

            JOB_HISTORY.RUN_ID = RUN_ID
        */


        await jobRepository.updateJobRunId(

            jobId,

            result.runId

        );
        /*
            4. Complete Job
        */


        await jobRepository.completeJob(

            jobId,

            "SUCCESS"

        );
        res.status(200).json({


            message:
                "Reconciliation completed successfully",


            jobId,


            data:
                result


        });

    }

    catch (error) {



        console.error(
            "Manual reconciliation failed:",
            error.message
        );

        if (jobId) {


            await jobRepository.completeJob(

                jobId,

                "FAILED",

                error.message

            );


        }
        res.status(500).json({

            message:
                "Reconciliation failed",

            error:
                error.message

        });



    }


};


/*
    Dashboard status API

    Viewer/Admin/Operator

*/

const getStatus = async (req, res) => {


    try {



        const latestJobs =
            await jobRepository.getLatestJobs();



        const latestJob =
            latestJobs[0];






        res.json({


            schedulerStatus:
                "ACTIVE",



            lastExecution:
                latestJob || null,



            message:
                "EDRMS monitoring active"



        });




    }

    catch (error) {


        res.status(500)
            .json({

                message:
                    error.message

            });


    }


};







module.exports = {


    run,

    getStatus


};