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
  Modal,
  message,
  Grid,
  Divider,
  Drawer,
  Space,
  Form,
  Upload,
  Spin,
  Select,
  Layout,
} from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  TranslationOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  PlusOutlined,
  CameraOutlined,
  CalendarOutlined,
  EyeOutlined,
  GlobalOutlined,
  ShopOutlined,
  CompassOutlined,
  ArrowRightOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "../App.css"; // Memastikan CSS global Landing Page terpakai
import logoImage from "../assets/logo.png";
import api from "../utils/api";
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

function BlogPage({ onNavigate }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // --- STATE ---
  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRegion, setActiveRegion] = useState("All China");

  const TRANSLATIONS = { en, cn };
  const t = (key) => TRANSLATIONS[lang][key] || key;

  const CHINA_REGIONS = [
    "Beijing",
    "Shanghai",
    "Xi'an",
    "Guangzhou",
    "Xinjiang",
    "Yunnan",
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    message.success("Logged out successfully");
  };

  // --- REUSABLE NAVBAR (Sama dengan Landing Page) ---
  const renderNavbar = () => (
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={() => onNavigate("landing")}
        >
          <div className="logo-icon-wrapper">
            <img
              src={logoImage}
              alt="Logo"
              className="logo-icon"
              style={{ width: "32px" }}
            />
          </div>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>
            QingzhenMu
          </span>
        </div>

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
          <Button type="link" onClick={() => onNavigate("prayer")}>
            {t("nav_prayer")}
          </Button>
          <Button
            type="link"
            className="active-link"
            style={{ color: "var(--primary-green)", fontWeight: "bold" }}
          >
            Blog
          </Button>
        </div>

        <div
          className="nav-actions"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {!isMobile && (
            <Button
              type="text"
              icon={<TranslationOutlined />}
              onClick={() => setLang(lang === "en" ? "cn" : "en")}
              style={{ fontWeight: "bold" }}
            >
              {lang === "en" ? "CN" : "EN"}
            </Button>
          )}

          {user ? (
            <Avatar
              src={user.avatar_url}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "var(--primary-green)",
                cursor: "pointer",
              }}
            />
          ) : (
            <Button type="text" onClick={() => onNavigate("auth")}>
              {t("nav_signin")}
            </Button>
          )}

          {isMobile ? (
            <Button
              type="text"
              onClick={() => setIsMobileMenuOpen(true)}
              icon={<MenuOutlined style={{ fontSize: "20px" }} />}
            />
          ) : (
            <Button
              type="primary"
              shape="round"
              className="btn-gold"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Post News
            </Button>
          )}
        </div>
      </div>
    </header>
  );

  return (
    <div className="landing-page">
      {" "}
      {/* Gunakan wrapper class yang sama untuk CSS context */}
      {renderNavbar()}
      {/* HERO SECTION - STYLE IDENTIK */}
      <section
        className="hero-section"
        style={{ padding: isMobile ? "40px 0" : "60px 0", textAlign: "center" }}
      >
        <div className="container" style={{ padding: "0 20px" }}>
          <Title
            style={{
              color: "white",
              fontSize: isMobile ? "2.5rem" : "3.5rem",
              marginBottom: 16,
              fontWeight: 800,
            }}
          >
            {lang === "en" ? "China Halal News" : "中国清真新闻"}
          </Title>
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.1rem",
              maxWidth: "700px",
              margin: "0 auto 40px",
            }}
          >
            Stay informed about the latest halal culinary trends, mosque events,
            and community stories across the mainland.
          </Paragraph>

          <div
            className="hero-search-bar"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <Input
              placeholder="Search region or news topic..."
              style={{ borderRadius: "30px", padding: "10px 25px" }}
              prefix={<SearchOutlined className="text-muted" />}
              suffix={
                <Button type="primary" shape="round" className="btn-gold">
                  Search
                </Button>
              }
              bordered={false}
            />
          </div>
        </div>
      </section>
      {/* BLOG CONTENT SECTION */}
      <section style={{ padding: "60px 0", background: "#fff" }}>
        <div className="container" style={{ padding: "0 20px" }}>
          {/* FILTER PILLS - STYLE IDENTIK */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "40px",
              overflowX: "auto",
              paddingBottom: "10px",
            }}
          >
            <Tag
              className={`filter-pill ${activeRegion === "All China" ? "active" : ""}`}
              onClick={() => setActiveRegion("All China")}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              All China
            </Tag>
            {CHINA_REGIONS.map((reg) => (
              <Tag
                key={reg}
                className={`filter-pill ${activeRegion === reg ? "active" : ""}`}
                onClick={() => setActiveRegion(reg)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
              >
                {reg}
              </Tag>
            ))}
          </div>

          <Row gutter={[32, 32]}>
            {/* FEATURED POST */}
            <Col span={24}>
              <Card
                className="feature-card"
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}
                bodyStyle={{ padding: 0 }}
              >
                <Row>
                  <Col xs={24} md={12}>
                    <img
                      src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200"
                      alt="Featured"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        minHeight: "300px",
                      }}
                    />
                  </Col>
                  <Col
                    xs={24}
                    md={12}
                    style={{ padding: isMobile ? "30px" : "60px" }}
                  >
                    <Tag color="gold" style={{ marginBottom: 16 }}>
                      MUST READ
                    </Tag>
                    <Title level={2} style={{ color: "var(--text-dark)" }}>
                      The Rising Popularity of Halal Hotpot in Shanghai
                    </Title>
                    <Paragraph type="secondary" style={{ fontSize: 16 }}>
                      As the demand for diverse culinary experiences grows,
                      halal hotpot establishments are becoming the new center
                      for social gatherings...
                    </Paragraph>
                    <Button
                      type="primary"
                      className="btn-green"
                      shape="round"
                      size="large"
                      style={{ marginTop: 24 }}
                    >
                      Read Story <ArrowRightOutlined />
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* NORMAL POSTS */}
            {[1, 2, 3].map((item) => (
              <Col xs={24} md={8} key={item}>
                <Card
                  hoverable
                  className="feature-card"
                  style={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  cover={
                    <img
                      alt="news"
                      src={`https://images.unsplash.com/photo-1590076215667-875d4ef2d97e?w=800&sig=${item}`}
                      style={{ height: 220, objectFit: "cover" }}
                    />
                  }
                >
                  <Space style={{ marginBottom: 12 }}>
                    <CalendarOutlined style={{ color: "#999" }} />
                    <Text type="secondary">April 05, 2026</Text>
                  </Space>
                  <Title level={4} style={{ marginTop: 0 }}>
                    Beijing's Oldest Mosque Renovation Completed
                  </Title>
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                    The historical restoration project in Niujie has finally
                    reached its completion phase...
                  </Paragraph>
                  <Divider style={{ margin: "16px 0" }} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space>
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text strong>Admin</Text>
                    </Space>
                    <Button
                      type="link"
                      style={{ color: "var(--primary-green)", padding: 0 }}
                    >
                      View Detail
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
      {/* MODAL UPLOAD - STYLE FORM IDENTIK */}
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              Publish New Article
            </Title>
            <Text type="secondary">
              Share news or guides with the community
            </Text>
          </div>
        }
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
        centered
        width={600}
      >
        <Form layout="vertical" size="large" style={{ marginTop: 24 }}>
          <Form.Item label="News Title">
            <Input placeholder="Enter title" style={{ borderRadius: 12 }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Region">
                <Select
                  placeholder="Select Region"
                  style={{ borderRadius: 12 }}
                >
                  {CHINA_REGIONS.map((r) => (
                    <Select.Option key={r} value={r}>
                      {r}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Category">
                <Select placeholder="Category" style={{ borderRadius: 12 }}>
                  <Select.Option value="food">Food Guide</Select.Option>
                  <Select.Option value="event">Community Event</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Content Article">
            <TextArea
              rows={5}
              placeholder="Write the full story..."
              style={{ borderRadius: 12 }}
            />
          </Form.Item>
          <Form.Item label="Cover Image">
            <Upload listType="picture-card">
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Button
            type="primary"
            block
            className="btn-green"
            size="large"
            shape="round"
            style={{ height: 48, background: "#2E7D32" }}
          >
            Publish Now
          </Button>
        </Form>
      </Modal>
      {/* DRAWER MOBILE - STYLE IDENTIK */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={280}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Button
            type="text"
            block
            style={{ textAlign: "left" }}
            onClick={() => onNavigate("landing")}
          >
            Home
          </Button>
          <Button
            type="text"
            block
            style={{ textAlign: "left" }}
            onClick={() => onNavigate("finder")}
          >
            Halal Finder
          </Button>
          <Button
            type="text"
            block
            style={{ textAlign: "left" }}
            onClick={() => onNavigate("mosque")}
          >
            Mosque Map
          </Button>
          <Divider />
          <Button
            type="primary"
            block
            className="btn-gold"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Post News
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default BlogPage;
