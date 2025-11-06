import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://guships.onrender.com";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
