import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("hrms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("hrms_token");
      Cookies.remove("hrms_role");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    if (error.response?.status === 403) {
      toast.error("You do not have permission to perform this action.");
    }
    if (error.response?.status === 422) {
      const errors = error.response.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
