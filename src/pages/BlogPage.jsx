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
  Modal,
  message,
  Grid,
  Divider,
  Form,
  Upload,
  Spin,
  Select,
  Breadcrumb,
  Empty,
  Badge,
  Tooltip,
  Drawer,
  Space,
} from "antd";
import {
  SearchOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  CameraOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  FireOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  TagOutlined,
  ReadOutlined,
  PlusOutlined,
  FilterOutlined,
  BookOutlined,
  SafetyCertificateFilled,
  CheckCircleFilled,
  MenuOutlined,
  TranslationOutlined,
  LogoutOutlined,
  DownOutlined,
  CompassFilled,
} from "@ant-design/icons";

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

// --- MOCK BLOG DATA ---
const MOCK_POSTS = [
  {
    id: 1,
    title: "China Issues New National Halal Food Standards for 2025",
    excerpt:
      "The State Administration for Market Regulation has released comprehensive guidelines covering halal slaughter, processing facilities, and certification requirements across all provinces.",
    content: "Full article content here...",
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
    content: "Full article content here...",
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
    content: "Full article content here...",
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
    content: "Full article content here...",
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
    content: "Full article content here...",
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
    content: "Full article content here...",
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
      {/* Image */}
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
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
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
        {post.featured && (
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <Tag
              icon={<FireOutlined />}
              style={{
                background: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: 20,
                padding: "2px 10px",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              Featured
            </Tag>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 16px" }}>
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
          <Text style={{ fontSize: 12, color: "#bbb" }}>·</Text>
          <Text style={{ fontSize: 12, color: "#bbb" }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {post.readTime}
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

      {/* Footer */}
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
      <div style={{ position: "relative" }}>
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
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
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
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              · {post.readTime}
            </Text>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                <EyeOutlined style={{ marginRight: 4 }} />
                {post.views.toLocaleString()}
              </Text>
              <Button
                type="text"
                size="small"
                icon={
                  isLiked ? (
                    <HeartFilled style={{ color: "#ff4d4f" }} />
                  ) : (
                    <HeartOutlined style={{ color: "white" }} />
                  )
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(post.id);
                }}
                style={{ color: "white", padding: 0 }}
              >
                {post.likes + (isLiked ? 1 : 0)}
              </Button>
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

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [likedPosts, setLikedPosts] = useState([]);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [loading, setLoading] = useState(false);

  // Modals
  const [selectedPost, setSelectedPost] = useState(null);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  // --- Computed: filtered & sorted posts ---
  const filteredPosts = posts
    .filter((p) => {
      const matchCat =
        activeCategory === "all" || p.category === activeCategory;
      const matchSearch =
        !searchText ||
        p.title.toLowerCase().includes(searchText.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchText.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchText.toLowerCase()));
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
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  };

  const handleRead = (post) => {
    setSelectedPost(post);
    setIsReadModalOpen(true);
    // increment view count
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p)),
    );
  };

  const handleWriteOpen = () => {
    if (!user) {
      message.warning("Please sign in to write an article.");
      onNavigate && onNavigate("auth");
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
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
        featured: false,
      };
      setPosts((prev) => [newPost, ...prev]);
      message.success(
        "Article submitted successfully! It will be reviewed before publishing.",
      );
      setIsWriteModalOpen(false);
      form.resetFields();
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div
      style={{
        fontFamily: "'Noto Serif', Georgia, serif",
        background: "#fafaf8",
        minHeight: "100vh",
      }}
    >
      {/* ─── HEADER ─── */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #e8e8e0",
          padding: "0 20px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 64,
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => onNavigate && onNavigate("landing")}
              style={{ color: "#2E7D32", fontWeight: 600 }}
            >
              {!isMobile && "QingzhenMu"}
            </Button>
            <Text style={{ color: "#ccc" }}>/</Text>
            <Text strong style={{ color: "#1a1a1a", fontSize: 16 }}>
              <ReadOutlined style={{ marginRight: 6, color: "#2E7D32" }} />
              Halal News
            </Text>
          </div>

          {/* Search - desktop */}
          {!isMobile && (
            <Input
              placeholder="Search articles, topics, tags..."
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                maxWidth: 320,
                borderRadius: 24,
                background: "#f5f5f0",
                border: "none",
              }}
              allowClear
            />
          )}

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={() => message.info("Use the search bar below")}
              />
            )}
            <Button
              type="primary"
              shape="round"
              icon={<EditOutlined />}
              onClick={handleWriteOpen}
              style={{
                background: "#2E7D32",
                borderColor: "#2E7D32",
                fontWeight: 600,
              }}
            >
              {!isMobile ? "Write Article" : "Write"}
            </Button>
          </div>
        </div>
      </header>

      {/* ─── HERO BANNER ─── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #388E3C 70%, #43A047 100%)",
          padding: isMobile ? "40px 20px" : "60px 20px",
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
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
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
            Halal News in China
          </Tag>
          <Title
            style={{
              color: "white",
              fontSize: isMobile ? "2rem" : "3rem",
              margin: "0 0 16px",
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            Stay Informed on Halal in China
          </Title>
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: isMobile ? 15 : 17,
              margin: "0 0 32px",
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            The latest news, certifications, travel guides, and community
            stories about halal living in China — curated for Muslim travelers
            and residents.
          </Paragraph>
          {isMobile && (
            <Input
              placeholder="Search articles..."
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                borderRadius: 24,
                maxWidth: 400,
                border: "none",
              }}
              allowClear
            />
          )}
          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: isMobile ? 24 : 48,
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Articles", value: `${posts.length}+` },
              { label: "Categories", value: `${CATEGORIES.length - 1}` },
              { label: "Monthly Readers", value: "12K+" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>
                  {s.value}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                  {s.label}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CATEGORY TABS ─── */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #f0f0e8",
          padding: "0 20px",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            gap: 0,
            minWidth: "max-content",
          }}
        >
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
                borderBottom:
                  activeCategory === cat.key
                    ? `3px solid ${cat.color}`
                    : "3px solid transparent",
                transition: "all 0.2s",
                fontSize: 14,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  color: activeCategory === cat.key ? cat.color : "#999",
                }}
              >
                {cat.icon}
              </span>
              {cat.label}
              <Badge
                count={
                  cat.key === "all"
                    ? posts.length
                    : posts.filter((p) => p.category === cat.key).length
                }
                style={{
                  background:
                    activeCategory === cat.key ? cat.color : "#f0f0f0",
                  color: activeCategory === cat.key ? "white" : "#999",
                  boxShadow: "none",
                  fontSize: 11,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "24px 16px" : "40px 20px",
        }}
      >
        {/* Sort & Results count */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Text style={{ color: "#888", fontSize: 14 }}>
            Showing{" "}
            <strong style={{ color: "#1a1a1a" }}>{filteredPosts.length}</strong>{" "}
            articles
            {activeCategory !== "all" && (
              <>
                {" "}
                in{" "}
                <strong style={{ color: "#2E7D32" }}>
                  {CATEGORIES.find((c) => c.key === activeCategory)?.label}
                </strong>
              </>
            )}
            {searchText && (
              <>
                {" "}
                for "<strong>{searchText}</strong>"
              </>
            )}
          </Text>
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
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Title
                level={5}
                style={{
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  margin: 0,
                  fontSize: 12,
                }}
              >
                <FireOutlined style={{ color: "#ff4d4f", marginRight: 6 }} />
                Featured Stories
              </Title>
            </div>
            <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
              {featuredPosts.map((post) => (
                <Col xs={24} md={12} key={post.id}>
                  <FeaturedCard
                    post={post}
                    onRead={handleRead}
                    onLike={handleLike}
                    likedPosts={likedPosts}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Title
                level={5}
                style={{
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  margin: 0,
                  fontSize: 12,
                }}
              >
                <GlobalOutlined style={{ color: "#2E7D32", marginRight: 6 }} />
                Latest Articles
              </Title>
            </div>
            <Row gutter={[20, 20]}>
              {regularPosts.map((post) => (
                <Col xs={24} sm={12} lg={8} key={post.id}>
                  <BlogCard
                    post={post}
                    onRead={handleRead}
                    onLike={handleLike}
                    likedPosts={likedPosts}
                  />
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
                  <Title level={4} style={{ color: "#888" }}>
                    No articles found
                  </Title>
                  <Text type="secondary">
                    Try a different category or search keyword
                  </Text>
                </div>
              }
            >
              <Button
                type="primary"
                style={{ background: "#2E7D32" }}
                onClick={() => {
                  setActiveCategory("all");
                  setSearchText("");
                }}
              >
                View All Articles
              </Button>
            </Empty>
          </div>
        )}

        {/* CTA Write */}
        <div
          style={{
            marginTop: 60,
            borderRadius: 20,
            background: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)",
            border: "1px solid #C8E6C9",
            padding: isMobile ? "32px 20px" : "48px 40px",
            textAlign: "center",
          }}
        >
          <CheckCircleFilled
            style={{ fontSize: 40, color: "#2E7D32", marginBottom: 16 }}
          />
          <Title level={3} style={{ color: "#1B5E20", margin: "0 0 12px" }}>
            Have a Story About Halal in China?
          </Title>
          <Paragraph
            style={{ color: "#4CAF50", fontSize: 16, margin: "0 0 28px" }}
          >
            Share news, experiences, or tips with our community. Help Muslim
            travelers and residents navigate China with confidence.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<EditOutlined />}
            onClick={handleWriteOpen}
            style={{
              background: "#2E7D32",
              borderColor: "#2E7D32",
              height: 48,
              paddingLeft: 32,
              paddingRight: 32,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Write an Article
          </Button>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          background: "#001529",
          color: "white",
          padding: "40px 20px 20px",
          marginTop: 60,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            paddingBottom: 20,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GlobalOutlined style={{ color: "#52c41a", fontSize: 20 }} />
            <Text strong style={{ color: "white", fontSize: 18 }}>
              QingzhenMu
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.4)" }}>/ Halal News</Text>
          </div>
          <Button
            type="link"
            style={{ color: "rgba(255,255,255,0.6)" }}
            onClick={() => onNavigate && onNavigate("landing")}
          >
            ← Back to Home
          </Button>
        </div>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            paddingTop: 20,
            textAlign: "center",
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            © 2025 QingzhenMu. Empowering Muslim travelers across China.
          </Text>
        </div>
      </footer>

      {/* ─── READ MODAL ─── */}
      <Modal
        open={isReadModalOpen}
        onCancel={() => setIsReadModalOpen(false)}
        footer={null}
        width={isMobile ? "100%" : 760}
        centered
        style={{ top: isMobile ? 0 : 20 }}
        styles={{ body: { padding: 0, maxHeight: "80vh", overflowY: "auto" } }}
      >
        {selectedPost && (
          <div>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              style={{
                width: "100%",
                height: isMobile ? 200 : 280,
                objectFit: "cover",
              }}
            />
            <div style={{ padding: isMobile ? "20px 16px" : "32px 40px" }}>
              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                {(() => {
                  const cat = CATEGORIES.find(
                    (c) => c.key === selectedPost.category,
                  );
                  return cat ? (
                    <Tag
                      style={{
                        background: cat.color,
                        color: "white",
                        border: "none",
                        borderRadius: 20,
                      }}
                    >
                      {cat.icon} {cat.label}
                    </Tag>
                  ) : null;
                })()}
                {selectedPost.tags.map((tag) => (
                  <Tag
                    key={tag}
                    icon={<TagOutlined />}
                    style={{ borderRadius: 20 }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>

              <Title level={2} style={{ lineHeight: 1.3, marginBottom: 16 }}>
                {selectedPost.title}
              </Title>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                <Avatar src={selectedPost.authorAvatar} size={36} />
                <div>
                  <Text strong>{selectedPost.author}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedPost.date} · {selectedPost.readTime} ·{" "}
                    <EyeOutlined /> {selectedPost.views.toLocaleString()} views
                  </Text>
                </div>
                <Button
                  type="text"
                  icon={
                    likedPosts.includes(selectedPost.id) ? (
                      <HeartFilled style={{ color: "#ff4d4f" }} />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={() => handleLike(selectedPost.id)}
                  style={{ marginLeft: "auto" }}
                >
                  {selectedPost.likes +
                    (likedPosts.includes(selectedPost.id) ? 1 : 0)}{" "}
                  Likes
                </Button>
              </div>

              <Divider />

              <Paragraph
                style={{ fontSize: 16, lineHeight: 1.8, color: "#333" }}
              >
                {selectedPost.excerpt}
              </Paragraph>
              <Paragraph
                style={{
                  fontSize: 15,
                  lineHeight: 1.9,
                  color: "#555",
                  marginTop: 16,
                }}
              >
                This article explores the developments in halal standards and
                practices in China, providing actionable insights for Muslim
                consumers, business owners, and travelers looking to navigate
                the evolving halal ecosystem in China.
              </Paragraph>
              <Paragraph
                style={{ fontSize: 15, lineHeight: 1.9, color: "#555" }}
              >
                With China's Muslim population estimated at over 20 million
                people, the demand for certified halal products and services has
                never been higher. Industry experts predict continued
                double-digit growth as both domestic consumption and Muslim
                tourism from Southeast Asia and the Middle East continue to
                rise.
              </Paragraph>

              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Found this helpful? Share it with your community.
                </Text>
                <Button icon={<ShareAltOutlined />} shape="round">
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── WRITE ARTICLE MODAL ─── */}
      <Modal
        title={
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <EditOutlined style={{ marginRight: 8, color: "#2E7D32" }} />
              Write an Article
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Share halal news & stories with the community
            </Text>
          </div>
        }
        open={isWriteModalOpen}
        onCancel={() => {
          setIsWriteModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        centered
        width={isMobile ? "100%" : 680}
        styles={{
          body: { padding: "24px 28px", maxHeight: "75vh", overflowY: "auto" },
        }}
      >
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              background: "#f6ffed",
              borderRadius: 10,
              border: "1px solid #b7eb8f",
              marginBottom: 20,
            }}
          >
            <Avatar src={user.avatar_url} icon={<UserOutlined />} />
            <Text>
              Publishing as <strong>{user.name || user.username}</strong>
            </Text>
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitArticle}
          size="large"
        >
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select article category">
              {CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
                <Option key={cat.key} value={cat.key}>
                  {cat.icon} {cat.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Article Title"
            rules={[
              { required: true, message: "Please enter a title" },
              { min: 10, message: "Title should be at least 10 characters" },
            ]}
          >
            <Input
              placeholder="Enter a clear, informative title..."
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Short Summary"
            rules={[
              { required: true, message: "Please write a short summary" },
            ]}
          >
            <TextArea
              rows={2}
              placeholder="A brief 1-2 sentence summary of your article..."
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Article Content"
            rules={[
              { required: true, message: "Please write the article content" },
              {
                min: 100,
                message: "Article should be at least 100 characters",
              },
            ]}
          >
            <TextArea
              rows={8}
              placeholder="Write your full article here... You can include facts, personal experience, tips, or news about halal in China."
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item name="tags" label="Tags (comma separated)">
            <Input
              placeholder="e.g. certification, beijing, food"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item label="Cover Image (Optional)">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8, fontSize: 12 }}>Upload Image</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                block
                onClick={() => {
                  setIsWriteModalOpen(false);
                  form.resetFields();
                }}
                style={{ borderRadius: 24 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
                style={{
                  background: "#2E7D32",
                  borderColor: "#2E7D32",
                  borderRadius: 24,
                  fontWeight: 700,
                  height: 44,
                }}
              >
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
