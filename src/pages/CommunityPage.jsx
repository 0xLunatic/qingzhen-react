// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Tag,
  Typography,
  Avatar,
  Modal,
  message,
  Grid,
  Badge,
  Tabs,
  Empty,
  Spin,
  Divider,
  Space,
  Select,
  Dropdown,
  Drawer,
} from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
  PhoneOutlined,
  MailOutlined,
  LinkOutlined,
  FilterOutlined,
  StarFilled,
  CompassFilled,
  CalendarOutlined,
  HeartOutlined,
  HeartFilled,
  UserOutlined,
  MenuOutlined,
  TranslationOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  AppleFilled,
  AndroidFilled,
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import "../App.css";
import logoImage from "../assets/logo.png";

// Import file bahasa (sesuaikan path-nya)
// import { en } from "../lang/en";
// import { cn } from "../lang/cn";
const en = {
  nav_finder: "Halal Finder",
  nav_mosque: "Mosque",
  nav_prayer: "Prayer Times",
  nav_community: "Community",
  nav_blog: "Blog",
  nav_signin: "Sign In",
  nav_download: "Download App",
  footer_desc: "Empowering Muslim travelers across China with reliable guides and halal information.",
  footer_about: "About Us",
  footer_careers: "Careers",
  footer_privacy: "Privacy Policy",
  footer_terms: "Terms of Service",
  footer_contact: "Contact Us",
  copyright: "© 2026 QingzhenMu. All rights reserved.",
  modal_title: "Get QingzhenMu App",
  modal_desc: "Download our mobile app to find halal food and prayer spaces on the go.",
};
const cn = {
  nav_finder: "清真寻找",
  nav_mosque: "清真寺",
  nav_prayer: "祈祷时间",
  nav_community: "社区",
  nav_blog: "博客",
  nav_signin: "登录",
  nav_download: "下载应用",
  footer_desc: "通过可靠的指南和清真信息为在中国旅行的穆斯林提供帮助。",
  footer_about: "关于我们",
  footer_careers: "职业生涯",
  footer_privacy: "隐私政策",
  footer_terms: "服务条款",
  footer_contact: "联系我们",
  copyright: "© 2026 QingzhenMu。保留所有权利。",
  modal_title: "获取 QingzhenMu 应用程序",
  modal_desc: "下载我们的移动应用程序，随时随地寻找清真食品和祈祷场所。",
};

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// ─────────────────────────────────────────────
//  STATIC DATA (UPDATED)
// ─────────────────────────────────────────────
const CATEGORIES = [
  { key: "all", label: "All", icon: <GlobalOutlined /> },
  { key: "masjid", label: "Mosque", icon: <CompassFilled /> },
  { key: "student", label: "Student", icon: <UserOutlined /> },
  { key: "business", label: "Business", icon: <TeamOutlined /> },
  { key: "social", label: "Social", icon: <HeartOutlined /> },
];

const REGIONS = [
  "All Regions",
  "Beijing",
  "Shanghai",
  "Guangzhou",
  "Shenzhen",
  "Chengdu",
  "Hangzhou",
];

