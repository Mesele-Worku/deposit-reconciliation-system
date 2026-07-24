const SchedulerCard = ({
    scheduler
}) => {


    if (!scheduler) {
        return null;
    }


    return (

        <div
            className="
            rounded-xl
            bg-white
            p-5
            shadow
            "
        >


            <h2
                className="
                mb-4
                text-lg
                font-bold
                text-[#232A78]
                "
            >
                Scheduler Status
            </h2>





            <div
                className="
                space-y-3
                "
            >



                <div>

                    <p className="text-sm text-gray-500">
                        Schedule Name
                    </p>

                    <p className="font-semibold">
                        {
                            scheduler.SCHEDULE_NAME
                        }
                    </p>

                </div>






                <div>

                    <p className="text-sm text-gray-500">
                        Run Type
                    </p>

                    <p className="font-semibold">
                        {
                            scheduler.RUN_TYPE
                        }
                    </p>

                </div>






                <div>

                    <p className="text-sm text-gray-500">
                        Next Run Time
                    </p>

                    <p className="font-semibold text-[#232A78]">
                        {
                            scheduler.RUN_TIME
                        }
                    </p>

                </div>







                <div>

                    <p className="text-sm text-gray-500">
                        Days
                    </p>

                    <p className="font-semibold">
                        {
                            scheduler.DAYS_OF_WEEK
                        }
                    </p>

                </div>






                <div>

                    <p className="text-sm text-gray-500">
                        Timezone
                    </p>

                    <p className="font-semibold">
                        {
                            scheduler.TIMEZONE
                        }
                    </p>

                </div>






                <div
                    className="
                    mt-3
                    inline-flex
                    rounded-full
                    bg-green-100
                    px-3
                    py-1
                    text-sm
                    font-bold
                    text-green-700
                    "
                >

                    {
                        scheduler.STATUS
                    }

                </div>




            </div>



        </div>

    );

};


export default SchedulerCard;