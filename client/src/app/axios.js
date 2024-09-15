import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "https://quietsphere.onrender.com"}/api/v1`;

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
