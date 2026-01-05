// src/App.jsx
import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import HalalFinder from "./pages/HalalFinder.jsx";
import MosqueFinder from "./pages/MosqueFinder.jsx";
import AuthenticationPage from "./pages/AuthenticationPage.jsx";
import "./App.css";

function App() {
  // Logic Inisialisasi State
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("last_visited_page");

    // Jika yang tersimpan 'auth', paksa balik ke 'landing'
    if (savedPage === "auth") {
      return "landing";
    }

    return savedPage || "landing";
  });

  // Simpan halaman terakhir yang dibuka
  useEffect(() => {
    localStorage.setItem("last_visited_page", currentPage);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={setCurrentPage} />;
      case "finder":
        return <HalalFinder onNavigate={setCurrentPage} />;
      case "mosque":
        return <MosqueFinder onNavigate={setCurrentPage} />;
      case "auth":
        return <AuthenticationPage onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
}

export default App;