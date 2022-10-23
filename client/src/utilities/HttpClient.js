import axios from "axios"
import cogoToast from "cogo-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

axios.interceptors.response.use(
    function (res) {
        return res
    },
    (err) => {
        cogoToast.error(`Server responded with status code ${err.response.status}`)
        return Promise.reject(err)
    }
)

export const HttpClient = () => {
    const token = localStorage.getItem("token");

    const defaultSettings = {
        headers: {
            authorization: token ? `Bearer ${token}` : ""
        }
    }

    return {
        get: async (url) => await axios.get(url, {...defaultSettings}),
        post: async (url, data) => await axios.post(url, data, {...defaultSettings}),
        put: async (url, data) => await axios.put(url, data, {...defaultSettings}),
        delete: async (url) => await axios.delete(url, {...defaultSettings})
    }
}