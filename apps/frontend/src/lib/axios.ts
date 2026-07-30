// "use client";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.error("Session expired or unauthorized access.");
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
