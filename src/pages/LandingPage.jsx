// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Typography,
  Avatar,
  Rate,
  Modal,
  message,
  Grid,
  Divider,
  Dropdown,
  Space,
  Form,
  Upload,
  Spin,
  Drawer, // Tambahan component Drawer untuk menu Mobile yang rapi
} from "antd";
import {
  SearchOutlined,
  CheckCircleFilled,
  CompassOutlined,
  ShopOutlined,
  BankOutlined,
  SafetyCertificateFilled,
  UsergroupAddOutlined,
  LikeFilled,
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  StopOutlined,
  ShoppingCartOutlined,
  CoffeeOutlined,
  FireOutlined,
  GlobalOutlined,
  AppleFilled,
  AndroidFilled,
  FilterOutlined,
  ArrowRightOutlined,
  TranslationOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
  EditOutlined,
  CameraOutlined,
  CompassFilled,
} from "@ant-design/icons";
import "../App.css";
import logoImage from "../assets/logo.png";

// 👇 IMPORT API HELPER
import api from "../utils/api";

// 👇 IMPORT BAHASA
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

// --- DATA COLLABORATION ---
const COLLABORATORS = [
  {
    name: "PCIM Yogyakarta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Logo_Muhammadiyah.svg/1280px-Logo_Muhammadiyah.svg.png",
    url: "#",
  },
];

// --- Components Helper ---
const FilterPill = ({ icon, text, active, onClick }) => (
  <Tag
    className={`filter-pill ${active ? "active" : ""}`}
    icon={icon}
    onClick={onClick}
    style={{
      userSelect: "none",
      padding: "6px 16px",
      borderRadius: "20px",
      cursor: "pointer",
      margin: "4px",
    }}
  >
    {text}
  </Tag>
);

const CheckListItem = ({ text }) => (
  <div
    className="check-list-item"
    style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
  >
    <CheckCircleFilled
      className="icon-gold"
      style={{ marginRight: "8px", color: "#faad14" }}
    />
    <Text>{text}</Text>
  </div>
);

