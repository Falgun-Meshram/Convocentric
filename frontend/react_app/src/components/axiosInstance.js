import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

const axiosInstance = axios.create({

    baseURL: 'http://6813-2607-fea8-1bdd-0-4c1d-785e-f6f1-5b7c.ngrok.io/api/',

    headers: {

        "Content-Type": "application/json",

        accept: "application/json",

    },

});




export default axiosInstance;