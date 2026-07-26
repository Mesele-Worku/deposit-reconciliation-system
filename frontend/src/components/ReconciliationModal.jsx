import {
    FaSyncAlt,
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";



const ReconciliationModal = ({
    status,
    message,
}) => {


    if (!status) {
        return null;
    }



    return (

        <div
            className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-black/70
      "
        >


            <div
                className="
        w-96
        rounded-xl
        bg-white
        p-8
        text-center
        shadow-2xl
        "
            >



                {/* RUNNING STATE */}

                {
                    status === "RUNNING" && (

                        <>

                            <FaSyncAlt

                                className="
                mx-auto
                mb-5
                animate-spin
                text-[#232A78]
                "

                                size={45}

                            />



                            <h2
                                className="
                text-xl
                font-bold
                text-[#232A78]
                "
                            >

                                Running Reconciliation

                            </h2>




                            <p
                                className="
                mt-3
                text-gray-600
                "
                            >

                                {
                                    message ||
                                    "Please wait while deposit reconciliation is processing..."
                                }


                            </p>



                        </>

                    )
                }






                {/* SUCCESS STATE */}


                {
                    status === "SUCCESS" && (

                        <>

                            <FaCheckCircle

                                className="
                mx-auto
                mb-5
                text-green-600
                "

                                size={45}

                            />



                            <h2
                                className="
                text-xl
                font-bold
                text-green-600
                "
                            >

                                Completed Successfully

                            </h2>




                            <p
                                className="
                mt-3
                text-gray-600
                "
                            >

                                {
                                    message ||
                                    "Reconciliation completed successfully"
                                }


                            </p>



                        </>

                    )
                }







                {/* FAILED STATE */}


                {
                    status === "FAILED" && (

                        <>

                            <FaTimesCircle

                                className="
                mx-auto
                mb-5
                text-red-600
                "

                                size={45}

                            />




                            <h2
                                className="
                text-xl
                font-bold
                text-red-600
                "
                            >

                                Reconciliation Failed

                            </h2>




                            <p
                                className="
                mt-3
                text-gray-600
                "
                            >

                                {
                                    message ||
                                    "An error occurred during reconciliation"
                                }


                            </p>



                        </>

                    )
                }



            </div>



        </div>

    );

};



export default ReconciliationModal;