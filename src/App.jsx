// src/App.jsx
import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import HalalFinder from "./pages/HalalFinder.jsx";
<<<<<<< HEAD
import MosqueFinder from "./pages/MosqueFinder.jsx";
=======
import MosqueFinder from "./pages/MosqueFinder.jsx"; // 👈 1. Import Component Mosque
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
      case "mosque": 
=======
      case "mosque": // 👈 2. Tambahkan Route 'mosque' di sini
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
