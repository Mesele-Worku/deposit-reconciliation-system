const cron = require("node-cron");

const scheduleRepository =
require("../repositories/scheduleRepository");


const reconciliationService =
require("../services/reconciliationService");


const jobRepository =
require("../repositories/jobHistoryRepository");





const startScheduler = () => {



    /*
        Scheduler runs every minute

        It checks database schedule table
    */


    cron.schedule(
        "* * * * *",

        async () => {


            try {


                const schedule =
                await scheduleRepository.getActiveSchedule();



                if (!schedule) {


                    console.log(
                        "No active reconciliation schedule"
                    );


                    return;

                }





                const now =
                new Date();



                const currentTime =
                now.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone:
                        schedule.TIMEZONE
                    }
                );





                const currentDay =
                now.toLocaleDateString(
                    "en-US",
                    {
                        weekday:"short",
                        timeZone:
                        schedule.TIMEZONE
                    }
                )
                .toUpperCase();






                const allowedDays =
                schedule.DAYS_OF_WEEK
                .split(",");







                if (

                    currentTime === schedule.RUN_TIME

                    &&

                    allowedDays.includes(
                        currentDay
                    )

                ) {



                    console.log(
                        "Starting scheduled reconciliation..."
                    );





                    let jobId;



                    try {



                        /*
                           Create job history
                        */

                        jobId =
                        await jobRepository.createJob(
                            "SCHEDULED"
                        );







                        await reconciliationService
                        .runReconciliation();







                        await jobRepository.completeJob(

                            jobId,

                            "SUCCESS"

                        );





                        console.log(
                            "Scheduled reconciliation completed"
                        );



                    }


                    catch(error){



                        if(jobId){


                            await jobRepository.completeJob(

                                jobId,

                                "FAILED",

                                error.message

                            );

                        }




                        console.error(

                            "Scheduled reconciliation failed:",

                            error.message

                        );

                    }




                }




            }

            catch(error){


                console.error(

                    "Scheduler Error:",

                    error.message

                );


            }




        }

    );




    console.log(
        "Dynamic reconciliation scheduler started"
    );



};





module.exports =
startScheduler;