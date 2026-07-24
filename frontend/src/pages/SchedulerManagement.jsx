import {
    useEffect,
    useState
} from "react";


import schedulerApi from "../api/schedulerApi";


import Navbar from "../components/Navbar";



const SchedulerManagement = () => {


    const [schedule, setSchedule] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);



    const loadSchedule = async () => {


        try {


            setLoading(true);


            const data =
                await schedulerApi.getSchedule();


            setSchedule(data);


        }

        catch (error) {

            console.error(
                "Loading schedule failed",
                error
            );

        }

        finally {

            setLoading(false);

        }


    };





    useEffect(() => {


        const fetchSchedule = async () => {

            await loadSchedule();

        };


        fetchSchedule();


    }, []);







    const handleChange = (e) => {


        setSchedule({

            ...schedule,

            [e.target.name]:
                e.target.value

        });


    };








    const handleSave = async () => {


        try {


            setSaving(true);



            await schedulerApi.updateSchedule({

                scheduleId:
                    schedule.SCHEDULE_ID,


                scheduleName:
                    schedule.SCHEDULE_NAME,


                runType:
                    schedule.RUN_TYPE,


                runTime:
                    schedule.RUN_TIME,


                daysOfWeek:
                    schedule.DAYS_OF_WEEK,


                timezone:
                    schedule.TIMEZONE,


                status:
                    schedule.STATUS

            });



            alert(
                "Schedule updated successfully"
            );


        }


        catch (error) {


            console.error(error);


            alert(
                "Schedule update failed"
            );


        }


        finally {


            setSaving(false);


        }


    };








    if (loading) {


        return (

            <div className="
                flex
                min-h-screen
                items-center
                justify-center
            ">

                Loading schedule...


            </div>

        );

    }







    return (

        <div
            className="
            min-h-screen
            bg-slate-100
            "
        >


            <Navbar />




            <main
                className="
                mx-auto
                max-w-3xl
                p-6
                "
            >


                <h1
                    className="
                    mb-6
                    text-2xl
                    font-bold
                    text-[#232A78]
                    "
                >

                    Scheduler Management

                </h1>






                <div
                    className="
                    rounded-xl
                    bg-white
                    p-6
                    shadow
                    "
                >





                    <label className="block mb-2 font-semibold">
                        Schedule Name
                    </label>


                    <input

                        name="SCHEDULE_NAME"

                        value={
                            schedule.SCHEDULE_NAME
                        }

                        onChange={
                            handleChange
                        }

                        className="
                        mb-4
                        w-full
                        rounded
                        border
                        p-2
                        "

                    />








                    <label className="block mb-2 font-semibold">
                        Run Time
                    </label>


                    <input

                        type="time"

                        name="RUN_TIME"

                        value={
                            schedule.RUN_TIME
                        }

                        onChange={
                            handleChange
                        }

                        className="
                        mb-4
                        w-full
                        rounded
                        border
                        p-2
                        "

                    />








                    <label className="block mb-2 font-semibold">
                        Days Of Week
                    </label>


                    <input

                        name="DAYS_OF_WEEK"

                        value={
                            schedule.DAYS_OF_WEEK
                        }

                        onChange={
                            handleChange
                        }

                        className="
                        mb-4
                        w-full
                        rounded
                        border
                        p-2
                        "

                    />










                    <label className="block mb-2 font-semibold">
                        Timezone
                    </label>


                    <input

                        name="TIMEZONE"

                        value={
                            schedule.TIMEZONE
                        }

                        onChange={
                            handleChange
                        }

                        className="
                        mb-4
                        w-full
                        rounded
                        border
                        p-2
                        "

                    />








                    <label className="block mb-2 font-semibold">
                        Status
                    </label>


                    <select

                        name="STATUS"

                        value={
                            schedule.STATUS
                        }

                        onChange={
                            handleChange
                        }

                        className="
                        mb-6
                        w-full
                        rounded
                        border
                        p-2
                        "

                    >

                        <option value="ACTIVE">
                            ACTIVE
                        </option>


                        <option value="INACTIVE">
                            INACTIVE
                        </option>


                    </select>








                    <button

                        onClick={
                            handleSave
                        }

                        disabled={
                            saving
                        }

                        className="
                        rounded
                        bg-[#232A78]
                        px-5
                        py-2
                        font-semibold
                        text-white
                        "

                    >

                        {
                            saving
                                ?
                                "Saving..."
                                :
                                "Update Schedule"
                        }


                    </button>





                </div>




            </main>



        </div>

    );


};


export default SchedulerManagement;