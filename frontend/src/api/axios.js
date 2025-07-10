import axios from "axios";
import { logoutUser } from "../utils/logoutUser";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.get("/auth/refresh");
        const newToken = res.data.token;

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch {
        logoutUser(); // redirect
      }
    }

    return Promise.reject(err);
  }
);

export default api;
