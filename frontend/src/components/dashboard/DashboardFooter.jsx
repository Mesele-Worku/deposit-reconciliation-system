const DashboardFooter = ({
    latestRun,
    lastRefresh,
    jobs
}) => {


    return (

        <section
            className="
            mt-8
            rounded-xl
            bg-white
            p-5
            shadow
            "
        >


            <div
                className="
                grid
                gap-4
                md:grid-cols-3
                "
            >





                <div>

                    <p
                        className="
                        text-sm
                        text-gray-500
                        "
                    >
                        Last Run Status
                    </p>


                    <p
                        className="
                        mt-1
                        font-bold
                        text-[#232A78]
                        "
                    >

                        {
                            latestRun?.STATUS || "N/A"
                        }

                    </p>


                </div>









                <div>

                    <p
                        className="
                        text-sm
                        text-gray-500
                        "
                    >
                        Last Execution
                    </p>


                    <p
                        className="
                        mt-1
                        font-bold
                        text-[#232A78]
                        "
                    >

                        {
                            latestRun?.END_TIME
                                ?
                                new Date(
                                    latestRun.END_TIME
                                )
                                    .toLocaleString()
                                :
                                "-"
                        }

                    </p>


                </div>









                <div>

                    <p
                        className="
                        text-sm
                        text-gray-500
                        "
                    >
                        Job Summary
                    </p>


                    <p
                        className="
                        mt-1
                        font-bold
                        text-green-600
                        "
                    >

                        Success:
                        {" "}
                        {
                            jobs?.successful || 0
                        }

                        {" / "}

                        {
                            jobs?.total || 0
                        }

                    </p>


                </div>





            </div>






            <div
                className="
                mt-5
                border-t
                pt-4
                text-sm
                text-gray-500
                "
            >


                Dashboard Refresh:

                <span
                    className="
                    ml-2
                    font-semibold
                    text-[#232A78]
                    "
                >

                    {
                        lastRefresh
                            ?
                            lastRefresh.toLocaleTimeString()
                            :
                            "-"
                    }

                </span>


            </div>





        </section>


    );

};


export default DashboardFooter;