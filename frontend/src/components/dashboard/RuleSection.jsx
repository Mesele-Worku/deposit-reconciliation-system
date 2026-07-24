import RuleCard from "../cards/RuleCard";



const RuleSection = ({
    rules
}) => {



    const ruleData =
        rules || {};



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

                Reconciliation Rules

            </h2>






            <div
                className="
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
                "
            >



                <RuleCard

                    rule={
                        ruleData.rule1
                    }

                />



                <RuleCard

                    rule={
                        ruleData.rule2
                    }

                />



                <RuleCard

                    rule={
                        ruleData.rule3
                    }

                />



            </div>







            {
                ruleData.summary && (

                    <div
                        className="
                        mt-5
                        rounded-xl
                        bg-white
                        p-4
                        shadow
                        "
                    >


                        <h3
                            className="
                            font-bold
                            text-gray-700
                            "
                        >

                            Rule Summary

                        </h3>





                        <div
                            className="
                            mt-3
                            grid
                            grid-cols-3
                            gap-3
                            text-center
                            "
                        >



                            <div>

                                <p
                                    className="
                                    text-sm
                                    text-gray-500
                                    "
                                >
                                    Total
                                </p>


                                <p
                                    className="
                                    text-xl
                                    font-bold
                                    "
                                >

                                    {
                                        ruleData.summary.total
                                    }

                                </p>


                            </div>







                            <div>

                                <p
                                    className="
                                    text-sm
                                    text-green-600
                                    "
                                >

                                    Passed

                                </p>


                                <p
                                    className="
                                    text-xl
                                    font-bold
                                    text-green-600
                                    "
                                >

                                    {
                                        ruleData.summary.passed
                                    }

                                </p>


                            </div>








                            <div>

                                <p
                                    className="
                                    text-sm
                                    text-red-600
                                    "
                                >

                                    Failed

                                </p>


                                <p
                                    className="
                                    text-xl
                                    font-bold
                                    text-red-600
                                    "
                                >

                                    {
                                        ruleData.summary.failed
                                    }

                                </p>


                            </div>






                        </div>



                    </div>


                )
            }





        </section>


    );


};



export default RuleSection;