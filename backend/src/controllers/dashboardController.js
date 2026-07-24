
// const dashboardService =
//     require("../services/dashboardService");




// const getDashboard = async (req, res) => {


//     try {


//         const data =
//             await dashboardService
//                 .getDashboardData();



//         res.json(data);



//     }

//     catch (error) {


//         res.status(500)
//             .json({

//                 message:
//                     error.message

//             });


//     }


// };





// module.exports = {

//     getDashboard

// };


const dashboardService =
    require("../services/dashboardService");



const getStatus = async (req, res) => {


    try {


        const dashboard =
            await dashboardService.getDashboard();



        res.status(200).json(
            dashboard
        );


    }
    catch (error) {


        console.error(
            "Dashboard Error:",
            error.message
        );


        res.status(500).json({

            message:
                error.message

        });


    }


};




module.exports = {

    getStatus

};