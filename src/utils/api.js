// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 1. REQUEST: Kirim Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE: Handle Error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config ? error.config.url : "";

    // 👇 PENTING: JANGAN Auto-Logout jika error terjadi saat Login/Register
    // Biarkan error ini lewat agar Frontend bisa menampilkan pesan "Password Salah"
    if (
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // Hanya Auto-Logout jika error 401 terjadi di halaman lain (misal saat buka Peta)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn("Session expired. Clearing storage.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = '/auth'; // Uncomment jika mau redirect paksa
    }
    return Promise.reject(error);
  }
);

export default api;
