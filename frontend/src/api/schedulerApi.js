import api from "./axios";


const getSchedule = async () => {

    const response =
        await api.get(
            "/schedule"
        );

    return response.data;

};



const updateSchedule = async (data) => {

    const response =
        await api.put(
            "/schedule",
            data
        );

    return response.data;

};



export default {

    getSchedule,

    updateSchedule

};