const COMMUNITIES = [
  {
    id: 1,
    name: "PCIM Beijing",
    category: "masjid",
    region: "Beijing",
    members: 3200,
    verified: true,
    featured: true,
    description:
      "Special Branch Leadership of Muhammadiyah in Beijing — supporting Indonesian Muslim communities in China.",
    tags: ["Muhammadiyah", "Official", "Active"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Logo_Muhammadiyah.svg/1280px-Logo_Muhammadiyah.svg.png",
    contact: { email: "pcim.beijing@example.com", web: "https://pcim.org" },
    upcomingEvent: "Friday Lecture, April 11, 2026",
  },
  {
    id: 2,
    name: "Muslim Student Association – Tsinghua University",
    category: "student",
    region: "Beijing",
    members: 850,
    verified: true,
    featured: false,
    description:
      "A Muslim student organization at Tsinghua University hosting discussions, halaqah, and social activities.",
    tags: ["Students", "Academic", "University"],
    logo: null,
    contact: { email: "msa.tsinghua@example.com", web: null },
    upcomingEvent: "Iftar Gathering, April 14, 2026",
  },
  {
    id: 3,
    name: "Halal Business Network China",
    category: "business",
    region: "Shanghai",
    members: 1500,
    verified: true,
    featured: true,
    description:
      "A network of halal entrepreneurs supporting business growth, certification, and product marketing.",
    tags: ["Business", "Networking", "Halal"],
    logo: null,
    contact: { email: "hbn.china@example.com", web: "https://halalbiz.net" },
    upcomingEvent: "Halal Export Webinar, April 20, 2026",
  },
  {
    id: 4,
    name: "Muslimah Community Guangzhou",
    category: "social",
    region: "Guangzhou",
    members: 620,
    verified: false,
    featured: false,
    description:
      "A safe space for Muslim women in Guangzhou to share, learn, and grow together.",
    tags: ["Muslimah", "Social", "Community"],
    logo: null,
    contact: { email: null, web: null },
    upcomingEvent: null,
  },
  {
    id: 5,
    name: "NU Digital China",
    category: "masjid",
    region: "Shenzhen",
    members: 4100,
    verified: true,
    featured: false,
    description:
      "A digital community focusing on Islamic literacy and online da’wah.",
    tags: ["NU", "Digital", "Official"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/NU.svg/800px-NU.svg.png",
    contact: { email: "nudigital@example.com", web: "https://nu.or.id" },
    upcomingEvent: "Live Online Lecture, April 10, 2026",
  },
  {
    id: 6,
    name: "Muslim Travelers China",
    category: "social",
    region: "Chengdu",
    members: 2300,
    verified: false,
    featured: false,
    description:
      "A community sharing halal travel tips, mosque recommendations, and experiences across China.",
    tags: ["Travel", "Halal Tourism", "Community"],
    logo: null,
    contact: { email: null, web: null },
    upcomingEvent: "Chengdu Trip, April 25, 2026",
  },
];

// ─────────────────────────────────────────────
//  COMPONENT: CommunityCard
// ─────────────────────────────────────────────
const CommunityCard = ({ community, onViewDetail, isMobile }) => {
  const [saved, setSaved] = useState(false);

  const initials = community.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      bordered={false}
      style={{
        height: "100%",
        borderRadius: 20,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        overflow: "hidden",
        position: "relative",
      }}
      bodyStyle={{ padding: 0 }}
      hoverable
    >
      {/* Featured Banner */}
      {community.featured && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: -28,
            background: "var(--accent-gold, #faad14)",
            color: "#000",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 36px",
            transform: "rotate(-45deg)",
            zIndex: 2,
            letterSpacing: 1,
          }}
        >
          FEATURED
        </div>
      )}

      {/* Card Header strip */}
      <div
        style={{
          height: 6,
          background: "linear-gradient(90deg, #2E7D32, #66BB6A)",
        }}
      />

      <div style={{ padding: "24px 24px 20px" }}>
        {/* Logo + Name Row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          {community.logo ? (
            <Avatar
              src={community.logo}
              size={56}
              shape="square"
              style={{
                borderRadius: 12,
                flexShrink: 0,
                border: "2px solid #f0f0f0",
              }}
            />
          ) : (
            <Avatar
              size={56}
              shape="square"
              style={{
                borderRadius: 12,
                flexShrink: 0,
                background: "linear-gradient(135deg, #2E7D32, #66BB6A)",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {initials}
            </Avatar>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <Title
                level={5}
                style={{
                  margin: 0,
                  fontSize: 15,
                  color: "#1a1a1a",
                  lineHeight: 1.3,
                }}
                ellipsis
              >
                {community.name}
              </Title>
              {community.verified && (
                <CheckCircleFilled
                  style={{ color: "#2E7D32", fontSize: 14, flexShrink: 0 }}
                />
              )}
            </div>
            <Space size={4} wrap>
              <Tag
                color="green"
                style={{ borderRadius: 20, fontSize: 11, margin: 0 }}
              >
                {CATEGORIES.find((c) => c.key === community.category)?.label}
              </Tag>
              <Tag
                icon={<EnvironmentOutlined />}
                style={{
                  borderRadius: 20,
                  fontSize: 11,
                  margin: 0,
                  border: "1px solid #d9d9d9",
                }}
              >
                {community.region}
              </Tag>
            </Space>
          </div>

          {/* Save / Bookmark */}
          <Button
            type="text"
            size="small"
            icon={
              saved ? (
                <HeartFilled style={{ color: "#f5222d" }} />
              ) : (
                <HeartOutlined style={{ color: "#aaa" }} />
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
              message.success(saved ? "Removed from saved" : "Saved to list!");
            }}
          />
        </div>

        {/* Description */}
        <Paragraph
          type="secondary"
          style={{ fontSize: 13, margin: "0 0 14px", lineHeight: 1.6 }}
          ellipsis={{ rows: 2 }}
        >
          {community.description}
        </Paragraph>

        {/* Tags */}
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {community.tags.map((tag) => (
            <Tag
              key={tag}
              style={{
                borderRadius: 20,
                fontSize: 11,
                background: "#f6ffed",
                borderColor: "#b7eb8f",
                color: "#389e0d",
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>

        {/* Upcoming Event */}
        {community.upcomingEvent && (
          <div
            style={{
              background: "#fffbe6",
              border: "1px solid #ffe58f",
              borderRadius: 10,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <CalendarOutlined style={{ color: "#faad14" }} />
            <Text style={{ fontSize: 12, color: "#ad6800" }}>
              {community.upcomingEvent}
            </Text>
          </div>
        )}

        <Divider style={{ margin: "0 0 16px" }} />

        {/* Footer Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <UsergroupAddOutlined style={{ color: "#2E7D32" }} />
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              {community.members.toLocaleString()}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              members
            </Text>
          </div>
          <Button
            type="primary"
            size="small"
            shape="round"
            style={{
              background: "#2E7D32",
              borderColor: "#2E7D32",
              fontWeight: 600,
            }}
            onClick={() => onViewDetail(community)}
          >
            View Detail <ArrowRightOutlined />
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ─────────────────────────────────────────────
//  COMPONENT: DetailModal
// ─────────────────────────────────────────────
const DetailModal = ({ community, onClose }) => {
  if (!community) return null;

  const initials = community.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Modal
      open={!!community}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      styles={{ body: { padding: "32px" } }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        {community.logo ? (
          <Avatar
            src={community.logo}
            size={80}
            shape="square"
            style={{ borderRadius: 16, border: "3px solid #f0f0f0" }}
          />
        ) : (
          <Avatar
            size={80}
            shape="square"
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, #2E7D32, #66BB6A)",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
        )}

        <div style={{ marginTop: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            {community.name}
            {community.verified && (
              <CheckCircleFilled
                style={{ color: "#2E7D32", fontSize: 16, marginLeft: 8 }}
              />
            )}
          </Title>
          <Space style={{ marginTop: 8 }}>
            <Tag color="green">
              {CATEGORIES.find((c) => c.key === community.category)?.label}
            </Tag>
            <Tag icon={<EnvironmentOutlined />}>{community.region}</Tag>
          </Space>
        </div>
      </div>

      <Divider />

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24, textAlign: "center" }}>
        <Col span={12}>
          <div
            style={{
              background: "#f6ffed",
              borderRadius: 12,
              padding: "16px 8px",
            }}
          >
            <Title level={3} style={{ margin: 0, color: "#2E7D32" }}>
              {community.members.toLocaleString()}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Total Members
            </Text>
          </div>
        </Col>
        <Col span={12}>
          <div
            style={{
              background: "#fffbe6",
              borderRadius: 12,
              padding: "16px 8px",
            }}
          >
            <Title level={3} style={{ margin: 0, color: "#faad14" }}>
              <StarFilled style={{ fontSize: 20 }} />
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {community.verified ? "Verified" : "Community"}
            </Text>
          </div>
        </Col>
      </Row>

      {/* Description */}
      <Paragraph style={{ color: "#555", lineHeight: 1.8, marginBottom: 20 }}>
        {community.description}
      </Paragraph>

      {/* Tags */}
      <div style={{ marginBottom: 20 }}>
        {community.tags.map((tag) => (
          <Tag
            key={tag}
            style={{
              borderRadius: 20,
              background: "#f6ffed",
              borderColor: "#b7eb8f",
              color: "#389e0d",
              marginBottom: 4,
            }}
          >
            {tag}
          </Tag>
        ))}
      </div>

      {/* Upcoming Event */}
      {community.upcomingEvent && (
        <div
          style={{
            background: "#fffbe6",
            border: "1px solid #ffe58f",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <CalendarOutlined style={{ color: "#faad14", fontSize: 18 }} />
          <div>
            <Text style={{ fontSize: 12, color: "#8c6900", display: "block" }}>
              Upcoming Event
            </Text>
            <Text style={{ fontWeight: 600, color: "#ad6800" }}>
              {community.upcomingEvent}
            </Text>
          </div>
        </div>
      )}

      {/* Contact */}
      {(community.contact?.email || community.contact?.web) && (
        <>
          <Divider>Contact</Divider>
          <Space direction="vertical" style={{ width: "100%" }}>
            {community.contact.email && (
              <Button
                block
                icon={<MailOutlined />}
                href={`mailto:${community.contact.email}`}
                style={{ borderRadius: 10 }}
              >
                {community.contact.email}
              </Button>
            )}
            {community.contact.web && (
              <Button
                block
                type="primary"
                icon={<LinkOutlined />}
                href={community.contact.web}
                target="_blank"
                style={{
                  borderRadius: 10,
                  background: "#2E7D32",
                  borderColor: "#2E7D32",
                }}
              >
                Visit Website
              </Button>
            )}
          </Space>
        </>
      )}

      <Button
        block
        size="large"
        type="primary"
        shape="round"
        icon={<UsergroupAddOutlined />}
        onClick={() => {
          message.success(`Request to join ${community.name} sent!`);
          onClose();
        }}
        style={{
          marginTop: 20,
          background: "#2E7D32",
          borderColor: "#2E7D32",
          height: 48,
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        Join Community
      </Button>
    </Modal>
  );
};

// ─────────────────────────────────────────────
//  MAIN: CommunityPage
// ─────────────────────────────────────────────
function CommunityPage({ onNavigate }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [lang, setLang] = useState("en");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRegion, setActiveRegion] = useState("All Regions");
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Navigation & User state
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

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
  const t = (key) => TRANSLATIONS[lang]?.[key] || key;

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "cn" : "en"));
    message.success(
      lang === "en" ? "Switched to Chinese" : "Switched to English"
    );
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
    { type: "divider" },
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const renderMobileMenu = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Button type="text" block style={{ textAlign: "left" }} onClick={() => { onNavigate("finder"); setIsMobileMenuOpen(false); }}>
        {t("nav_finder")}
      </Button>
      <Button type="text" block style={{ textAlign: "left" }} onClick={() => { onNavigate("mosque"); setIsMobileMenuOpen(false); }}>
        {t("nav_mosque")}
      </Button>
      <Button type="text" block style={{ textAlign: "left" }} onClick={() => { onNavigate("prayer"); setIsMobileMenuOpen(false); }}>
        {t("nav_prayer")}
      </Button>
      <Button type="text" block style={{ textAlign: "left", color: "var(--primary-green)", fontWeight: "bold", background: "rgba(15, 81, 50, 0.05)" }} onClick={() => setIsMobileMenuOpen(false)}>
        {t("nav_community")}
      </Button>
      <Button type="text" block style={{ textAlign: "left" }} onClick={() => { onNavigate("blog"); setIsMobileMenuOpen(false); }}>
        {t("nav_blog")}
      </Button>

      <Divider style={{ margin: "8px 0" }} />

      {user ? (
        <div style={{ padding: "0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Avatar src={user.avatar_url} icon={<UserOutlined />} style={{ border: "2px solid var(--primary-green)" }} />
            <Text strong>{user.name || user.username}</Text>
          </div>
          <Button block icon={<UserOutlined />} onClick={() => message.info("Profile")} style={{ marginBottom: 8, borderRadius: 8 }}>
            My Profile
          </Button>
          <Button block icon={<LogoutOutlined />} danger onClick={handleLogout} style={{ borderRadius: 8 }}>
            Log Out
          </Button>
        </div>
      ) : (
        <Button type="primary" block onClick={() => onNavigate("auth")} style={{ borderRadius: 8, background: "var(--primary-green)" }}>
          {t("nav_signin")}
        </Button>
      )}

      <Button block onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} icon={<TranslationOutlined />} style={{ borderRadius: 8 }}>
        {lang === "en" ? "CN" : "EN"}
      </Button>

      <Button block shape="round" className="btn-gold" onClick={() => { setIsDownloadModalOpen(true); setIsMobileMenuOpen(false); }} style={{ marginTop: 8 }}>
        {t("nav_download")}
      </Button>
    </div>
  );

  // Simulate initial load
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Filter logic
  const filtered = COMMUNITIES.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "all" || c.category === activeCategory;
    const matchRegion =
      activeRegion === "All Regions" || c.region === activeRegion;
    return matchSearch && matchCat && matchRegion;
  });

  const featuredCount = COMMUNITIES.filter((c) => c.featured).length;
  const totalMembers = COMMUNITIES.reduce((sum, c) => sum + c.members, 0);

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* ── HEADER / NAVBAR ── */}
      <header className="navbar-container" style={{ padding: "0 20px", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 1000, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="container navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div className="brand-logo" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => onNavigate("home")}>
            <div className="logo-icon-wrapper">
              <img src={logoImage} alt="Logo Brand" className="logo-icon" style={{ width: "32px" }} />
            </div>
            <span style={{ fontWeight: "800", fontSize: "18px", color: "var(--text-dark)" }}>QingzhenMu</span>
          </div>

          <div className="nav-links desktop-only" style={{ display: isMobile ? "none" : "flex", gap: "24px" }}>
            <Button type="text" onClick={() => onNavigate("finder")} style={{ fontWeight: 500 }}>{t("nav_finder")}</Button>
            <Button type="text" onClick={() => onNavigate("mosque")} style={{ fontWeight: 500 }}>{t("nav_mosque")}</Button>
            <Button type="text" onClick={() => onNavigate("prayer")} style={{ fontWeight: 500 }}>{t("nav_prayer")}</Button>
            <Button type="text" onClick={() => {}} style={{ color: "var(--primary-green)", fontWeight: "700", background: "rgba(15, 81, 50, 0.05)", borderRadius: "8px" }}>{t("nav_community")}</Button>
            <Button type="text" onClick={() => onNavigate("blog")} style={{ fontWeight: 500 }}>{t("nav_blog")}</Button>
          </div>

          <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!isMobile && (
              <Button type="text" icon={<TranslationOutlined />} onClick={toggleLanguage} style={{ fontWeight: "600", color: "#555" }}>
                {lang === "en" ? "CN" : "EN"}
              </Button>
            )}

            <div className="hide-mobile" style={{ display: isMobile ? "none" : "block" }}>
              {user ? (
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <Button type="text" style={{ height: "auto", padding: "4px 8px", borderRadius: 24 }}>
                    <Space>
                      <Avatar src={user.avatar_url} icon={<UserOutlined />} style={{ backgroundColor: "var(--primary-green)" }} />
                      <Text strong style={{ color: "var(--text-dark)" }}>{user.name || user.username || "User"}</Text>
                      <DownOutlined style={{ fontSize: 10, color: "#999" }} />
                    </Space>
                  </Button>
                </Dropdown>
              ) : (
                <Button type="text" onClick={() => onNavigate("auth")} style={{ fontWeight: 600 }}>{t("nav_signin")}</Button>
              )}
            </div>

            {!isMobile && (
              <Button type="primary" shape="round" className="btn-gold" onClick={() => setIsDownloadModalOpen(true)} style={{ boxShadow: "0 4px 14px rgba(197, 157, 36, 0.3)" }}>
                {t("nav_download")}
              </Button>
            )}

            {isMobile && (
              <Button type="text" className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)} icon={<MenuOutlined style={{ fontSize: "20px" }} />} />
            )}
          </div>
        </div>
      </header>

      {/* DRAWER UNTUK MENU MOBILE */}
      <Drawer title={<span style={{ fontWeight: 700 }}>Menu</span>} placement="right" onClose={() => setIsMobileMenuOpen(false)} open={isMobileMenuOpen} width={280}>
        {renderMobileMenu()}
      </Drawer>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1 }}>
        {/* ── HERO BANNER ── */}
        <section
          style={{
            background:
              "linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)",
            padding: isMobile ? "50px 20px 40px" : "80px 20px 60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              left: "20%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          />

          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <div
              style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}
            >
              <Tag
                style={{
                  background: "rgba(250,173,20,0.2)",
                  borderColor: "rgba(250,173,20,0.5)",
                  color: "#faad14",
                  borderRadius: 20,
                  padding: "4px 16px",
                  fontSize: 13,
                  marginBottom: 16,
                  fontWeight: 600,
                }}
              >
                🤝 Muslim Communities
              </Tag>
              <Title
                style={{
                  color: "white",
                  fontSize: isMobile ? "2rem" : "3rem",
                  fontWeight: 800,
                  margin: "0 0 16px",
                  lineHeight: 1.2,
                }}
              >
                Find Your Community
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: isMobile ? 15 : 17,
                  maxWidth: 560,
                  margin: "0 auto 32px",
                  lineHeight: 1.7,
                }}
              >
                Connect with verified Muslim organizations, student associations,
                and halal business networks near you.
              </Paragraph>

              {/* Search Bar */}
              <div style={{ maxWidth: 560, margin: "0 auto" }}>
                <Input
                  size="large"
                  placeholder="Search communities, organizations..."
                  prefix={<SearchOutlined style={{ color: "#aaa" }} />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    borderRadius: 30,
                    padding: "10px 20px",
                    fontSize: 15,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    border: "none",
                  }}
                  allowClear
                />
              </div>
            </div>

            {/* Stats Row */}
            <Row gutter={[16, 16]} justify="center">
              {[
                { value: COMMUNITIES.length, label: "Communities" },
                {
                  value: totalMembers.toLocaleString() + "+",
                  label: "Total Members",
                },
                { value: featuredCount, label: "Featured" },
                { value: REGIONS.length - 1, label: "Regions" },
              ].map((stat) => (
                <Col key={stat.label} xs={12} md={6}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 16,
                      padding: "16px 12px",
                      textAlign: "center",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <Title
                      level={3}
                      style={{ color: "#faad14", margin: 0, fontWeight: 800 }}
                    >
                      {stat.value}
                    </Title>
                    <Text
                      style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}
                    >
                      {stat.label}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <section
          style={{
            background: "white",
            padding: "16px 20px",
            borderBottom: "1px solid #f0f0f0",
            position: "sticky",
            top: 64, // below navbar
            zIndex: 100,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: isMobile ? "nowrap" : "wrap",
              overflowX: isMobile ? "auto" : "visible",
              paddingBottom: isMobile ? 4 : 0,
            }}
          >
            <FilterOutlined style={{ color: "#aaa", flexShrink: 0 }} />

            {CATEGORIES.map((cat) => (
              <Tag
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                icon={cat.icon}
                style={{
                  cursor: "pointer",
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                  background: activeCategory === cat.key ? "#2E7D32" : "#f5f5f5",
                  color: activeCategory === cat.key ? "white" : "#555",
                  borderColor: activeCategory === cat.key ? "#2E7D32" : "#f5f5f5",
                  transition: "all 0.2s",
                }}
              >
                {cat.label}
              </Tag>
            ))}

            <div style={{ marginLeft: "auto", flexShrink: 0 }}>
              <Select
                value={activeRegion}
                onChange={setActiveRegion}
                style={{ width: isMobile ? 140 : 160, borderRadius: 20 }}
                options={REGIONS.map((r) => ({ label: r, value: r }))}
                size="middle"
              />
            </div>
          </div>
        </section>

        {/* ── COMMUNITY GRID ── */}
        <section style={{ padding: isMobile ? "32px 16px" : "48px 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Result count */}
            <div
              style={{
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text type="secondary" style={{ fontSize: 14 }}>
                Showing{" "}
                <strong style={{ color: "#2E7D32" }}>{filtered.length}</strong>{" "}
                communities
                {search && ` for "${search}"`}
              </Text>
              {search && (
                <Button type="link" size="small" onClick={() => setSearch("")}>
                  Clear search
                </Button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <Spin size="large" />
              </div>
            ) : filtered.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    No communities found.{" "}
                    <Button
                      type="link"
                      onClick={() => {
                        setSearch("");
                        setActiveCategory("all");
                        setActiveRegion("All Regions");
                      }}
                    >
                      Reset filters
                    </Button>
                  </span>
                }
                style={{ padding: "80px 0" }}
              />
            ) : (
              <Row gutter={[24, 24]}>
                {filtered.map((community) => (
                  <Col
                    xs={24}
                    sm={12}
                    lg={8}
                    key={community.id}
                    style={{ display: "flex" }}
                  >
                    <CommunityCard
                      community={community}
                      onViewDetail={setSelectedCommunity}
                      isMobile={isMobile}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </section>

        {/* ── CTA: REGISTER COMMUNITY ── */}
        <section
          style={{
            padding: isMobile ? "40px 20px" : "60px 20px",
            background: "white",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #f6ffed, #fffbe6)",
                border: "1px solid #b7eb8f",
                borderRadius: 24,
                padding: isMobile ? "32px 24px" : "48px 40px",
              }}
            >
              <UsergroupAddOutlined
                style={{ fontSize: 48, color: "#2E7D32", marginBottom: 16 }}
              />
              <Title level={3} style={{ color: "#1B5E20", marginBottom: 12 }}>
                Register Your Community
              </Title>
              <Paragraph
                type="secondary"
                style={{
                  fontSize: 15,
                  marginBottom: 28,
                  maxWidth: 480,
                  margin: "0 auto 28px",
                }}
              >
                Is your Muslim organization or halal business network not listed
                yet? Register now and connect with thousands of members.
              </Paragraph>
              <Space wrap justify="center">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  icon={<UsergroupAddOutlined />}
                  style={{
                    background: "#2E7D32",
                    borderColor: "#2E7D32",
                    height: 48,
                    fontWeight: 700,
                    padding: "0 32px",
                  }}
                  onClick={() => message.info("Registration form coming soon!")}
                >
                  Register Community
                </Button>
                <Button
                  size="large"
                  shape="round"
                  style={{ height: 48, padding: "0 32px" }}
                  onClick={() => onNavigate && onNavigate("landing")}
                >
                  Learn More
                </Button>
              </Space>
            </div>
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer-section" style={{ background: "#0f172a", color: "white", padding: "80px 0 24px", marginTop: "auto" }}>
        <div className="container" style={{ padding: "0 20px", maxWidth: 1200, margin: "0 auto" }}>
          <div className="footer-content" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", marginBottom: "60px", gap: "40px" }}>
            <div style={{ maxWidth: 320 }}>
              <div className="brand-logo" style={{ color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: "10px" }}>
                <GlobalOutlined style={{ color: "var(--secondary-green)", fontSize: 24 }} />
                <span style={{ fontSize: "24px", fontWeight: "800" }}>QingzhenMu</span>
              </div>
              <Paragraph style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.6 }}>
                {t("footer_desc")}
              </Paragraph>
            </div>

            <div className="footer-links" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_about")}</Button>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_careers")}</Button>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_privacy")}</Button>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_terms")}</Button>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_contact")}</Button>
            </div>

            <div className="footer-social" style={{ display: "flex", gap: "24px", fontSize: "24px" }}>
              <FacebookFilled style={{ cursor: "pointer", color: "rgba(255,255,255,0.8)", transition: "color 0.3s" }} onMouseOver={(e) => e.currentTarget.style.color = "white"} onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"} />
              <InstagramFilled style={{ cursor: "pointer", color: "rgba(255,255,255,0.8)", transition: "color 0.3s" }} onMouseOver={(e) => e.currentTarget.style.color = "white"} onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"} />
              <YoutubeFilled style={{ cursor: "pointer", color: "rgba(255,255,255,0.8)", transition: "color 0.3s" }} onMouseOver={(e) => e.currentTarget.style.color = "white"} onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"} />
            </div>
          </div>

          <div className="copyright" style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px" }}>
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
              {t("copyright")}
            </Text>
          </div>
        </div>
      </footer>

      {/* ── DOWNLOAD APP MODAL ── */}
      <Modal title={null} footer={null} open={isDownloadModalOpen} onCancel={() => setIsDownloadModalOpen(false)} centered width={400} styles={{ body: { padding: 32 } }}>
        <div style={{ textAlign: "center" }}>
          <GlobalOutlined style={{ fontSize: 56, color: "var(--primary-green)", marginBottom: 20 }} />
          <Title level={3} style={{ fontWeight: 800 }}>{t("modal_title")}</Title>
          <Paragraph style={{ color: "#64748b", marginBottom: 32 }}>{t("modal_desc")}</Paragraph>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Button type="primary" size="large" icon={<AppleFilled />} style={{ background: "#0f172a", borderColor: "#0f172a", height: 50, borderRadius: 12, fontWeight: 600 }} block onClick={() => message.info("Redirecting to App Store...")}>
              Download on App Store
            </Button>
            <Button type="primary" size="large" icon={<AndroidFilled />} style={{ background: "var(--primary-green)", borderColor: "var(--primary-green)", height: 50, borderRadius: 12, fontWeight: 600 }} block onClick={() => message.info("Redirecting to Play Store...")}>
              Get it on Google Play
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── DETAIL MODAL ── */}
      <DetailModal
        community={selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
      />
    </div>
  );
}

export default CommunityPage;