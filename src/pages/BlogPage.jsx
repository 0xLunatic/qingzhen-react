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
  Form,
  Upload,
  Select,
  Empty,
  Badge,
  Tooltip,
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
  EditOutlined,
  CameraOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  FireOutlined,
  ClockCircleOutlined,
  TagOutlined,
  FilterOutlined,
  BookOutlined,
  SafetyCertificateFilled,
  CheckCircleFilled,
  CompassFilled,
} from "@ant-design/icons";
import "../App.css";
import logoImage from "../assets/logo.png";

// 👇 IMPORT BAHASA (Sesuaikan path-nya jika berbeda)
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

// --- MOCK DATA CATEGORIES ---
const CATEGORIES = [
  { key: "all", label: "All News", icon: <GlobalOutlined />, color: "#2E7D32" },
  {
    key: "certification",
    label: "Halal Certification",
    icon: <SafetyCertificateFilled />,
    color: "#1890ff",
  },
  {
    key: "food",
    label: "Food & Restaurants",
    icon: <FireOutlined />,
    color: "#fa8c16",
  },
  {
    key: "travel",
    label: "Muslim Travel",
    icon: <CompassFilled />,
    color: "#722ed1",
  },
  {
    key: "policy",
    label: "Policy & Regulation",
    icon: <BookOutlined />,
    color: "#eb2f96",
  },
  {
    key: "community",
    label: "Community",
    icon: <UserOutlined />,
    color: "#13c2c2",
  },
];

const mockContent = [
  "Bagi wisatawan Muslim, menemukan makanan halal di luar negeri terkadang terasa seperti mencari jarum di tumpukan jerami. Namun, dengan persiapan yang matang dan penggunaan teknologi modern, pengalaman kuliner Anda bisa menjadi sangat menyenangkan dan bebas rasa khawatir.",
  "Pertama-tama, kenali sertifikasi halal lokal. Setiap negara biasanya memiliki lembaga resmi yang mengeluarkan logo halal. Pastikan Anda menyimpan gambar logo tersebut di ponsel Anda sebagai referensi cepat saat melihat menu atau papan nama restoran di jalan.",
  "Selain itu, jangan ragu untuk bertanya. Meskipun ada kendala bahasa, banyak pemilik restoran yang mengerti kata 'Halal' atau 'No Pork, No Lard'. Aplikasi penerjemah atau kamus saku yang berisi frasa-frasa penting tentang pantangan makanan akan sangat membantu.",
  "Terakhir, manfaatkan komunitas. Aplikasi seperti QingzhenMu mengandalkan ulasan dari sesama pengguna Muslim yang telah memverifikasi secara langsung status kehalalan tempat tersebut. Membaca ulasan dan melihat foto dari komunitas seringkali memberikan informasi yang lebih akurat daripada sekadar klaim di internet.",
];