function LandingPage({ onNavigate }) {
  // --- STATE MANAGEMENT ---
  const screens = useBreakpoint();
  // isMobile true jika layar < 768px (md)
  const isMobile = !screens.md;

  const [lang, setLang] = useState("en");
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState(["Verified Halal"]);
  const [activeStep, setActiveStep] = useState("search");

  // Modals
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data States
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTesti, setLoadingTesti] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [form] = Form.useForm();

  // 👇 STATE USER (Cek Login)
  const [user, setUser] = useState(null);

  // --- EFFECT: Load User & Testimonials ---
  useEffect(() => {
    // 1. Cek LocalStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data");
      }
    }

    // 2. Fetch Reviews dari Backend
    const fetchReviews = async () => {
      try {
        const response = await api.get("/app-reviews/featured");
        if (response.data.success) {
          // Backend sekarang sudah handle logic: Featured -> Fallback Latest
          setTestimonials(response.data.data);
        }
      } catch (error) {
        console.error("Failed fetching reviews:", error);
      } finally {
        setLoadingTesti(false);
      }
    };

    fetchReviews();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.success("Logged out successfully");
  };

  const TRANSLATIONS = { en, cn };
  const t = (key) => TRANSLATIONS[lang][key];

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "cn" : "en"));
    message.success(
      lang === "en" ? "Switched to Chinese" : "Switched to English",
    );
  };

  const handleSearch = () => {
    if (!searchText.trim()) {
      message.warning("Please enter a keyword to search!");
      return;
    }
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      message.success(`Found 12 halal places for "${searchText}"`);
    }, 1500);
  };

  // 👇 HANDLER TOMBOL "Write a Review"
  const onOpenReviewModal = () => {
    if (!user) {
      message.warning("Please sign in to write a review.");
      onNavigate("auth");
    } else {
      setIsReviewModalOpen(true);
    }
  };

  // 👇 REAL BACKEND SUBMIT REVIEW
  const handleReviewSubmit = async (values) => {
    setSubmittingReview(true);
    try {
      await api.post("/app-reviews", {
        rating: values.rating,
        comment: values.review,
      });

      message.success("Thanks for sharing! Your review is posted.");

      // Refresh list review agar yang baru (jika masuk kriteria latest) langsung muncul
      // Opsional: Anda bisa buat state reloadTrigger jika mau auto-refresh

      setIsReviewModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Submit review error:", error);
      message.error(
        error.response?.data?.message || "Failed to submit review.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleFilter = (filterName) => {
    if (activeFilters.includes(filterName)) {
      setActiveFilters(activeFilters.filter((f) => f !== filterName));
    } else {
      setActiveFilters([...activeFilters, filterName]);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => message.info("Go to Profile Page"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => message.info("Go to Settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Helper untuk konten menu mobile (Drawer)
  const renderMobileMenu = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        onClick={() => {
          onNavigate("finder");
          setIsMobileMenuOpen(false);
        }}
      >
        {t("nav_finder")}
      </Button>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        onClick={() => {
          onNavigate("mosque");
          setIsMobileMenuOpen(false);
        }}
      >
        {t("nav_mosque")}
      </Button>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        onClick={() => {
          onNavigate("prayer");
          setIsMobileMenuOpen(false);
        }}
      >
        {t("nav_prayer")}
      </Button>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        onClick={() => onNavigate("community-page")}
      >
        {t("nav_community")}
      </Button>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        onClick={() => onNavigate("blog-page")}
      >
        {t("nav_blog")}
      </Button>

      <Divider style={{ margin: "8px 0" }} />

      {user ? (
        <div style={{ padding: "0 8px" }}>
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
            icon={<UserOutlined />}
            onClick={() => message.info("Profile")}
            style={{ marginBottom: 8 }}
          >
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

      <Button
        block
        onClick={() => {
          toggleLanguage();
          setIsMobileMenuOpen(false);
        }}
        icon={<TranslationOutlined />}
      >
        {lang === "en" ? "CN" : "EN"}
      </Button>

      <Button
        block
        shape="round"
        className="btn-gold"
        onClick={() => {
          setIsDownloadModalOpen(true);
          setIsMobileMenuOpen(false);
        }}
      >
        {t("nav_download")}
      </Button>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case "search":
        return (
          <Row gutter={[24, 24]} align="middle" style={{ padding: "8px 0" }}>
            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <div style={{ marginBottom: 16 }}>
                <CheckCircleFilled
                  style={{ fontSize: 40, color: "var(--primary-green)" }}
                />
              </div>
              <Title level={4}>{t("lbl_restaurants")}</Title>
              <Text type="secondary">{t("lbl_prayer_avail")}</Text>
            </Col>

            {/* Divider Vertikal: Hilang di Mobile (xs=0) */}
            <Col xs={0} md={1} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: 80,
                  width: 1,
                  background: "#eee",
                  margin: "0 auto",
                }}
              ></div>
            </Col>

            <Col xs={24} md={6} style={{ textAlign: "center" }}>
              <div className="halal-slider-visual">
                <div style={{ padding: "0 8px", fontWeight: "bold" }}></div>
                <div className="slider-track">
                  <div className="slider-fill"></div>
                  <div className="slider-knob"></div>
                </div>
                <div
                  style={{
                    padding: "0 8px",
                    fontWeight: "bold",
                    color: "var(--primary-green)",
                  }}
                >
                  Halal
                </div>
              </div>
              <Space wrap justify="center" style={{ marginTop: 10 }}>
                <Tag color="green">{t("filter_no_alcohol")}</Tag>
                <Tag color="blue">{t("filter_family")}</Tag>
              </Space>
            </Col>

            <Col xs={0} md={1} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: 80,
                  width: 1,
                  background: "#eee",
                  margin: "0 auto",
                }}
              ></div>
            </Col>

            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <SafetyCertificateFilled
                style={{
                  fontSize: 40,
                  color: "var(--primary-green)",
                  marginBottom: 16,
                }}
              />
              <Title level={4}>{t("lbl_halal_labels")}</Title>
              <Text type="secondary">{t("lbl_halal_desc")}</Text>
            </Col>
          </Row>
        );

      case "filter":
        return (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <FilterOutlined
              style={{
                fontSize: 48,
                color: "var(--primary-green)",
                marginBottom: 24,
              }}
            />
            <Title level={3}>{t("lbl_smart_filters")}</Title>
            <Paragraph
              type="secondary"
              style={{ fontSize: 16, maxWidth: 600, margin: "0 auto 24px" }}
            >
              {t("lbl_smart_desc")}
            </Paragraph>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Tag color="green" style={{ padding: "8px 16px", fontSize: 14 }}>
                {t("filter_verified")}
              </Tag>
              <Tag color="blue" style={{ padding: "8px 16px", fontSize: 14 }}>
                {t("filter_prayer")}
              </Tag>
              <Tag color="purple" style={{ padding: "8px 16px", fontSize: 14 }}>
                WiFi
              </Tag>
            </div>
          </div>
        );

      case "go":
        return (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <LikeFilled
              style={{
                fontSize: 48,
                color: "var(--primary-green)",
                marginBottom: 24,
              }}
            />
            <Title level={3}>{t("lbl_confidence")}</Title>
            <Paragraph
              type="secondary"
              style={{ fontSize: 16, maxWidth: 600, margin: "0 auto 24px" }}
            >
              {t("lbl_confidence_desc")}
            </Paragraph>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Tag color="gold" style={{ padding: "8px 16px", fontSize: 14 }}>
                4.9/5 Ratings
              </Tag>
              <Tag color="cyan" style={{ padding: "8px 16px", fontSize: 14 }}>
                Verified Reviews
              </Tag>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="landing-page">
      {/* HEADER / NAVBAR */}
      <header className="navbar-container" style={{ padding: "0 20px" }}>
        <div
          className="container navbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
          }}
        >
          <div
            className="brand-logo"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div className="logo-icon-wrapper">
              <img
                src={logoImage}
                alt="Logo Brand"
                className="logo-icon"
                style={{ width: "32px" }}
              />
            </div>
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              QingzhenMu
            </span>
          </div>

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <div
            className="nav-links desktop-only"
            style={{ display: isMobile ? "none" : "flex", gap: "20px" }}
          >
            <Button type="link" onClick={() => onNavigate("finder")}>
              {t("nav_finder")}
            </Button>
            <Button type="link" onClick={() => onNavigate("mosque")}>
              {t("nav_mosque")}
            </Button>
            <Button
              type="link"
              onClick={() => {
                onNavigate("prayer"); // 👈 Arahkan ke halaman prayer
                setIsMobileMenuOpen(false);
              }}
            >
              {t("nav_prayer")}
            </Button>
            <Button type="link" onClick={() => onNavigate("community-page")}>
              {t("nav_community")}
            </Button>
            <Button type="link" onClick={() => onNavigate("blog-page")}>
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
                      icon={<UserOutlined />}
                      style={{ marginBottom: 8 }}
                      onClick={() => message.info("Profile")}
                    >
                      My Profile
                    </Button>
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

                <Divider style={{ margin: "8px 0" }} />
                <Button
                  type="text"
                  onClick={() => {
                    toggleLanguage();
                    setIsMobileMenuOpen(false);
                  }}
                  icon={<TranslationOutlined />}
                >
                  {lang === "en" ? "Switch to Chinese" : "Switch to English"}
                </Button>
              </>
            )}
          </div>

          <div
            className="nav-actions"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            {!isMobile && (
              <Button
                type="text"
                icon={<TranslationOutlined />}
                onClick={toggleLanguage}
                style={{ fontWeight: "bold", marginRight: 8 }}
              >
                {lang === "en" ? "CN" : "EN"}
              </Button>
            )}

            <div
              className="hide-mobile"
              style={{ display: isMobile ? "none" : "block" }}
            >
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
              <Button
                type="primary"
                shape="round"
                className="btn-gold"
                onClick={() => setIsDownloadModalOpen(true)}
              >
                {t("nav_download")}
              </Button>
            )}

            {/* Tombol Hamburger Menu (Hanya di Mobile) */}
            {isMobile && (
              <Button
                type="text"
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                icon={<MenuOutlined style={{ fontSize: "20px" }} />}
              />
            )}
          </div>
        </div>
      </header>

      {/* DRAWER UNTUK MENU MOBILE */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={280}
      >
        {renderMobileMenu()}
      </Drawer>

      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ padding: isMobile ? "40px 0" : "80px 0" }}
      >
        <div className="container" style={{ padding: "0 20px" }}>
          <Row gutter={[48, 24]} align="middle">
            <Col xs={24} md={14}>
              <Title
                style={{
                  color: "white",
                  fontSize: isMobile ? "2.5rem" : "3.5rem",
                  marginBottom: 16,
                  lineHeight: 1.2,
                  fontWeight: 800,
                }}
              >
                {t("hero_title")}
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: isMobile ? "1rem" : "1.2rem",
                  marginBottom: 40,
                  maxWidth: "90%",
                }}
              >
                {t("hero_desc")}
              </Paragraph>

              <div className="hero-search-bar" style={{ marginBottom: "20px" }}>
                <Input
                  placeholder={t("search_placeholder")}
                  style={{ borderRadius: "30px", padding: "8px 20px" }}
                  prefix={
                    <SearchOutlined
                      className="text-muted"
                      style={{ fontSize: 18 }}
                    />
                  }
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={handleSearch}
                  suffix={
                    <Button
                      type="primary"
                      shape="round"
                      className="btn-gold search-btn"
                      onClick={handleSearch}
                      loading={isSearching}
                    >
                      {isSearching ? t("search_loading") : t("search_btn")}
                    </Button>
                  }
                  bordered={false}
                />
              </div>

              {/* Filter Pills: Scroll Horizontal di Mobile */}
              <div
                className="hero-filters"
                style={{
                  display: "flex",
                  overflowX: isMobile ? "auto" : "visible",
                  gap: "8px",
                  paddingBottom: "10px",
                  flexWrap: isMobile ? "nowrap" : "wrap",
                }}
              >
                <FilterPill
                  icon={<SafetyCertificateFilled />}
                  text={t("filter_verified")}
                  active={activeFilters.includes("Verified Halal")}
                  onClick={() => toggleFilter("Verified Halal")}
                />
                <FilterPill
                  icon={<StopOutlined />}
                  text={t("filter_no_alcohol")}
                  active={activeFilters.includes("No Alcohol")}
                  onClick={() => toggleFilter("No Alcohol")}
                />
                <FilterPill
                  icon={<UsergroupAddOutlined />}
                  text={t("filter_family")}
                  active={activeFilters.includes("Family-Friendly")}
                  onClick={() => toggleFilter("Family-Friendly")}
                />
                <FilterPill
                  icon={<CompassOutlined />}
                  text={t("filter_prayer")}
                  active={activeFilters.includes("Prayer Space")}
                  onClick={() => toggleFilter("Prayer Space")}
                />
              </div>
            </Col>

            <Col xs={24} md={10}>
              <Card
                className="glass-card"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "16px",
                }}
              >
                <CheckListItem text={t("checklist_1")} />
                <CheckListItem text={t("checklist_2")} />
                <CheckListItem text={t("checklist_3")} />
                <div style={{ marginTop: 24 }}>
                  <Button
                    type="primary"
                    block
                    className="btn-green"
                    size="large"
                    shape="round"
                    onClick={() => onNavigate("finder")}
                    style={{ background: "#2E7D32" }}
                  >
                    {t("explore_map")} <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* FEATURES SECTION (FIXED ALIGNMENT) */}
      <section
        className="section-container"
        style={{ padding: isMobile ? "40px 0" : "80px 0" }}
      >
        <div className="container" style={{ padding: "0 20px" }}>
          <Title
            level={2}
            className="text-center mb-large"
            style={{
              color: "var(--primary-green)",
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            {t("discover_title")}
          </Title>

          <Row gutter={[24, 24]} align="stretch">
            <Col xs={24} lg={15} style={{ display: "flex" }}>
              <Card
                className="feature-card"
                bordered={false}
                bodyStyle={{ padding: 0, height: "100%" }}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Row style={{ margin: 0 }}>
                  <Col
                    xs={24}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",

                      // Hapus border kanan di mobile, tambah border bawah
                      borderRight: !isMobile ? "1px solid #f0f0f0" : "none",
                      borderBottom: isMobile ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <div style={{ padding: 24, flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 12,
                        }}
                      >
                        <ShopOutlined
                          style={{
                            fontSize: 24,
                            color: "var(--primary-green)",
                          }}
                        />
                        <Title
                          level={4}
                          style={{ margin: 0, color: "var(--text-dark)" }}
                        >
                          {t("card_finder_title")}
                        </Title>
                      </div>
                      <Paragraph type="secondary">
                        {t("card_finder_desc")}
                      </Paragraph>
                    </div>

                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderBottomLeftRadius: isMobile ? 0 : 16,
                        borderTopRightRadius: isMobile ? 0 : 0,
                      }}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                        alt="Halal Map"
                        style={{
                          width: "100%",
                          height: "160px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "var(--primary-green)",
                          borderRadius: "50%",
                          padding: 10,
                          border: "3px solid white",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        }}
                      >
                        <ShopOutlined
                          style={{ color: "white", fontSize: 20 }}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col
                    xs={24}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <div style={{ padding: 24, flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 12,
                        }}
                      >
                        <CompassOutlined
                          style={{
                            fontSize: 24,
                            color: "var(--primary-green)",
                          }}
                        />
                        <Title
                          level={4}
                          style={{ margin: 0, color: "var(--text-dark)" }}
                        >
                          {t("card_mosque_title")}
                        </Title>
                      </div>
                      <Paragraph type="secondary">
                        {t("card_mosque_desc")}
                      </Paragraph>
                    </div>

                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderBottomRightRadius: 16,
                      }}
                    >
                      <img
                        src="https://img.freepik.com/free-photo/mosque-building_1409-5435.jpg?w=1380&t=st=1686640000~exp=1686640600~hmac=..."
                        alt="Mosque Map"
                        style={{
                          width: "100%",
                          height: "160px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "var(--primary-green)",
                          borderRadius: "50%",
                          padding: 10,
                          border: "3px solid white",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        }}
                      >
                        <CompassOutlined
                          style={{ color: "white", fontSize: 20 }}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={9} style={{ display: "flex" }}>
              <Card
                className="feature-card"
                bordered={false}
                bodyStyle={{
                  padding: 24,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <SearchOutlined
                      style={{ fontSize: 22, color: "var(--text-dark)" }}
                    />
                    <Title level={4} style={{ margin: 0 }}>
                      {t("cat_title")}
                    </Title>
                  </div>
                  <Tag
                    style={{
                      border: "none",
                      background: "#e6f7ff",
                      color: "var(--primary-green)",
                      fontWeight: 600,
                    }}
                  >
                    {t("cat_new")}
                  </Tag>
                </div>

                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Button
                      type="primary"
                      className="btn-green"
                      style={{
                        width: "100%",
                        height: 52,
                        borderRadius: 12,
                        justifyContent: "flex-start",
                        fontSize: 15,
                        background: "#2E7D32",
                      }}
                      icon={<ShopOutlined />}
                      onClick={() => onNavigate("finder")}
                    >
                      {t("cat_rest")}
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Button
                      style={{
                        width: "100%",
                        height: 52,
                        borderRadius: 12,
                        justifyContent: "flex-start",
                        background: "#f5f5f5",
                        border: "none",
                        color: "#333",
                        fontSize: 15,
                      }}
                      icon={<CompassOutlined />}
                      onClick={() => onNavigate("mosque")}
                    >
                      {t("nav_mosque")}
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Button
                      style={{
                        width: "100%",
                        height: 52,
                        borderRadius: 12,
                        justifyContent: "flex-start",
                        background: "#f5f5f5",
                        border: "none",
                        color: "#333",
                        fontSize: 15,
                      }}
                      icon={<CompassFilled />}
                      onClick={() => onNavigate("prayer")}
                    >
                      {t("nav_prayer")}
                    </Button>
                  </Col>
                </Row>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 32,
                    textAlign: "right",
                  }}
                >
                  <Button
                    shape="round"
                    size="large"
                    style={{ fontWeight: 600 }}
                  >
                    {t("view_all")}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        className="section-container bg-gray"
        style={{
          background: "#f9f9f9",
          padding: isMobile ? "40px 0" : "80px 0",
        }}
      >
        <div className="container" style={{ padding: "0 20px" }}>
          <Row gutter={[48, 48]} align="middle" style={{ padding: "20px 0" }}>
            <Col xs={24} md={24}>
              <Title
                level={2}
                className="mb-medium text-center"
                style={{ textAlign: "center" }}
              >
                {t("how_title")}
              </Title>

              <div
                className="step-tabs"
                style={{
                  justifyContent: "center",
                  display: "flex",
                  gap: "10px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type={activeStep === "search" ? "primary" : "text"}
                  className={activeStep === "search" ? "btn-green" : ""}
                  icon={<SearchOutlined />}
                  shape="round"
                  size="large"
                  onClick={() => setActiveStep("search")}
                >
                  {t("step_search")}
                </Button>
                <Button
                  type={activeStep === "filter" ? "primary" : "text"}
                  className={activeStep === "filter" ? "btn-green" : ""}
                  icon={<FilterOutlined />}
                  shape="round"
                  size="large"
                  onClick={() => setActiveStep("filter")}
                >
                  {t("step_filter")}
                </Button>
                <Button
                  type={activeStep === "go" ? "primary" : "text"}
                  className={activeStep === "go" ? "btn-green" : ""}
                  icon={<LikeFilled />}
                  shape="round"
                  size="large"
                  onClick={() => setActiveStep("go")}
                >
                  {t("step_go")}
                </Button>
              </div>

              <Card
                className="section-frame-card"
                bordered={false}
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  marginBottom: "30px",
                }}
              >
                {renderStepContent()}
              </Card>

              {/* 2. CONFIDENCE FRAME */}
              <Card
                className="section-frame-card"
                bordered={false}
                style={{
                  marginBottom: 0,
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: 20,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 32,
                        background: "var(--accent-gold)",
                        borderRadius: 4,
                      }}
                    />
                    <div>
                      <Title level={4} style={{ margin: 0 }}>
                        {t("conf_title")}
                      </Title>
                      <Text type="secondary">{t("conf_subtitle")}</Text>
                    </div>
                  </div>
                </div>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <div
                      className="sub-feature"
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "flex-start",
                      }}
                    >
                      <CheckCircleFilled
                        className="sub-feature-icon"
                        style={{ fontSize: "24px", color: "#52c41a" }}
                      />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {t("feat_verified")}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {t("feat_verified_desc")}
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div
                      className="sub-feature"
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "flex-start",
                      }}
                    >
                      <CompassOutlined
                        className="sub-feature-icon"
                        style={{ color: "#1890ff", fontSize: "24px" }}
                      />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {t("feat_owned")}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {t("feat_owned_desc")}
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div
                      className="sub-feature"
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "flex-start",
                      }}
                    >
                      <LikeFilled
                        className="sub-feature-icon"
                        style={{ color: "#fa8c16", fontSize: "24px" }}
                      />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {t("feat_reviews")}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {t("feat_reviews_desc")}
                        </Text>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* TESTIMONIALS (DYNAMIC) */}
      <section
        className="section-container"
        style={{ padding: isMobile ? "40px 0" : "80px 0" }}
      >
        <div className="container" style={{ padding: "0 20px" }}>
          <Title
            level={2}
            className="text-center mb-large"
            style={{ textAlign: "center", marginBottom: "40px" }}
          >
            {t("testi_title")}
          </Title>

          {loadingTesti ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {testimonials.map((item, idx) => (
                <Col xs={24} md={8} key={idx}>
                  <Card
                    bordered={false}
                    className="feature-card testimonial-card"
                    style={{
                      height: "100%",
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      className="testimonial-user"
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <Avatar
                        src={
                          item.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${item.name}`
                        }
                        size={56}
                      />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          {item.name}
                        </Title>
                        <Rate
                          disabled
                          defaultValue={item.rating}
                          style={{ fontSize: 14, color: "var(--accent-gold)" }}
                        />
                      </div>
                    </div>
                    <Paragraph
                      type="secondary"
                      style={{ fontStyle: "italic", fontSize: 16 }}
                      ellipsis={{ rows: 4, expandable: true, symbol: "more" }}
                    >
                      "{item.text}"
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* 👇 TOMBOL WRITE REVIEW BARU */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Button
              type="default"
              shape="round"
              size="large"
              icon={<EditOutlined />}
              onClick={onOpenReviewModal} // 👈 Panggil fungsi proteksi
              style={{
                borderColor: "var(--primary-green)",
                color: "var(--primary-green)",
                fontWeight: 600,
                padding: "0 32px",
                height: 48,
              }}
            >
              Have a story to share? Write a review!
            </Button>
          </div>
        </div>
      </section>

      {/* --- STRATEGIC COLLABORATIONS --- */}
      <section
        className="collab-section"
        style={{
          padding: "60px 0",
          background: "#f8f9fa",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div className="container" style={{ padding: "0 20px" }}>
          <Card
            className="collab-card"
            bordered={false}
            style={{
              borderRadius: 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              padding: isMobile ? "20px" : "40px",
              textAlign: "center",
            }}
          >
            <Title
              level={3}
              style={{ marginBottom: 40, color: "var(--primary-green)" }}
            >
              Our Strategic Collaborations
            </Title>

            <div
              className="partners-logos"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: isMobile ? 32 : 64,
                flexWrap: "wrap",
              }}
            >
              {COLLABORATORS.map((partner, index) => (
                <a
                  href={partner.url}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block" }}
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{
                      height: isMobile ? 40 : 60,
                      filter: "grayscale(100%)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      objectFit: "contain",
                      opacity: 0.7,
                    }}
                    onMouseOver={(e) => {
                      e.target.style.filter = "grayscale(0%)";
                      e.target.style.opacity = "1";
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.filter = "grayscale(100%)";
                      e.target.style.opacity = "0.7";
                      e.target.style.transform = "scale(1)";
                    }}
                    title={partner.name}
                  />
                </a>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="footer-section"
        style={{
          background: "#001529",
          color: "white",
          padding: "60px 0 20px",
        }}
      >
        <div className="container" style={{ padding: "0 20px" }}>
          <div
            className="footer-content"
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              marginBottom: "40px",
              gap: "30px",
            }}
          >
            <div style={{ maxWidth: 300 }}>
              <div
                className="brand-logo"
                style={{
                  color: "white",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <GlobalOutlined style={{ color: "var(--secondary-green)" }} />
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                  QingzhenMu
                </span>
              </div>
              <Paragraph style={{ color: "rgba(255,255,255,0.6)" }}>
                {t("footer_desc")}
              </Paragraph>
            </div>

            <div
              className="footer-links"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Button
                type="link"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {t("footer_about")}
              </Button>
              <Button
                type="link"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {t("footer_careers")}
              </Button>
              <Button
                type="link"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {t("footer_privacy")}
              </Button>
              <Button
                type="link"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {t("footer_terms")}
              </Button>
              <Button
                type="link"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                {t("footer_contact")}
              </Button>
            </div>

            <div
              className="footer-social"
              style={{ display: "flex", gap: "20px", fontSize: "24px" }}
            >
              <FacebookFilled style={{ cursor: "pointer", color: "white" }} />
              <InstagramFilled style={{ cursor: "pointer", color: "white" }} />
              <YoutubeFilled style={{ cursor: "pointer", color: "white" }} />
            </div>
          </div>

          <div
            className="copyright"
            style={{
              textAlign: "center",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "20px",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.4)" }}>
              {t("copyright")}
            </Text>
          </div>
        </div>
      </footer>

      {/* DOWNLOAD MODAL */}
      <Modal
        title={null}
        footer={null}
        open={isDownloadModalOpen}
        onCancel={() => setIsDownloadModalOpen(false)}
        centered
        width={400}
      >
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <GlobalOutlined
            style={{
              fontSize: 48,
              color: "var(--primary-green)",
              marginBottom: 16,
            }}
          />
          <Title level={3}>{t("modal_title")}</Title>
          <Paragraph>{t("modal_desc")}</Paragraph>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 24,
            }}
          >
            <Button
              type="primary"
              size="large"
              icon={<AppleFilled />}
              style={{ background: "#000", borderColor: "#000", height: 48 }}
              block
              onClick={() => message.info("Redirecting to App Store...")}
            >
              App Store
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<AndroidFilled />}
              style={{
                background: "#3DDC84",
                borderColor: "#3DDC84",
                height: 48,
              }}
              block
              onClick={() => message.info("Redirecting to Play Store...")}
            >
              Google Play
            </Button>
          </div>
        </div>
      </Modal>

      {/* 👇 MODAL REVIEW BARU (PROTECTED) */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              Share Your Experience
            </Title>
            <Text type="secondary">Help others find great halal places!</Text>
          </div>
        }
        open={isReviewModalOpen}
        onCancel={() => setIsReviewModalOpen(false)}
        footer={null}
        centered
        width={500}
        styles={{ body: { padding: "24px 32px" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReviewSubmit}
          size="large"
          style={{ marginTop: 24 }}
        >
          {/* INFO POSTING SEBAGAI SIAPA */}
          {user && (
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <Space align="center">
                <Avatar src={user.avatar_url} icon={<UserOutlined />} />
                <Text>
                  Posting publicly as{" "}
                  <strong>{user.name || user.username}</strong>
                </Text>
              </Space>
            </div>
          )}

          <Form.Item
            name="rating"
            label="How was your experience?"
            initialValue={5}
            style={{ textAlign: "center" }}
          >
            <Rate style={{ fontSize: 36, color: "var(--accent-gold)" }} />
          </Form.Item>

          <Form.Item
            name="review"
            label="Write your review"
            rules={[
              {
                required: true,
                message: "Please write something about your experience",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Tell us about the food, atmosphere, or service..."
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item label="Upload Photos (Optional)">
            <Upload
              listType="picture-card"
              maxCount={3}
              beforeUpload={() => false}
            >
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="btn-green"
              size="large"
              loading={submittingReview}
              style={{
                height: 48,
                borderRadius: 24,
                fontWeight: 600,
                background: "#2E7D32",
              }}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LandingPage;
