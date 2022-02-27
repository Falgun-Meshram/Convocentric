import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

const axiosInstance = axios.create({

    baseURL: 'http://25ab-2607-fea8-1c80-7f7-55ce-adce-4c03-481e.ngrok.io/api/',

    headers: {

        "Content-Type": "application/json",

        accept: "application/json",

    },

});




export default axiosInstance;