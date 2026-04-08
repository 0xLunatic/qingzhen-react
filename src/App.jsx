// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Import Pages Public
import LandingPage from "./pages/LandingPage.jsx";
import HalalFinder from "./pages/HalalFinder.jsx";
import MosqueFinder from "./pages/MosqueFinder.jsx";
import AuthenticationPage from "./pages/AuthenticationPage.jsx";
import PrayerTimesPage from "./pages/PrayerTimesPage.jsx";
import TravelPlanPage from "./pages/TravelPlan.jsx";
import BlogPage from "./pages/BlogPage.jsx";

// Import Pages Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePlaces from "./pages/admin/ManagePlaces";
import AdminLogin from "./pages/admin/AdminLogin"; // 👈 Import Halaman Login Admin Baru

import "./App.css";

// --- Middleware Cerdas: AdminRoute ---
// Logic: Jika Admin -> Tampilkan Dashboard (children)
//        Jika Bukan -> Tampilkan Form Login Admin (di URL yang sama)
const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Cek apakah user sudah login DAN role-nya admin
  if (user && user.role === "admin") {
    return children; // Render AdminLayout + Isinya
  }

  // Jika belum login, atau login tapi user biasa, TAMPILKAN FORM LOGIN ADMIN
  return <AdminLogin />;
};

const AppRoutes = () => {
  const navigate = useNavigate();

  const handleNavigation = (destination) => {
    switch (destination) {
      case "landing":
        navigate("/");
        break;
      case "finder":
        navigate("/finder");
        break;
      case "mosque":
        navigate("/mosque");
        break;
      case "auth":
        navigate("/auth");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "prayer":
        navigate("/prayer");
        break;
      case "travel-plan":
        navigate("/travel-plan");
        break;
      case "blog":
        navigate("/blog");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage onNavigate={handleNavigation} />} />
      <Route
        path="/finder"
        element={<HalalFinder onNavigate={handleNavigation} />}
      />
      <Route
        path="/mosque"
        element={<MosqueFinder onNavigate={handleNavigation} />}
      />
      <Route
        path="/auth"
        element={<AuthenticationPage onNavigate={handleNavigation} />}
      />
      <Route
        path="/prayer"
        element={<PrayerTimesPage onNavigate={handleNavigation} />}
      />
      <Route
        path="/travel-plan"
        element={<TravelPlanPage onNavigate={handleNavigation} />}
      />
      <Route
        path="/blog"
        element={<BlogPage onNavigate={handleNavigation} />}
      />
      {/* ADMIN ROUTES (PROTECTED) */}
      <Route
        path="/admin"
        element={
          // 👇 AdminRoute sekarang menangani logic login sendiri
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="places" element={<ManagePlaces />} />
      </Route>

      {/* FALLBACK ROUTE */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
