import { useEffect, useState } from "react";

import api from "../api/axios";

import SummaryCard from "../components/SummaryCard";
import StatusBadge from "../components/StatusBadge";


const Dashboard = () => {

    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [lastRefresh, setLastRefresh] = useState(null);



    // const fetchReconciliationStatus = async () => {

    //     try {

    //         setError("");

    //         const response =
    //             await api.get(
    //                 "/reconciliation/status"
    //             );


    //         setData(response.data);

    //         setLastRefresh(new Date());


    //     } catch (error) {

    //         console.error(error);

    //         setError(
    //             "Unable to load reconciliation data"
    //         );

    //     }

    // };


useEffect(() => {

    let isMounted = true;


    const loadData = async () => {

        try {

            setError("");

            const response =
                await api.get(
                    "/reconciliation/status"
                );


            if (isMounted) {

                setData(response.data);

                setLastRefresh(new Date());

            }


        } catch (error) {


            console.error(error);


            if (isMounted) {

                setError(
                    "Unable to load reconciliation data"
                );

            }

        }

    };



    // Initial loading
    loadData();



    // Auto refresh every 30 seconds

    const interval =
        setInterval(
            loadData,
            30000
        );



    return () => {

        isMounted = false;

        clearInterval(interval);

    };


}, []);




    if (!data) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
            ">

                <div className="
                    bg-white
                    shadow
                    rounded-xl
                    p-8
                    text-center
                ">

                    {
                        error
                        ?
                        <p className="text-red-600">
                            {error}
                        </p>
                        :
                        <p>
                            Loading reconciliation data...
                        </p>
                    }


                </div>


            </div>

        );

    }



    return (

        <div className="
            min-h-screen
            bg-gray-100
            p-4
            sm:p-6
        ">


            {/* Header */}

            <div className="
                mb-6
            ">

                <h1 className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-green-800
                    bg-gradient-to-r
                    from-blue-500
                    to-indigo-600
                    text-transparent
                    bg-clip-text
                ">

                    EDRMS Deposit Monitoring Dashboard

                </h1>


                <p className="
                    text-gray-500
                    mt-2
                    text-sm
                ">

                    Enterprise Deposit Reconciliation & Monitoring System

                </p>


            </div>




            {/* Summary Cards */}

            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-4
            ">


                <SummaryCard
                    title="Core Banking Deposit"
                    value={data.coreDeposit}
                />


                <SummaryCard
                    title="Warehouse Deposit"
                    value={data.warehouseDeposit}
                />


                <SummaryCard
                    title="Difference"
                    value={
                        data.rule1.difference
                    }
                />


                <SummaryCard
                    title="Monitoring Status"
                    value="ACTIVE"
                />


            </div>




            {/* Rules Section */}


            <div className="
                mt-6
                bg-white
                rounded-xl
                shadow
                p-5
            ">


                <h2 className="
                    text-xl
                    font-bold
                    mb-5
                ">

                    Reconciliation Rules

                </h2>




                <div className="
                    space-y-4
                ">


                    <div className="
                        flex
                        justify-between
                        items-center
                        border-b
                        pb-3
                    ">

                        <div>

                            <p className="font-semibold">

                                Rule 1

                            </p>

                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Core Banking vs Data Warehouse Total Deposit

                            </p>

                        </div>


                        <StatusBadge
                            status={
                                data.rule1.status
                            }
                        />


                    </div>





                    <div className="
                        flex
                        justify-between
                        items-center
                        border-b
                        pb-3
                    ">


                        <div>

                            <p className="font-semibold">

                                Rule 2

                            </p>


                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Retail + Segmentation Deposit Validation

                            </p>


                        </div>



                        <StatusBadge
                            status={
                                data.rule2.status
                            }
                        />


                    </div>






                    <div className="
                        flex
                        justify-between
                        items-center
                    ">


                        <div>

                            <p className="font-semibold">

                                Rule 3

                            </p>


                            <p className="
                                text-sm
                                text-gray-500
                            ">

                                Segment Total Validation

                            </p>


                        </div>



                        <StatusBadge
                            status={
                                data.rule3.status
                            }
                        />


                    </div>



                </div>


            </div>






            {/* Footer Information */}

            <div className="
                mt-6
                bg-white
                rounded-xl
                shadow
                p-5
                text-sm
                text-gray-600
            ">


                <p>

                    Last Data Update:

                    <span className="font-semibold ml-2">

                        {
                            new Date(
                                data.timestamp
                            )
                            .toLocaleString()
                        }

                    </span>

                </p>



                <p className="mt-2">

                    Dashboard Refresh:

                    <span className="font-semibold ml-2">

                        {
                            lastRefresh
                            ?
                            lastRefresh.toLocaleTimeString()
                            :
                            "-"
                        }

                    </span>


                </p>


            </div>



        </div>

    );

};



export default Dashboard;