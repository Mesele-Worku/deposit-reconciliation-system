import {
    FaUniversity,
    FaDatabase,
    FaWallet,
    FaLayerGroup
} from "react-icons/fa";


import SummaryCard from "../cards/SummaryCard";




const MonitoringCards = ({
    deposits

}) => {



    const depositData =
        deposits || {};





    return (


        <div
            className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-4
            "
        >






            <SummaryCard

                title="Core Banking Deposit"

                value={
                    depositData.core || 0
                }

                icon={
                    <FaUniversity />
                }

                color="#232A78"

            />








            <SummaryCard

                title="Warehouse Deposit"

                value={
                    depositData.warehouse || 0
                }

                icon={
                    <FaDatabase />
                }

                color="#FF9710"

            />









            <SummaryCard

                title="Retail Deposit"

                value={
                    depositData.retail || 0
                }

                icon={
                    <FaWallet />
                }

                color="#16A34A"

            />









            <SummaryCard

                title="Segmentation Deposit"

                value={
                    depositData.segmentation || 0
                }

                icon={
                    <FaLayerGroup />
                }

                color="#6366F1"

            />





        </div>


    );


};



export default MonitoringCards;