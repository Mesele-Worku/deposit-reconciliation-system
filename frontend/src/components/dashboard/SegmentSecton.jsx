import SegmentCard from "../cards/SegmentCard";


const SegmentSection = ({
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

                Segment Breakdown

            </h2>




            <div
                className="
                grid
                grid-cols-2
                gap-4
                sm:grid-cols-3
                md:grid-cols-4
                xl:grid-cols-6
                "
            >


                {
                    Object.entries(
                        segments || {}
                    )
                        .map(([name, value]) => (


                            <SegmentCard

                                key={name}

                                name={name}

                                value={value}

                            />


                        ))
                }



            </div>




        </section>

    );

};



export default SegmentSection;