// src/pages/BlogPage.jsx
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
  Divider,
  Grid,
  Dropdown,
  Space,
  Modal,
  Drawer,
  message,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
  FacebookFilled,
  InstagramFilled,
  YoutubeFilled,
  ReadOutlined,
  TranslationOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
  AppleFilled,
  AndroidFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
import "../App.css";
import logoImage from "../assets/logo.png";

// 👇 IMPORT BAHASA (Sesuaikan path-nya jika berbeda)
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// --- MOCK DATA CONTENT ARTIKEL ---
const mockContent = [
  "Bagi wisatawan Muslim, menemukan makanan halal di luar negeri terkadang terasa seperti mencari jarum di tumpukan jerami. Namun, dengan persiapan yang matang dan penggunaan teknologi modern, pengalaman kuliner Anda bisa menjadi sangat menyenangkan dan bebas rasa khawatir.",
  "Pertama-tama, kenali sertifikasi halal lokal. Setiap negara biasanya memiliki lembaga resmi yang mengeluarkan logo halal. Pastikan Anda menyimpan gambar logo tersebut di ponsel Anda sebagai referensi cepat saat melihat menu atau papan nama restoran di jalan.",
  "Selain itu, jangan ragu untuk bertanya. Meskipun ada kendala bahasa, banyak pemilik restoran yang mengerti kata 'Halal' atau 'No Pork, No Lard'. Aplikasi penerjemah atau kamus saku yang berisi frasa-frasa penting tentang pantangan makanan akan sangat membantu.",
  "Terakhir, manfaatkan komunitas. Aplikasi seperti QingzhenMu mengandalkan ulasan dari sesama pengguna Muslim yang telah memverifikasi secara langsung status kehalalan tempat tersebut. Membaca ulasan dan melihat foto dari komunitas seringkali memberikan informasi yang lebih akurat daripada sekadar klaim di internet."
];

// --- MOCK DATA BERITA/BLOG ---
const FEATURED_POST = {
  id: 1,
  title: "Panduan Lengkap Mencari Makanan Halal Otentik di Tiongkok",
  excerpt: "Menemukan makanan halal di luar negeri bisa menjadi tantangan, tetapi dengan beberapa tips dan trik ini, Anda bisa menikmati kuliner lokal tanpa rasa khawatir. Pelajari cara mengidentifikasi logo halal dan restoran ramah Muslim.",
  category: "Panduan Wisata",
  author: "Ahmad Rizqi",
  date: "8 April 2026",
  readTime: "5 min read",
  image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=1200&q=80",
  content: mockContent,
};

const BLOG_POSTS = [
  {
    id: 2,
    title: "5 Masjid Bersejarah yang Wajib Dikunjungi Tahun Ini",
    excerpt: "Jelajahi keindahan arsitektur dan nilai sejarah dari masjid-masjid tertua yang ada di Asia.",
    category: "Komunitas",
    author: "Siti Aminah",
    date: "5 April 2026",
    readTime: "4 min read",
    image: "https://img.freepik.com/free-photo/mosque-building_1409-5435.jpg?w=600",
    content: mockContent,
  },
  {
    id: 3,
    title: "Review: Restoran Daging Bakar Halal Baru di Pusat Kota",
    excerpt: "Kami mencoba menu andalan di restoran yang sedang viral ini. Apakah rasanya sepadan dengan antreannya?",
    category: "Food Review",
    author: "Chef Budi",
    date: "2 April 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    content: mockContent,
  },
  {
    id: 4,
    title: "Tips Menjaga Pola Makan Sehat Selama Puasa",
    excerpt: "Ahli gizi membagikan rahasia tetap bugar dan terhidrasi dengan baik saat menjalankan ibadah puasa.",
    category: "Gaya Hidup",
    author: "Dr. Laila",
    date: "28 Maret 2026",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1490645943967-cb2eb5b80061?auto=format&fit=crop&w=600&q=80",
    content: mockContent,
  },
  {
    id: 5,
    title: "Update Aplikasi: Fitur Arah Kiblat Kini Lebih Akurat",
    excerpt: "QingzhenMu meluncurkan pembaruan terbaru yang meningkatkan presisi kompas kiblat di daerah terpencil.",
    category: "Berita App",
    author: "Tim Developer",
    date: "25 Maret 2026",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
    content: mockContent,
  },
  {
    id: 6,
    title: "Mengenal Label Sertifikasi Halal dari Berbagai Negara",
    excerpt: "Pahami perbedaan logo sertifikasi halal ketika Anda bepergian ke luar negeri agar tidak salah pilih.",
    category: "Panduan Wisata",
    author: "Ahmad Rizqi",
    date: "20 Maret 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1580436541340-9753bbfe092d?auto=format&fit=crop&w=600&q=80",
    content: mockContent,
  },
];

