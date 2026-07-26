import {
    FaHome,
    FaPlay,
    FaUsers,
    FaClock,
    FaBell,
    FaFileAlt,
    FaHistory,
    FaCog
} from "react-icons/fa";


import { NavLink } from "react-router-dom";

import { useAuth } from "../context/authContext";



const Sidebar = () => {


    const { user } = useAuth();



    return (

        <aside
            className="
            fixed
            left-0
            top-0
            h-screen
            w-58
            bg-[#232A78]
            text-white
            shadow-xl
            "
        >



            {/* LOGO */}

            <div
                className="
                border-b
                border-white/20
                p-[13px]
                "
            >

                <h1
                    className="
                    text-2xl
                    font-bold
                    "
                >
                    EDRMS
                </h1>


                <p
                    className="
                    text-xs
                    text-gray-300
                    "
                >
                    Enterprise Deposit Reconciliation
                </p>

            </div>






            {/* MENU */}

            <nav
                className="
                mt-5
                space-y-6
                px-4
                "
            >




                {/* MAIN SECTION */}

                <div>

                    <SectionTitle title="MAIN" />


                    <Menu
                        icon={<FaHome />}
                        text="Dashboard"
                        link="/dashboard"
                    />

                </div>







                {/* RECONCILIATION SECTION */}

                <div>

                    <SectionTitle title="RECONCILIATION" />



                    {
                        (
                            user?.role === "ADMIN" ||
                            user?.role === "OPERATOR"
                        )
                        &&

                        <Menu
                            icon={<FaPlay />}
                            text="Run Reconciliation"
                            link="/reconciliation/run"
                        />

                    }



                    <Menu
                        icon={<FaHistory />}
                        text="Reconciliation History"
                        link="/history"
                    />


                </div>









                {/* ADMINISTRATION SECTION */}


                {
                    user?.role === "ADMIN" &&


                    <div>


                        <SectionTitle title="ADMINISTRATION" />



                        <Menu
                            icon={<FaUsers />}
                            text="User Management"
                            link="/users"
                        />



                        <Menu
                            icon={<FaClock />}
                            text="Scheduler Management"
                            link="/scheduler"
                        />



                        <Menu
                            icon={<FaBell />}
                            text="Notification Management"
                            link="/notifications"
                        />



                    </div>

                }









                {/* REPORTING SECTION */}


                <div>


                    <SectionTitle title="REPORTING" />


                    <Menu
                        icon={<FaFileAlt />}
                        text="Reports"
                        link="/reports"
                    />


                </div>









                {/* SYSTEM SECTION */}


                {
                    user?.role === "ADMIN" &&


                    <div>


                        <SectionTitle title="SYSTEM" />


                        <Menu
                            icon={<FaCog />}
                            text="System Settings"
                            link="/settings"
                        />


                    </div>

                }





            </nav>


        </aside>

    );

};









// ===============================
// MENU ITEM COMPONENT
// ===============================


const Menu = ({
    icon,
    text,
    link
}) => {


    return (

        <NavLink

            to={link}


            className={({ isActive }) =>

                `
                group
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                transition-all
                duration-200


                ${isActive

                    ?

                    "bg-[#ff9710] text-white shadow-lg"

                    :

                    "text-gray-200 hover:bg-white/20 hover:text-white"

                }

                `

            }


        >


            <span
                className="
                text-lg
                group-hover:text-white
                "
            >

                {icon}

            </span>



            <span>

                {text}

            </span>



        </NavLink>

    );

};









// ===============================
// SECTION TITLE COMPONENT
// ===============================


const SectionTitle = ({
    title
}) => {


    return (

        <p

            className="
            mb-2
            px-3
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-gray-300
            "

        >

            {title}


        </p>

    );

};





export default Sidebar;