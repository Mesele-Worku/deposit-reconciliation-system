const jobRepository =
    require("../repositories/jobHistoryRepository");



const getJobs = async (req, res) => {


    try {


        const jobs =
            await jobRepository.getLatestJobs();


        res.json(jobs);


    }

    catch (error) {


        res.status(500)
            .json({

                message: error.message

            });


    }


};



module.exports = {
    getJobs
};