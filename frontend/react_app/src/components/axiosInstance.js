import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

const axiosInstance = axios.create({

    baseURL: process.env.REACT_APP_BASE_URL,

    headers: {

        "Content-Type": "application/json",

        accept: "application/json",

    },

});




export default axiosInstance;