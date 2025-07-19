import axios from "axios";

// in production, there's no localhost so we have to make this dynamic
// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const BASE_URL = import.meta.env.PROD 
  ? "https://mern-notes-backend-6kxk.onrender.com/api"  // Make sure this matches your backend URL
  : "http://localhost:5001/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