// --- MOCK BLOG DATA ---
const MOCK_POSTS = [
  {
    id: 1,
    title: "China Issues New National Halal Food Standards for 2025",
    excerpt:
      "The State Administration for Market Regulation has released comprehensive guidelines covering halal slaughter, processing facilities, and certification requirements across all provinces.",
    content: mockContent,
    category: "certification",
    author: "Ahmad Wei",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=AhmadWei",
    date: "2025-03-15",
    readTime: "5 min read",
    views: 2841,
    likes: 142,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    tags: ["certification", "regulation", "2025"],
    featured: true,
  },
  {
    id: 2,
    title: "Xi'an's Muslim Quarter: A Complete Guide for Halal Travelers",
    excerpt:
      "Discover the best halal restaurants, traditional markets, and cultural experiences in China's most iconic Islamic neighborhood. From lamb skewers to hand-pulled noodles.",
    content: mockContent,
    category: "travel",
    author: "Fatimah Chen",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=FatimahChen",
    date: "2025-03-10",
    readTime: "8 min read",
    views: 5302,
    likes: 267,
    image:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80",
    tags: ["travel", "xian", "guide"],
    featured: true,
  },
  {
    id: 3,
    title: "Top 10 Halal-Certified Chain Restaurants Expanding in China",
    excerpt:
      "Major F&B brands are racing to obtain halal certification as Muslim consumer spending reaches record highs. Here are the chains leading the charge.",
    content: mockContent,
    category: "food",
    author: "Muhammad Liu",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=MuhammadLiu",
    date: "2025-03-05",
    readTime: "6 min read",
    views: 3788,
    likes: 201,
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    tags: ["food", "restaurant", "certification"],
    featured: false,
  },
  {
    id: 4,
    title: "Xinjiang Halal Industry to Reach ¥50 Billion by 2026",
    excerpt:
      "Regional government reports indicate rapid growth in halal food production, hospitality, and export sectors as international demand surges.",
    content: mockContent,
    category: "policy",
    author: "Yusuf Zhang",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=YusufZhang",
    date: "2025-02-28",
    readTime: "4 min read",
    views: 1923,
    likes: 89,
    image:
      "https://images.unsplash.com/photo-1542223616-9de9adb5e3e8?w=800&q=80",
    tags: ["xinjiang", "economy", "growth"],
    featured: false,
  },
  {
    id: 5,
    title: "How Chinese Muslims Are Reviving Traditional Halal Recipes",
    excerpt:
      "A new generation of Hui chefs is blending ancient Islamic culinary traditions with modern techniques, creating a renaissance of authentic Chinese halal cuisine.",
    content: mockContent,
    category: "food",
    author: "Khadijah Zhao",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=KhadijahZhao",
    date: "2025-02-20",
    readTime: "7 min read",
    views: 4156,
    likes: 315,
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    tags: ["culture", "food", "hui"],
    featured: false,
  },
  {
    id: 6,
    title:
      "Prayer Room Facilities Become Mandatory in New Shanghai Airports Terminal",
    excerpt:
      "Shanghai Pudong International Airport's new Terminal 4 will feature dedicated prayer rooms, halal dining zones, and wudu washing facilities as part of inclusive design.",
    content: mockContent,
    category: "community",
    author: "Ibrahim Sun",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=IbrahimSun",
    date: "2025-02-14",
    readTime: "3 min read",
    views: 2674,
    likes: 178,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    tags: ["community", "travel", "infrastructure"],
    featured: false,
  },
];

