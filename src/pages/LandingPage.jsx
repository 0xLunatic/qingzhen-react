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
  Form, // 👈 Import Form
  Upload, // 👈 Import Upload
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
  EditOutlined, // 👈 Icon Edit untuk Review
  CameraOutlined, // 👈 Icon Kamera
} from "@ant-design/icons";
import "../App.css";
import logoImage from "../assets/logo.png";

// 👇 IMPORT BAHASA
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input; // 👈 Destructure TextArea
const { useBreakpoint } = Grid;

// --- DATA COLLABORATION ---
const COLLABORATORS = [
  {
    name: "PCIM Yogyakarta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Muhammadiyah_Logo.svg/1200px-Muhammadiyah_Logo.svg.png",
    url: "#",
  },
  {
    name: "KBRI Beijing",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Emblem_of_Indonesia.svg/1200px-Emblem_of_Indonesia.svg.png",
    url: "#",
  },
  {
    name: "Halal China Trust",
    logo: "https://cdn-icons-png.flaticon.com/512/5332/5332296.png",
    url: "#",
  },
  {
    name: "Muslim Student Assoc.",
    logo: "https://cdn-icons-png.flaticon.com/512/3125/3125713.png",
    url: "#",
  },
  {
    name: "China Islamic Assoc.",
    logo: "https://cdn-icons-png.flaticon.com/512/3206/3206896.png",
    url: "#",
  },
];

// --- Components Helper ---
const FilterPill = ({ icon, text, active, onClick }) => (
  <Tag
    className={`filter-pill ${active ? "active" : ""}`}
    icon={icon}
    onClick={onClick}
    style={{ userSelect: "none" }}
  >
    {text}
  </Tag>
);

const CheckListItem = ({ text }) => (
  <div className="check-list-item">
    <CheckCircleFilled className="icon-gold" />
    <Text>{text}</Text>
  </div>
);

