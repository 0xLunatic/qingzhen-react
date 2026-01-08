// src/pages/PrayerTime.jsx
import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Spin,
  message,
  Avatar,
  Divider,
  Grid,
  Select,
  Badge,
  Dropdown,
  Space,
  Drawer,
} from "antd";
import {
  ClockCircleFilled,
  EnvironmentFilled,
  CalendarOutlined,
  CompassFilled,
  SettingOutlined,
  ReloadOutlined,
  UserOutlined,
  LogoutOutlined,
  TranslationOutlined,
  MenuOutlined,
  SunFilled,
  MoonFilled,
  CloudFilled,
  DownOutlined,
} from "@ant-design/icons";
import { FaMosque, FaPray, FaKaaba } from "react-icons/fa";
import { WiDaySunny, WiMoonAltWaxingCrescent4 } from "react-icons/wi";

import logoImage from "../assets/logo.png"; 
import "../App.css"; 

// 👇 IMPORT API HELPER (Sama seperti HalalFinder)
import api from "../utils/api";
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { Option } = Select;

// --- CONSTANTS ---
const THEME_COLOR = "#1B4D3E";
const ACCENT_COLOR = "#C6A87C";
const MECCA_COORDS = { lat: 21.4225, lng: 39.8262 };

// 👇 KONFIGURASI BACKEND (Sama seperti HalalFinder)
const BACKEND_URL = "http://localhost:5000";

// --- HELPER FUNCTIONS ---

// 1. Helper Foto (Membersihkan URL gambar dari Backend)
const getPhotoUrl = (path) => {
  if (!path) return null; // Return null biar Avatar pakai icon default
  if (path.startsWith("http")) return path;

  let cleanPath = path.replace(/\\/g, "/");

  if (cleanPath.startsWith("public/")) {
    cleanPath = cleanPath.replace("public/", "");
  } else if (cleanPath.startsWith("/public/")) {
    cleanPath = cleanPath.replace("/public/", "");
  }

  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }

  return `${BACKEND_URL}${cleanPath}`;
};

