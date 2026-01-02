// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Sesuaikan port backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Otomatis sisipkan Token JWT jika ada (untuk request yg butuh login)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
