// src/App.jsx
import React, { useState, useEffect } from "react"; // Tambahkan useEffect
import LandingPage from "./pages/LandingPage.jsx";
import HalalFinder from "./pages/HalalFinder.jsx";
import "./App.css";

function App() {
  // 1. Ganti default value dengan function yang mengecek LocalStorage
  const [currentPage, setCurrentPage] = useState(() => {
    // Cek apakah ada data tersimpan, jika tidak ada default ke "landing"
    return localStorage.getItem("last_visited_page") || "landing";
  });

  // 2. Tambahkan useEffect untuk menyimpan posisi setiap kali currentPage berubah
  useEffect(() => {
    localStorage.setItem("last_visited_page", currentPage);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "finder":
        return <HalalFinder onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;
