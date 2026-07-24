import DepositPieChart from "../charts/DespositPieChart";
import DepositTrendChart from "../charts/DepositTrendChart";



const AnalyticsSection = ({
    deposits,
    segments
}) => {



    return (

        <section
            className="
            mt-8
            "
        >



            <h2
                className="
                mb-4
                text-xl
                font-bold
                text-[#232A78]
                "
            >

                Deposit Analytics

            </h2>






            <div
                className="
                grid
                gap-6
                xl:grid-cols-2
                "
            >






                {/* Deposit Distribution */}


                <div
                    className="
                    rounded-xl
                    bg-white
                    p-5
                    shadow
                    "
                >



                    <h3
                        className="
                        mb-4
                        font-semibold
                        text-gray-700
                        "
                    >

                        Deposit Distribution

                    </h3>





                    <DepositPieChart

                        segments={

                            segments || {}

                        }

                    />



                </div>









                {/* Trend Chart */}


                <div
                    className="
                    rounded-xl
                    bg-white
                    p-5
                    shadow
                    "
                >



                    <h3
                        className="
                        mb-4
                        font-semibold
                        text-gray-700
                        "
                    >

                        Deposit Trend

                    </h3>





                    <DepositTrendChart />



                </div>





            </div>









            {/* Deposit Comparison */}


            <div
                className="
                mt-6
                grid
                gap-5
                md:grid-cols-4
                "
            >





                <DepositMetric

                    title="Core Banking"

                    value={
                        deposits?.core
                    }

                />



                <DepositMetric

                    title="Warehouse"

                    value={
                        deposits?.warehouse
                    }

                />



                <DepositMetric

                    title="Retail"

                    value={
                        deposits?.retail
                    }

                />



                <DepositMetric

                    title="Segmentation"

                    value={
                        deposits?.segmentation
                    }

                />




            </div>





        </section>


    );

};








const DepositMetric = ({
    title,
    value
}) => {



    return (

        <div
            className="
            rounded-xl
            bg-white
            p-4
            shadow
            "
        >


            <p
                className="
                text-sm
                text-gray-500
                "
            >

                {title}

            </p>




            <p
                className="
                mt-2
                text-xl
                font-bold
                text-[#232A78]
                "
            >

                {
                    value
                        ?
                        value.toLocaleString()
                        :
                        0
                }

            </p>



        </div>


    );


};




export default AnalyticsSection;