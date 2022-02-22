import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

const axiosInstance = axios.create({

    baseURL: 'http://localhost:4001/api/',

    headers: {

        "Content-Type": "application/json",

        accept: "application/json",

    },

});




export default axiosInstance;