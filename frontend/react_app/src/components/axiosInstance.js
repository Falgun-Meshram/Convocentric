import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        Authorization: "Token " + localStorage.getItem("token"),
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       const originalRequest = error.config;
//       if (
//         error && error.response &&
//         (error.response.status === 401 || error.response.status === 403) &&
//         (error.response.statusText === "Unauthorized" ||
//           error.response.statusText === "Forbidden")
//       ) {
//         return axiosInstance
//           .post("is_authenticated")
//           .then((response) => {
//             console.log(response)
//             localStorage.setItem("token", response.data.token);
//             axiosInstance.defaults.headers["Authorization"] = "Token " + response.data.token;
//             originalRequest.headers["Authorization"] = "Token " + response.data.token;
//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       }
//       return Promise.reject(error);
//     }
// );

export default axiosInstance;