const CATEGORIES = ["Semua", "Berita App", "Food Review", "Panduan Wisata", "Gaya Hidup", "Komunitas"];

function BlogPage({ onNavigate }) {
  // --- STATE MANAGEMENT ---
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [lang, setLang] = useState("en");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchText, setSearchText] = useState("");

  // 👇 State untuk Artikel yang dipilih (jika null, tampilkan daftar berita)
  const [selectedPost, setSelectedPost] = useState(null);

  // Modals & Drawers
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User State
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Scroll to top ketika artikel dibuka/ditutup
    window.scrollTo(0, 0);
  }, [selectedPost]);

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

  const handleNavigateBlog = () => {
    setSelectedPost(null); // Tutup artikel jika sedang baca, kembali ke list
    setIsMobileMenuOpen(false);
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

  // Helper Menu Mobile (Drawer)
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
      <Button type="text" block style={{ textAlign: "left" }} onClick={() => setIsMobileMenuOpen(false)}>
        {t("nav_community")}
      </Button>
      <Button type="text" block style={{ textAlign: "left", color: "var(--primary-green)", fontWeight: "bold", background: "rgba(15, 81, 50, 0.05)" }} onClick={handleNavigateBlog}>
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

  // Filter Logic untuk Blog List
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchCategory = activeCategory === "Semua" || post.category === activeCategory;
    const matchSearch = post.title.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="blog-page landing-page" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      
      {/* HEADER / NAVBAR */}
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
            <Button type="text" onClick={() => {}} style={{ fontWeight: 500 }}>{t("nav_community")}</Button>
            <Button type="text" onClick={handleNavigateBlog} style={{ color: "var(--primary-green)", fontWeight: "700", background: "rgba(15, 81, 50, 0.05)", borderRadius: "8px" }}>{t("nav_blog")}</Button>
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

      {/* 👇 RENDER DETAIL ARTIKEL JIKA ADA YANG DIPILIH */}
      {selectedPost ? (
        <section style={{ padding: isMobile ? "40px 0" : "60px 0", background: "#fff", minHeight: "80vh" }}>
          <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Tombol Back */}
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => setSelectedPost(null)}
              style={{ marginBottom: 32, fontWeight: 600, color: "var(--primary-green)", padding: 0, fontSize: "16px" }}
            >
              {lang === "en" ? "Back to Journal" : "返回期刊"}
            </Button>

            {/* Article Header */}
            <div style={{ marginBottom: 32 }}>
              <Tag color="gold" style={{ margin: 0, padding: "6px 16px", borderRadius: 20, fontWeight: "700", border: "none", marginBottom: 16, fontSize: "14px" }}>
                {selectedPost.category}
              </Tag>
              <Title level={1} style={{ marginTop: 0, marginBottom: 24, fontWeight: 800, fontSize: isMobile ? "2.2rem" : "3.2rem", lineHeight: 1.2, color: "var(--text-dark)" }}>
                {selectedPost.title}
              </Title>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar size={48} src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedPost.author}`} style={{ backgroundColor: "#f1f5f9" }} />
                  <div>
                    <Text strong style={{ display: "block", fontSize: "16px", color: "#334155" }}>{selectedPost.author}</Text>
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      {selectedPost.date} • {selectedPost.readTime || "5 min read"}
                    </Text>
                  </div>
                </div>
                {/* Tombol Share */}
                <Button shape="circle" icon={<ShareAltOutlined />} onClick={() => message.success("Link copied to clipboard!")} />
              </div>
            </div>

            {/* Article Hero Image */}
            <div style={{ borderRadius: "24px", overflow: "hidden", marginBottom: 40, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
              <img src={selectedPost.image} alt={selectedPost.title} style={{ width: "100%", maxHeight: "500px", objectFit: "cover", display: "block" }} />
            </div>

            {/* Article Content */}
            <div className="article-content" style={{ paddingBottom: "60px" }}>
              <Paragraph style={{ fontSize: "19px", lineHeight: 1.8, color: "#475569", fontWeight: 500, fontStyle: "italic", marginBottom: 32, paddingLeft: 20, borderLeft: "4px solid var(--primary-green)" }}>
                {selectedPost.excerpt}
              </Paragraph>
              
              {selectedPost.content.map((para, idx) => (
                <Paragraph key={idx} style={{ fontSize: "18px", lineHeight: 1.8, color: "#334155", marginBottom: 24 }}>
                  {para}
                </Paragraph>
              ))}
            </div>
          </div>
        </section>

      ) : (
        /* 👇 RENDER DAFTAR BERITA (JIKA TIDAK ADA YANG DIPILIH) */
        <>
          {/* MODERN HERO SECTION */}
          <section 
            className="blog-hero" 
            style={{ 
              background: "linear-gradient(135deg, var(--primary-green) 0%, #115c38 100%)", 
              padding: isMobile ? "50px 20px" : "80px 20px", 
              color: "white", 
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative Background Elements */}
            <div style={{ position: "absolute", top: "-50px", left: "-50px", width: "200px", height: "200px", background: "rgba(255,255,255,0.05)", borderRadius: "50%", filter: "blur(40px)" }} />
            <div style={{ position: "absolute", bottom: "-80px", right: "-20px", width: "300px", height: "300px", background: "rgba(197, 157, 36, 0.1)", borderRadius: "50%", filter: "blur(60px)" }} />

            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <Tag color="rgba(255,255,255,0.2)" style={{ border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "4px 16px", marginBottom: 24, fontSize: 13, color: "white" }}>
                {lang === "en" ? "Explore • Learn • Connect" : "探索 • 学习 • 连接"}
              </Tag>
              
              <Title style={{ color: "white", fontSize: isMobile ? "2.2rem" : "3.2rem", marginBottom: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>
                {lang === "en" ? "QingzhenMu Journal" : "QingzhenMu 期刊"}
              </Title>
              
              <Paragraph style={{ color: "rgba(255,255,255,0.85)", fontSize: isMobile ? "1rem" : "1.15rem", maxWidth: 650, margin: "0 auto 40px", lineHeight: 1.6 }}>
                 {lang === "en" 
                    ? "Discover the latest news, authentic food reviews, Muslim-friendly travel guides, and inspiring stories from our global community." 
                    : "发现最新新闻、真实的美食评论、穆斯林友好旅游指南以及我们全球社区的鼓舞人心的故事。"}
              </Paragraph>
              
              <div style={{ maxWidth: 550, margin: "0 auto", position: "relative" }}>
                <Input
                  size="large"
                  placeholder={lang === "en" ? "Search articles, guides, or reviews..." : "搜索文章、指南或评论..."}
                  prefix={<SearchOutlined style={{ color: "var(--primary-green)", fontSize: 18, marginRight: 8 }} />}
                  style={{ 
                    borderRadius: 40, 
                    padding: "12px 24px", 
                    fontSize: 16,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    border: "none"
                  }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* MAIN CONTENT SECTION */}
          <section style={{ padding: isMobile ? "40px 0" : "80px 0", background: "#f8f9fa" }}>
            <div className="container">
              
              {/* MODERN CATEGORY FILTER (PILLS) */}
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                overflowX: "auto", 
                paddingBottom: "16px", 
                marginBottom: "40px", 
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch"
              }}>
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <div
                      key={cat}
                      style={{ 
                        cursor: "pointer", 
                        padding: "10px 24px", 
                        fontSize: "14px", 
                        borderRadius: "30px", 
                        border: isActive ? "1px solid var(--primary-green)" : "1px solid #e2e8f0",
                        background: isActive ? "var(--primary-green)" : "#ffffff",
                        color: isActive ? "#ffffff" : "#475569",
                        fontWeight: isActive ? 600 : 500,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        whiteSpace: "nowrap",
                        boxShadow: isActive ? "0 4px 12px rgba(15, 81, 50, 0.2)" : "0 2px 4px rgba(0,0,0,0.02)"
                      }}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </div>
                  );
                })}
              </div>

              {/* FEATURED POST (MAGAZINE STYLE) */}
              {activeCategory === "Semua" && !searchText && (
                <Card
                  bordered={false}
                  bodyStyle={{ padding: 0 }}
                  className="modern-blog-card"
                  style={{ 
                    borderRadius: "24px", 
                    overflow: "hidden", 
                    marginBottom: "60px", 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                    border: "1px solid rgba(0,0,0,0.02)",
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedPost(FEATURED_POST)}
                >
                  <Row>
                    <Col xs={24} md={13}>
                      <div style={{ position: "relative", height: "100%", minHeight: isMobile ? "280px" : "450px" }}>
                        <img 
                          src={FEATURED_POST.image} 
                          alt={FEATURED_POST.title} 
                          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, transition: "transform 0.5s ease" }} 
                        />
                      </div>
                    </Col>
                    <Col xs={24} md={11} style={{ padding: isMobile ? "32px 24px" : "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center", background: "white" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                        <Tag color="gold" style={{ margin: 0, padding: "4px 12px", borderRadius: 20, fontWeight: "700", border: "none" }}>
                          {FEATURED_POST.category}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: "13px", fontWeight: 500 }}>
                          <CalendarOutlined style={{ marginRight: 6 }} /> {FEATURED_POST.date}
                        </Text>
                      </div>
                      
                      <Title level={2} style={{ marginTop: 0, marginBottom: 20, lineHeight: 1.3, fontWeight: 800, fontSize: isMobile ? "1.8rem" : "2.2rem" }}>
                        {FEATURED_POST.title}
                      </Title>
                      
                      <Paragraph type="secondary" style={{ fontSize: "16px", marginBottom: 32, lineHeight: 1.6, color: "#64748b" }}>
                        {FEATURED_POST.excerpt}
                      </Paragraph>
                      
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 24, borderTop: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar size={48} src={`https://api.dicebear.com/7.x/notionists/svg?seed=${FEATURED_POST.author}`} style={{ backgroundColor: "#f1f5f9" }} />
                          <div>
                            <Text strong style={{ display: "block", fontSize: "15px", color: "#334155" }}>{FEATURED_POST.author}</Text>
                            <Text type="secondary" style={{ fontSize: "13px" }}>{FEATURED_POST.readTime}</Text>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}

              {/* BLOG GRID */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                <Title level={3} style={{ margin: 0, color: "var(--text-dark)", fontWeight: 800 }}>
                  {searchText 
                    ? (lang === "en" ? `Search Results for "${searchText}"` : `"${searchText}" 的搜索结果`) 
                    : (lang === "en" ? "Latest Articles" : "最新文章")}
                </Title>
              </div>
              
              <Row gutter={[24, 32]}>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Col xs={24} sm={12} lg={8} key={post.id}>
                      <Card
                        hoverable
                        bordered={false}
                        onClick={() => setSelectedPost(post)}
                        className="modern-blog-card"
                        bodyStyle={{ padding: "24px", display: "flex", flexDirection: "column", height: "100%" }}
                        cover={
                          <div style={{ overflow: "hidden", height: "220px", position: "relative" }}>
                            <img 
                              alt={post.title} 
                              src={post.image} 
                              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} 
                            />
                            <div style={{ position: "absolute", top: 16, left: 16 }}>
                              <Tag style={{ background: "rgba(255,255,255,0.9)", border: "none", color: "var(--primary-green)", fontWeight: 700, borderRadius: 12, padding: "4px 10px" }}>
                                {post.category}
                              </Tag>
                            </div>
                          </div>
                        }
                        style={{ 
                          height: "100%", 
                          display: "flex", 
                          flexDirection: "column", 
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 10px 20px rgba(0,0,0,0.04)",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: "13px", marginBottom: 12, display: "block" }}>
                          {post.date}
                        </Text>
                        <Title level={4} style={{ marginTop: 0, fontSize: "19px", lineHeight: 1.4, fontWeight: 700, marginBottom: 16 }}>
                          {post.title}
                        </Title>
                        <Paragraph type="secondary" ellipsis={{ rows: 3 }} style={{ flex: 1, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
                          {post.excerpt}
                        </Paragraph>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                          <Text strong style={{ fontSize: "14px", color: "#475569" }}>By {post.author}</Text>
                          <Button type="link" style={{ padding: 0, color: "var(--primary-green)", fontWeight: 700, pointerEvents: "none" }}>
                            {lang === "en" ? "Read" : "阅读"} <ArrowRightOutlined />
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: 24, border: "1px dashed #cbd5e1" }}>
                      <ReadOutlined style={{ fontSize: 64, color: "#cbd5e1", marginBottom: 24 }} />
                      <Title level={4} style={{ color: "#64748b", margin: 0 }}>
                        {lang === "en" ? "No articles found matching your criteria." : "找不到符合您标准的文章。"}
                      </Title>
                      <Button type="primary" shape="round" onClick={() => {setSearchText(""); setActiveCategory("Semua")}} style={{ marginTop: 24, background: "var(--primary-green)" }}>
                        {lang === "en" ? "Clear Filters" : "清除过滤器"}
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>

              {/* LOAD MORE */}
              {filteredPosts.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 60 }}>
                  <Button size="large" shape="round" style={{ fontWeight: 600, padding: "0 48px", height: 50, borderColor: "var(--primary-green)", color: "var(--primary-green)" }}>
                    {lang === "en" ? "Load More Articles" : "加载更多文章"}
                  </Button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="footer-section" style={{ background: "#0f172a", color: "white", padding: "80px 0 24px" }}>
        <div className="container" style={{ padding: "0 20px" }}>
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

      {/* DOWNLOAD MODAL */}
      <Modal title={null} footer={null} open={isDownloadModalOpen} onCancel={() => setIsDownloadModalOpen(false)} centered width={400} bodyStyle={{ padding: 32 }}>
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

      {/* Internal CSS Setup for the Hover effect on Cards */}
      <style>{`
        .modern-blog-card:hover img {
          transform: scale(1.05) !important;
        }
        .modern-blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
}

export default BlogPage;