// 2. Hitung Arah Kiblat
const calculateQiblaDirection = (userLat, userLng) => {
  const lat1 = (userLat * Math.PI) / 180;
  const lng1 = (userLng * Math.PI) / 180;
  const lat2 = (MECCA_COORDS.lat * Math.PI) / 180;
  const lng2 = (MECCA_COORDS.lng * Math.PI) / 180;
  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

// 3. Format Waktu
const formatTime = (timeStr) => {
  if (!timeStr) return "--:--";
  return timeStr.split(" ")[0];
};

function PrayerTime({ onNavigate }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // --- STATE UI (NAVBAR) ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const TRANSLATIONS = { en, cn };
  const t = (key) => TRANSLATIONS[lang]?.[key] || key;
  
  // --- STATE USER & DATA ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  
  // Data Sholat
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [gregorianDate, setGregorianDate] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [qiblaDir, setQiblaDir] = useState(0);
  const [calculationMethod, setCalculationMethod] = useState(2); // Default: ISNA

  // --- EFFECTS ---

  // 1. Load User Data (Dari LocalStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  // 2. Get Location & Fetch Data
  useEffect(() => {
    getLocationAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculationMethod]);

  // 3. Countdown Loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (timings) calculateNextPrayer(timings);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timings]);

  // --- LOGIC ---

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.success("Logged out");
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "cn" : "en"));
    message.success(lang === "en" ? "切换到中文" : "Switched to English");
  };

  // Fungsi Opsional: Simpan preferensi ke Backend (Jika nanti dibutuhkan)
  const savePreferenceToBackend = async (method) => {
    if (!user) return;
    try {
        // Contoh implementasi jika ada endpoint update user
        // await api.put(`/users/${user.id}`, { calculation_method: method });
        console.log("Saving preference to backend:", method);
    } catch (error) {
        console.error("Failed to save preference", error);
    }
  }

  const handleMethodChange = (val) => {
      setCalculationMethod(val);
      savePreferenceToBackend(val);
  }

  const getLocationAndFetch = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setQiblaDir(calculateQiblaDirection(latitude, longitude));
          fetchPrayerTimes(latitude, longitude);
        },
        (error) => {
          message.warning("GPS access denied/failed. Using default location (Jakarta).");
          const defLat = -6.2088;
          const defLng = 106.8456;
          setLocation({ lat: defLat, lng: defLng });
          setQiblaDir(calculateQiblaDirection(defLat, defLng));
          fetchPrayerTimes(defLat, defLng);
        }
      );
    } else {
      message.error("Geolocation not supported.");
      setLoading(false);
    }
  };

  const fetchPrayerTimes = async (lat, lng) => {
    try {
      const date = new Date();
      const timestamp = Math.floor(date.getTime() / 1000);
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${calculationMethod}`
      );
      const data = await response.json();

      if (data.code === 200) {
        setTimings(data.data.timings);
        setHijriDate(data.data.date.hijri);
        setGregorianDate(data.data.date.readable);
        calculateNextPrayer(data.data.timings);
      } else {
        message.error("Failed to fetch prayer data");
      }
    } catch (error) {
      console.error(error);
      message.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = (timingsData) => {
    if (!timingsData) return;
    const now = new Date();
    const timeNow = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: "Fajr", time: timingsData.Fajr },
      { name: "Sunrise", time: timingsData.Sunrise, isPrayer: false },
      { name: "Dhuhr", time: timingsData.Dhuhr },
      { name: "Asr", time: timingsData.Asr },
      { name: "Maghrib", time: timingsData.Maghrib },
      { name: "Isha", time: timingsData.Isha },
    ];

    let upcoming = null;
    for (let p of prayers) {
      const [h, m] = p.time.split(":").map(Number);
      const pTime = h * 60 + m;
      if (pTime > timeNow) {
        upcoming = p;
        break;
      }
    }

    if (!upcoming) {
      upcoming = { name: "Fajr", time: timingsData.Fajr, isNextDay: true };
    }

    const [h, m] = upcoming.time.split(":").map(Number);
    let targetDate = new Date();
    targetDate.setHours(h, m, 0, 0);
    if (upcoming.isNextDay) targetDate.setDate(targetDate.getDate() + 1);

    const diffMs = targetDate - now;
    const diffH = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffS = Math.floor((diffMs % (1000 * 60)) / 1000);

    setNextPrayer(upcoming.name);
    setTimeLeft(
      `${diffH.toString().padStart(2, "0")}:${diffM.toString().padStart(2, "0")}:${diffS.toString().padStart(2, "0")}`
    );
  };

  // --- UI HELPERS ---

  const getIcon = (name) => {
    switch (name) {
      case "Fajr": return <WiMoonAltWaxingCrescent4 size={28} color={THEME_COLOR} />;
      case "Sunrise": return <SunFilled style={{ fontSize: 24, color: "#faad14" }} />;
      case "Dhuhr": return <WiDaySunny size={32} color="#faad14" />;
      case "Asr": return <CloudFilled style={{ fontSize: 24, color: "#8c8c8c" }} />;
      case "Maghrib": return <div style={{width: 24, height: 12, background: 'linear-gradient(to top, #faad14, #1B4D3E)', borderRadius: '12px 12px 0 0'}}></div>;
      case "Isha": return <MoonFilled style={{ fontSize: 24, color: THEME_COLOR }} />;
      default: return <ClockCircleFilled />;
    }
  };

  const userMenuItems = [
    { key: "profile", label: "My Profile", icon: <UserOutlined />, onClick: () => message.info("Profile Page") },
    { type: "divider" },
    { key: "logout", label: "Log Out", icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  // Helper untuk konten menu mobile (Sama dengan HalalFinder)
  const renderMobileMenu = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button type="text" block style={{ textAlign: 'left' }} onClick={() => { onNavigate("finder"); setIsMobileMenuOpen(false); }}>
        {t("nav_finder")}
      </Button>
      <Button type="text" block style={{ textAlign: 'left' }} onClick={() => { onNavigate("mosque"); setIsMobileMenuOpen(false); }}>
        {t("nav_mosque")}
      </Button>
      <Button type="text" block style={{ textAlign: 'left', color: THEME_COLOR, fontWeight: 'bold', background: '#e6f7ff' }} onClick={() => setIsMobileMenuOpen(false)}>
        {t("nav_prayer")}
      </Button>
      <Button type="text" block style={{ textAlign: 'left' }} onClick={() => setIsMobileMenuOpen(false)}>
        {t("nav_community")}
      </Button>
      <Button type="text" block style={{ textAlign: 'left' }} onClick={() => setIsMobileMenuOpen(false)}>
        {t("nav_blog")}
      </Button>

      <Divider style={{ margin: "8px 0" }} />

      {user ? (
        <div style={{ padding: "0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Avatar 
                src={getPhotoUrl(user.avatar_url)} 
                icon={<UserOutlined />} 
            />
            <Text strong>{user.name || user.username}</Text>
          </div>
          <Button block icon={<UserOutlined />} onClick={() => message.info("Profile")} style={{ marginBottom: 8 }}>
             My Profile
          </Button>
          <Button block icon={<LogoutOutlined />} danger onClick={handleLogout}>
             Log Out
          </Button>
        </div>
      ) : (
        <Button type="primary" block onClick={() => onNavigate("auth")}>
          {t("nav_signin")}
        </Button>
      )}

      <Button block onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} icon={<TranslationOutlined />}>
        {lang === "en" ? "CN" : "EN"}
      </Button>
       
       <Button block shape="round" className="btn-gold" onClick={() => { setIsMobileMenuOpen(false); message.info("Download app modal"); }}>
        {t("nav_download")}
      </Button>
    </div>
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5f7fa" }}>
      
      {/* --- NAVBAR (KODE SAMA DENGAN HALALFINDER) --- */}
      <header className="navbar-container" style={{ padding: '0 20px', background: '#fff' }}>
        <div className="container navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          {/* Logo */}
          <div className="brand-logo" onClick={() => onNavigate("landing")} style={{ cursor: "pointer", display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="logo-icon-wrapper">
              <img src={logoImage} alt="Logo Brand" className="logo-icon" style={{ width: '32px' }} />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>QingzhenMu</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="nav-links desktop-only" style={{ display: isMobile ? 'none' : 'flex', gap: '20px' }}>
            <Button type="link" onClick={() => onNavigate("finder")}>
               {t("nav_finder")}
            </Button>
            <Button type="link" onClick={() => onNavigate("mosque")}>
               {t("nav_mosque")}
            </Button>
            <Button type="link" className="active text-green" onClick={() => {}}>
               {t("nav_prayer")}
            </Button>
            <Button type="link" onClick={() => {}}>
               {t("nav_community")}
            </Button>
            <Button type="link" onClick={() => {}}>
               {t("nav_blog")}
            </Button>
          </div>

          {/* Nav Actions */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isMobile && (
              <Button type="text" icon={<TranslationOutlined />} onClick={toggleLanguage} style={{ fontWeight: "bold", marginRight: 8 }}>
                {lang === "en" ? "CN" : "EN"}
              </Button>
            )}

            <div className="hide-mobile" style={{ display: isMobile ? 'none' : 'block' }}>
              {user ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <Button type="text" style={{ height: "auto", padding: "4px 8px" }}>
                    <Space>
                      {/* Avatar Menggunakan getPhotoUrl agar konsisten dengan Backend */}
                      <Avatar 
                        src={getPhotoUrl(user.avatar_url)} 
                        icon={<UserOutlined />} 
                        style={{ backgroundColor: "var(--primary-green)" }} 
                      />
                      <Text strong style={{ color: "var(--text-dark)" }}>
                        {user.name || user.username || "User"}
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

            {!isMobile && (
              <Button type="primary" shape="round" className="btn-gold" onClick={() => {}}>
                {t("nav_download")}
              </Button>
            )}

            {/* Hamburger Button (Mobile Only) */}
            {isMobile && (
              <Button
                type="text"
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                icon={<MenuOutlined style={{ fontSize: '20px' }} />}
              />
            )}
          </div>
        </div>
      </header>

      {/* --- DRAWER MENU MOBILE --- */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={280}
      >
        {renderMobileMenu()}
      </Drawer>

      {/* --- MAIN CONTENT (PRAYER SPECIFIC) --- */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '32px 20px' }}>
        <div className="container" style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
            
          {loading ? (
              <div style={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 16 }}>
                  <Spin size="large" />
                  <Text type="secondary">Fetching prayer times...</Text>
              </div>
          ) : (
              <Row gutter={[24, 24]}>
                  
                  {/* LEFT COLUMN: HERO & LIST */}
                  <Col xs={24} md={14} lg={15}>
                      
                      {/* 1. HERO CARD (COUNTDOWN) */}
                      <Card
                          bordered={false}
                          style={{ 
                              background: `linear-gradient(135deg, ${THEME_COLOR} 0%, #143b2f 100%)`, 
                              color: 'white', 
                              borderRadius: 16,
                              marginBottom: 24,
                              boxShadow: '0 10px 30px rgba(27, 77, 62, 0.3)',
                              position: 'relative',
                              overflow: 'hidden'
                          }}
                      >
                          {/* Background Decor */}
                          <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, fontSize: 180, color: '#fff' }}>
                              <FaMosque />
                          </div>

                          <div style={{ position: 'relative', zIndex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div>
                                      <Text style={{ color: ACCENT_COLOR, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}>
                                          Next Prayer
                                      </Text>
                                      <Title level={1} style={{ color: 'white', margin: '4px 0 0 0', fontSize: isMobile ? 36 : 48 }}>
                                          {nextPrayer === 'Sunrise' ? 'Sunrise' : nextPrayer}
                                      </Title>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                          <ClockCircleFilled style={{ color: 'rgba(255,255,255,0.7)' }} />
                                          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>
                                              {timings ? formatTime(timings[nextPrayer]) : '--:--'}
                                          </Text>
                                      </div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Countdown</Text>
                                      <div style={{ fontSize: isMobile ? 28 : 42, fontWeight: 'bold', fontFamily: 'monospace', lineHeight: 1, color: '#fff' }}>
                                          {timeLeft}
                                      </div>
                                  </div>
                              </div>

                              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

                              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <CalendarOutlined style={{ color: ACCENT_COLOR, fontSize: 18 }} />
                                      <div>
                                          <Text style={{ color: 'white', display: 'block', lineHeight: 1.2 }}>
                                              {hijriDate ? `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}` : 'Loading...'}
                                          </Text>
                                          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                                              {gregorianDate}
                                          </Text>
                                      </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <EnvironmentFilled style={{ color: ACCENT_COLOR, fontSize: 18 }} />
                                      <div>
                                          <Text style={{ color: 'white', display: 'block', lineHeight: 1.2 }}>
                                             My Location
                                          </Text>
                                          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                                              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting...'}
                                          </Text>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </Card>

                      {/* 2. SCHEDULE LIST */}
                      <Card title="Today's Schedule" bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <div className="prayer-list">
                              {timings && ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((name) => {
                                  const isActive = name === nextPrayer;
                                  return (
                                      <div 
                                          key={name}
                                          style={{
                                              display: 'flex', 
                                              justifyContent: 'space-between', 
                                              alignItems: 'center',
                                              padding: '16px 0',
                                              borderBottom: '1px solid #f0f0f0',
                                              backgroundColor: isActive ? '#f6ffed' : 'transparent',
                                              margin: isActive ? '0 -24px' : '0',
                                              paddingLeft: isActive ? 24 : 0,
                                              paddingRight: isActive ? 24 : 0,
                                              transition: 'all 0.3s'
                                          }}
                                      >
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                              <div style={{
                                                  width: 40, height: 40, borderRadius: '50%', 
                                                  background: isActive ? THEME_COLOR : '#f5f5f5', 
                                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                  color: isActive ? ACCENT_COLOR : '#999'
                                              }}>
                                                  {getIcon(name)}
                                              </div>
                                              <div>
                                                  <Text strong style={{ fontSize: 16, color: isActive ? THEME_COLOR : '#333' }}>
                                                      {name}
                                                  </Text>
                                                  {isActive && <Badge status="processing" text={<span style={{ color: '#52c41a', fontSize: 10 }}>Upcoming</span>} style={{ marginLeft: 8 }} />}
                                              </div>
                                          </div>
                                          <Text style={{ fontSize: 18, fontWeight: isActive ? 'bold' : 'normal', color: isActive ? THEME_COLOR : '#555' }}>
                                              {formatTime(timings[name])}
                                          </Text>
                                      </div>
                                  )
                              })}
                          </div>
                      </Card>
                  </Col>

                  {/* RIGHT COLUMN: QIBLA & SETTINGS */}
                  <Col xs={24} md={10} lg={9}>
                      
                      {/* 1. QIBLA COMPASS */}
                      <Card bordered={false} style={{ borderRadius: 16, marginBottom: 24, textAlign: 'center', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <Title level={4} style={{ marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                               <FaKaaba style={{ color: THEME_COLOR }}/> Qibla Direction
                          </Title>
                          <Text type="secondary">Point your device to find Mecca.</Text>
                          
                          <div style={{ margin: '30px auto', position: 'relative', width: 200, height: 200 }}>
                              {/* Compass Ring */}
                              <div style={{
                                  width: '100%', height: '100%', borderRadius: '50%', border: `8px solid #f0f0f0`,
                                  position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'
                              }}>
                                  <span style={{ position: 'absolute', top: 5, fontWeight: 'bold', color: '#ccc' }}>N</span>
                                  <span style={{ position: 'absolute', bottom: 5, fontWeight: 'bold', color: '#ccc' }}>S</span>
                                  <span style={{ position: 'absolute', left: 10, fontWeight: 'bold', color: '#ccc' }}>W</span>
                                  <span style={{ position: 'absolute', right: 10, fontWeight: 'bold', color: '#ccc' }}>E</span>
                                  
                                  {/* Arrow */}
                                  <div style={{
                                      position: 'absolute',
                                      width: 4, height: '50%', background: 'transparent',
                                      transform: `rotate(${qiblaDir}deg)`,
                                      transformOrigin: 'bottom center',
                                      top: 0, left: 'calc(50% - 2px)',
                                      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                  }}>
                                      <div style={{
                                          width: 0, height: 0, 
                                          borderLeft: '10px solid transparent', borderRight: '10px solid transparent', 
                                          borderBottom: `30px solid ${THEME_COLOR}`,
                                          position: 'absolute', top: 0, left: -8
                                      }}></div>
                                  </div>

                                  <div style={{ zIndex: 10, background: '#fff', padding: '4px 12px', borderRadius: 20, border: `1px solid ${ACCENT_COLOR}` }}>
                                      <Text strong style={{ fontSize: 18, color: THEME_COLOR }}>{Math.round(qiblaDir)}°</Text>
                                  </div>
                              </div>
                          </div>
                          <Button icon={<CompassFilled />} type="primary" ghost block onClick={getLocationAndFetch}>
                              Refresh GPS
                          </Button>
                      </Card>

                      {/* 2. SETTINGS */}
                      <Card title={<><SettingOutlined /> Settings</>} bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <div style={{ marginBottom: 16 }}>
                              <Text strong style={{ display: 'block', marginBottom: 8 }}>Calculation Method</Text>
                              <Select 
                                  value={calculationMethod} 
                                  style={{ width: '100%' }} 
                                  onChange={handleMethodChange}
                                  size="large"
                              >
                                  <Option value={2}>ISNA (North America)</Option>
                                  <Option value={3}>Muslim World League</Option>
                                  <Option value={4}>Umm Al-Qura (Makkah)</Option>
                                  <Option value={5}>Egyptian General Authority</Option>
                                  <Option value={11}>Majlis Ugama Islam Singapura</Option>
                                  <Option value={20}>Kemenag Indonesia</Option>
                              </Select>
                          </div>
                          <Button block icon={<ReloadOutlined />} onClick={getLocationAndFetch}>
                              Update Data
                          </Button>
                      </Card>

                      {/* 3. HADITH QUOTE */}
                      <Card bordered={false} style={{ marginTop: 24, borderRadius: 16, background: '#FFF8E6', border: `1px solid ${ACCENT_COLOR}` }}>
                           <div style={{ textAlign: 'center' }}>
                              <FaPray style={{ fontSize: 32, color: ACCENT_COLOR, marginBottom: 8 }} />
                              <Text italic style={{ display: 'block', fontSize: 14, color: '#555' }}>
                                  "Prayer is the pillar of religion."
                              </Text>
                              <Text strong style={{ fontSize: 12, color: THEME_COLOR, marginTop: 4, display: 'block' }}>
                                  — Al-Baihaqi
                              </Text>
                           </div>
                      </Card>

                  </Col>
              </Row>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrayerTime;