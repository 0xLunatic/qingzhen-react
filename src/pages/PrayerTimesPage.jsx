// src/pages/PrayerTimesPage.jsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  Avatar,
  Divider,
  Dropdown,
  Space,
  Layout,
} from "antd";
import {
  GlobalOutlined,
  UserOutlined,
  LogoutOutlined,
  TranslationOutlined,
  MenuOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "../App.css";
import { en } from "../lang/en";
import { cn } from "../lang/cn";
import ChinaPrayerSchedule from "../../components/ChinaPrayerSchedule"; // Import komponen jadwal

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

function PrayerTimesPage({ onNavigate }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);

  // --- Multi-language & User Logic (Sama seperti halaman lain) ---
  const TRANSLATIONS = { en, cn };
  const t = (key) => TRANSLATIONS[lang]?.[key] || key;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "cn" : "en"));
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8f9fa",
      }}
    >
      {/* --- NAVBAR --- */}
      <header className="navbar-container">
        <div className="container navbar">
          <div
            className="brand-logo"
            onClick={() => onNavigate("landing")}
            style={{ cursor: "pointer" }}
          >
            <GlobalOutlined className="logo-icon" /> <span>QingzhenMu</span>
          </div>
          <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <Button type="link" onClick={() => onNavigate("finder")}>
              {t("nav_finder")}
            </Button>
            <Button type="link" onClick={() => onNavigate("mosque")}>
              {t("nav_mosque")}
            </Button>
            {/* Active State untuk Prayer */}
            <Button type="link" className="active text-green">
              {t("nav_prayer")}
            </Button>
            <Button type="link" onClick={() => setIsMobileMenuOpen(false)}>
              {t("nav_community")}
            </Button>
            <Button type="link" onClick={() => setIsMobileMenuOpen(false)}>
              {t("nav_blog")}
            </Button>

            {isMobile && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                {user ? (
                  <div style={{ padding: "0 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <Avatar src={user.avatar_url} icon={<UserOutlined />} />
                      <Text strong>{user.name || user.username}</Text>
                    </div>
                    <Button
                      block
                      icon={<LogoutOutlined />}
                      danger
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <Button type="text" onClick={() => onNavigate("auth")}>
                    {t("nav_signin")}
                  </Button>
                )}
              </>
            )}
          </div>
          <div className="nav-actions">
            <Button
              type="text"
              className="hide-mobile"
              icon={<TranslationOutlined />}
              onClick={toggleLanguage}
            >
              {lang === "en" ? "CN" : "EN"}
            </Button>
            <div className="hide-mobile">
              {user ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    style={{ height: "auto", padding: "4px 8px" }}
                  >
                    <Space>
                      <Avatar
                        src={user.avatar_url}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#1B4D3E" }}
                      />
                      <Text strong style={{ color: "var(--text-dark)" }}>
                        {user.name || user.username}
                      </Text>
                      <DownOutlined style={{ fontSize: 10, color: "#999" }} />
                    </Space>
                  </Button>
                </Dropdown>
              ) : (
                <Button type="text" onClick={() => onNavigate("auth")}>
                  {t("nav_signin")}
                </Button>
              )}
            </div>
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <div
        className="container"
        style={{
          flex: 1,
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <Title level={2} style={{ color: "#1B4D3E", marginBottom: 8 }}>
              {" "}
              China Prayer Times{" "}
            </Title>
            <Text type="secondary">
              Accurate prayer times for major cities across China (Beijing Time
              / UTC+8)
            </Text>
          </div>

          {/* Panggil Komponen Jadwal Sholat */}
          <ChinaPrayerSchedule />

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => onNavigate("mosque")}
            >
              Back to Mosque Finder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrayerTimesPage;