function LandingPage({ onNavigate }) {
  // --- STATE MANAGEMENT ---
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [lang, setLang] = useState("en");
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState(["Verified Halal"]);
  const [activeStep, setActiveStep] = useState("search");

  // Modals
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // 👈 State Modal Review
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [form] = Form.useForm(); // 👈 Form Instance

  // 👇 STATE USER (Cek Login)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data");
      }
    }
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
      lang === "en" ? "Switched to Chinese" : "Switched to English"
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

  // 👇 HANDLER SUBMIT REVIEW
  const handleReviewSubmit = (values) => {
    // Simulasi kirim ke API
    console.log("Review Submitted:", values);

    setIsReviewModalOpen(false);
    form.resetFields();

    message.success("Thanks for sharing! Your review is under moderation.");
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
                <div style={{ padding: "0 8px", fontWeight: "bold" }}>
                  Haram
                </div>
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
              <Tag color="green">{t("filter_no_alcohol")}</Tag>
              <Tag color="blue" style={{ marginTop: 8 }}>
                {t("filter_family")}
              </Tag>
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
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
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
      <header className="navbar-container">
        <div className="container navbar">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <img src={logoImage} alt="Logo Brand" className="logo-icon" />
            </div>
            <span>QingzhenMu</span>
          </div>

          <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <Button type="link" onClick={() => onNavigate("finder")}>
              {t("nav_finder")}
            </Button>
            <Button type="link" onClick={() => setIsMobileMenuOpen(false)}>
              {t("nav_mosque")}
            </Button>
            <Button type="link" onClick={() => setIsMobileMenuOpen(false)}>
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
                      <Text strong>{user.username || user.name}</Text>
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

          <div className="nav-actions">
            <Button
              type="text"
              icon={<TranslationOutlined />}
              onClick={toggleLanguage}
              style={{ fontWeight: "bold", marginRight: 8 }}
              className="hide-mobile"
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
                        style={{ backgroundColor: "var(--primary-green)" }}
                      />
                      <Text strong style={{ color: "var(--text-dark)" }}>
                        {user.username || user.name || "User"}
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

            <Button
              type="primary"
              shape="round"
              className="btn-gold"
              onClick={() => setIsDownloadModalOpen(true)}
            >
              {t("nav_download")}
            </Button>

            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
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
                  fontSize: "1.2rem",
                  marginBottom: 40,
                  maxWidth: "90%",
                }}
              >
                {t("hero_desc")}
              </Paragraph>

              <div className="hero-search-bar">
                <Input
                  placeholder={t("search_placeholder")}
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

              <div className="hero-filters">
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
              <Card className="glass-card">
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
                  >
                    {t("explore_map")} <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section-container">
        <div className="container">
          <Title
            level={2}
            className="text-center mb-large"
            style={{ color: "var(--primary-green)" }}
          >
            {t("discover_title")}
          </Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={15}>
              <Card
                className="feature-card"
                bordered={false}
                bodyStyle={{ padding: 0 }}
              >
                <Row>
                  <Col
                    xs={24}
                    md={12}
                    style={{
                      padding: "24px 24px 0 24px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <ShopOutlined
                        style={{ fontSize: 24, color: "var(--primary-green)" }}
                      />
                      <Title
                        level={4}
                        style={{ margin: 0, color: "var(--text-dark)" }}
                      >
                        {t("card_finder_title")}
                      </Title>
                    </div>
                    <Paragraph
                      type="secondary"
                      style={{ marginBottom: 24, flex: 1 }}
                    >
                      {t("card_finder_desc")}
                    </Paragraph>
                    <div
                      style={{
                        position: "relative",
                        marginTop: "auto",
                        overflow: "hidden",
                        borderTopRightRadius: 16,
                        borderTopLeftRadius: 16,
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
                          top: "40%",
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

                  <Col xs={24} md={12} className="feature-split-col">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <CompassOutlined
                        style={{ fontSize: 24, color: "var(--primary-green)" }}
                      />
                      <Title
                        level={4}
                        style={{ margin: 0, color: "var(--text-dark)" }}
                      >
                        {t("card_mosque_title")}
                      </Title>
                    </div>
                    <Paragraph
                      type="secondary"
                      style={{ marginBottom: 24, flex: 1 }}
                    >
                      {t("card_mosque_desc")}
                    </Paragraph>
                    <div
                      style={{
                        position: "relative",
                        marginTop: "auto",
                        overflow: "hidden",
                        borderTopRightRadius: 16,
                        borderTopLeftRadius: 16,
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
                          top: "40%",
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

            <Col xs={24} lg={9}>
              <Card
                className="feature-card"
                bordered={false}
                bodyStyle={{
                  padding: 24,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
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
                  <Col span={14}>
                    <Button
                      type="primary"
                      className="btn-green"
                      style={{
                        width: "100%",
                        height: 44,
                        borderRadius: 12,
                        justifyContent: "flex-start",
                        fontSize: 15,
                      }}
                      icon={<ShopOutlined />}
                    >
                      {t("cat_rest")}
                    </Button>
                  </Col>
                  <Col span={10}>
                    <Button
                      style={{
                        width: "100%",
                        height: 44,
                        borderRadius: 12,
                        justifyContent: "flex-start",
                        background: "#f5f5f5",
                        border: "none",
                        color: "#333",
                        fontSize: 15,
                      }}
                      icon={<ShoppingCartOutlined />}
                    >
                      {t("cat_groceries")}
                    </Button>
                  </Col>
                  <Col span={10}>
                    <Button
                      style={{
                        width: "100%",
                        height: 44,
                        borderRadius: 12,
                        justifyContent: "flex-start",
                        background: "#f5f5f5",
                        border: "none",
                        color: "#333",
                        fontSize: 15,
                      }}
                      icon={<BankOutlined />}
                    >
                      {t("cat_hotels")}
                    </Button>
                  </Col>
                  <Col span={14}>
                    <Button
                      style={{
                        width: "100%",
                        height: 44,
                        borderRadius: 12,
                        justifyContent: "flex-start",
                        background: "#f5f5f5",
                        border: "none",
                        color: "#333",
                        fontSize: 15,
                      }}
                      icon={<CoffeeOutlined />}
                    >
                      {t("cat_cafes")}
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Button
                      style={{
                        width: "auto",
                        height: 44,
                        borderRadius: 12,
                        justifyContent: "flex-start",
                        background: "#f5f5f5",
                        border: "none",
                        color: "#333",
                        fontSize: 15,
                        paddingRight: 24,
                      }}
                      icon={<FireOutlined />}
                    >
                      {t("cat_butcher")}
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
      <section className="section-container bg-gray">
        <div className="container">
          <Row gutter={[48, 48]} align="middle" style={{ padding: "20px 0" }}>
            <Col xs={24} md={24}>
              <Title level={2} className="mb-medium text-center">
                {t("how_title")}
              </Title>

              <div className="step-tabs" style={{ justifyContent: "center" }}>
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

              <Card className="section-frame-card" bordered={false}>
                {renderStepContent()}
              </Card>

              {/* 2. CONFIDENCE FRAME */}
              <Card
                className="section-frame-card"
                bordered={false}
                style={{ marginBottom: 0 }}
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
                    <div className="sub-feature">
                      <CheckCircleFilled className="sub-feature-icon" />
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
                    <div className="sub-feature">
                      <CompassOutlined
                        className="sub-feature-icon"
                        style={{ color: "#1890ff" }}
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
                    <div className="sub-feature">
                      <LikeFilled
                        className="sub-feature-icon"
                        style={{ color: "#fa8c16" }}
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

      {/* TESTIMONIALS */}
      <section className="section-container">
        <div className="container">
          <Title level={2} className="text-center mb-large">
            {t("testi_title")}
          </Title>
          <Row gutter={[24, 24]}>
            {[
              {
                name: "Aisyah Rahman",
                img: "https://i.pravatar.cc/150?img=5",
                text: t("testi_1"),
              },
              {
                name: "Hassan Abdullah",
                img: "https://i.pravatar.cc/150?img=11",
                text: t("testi_2"),
              },
              {
                name: "Nurul Wahyuni",
                img: "https://i.pravatar.cc/150?img=9",
                text: t("testi_3"),
              },
            ].map((item, idx) => (
              <Col xs={24} md={8} key={idx}>
                <Card
                  bordered={false}
                  className="feature-card testimonial-card"
                >
                  <div className="testimonial-user">
                    <Avatar src={item.img} size={56} />
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {item.name}
                      </Title>
                      <Rate
                        disabled
                        defaultValue={5}
                        style={{ fontSize: 14, color: "var(--accent-gold)" }}
                      />
                    </div>
                  </div>
                  <Paragraph
                    type="secondary"
                    style={{ fontStyle: "italic", fontSize: 16 }}
                  >
                    "{item.text}"
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 👇 TOMBOL WRITE REVIEW BARU */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Button
              type="default"
              shape="round"
              size="large"
              icon={<EditOutlined />}
              onClick={() => setIsReviewModalOpen(true)}
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
        <div className="container">
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
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <div style={{ maxWidth: 300 }}>
              <div
                className="brand-logo"
                style={{ color: "white", marginBottom: 16 }}
              >
                <GlobalOutlined style={{ color: "var(--secondary-green)" }} />
                <span>QingzhenMu</span>
              </div>
              <Paragraph style={{ color: "rgba(255,255,255,0.6)" }}>
                {t("footer_desc")}
              </Paragraph>
            </div>

            <div className="footer-links">
              <Button type="link">{t("footer_about")}</Button>
              <Button type="link">{t("footer_careers")}</Button>
              <Button type="link">{t("footer_privacy")}</Button>
              <Button type="link">{t("footer_terms")}</Button>
              <Button type="link">{t("footer_contact")}</Button>
            </div>

            <div className="footer-social">
              <FacebookFilled style={{ cursor: "pointer", color: "white" }} />
              <InstagramFilled style={{ cursor: "pointer", color: "white" }} />
              <YoutubeFilled style={{ cursor: "pointer", color: "white" }} />
            </div>
          </div>

          <div className="copyright">
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

      {/* 👇 MODAL REVIEW BARU */}
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
          {/* Jika User Belum Login, Tampilkan Input Nama */}
          {!user && (
            <Form.Item
              name="name"
              label="Your Name"
              rules={[{ required: true, message: "Please tell us your name" }]}
            >
              <Input placeholder="John Doe" prefix={<UserOutlined />} />
            </Form.Item>
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
              style={{ height: 48, borderRadius: 24, fontWeight: 600 }}
            >
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LandingPage;