// --- BlogCard Component ---
const BlogCard = ({ post, onRead, onLike, likedPosts }) => {
  const isLiked = likedPosts.includes(post.id);
  const catObj =
    CATEGORIES.find((c) => c.key === post.category) || CATEGORIES[0];

  return (
    <Card
      hoverable
      bordered={false}
      bodyStyle={{ padding: 0 }}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", height: 200 }}>
        <img
          src={post.image}
          alt={post.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
        />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <Tag
            icon={catObj.icon}
            style={{
              background: catObj.color,
              color: "white",
              border: "none",
              borderRadius: 20,
              padding: "2px 12px",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {catObj.label}
          </Tag>
        </div>
      </div>

      <div style={{ padding: "20px 20px 16px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <Avatar src={post.authorAvatar} size={24} />
          <Text style={{ fontSize: 13, color: "#666" }}>{post.author}</Text>
          <Text style={{ fontSize: 12, color: "#bbb" }}>·</Text>
          <Text style={{ fontSize: 12, color: "#bbb" }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {post.date}
          </Text>
        </div>

        <Title
          level={5}
          style={{ margin: "0 0 8px", lineHeight: 1.4, color: "#1a1a1a" }}
          ellipsis={{ rows: 2 }}
        >
          {post.title}
        </Title>
        <Paragraph
          type="secondary"
          style={{ fontSize: 13, margin: 0 }}
          ellipsis={{ rows: 3 }}
        >
          {post.excerpt}
        </Paragraph>
      </div>

      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space size={16}>
          <Tooltip title={isLiked ? "Unlike" : "Like"}>
            <Button
              type="text"
              size="small"
              icon={
                isLiked ? (
                  <HeartFilled style={{ color: "#ff4d4f" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
              style={{ color: isLiked ? "#ff4d4f" : "#999", padding: 0 }}
            >
              {post.likes + (isLiked ? 1 : 0)}
            </Button>
          </Tooltip>
          <Text style={{ fontSize: 12, color: "#999" }}>
            <EyeOutlined style={{ marginRight: 4 }} />
            {post.views.toLocaleString()}
          </Text>
        </Space>
        <Button
          type="link"
          size="small"
          onClick={() => onRead(post)}
          style={{
            color: "var(--primary-green, #2E7D32)",
            fontWeight: 600,
            padding: 0,
          }}
        >
          Read More <ArrowRightOutlined />
        </Button>
      </div>
    </Card>
  );
};

// --- FeaturedCard Component ---
const FeaturedCard = ({ post, onRead, onLike, likedPosts }) => {
  const isLiked = likedPosts.includes(post.id);
  const catObj =
    CATEGORIES.find((c) => c.key === post.category) || CATEGORIES[0];

  return (
    <Card
      hoverable
      bordered={false}
      bodyStyle={{ padding: 0 }}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        height: "100%",
        cursor: "pointer",
      }}
      onClick={() => onRead(post)}
    >
      <div style={{ position: "relative", height: "100%" }}>
        <img
          src={post.image}
          alt={post.title}
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            display: "flex",
            gap: 8,
          }}
        >
          <Tag
            icon={catObj.icon}
            style={{
              background: catObj.color,
              color: "white",
              border: "none",
              borderRadius: 20,
              padding: "3px 12px",
              fontWeight: 600,
            }}
          >
            {catObj.label}
          </Tag>
          <Tag
            icon={<FireOutlined />}
            style={{
              background: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: 20,
              padding: "3px 12px",
              fontWeight: 600,
            }}
          >
            Featured
          </Tag>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px",
          }}
        >
          <Title
            level={3}
            style={{
              color: "white",
              margin: "0 0 8px",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {post.title}
          </Title>
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 12px",
              fontSize: 14,
            }}
            ellipsis={{ rows: 2 }}
          >
            {post.excerpt}
          </Paragraph>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar src={post.authorAvatar} size={28} />
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}>
              {post.author}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              · {post.date}
            </Text>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                <EyeOutlined style={{ marginRight: 4 }} />
                {post.views.toLocaleString()}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ============================================================
// MAIN BlogPage COMPONENT
// ============================================================
function BlogPage({ onNavigate }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [lang, setLang] = useState("en");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [likedPosts, setLikedPosts] = useState([]);
  const [posts, setPosts] = useState(MOCK_POSTS);

  // Modals & Navigation States
  const [selectedPost, setSelectedPost] = useState(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
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
  const t = (key) => TRANSLATIONS[lang]?.[key] || key;

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

  // --- Computed: filtered & sorted posts ---
  const filteredPosts = posts
    .filter((p) => {
      const matchCat =
        activeCategory === "all" || p.category === activeCategory;
      const matchSearch =
        !searchText ||
        p.title.toLowerCase().includes(searchText.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
        p.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "latest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "liked") return b.likes - a.likes;
      return 0;
    });

  const featuredPosts = filteredPosts.filter((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured);

  const handleLike = (id) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleRead = (post) => {
    setSelectedPost(post);
    // increment view count
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p))
    );
  };

  const handleWriteOpen = () => {
    if (!user) {
      message.warning("Please sign in to write an article.");
      if (onNavigate) onNavigate("auth");
      return;
    }
    setIsWriteModalOpen(true);
  };

  const handleSubmitArticle = async (values) => {
    setSubmitting(true);
    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        title: values.title,
        excerpt: values.excerpt,
        content: values.content,
        category: values.category,
        author: user?.name || user?.username || "Anonymous",
        authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "user"}`,
        date: new Date().toISOString().split("T")[0],
        readTime: `${Math.max(1, Math.ceil(values.content?.split(" ").length / 200))} min read`,
        views: 0,
        likes: 0,
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
        featured: false,
      };
      setPosts((prev) => [newPost, ...prev]);
      message.success("Article submitted successfully! It will be reviewed before publishing.");
      setIsWriteModalOpen(false);
      form.resetFields();
      setSubmitting(false);
    }, 1200);
  };

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

      {/* RENDER DETAIL ARTIKEL JIKA ADA YANG DIPILIH */}
      {selectedPost ? (
        <section style={{ padding: isMobile ? "40px 0" : "60px 0", background: "#fff", minHeight: "80vh" }}>
          <div className="container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
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
              {(() => {
                const catObj = CATEGORIES.find(c => c.key === selectedPost.category) || CATEGORIES[0];
                return (
                  <Tag style={{ background: catObj.color, color: "white", padding: "6px 16px", borderRadius: 20, fontWeight: "700", border: "none", marginBottom: 16, fontSize: "14px" }}>
                    {catObj.icon} {catObj.label}
                  </Tag>
                );
              })()}
              <Title level={1} style={{ marginTop: 0, marginBottom: 24, fontWeight: 800, fontSize: isMobile ? "2.2rem" : "3.2rem", lineHeight: 1.2, color: "var(--text-dark)" }}>
                {selectedPost.title}
              </Title>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar size={48} src={selectedPost.authorAvatar} style={{ backgroundColor: "#f1f5f9" }} />
                  <div>
                    <Text strong style={{ display: "block", fontSize: "16px", color: "#334155" }}>{selectedPost.author}</Text>
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      {selectedPost.date} • {selectedPost.readTime} • <EyeOutlined style={{marginLeft: 4}}/> {selectedPost.views.toLocaleString()} views
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
              
              {Array.isArray(selectedPost.content) ? (
                selectedPost.content.map((para, idx) => (
                  <Paragraph key={idx} style={{ fontSize: "18px", lineHeight: 1.8, color: "#334155", marginBottom: 24 }}>
                    {para}
                  </Paragraph>
                ))
              ) : (
                <Paragraph style={{ fontSize: "18px", lineHeight: 1.8, color: "#334155", marginBottom: 24, whiteSpace: "pre-wrap" }}>
                  {selectedPost.content}
                </Paragraph>
              )}
            </div>
          </div>
        </section>

      ) : (
        /* RENDER DAFTAR BERITA (JIKA TIDAK ADA YANG DIPILIH) */
        <>
          {/* HERO BANNER */}
          <div
            style={{
              background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #388E3C 70%, #43A047 100%)",
              padding: isMobile ? "50px 20px" : "80px 20px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative pattern */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              }}
            />
            <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", zIndex: 2 }}>
              <Tag
                icon={<SafetyCertificateFilled />}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 20,
                  padding: "4px 16px",
                  marginBottom: 16,
                  backdropFilter: "blur(4px)",
                }}
              >
                {lang === "en" ? "Halal News in China" : "中国清真新闻"}
              </Tag>
              <Title
                style={{
                  color: "white",
                  fontSize: isMobile ? "2.2rem" : "3.2rem",
                  margin: "0 0 16px",
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {lang === "en" ? "QingzhenMu Journal" : "QingzhenMu 期刊"}
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: isMobile ? 15 : 17,
                  margin: "0 auto 32px",
                  maxWidth: 580,
                  lineHeight: 1.6
                }}
              >
                {lang === "en" 
                  ? "The latest news, certifications, travel guides, and community stories about halal living in China — curated for Muslim travelers and residents." 
                  : "有关中国清真生活的最新新闻、认证、旅游指南和社区故事——专为穆斯林游客和居民精心策划。"}
              </Paragraph>
              
              <div style={{ maxWidth: 550, margin: "0 auto" }}>
                <Input
                  size="large"
                  placeholder={lang === "en" ? "Search articles, guides, or reviews..." : "搜索文章、指南或评论..."}
                  prefix={<SearchOutlined style={{ color: "var(--primary-green)", fontSize: 18, marginRight: 8 }} />}
                  style={{ 
                    borderRadius: 40, 
                    padding: "8px 24px", 
                    fontSize: 16,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    border: "none"
                  }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </div>
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div style={{ background: "white", borderBottom: "1px solid #f0f0e8", padding: "0 20px", overflowX: "auto" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0, minWidth: "max-content" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "16px 20px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontWeight: activeCategory === cat.key ? 700 : 500,
                    color: activeCategory === cat.key ? cat.color : "#666",
                    borderBottom: activeCategory === cat.key ? `3px solid ${cat.color}` : "3px solid transparent",
                    transition: "all 0.2s",
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ color: activeCategory === cat.key ? cat.color : "#999" }}>
                    {cat.icon}
                  </span>
                  {cat.label}
                  <Badge
                    count={cat.key === "all" ? posts.length : posts.filter((p) => p.category === cat.key).length}
                    style={{
                      background: activeCategory === cat.key ? cat.color : "#f0f0f0",
                      color: activeCategory === cat.key ? "white" : "#999",
                      boxShadow: "none",
                      fontSize: 11,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 20px" }}>
            {/* Sort & Results count */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <Text style={{ color: "#888", fontSize: 14 }}>
                Showing <strong style={{ color: "#1a1a1a" }}>{filteredPosts.length}</strong> articles
                {activeCategory !== "all" && (
                  <> in <strong style={{ color: "#2E7D32" }}>{CATEGORIES.find((c) => c.key === activeCategory)?.label}</strong></>
                )}
                {searchText && (
                  <> for "<strong>{searchText}</strong>"</>
                )}
              </Text>
              
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 160, borderRadius: 8 }}
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="latest">Latest First</Option>
                  <Option value="popular">Most Viewed</Option>
                  <Option value="liked">Most Liked</Option>
                </Select>
                {!isMobile && (
                  <Button type="primary" shape="round" icon={<EditOutlined />} onClick={handleWriteOpen} style={{ background: "#2E7D32", borderColor: "#2E7D32", fontWeight: 600 }}>
                    Write Article
                  </Button>
                )}
              </div>
            </div>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Title level={5} style={{ color: "#888", textTransform: "uppercase", letterSpacing: 1, margin: 0, fontSize: 12 }}>
                    <FireOutlined style={{ color: "#ff4d4f", marginRight: 6 }} /> Featured Stories
                  </Title>
                </div>
                <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
                  {featuredPosts.map((post) => (
                    <Col xs={24} md={12} key={post.id}>
                      <FeaturedCard post={post} onRead={handleRead} onLike={handleLike} likedPosts={likedPosts} />
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Title level={5} style={{ color: "#888", textTransform: "uppercase", letterSpacing: 1, margin: 0, fontSize: 12 }}>
                    <GlobalOutlined style={{ color: "#2E7D32", marginRight: 6 }} /> Latest Articles
                  </Title>
                </div>
                <Row gutter={[20, 20]}>
                  {regularPosts.map((post) => (
                    <Col xs={24} sm={12} lg={8} key={post.id}>
                      <BlogCard post={post} onRead={handleRead} onLike={handleLike} likedPosts={likedPosts} />
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* Empty state */}
            {filteredPosts.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <Title level={4} style={{ color: "#888" }}>No articles found</Title>
                      <Text type="secondary">Try a different category or search keyword</Text>
                    </div>
                  }
                >
                  <Button type="primary" style={{ background: "#2E7D32" }} onClick={() => { setActiveCategory("all"); setSearchText(""); }}>
                    View All Articles
                  </Button>
                </Empty>
              </div>
            )}

            {/* CTA Write */}
            <div style={{ marginTop: 60, borderRadius: 20, background: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)", border: "1px solid #C8E6C9", padding: isMobile ? "32px 20px" : "48px 40px", textAlign: "center" }}>
              <CheckCircleFilled style={{ fontSize: 40, color: "#2E7D32", marginBottom: 16 }} />
              <Title level={3} style={{ color: "#1B5E20", margin: "0 0 12px" }}>
                Have a Story About Halal in China?
              </Title>
              <Paragraph style={{ color: "#4CAF50", fontSize: 16, margin: "0 auto 28px", maxWidth: 600 }}>
                Share news, experiences, or tips with our community. Help Muslim travelers and residents navigate China with confidence.
              </Paragraph>
              <Button type="primary" size="large" shape="round" icon={<EditOutlined />} onClick={handleWriteOpen} style={{ background: "#2E7D32", borderColor: "#2E7D32", height: 48, paddingLeft: 32, paddingRight: 32, fontWeight: 700, fontSize: 15 }}>
                Write an Article
              </Button>
            </div>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer className="footer-section" style={{ background: "#0f172a", color: "white", padding: "80px 0 24px", marginTop: "auto" }}>
        <div className="container" style={{ padding: "0 20px", maxWidth: 1200, margin: "0 auto" }}>
          <div className="footer-content" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", marginBottom: "60px", gap: "40px" }}>
            <div style={{ maxWidth: 320 }}>
              <div className="brand-logo" style={{ color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: "10px" }}>
                <GlobalOutlined style={{ color: "var(--secondary-green)", fontSize: 24 }} />
                <span style={{ fontSize: "24px", fontWeight: "800" }}>QingzhenMu</span>
              </div>
              <Paragraph style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.6 }}>
                {t("footer_desc") || "Empowering Muslim travelers across China with reliable guides and halal information."}
              </Paragraph>
            </div>

            <div className="footer-links" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_about") || "About Us"}</Button>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_careers") || "Careers"}</Button>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_privacy") || "Privacy Policy"}</Button>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_terms") || "Terms of Service"}</Button>
              <Button type="link" style={{ color: "rgba(255,255,255,0.8)", textAlign: "left", padding: 0, fontSize: 15 }}>{t("footer_contact") || "Contact Us"}</Button>
            </div>

            <div className="footer-social" style={{ display: "flex", gap: "24px", fontSize: "24px" }}>
              <FacebookFilled style={{ cursor: "pointer", color: "rgba(255,255,255,0.8)", transition: "color 0.3s" }} onMouseOver={(e) => e.currentTarget.style.color = "white"} onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"} />
              <InstagramFilled style={{ cursor: "pointer", color: "rgba(255,255,255,0.8)", transition: "color 0.3s" }} onMouseOver={(e) => e.currentTarget.style.color = "white"} onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"} />
              <YoutubeFilled style={{ cursor: "pointer", color: "rgba(255,255,255,0.8)", transition: "color 0.3s" }} onMouseOver={(e) => e.currentTarget.style.color = "white"} onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"} />
            </div>
          </div>

          <div className="copyright" style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px" }}>
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
              {t("copyright") || "© 2026 QingzhenMu. Empowering Muslim travelers across China."}
            </Text>
          </div>
        </div>
      </footer>

      {/* DOWNLOAD APP MODAL */}
      <Modal title={null} footer={null} open={isDownloadModalOpen} onCancel={() => setIsDownloadModalOpen(false)} centered width={400} styles={{ body: { padding: 32 } }}>
        <div style={{ textAlign: "center" }}>
          <GlobalOutlined style={{ fontSize: 56, color: "var(--primary-green)", marginBottom: 20 }} />
          <Title level={3} style={{ fontWeight: 800 }}>{t("modal_title") || "Get QingzhenMu App"}</Title>
          <Paragraph style={{ color: "#64748b", marginBottom: 32 }}>{t("modal_desc") || "Download our mobile app to find halal food and prayer spaces on the go."}</Paragraph>
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

      {/* WRITE ARTICLE MODAL */}
      <Modal
        title={
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <EditOutlined style={{ marginRight: 8, color: "#2E7D32" }} />
              Write an Article
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>Share halal news & stories with the community</Text>
          </div>
        }
        open={isWriteModalOpen}
        onCancel={() => { setIsWriteModalOpen(false); form.resetFields(); }}
        footer={null}
        centered
        width={isMobile ? "100%" : 680}
        styles={{ body: { padding: "24px 28px", maxHeight: "75vh", overflowY: "auto" } }}
      >
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f6ffed", borderRadius: 10, border: "1px solid #b7eb8f", marginBottom: 20 }}>
            <Avatar src={user.avatar_url} icon={<UserOutlined />} />
            <Text>Publishing as <strong>{user.name || user.username}</strong></Text>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleSubmitArticle} size="large">
          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
            <Select placeholder="Select article category">
              {CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
                <Option key={cat.key} value={cat.key}>{cat.icon} {cat.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="title" label="Article Title" rules={[{ required: true, message: "Please enter a title" }, { min: 10, message: "Title should be at least 10 characters" }]}>
            <Input placeholder="Enter a clear, informative title..." style={{ borderRadius: 10 }} />
          </Form.Item>

          <Form.Item name="excerpt" label="Short Summary" rules={[{ required: true, message: "Please write a short summary" }]}>
            <TextArea rows={2} placeholder="A brief 1-2 sentence summary of your article..." style={{ borderRadius: 10 }} />
          </Form.Item>

          <Form.Item name="content" label="Article Content" rules={[{ required: true, message: "Please write the article content" }, { min: 100, message: "Article should be at least 100 characters" }]}>
            <TextArea rows={8} placeholder="Write your full article here... You can include facts, personal experience, tips, or news about halal in China." style={{ borderRadius: 10 }} />
          </Form.Item>

          <Form.Item name="tags" label="Tags (comma separated)">
            <Input placeholder="e.g. certification, beijing, food" style={{ borderRadius: 10 }} />
          </Form.Item>

          <Form.Item label="Cover Image (Optional)">
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8, fontSize: 12 }}>Upload Image</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Button block onClick={() => { setIsWriteModalOpen(false); form.resetFields(); }} style={{ borderRadius: 24 }}>Cancel</Button>
              <Button type="primary" htmlType="submit" block loading={submitting} style={{ background: "#2E7D32", borderColor: "#2E7D32", borderRadius: 24, fontWeight: 700, height: 44 }}>
                {submitting ? "Submitting..." : "Submit Article"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}

export default BlogPage;