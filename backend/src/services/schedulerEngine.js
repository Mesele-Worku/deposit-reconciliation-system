const cron = require("node-cron");


const schedulerRepository =
    require("../repositories/scheduleRepository");


const reconciliationService =
    require("./reconciliationService");


const jobRepository =
    require("../repositories/jobHistoryRepository");





const startScheduler = () => {


    /*
        Run every minute

        * * * * *
        | | | | |
        | | | | |
        | | | | +---- Day of week
        | | | +------ Month
        | | +-------- Day
        | +---------- Hour
        +------------ Minute

    */


    cron.schedule(
        "* * * * *",
        async () => {


            try {


                const schedule =
                    await schedulerRepository.getSchedule();




                if (!schedule) {

                    return;

                }





                if (schedule.STATUS !== "ACTIVE") {

                    return;

                }







                const now =
                    new Date();




                const currentTime =
                    now.toLocaleTimeString(
                        "en-GB",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone:
                                schedule.TIMEZONE
                        }
                    );






                if (currentTime !== schedule.RUN_TIME) {

                    return;

                }






                console.log(
                    "Automatic reconciliation started"
                );





                /*
                    Create Job
                */


                const jobId =
                    await jobRepository.createJob(
                        "SCHEDULED"
                    );






                /*
                    Execute reconciliation
                */


                const result =
                    await reconciliationService
                        .runReconciliation();








                /*
                    Link job with run
                */


                await jobRepository.updateJobRunId(

                    jobId,

                    result.runId

                );








                await jobRepository.completeJob(

                    jobId,

                    "SUCCESS"

                );






                console.log(
                    "Automatic reconciliation completed"
                );



            }

            catch (error) {



                console.error(
                    "Scheduler failed:",
                    error.message
                );



            }


        }
    );


};



module.exports = {

    startScheduler

};