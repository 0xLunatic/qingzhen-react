import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Tag,
  Typography,
  Avatar,
  Input,
  Button,
  Divider,
  Space,
  Badge,
  Pagination,
  Grid,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  ArrowRightOutlined,
  FireOutlined,
  MessageOutlined,
  TranslationOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const BlogPage = ({ onNavigate }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [searchText, setSearchText] = useState("");

  // --- MOCK DATA BLOG ---
  const FEATURED_POST = {
    title: "10 Masjid Bersejarah di Beijing yang Wajib Dikunjungi",
    excerpt:
      "Menelusuri jejak sejarah Islam di ibukota Tiongkok, mulai dari Masjid Niujie hingga arsitektur unik di distrik pusat...",
    author: "Admin Qingzhen",
    date: "12 Maret 2026",
    category: "Travel Guide",
    image:
      "https://images.unsplash.com/photo-1590075865003-e48277eb57d7?auto=format&fit=crop&w=1200&q=80",
  };

  const POSTS = [
    {
      id: 1,
      title: "Cara Mencari Makanan Halal di Shanghai",
      date: "10 Mar 2026",
      category: "Tips",
      img: "https://images.unsplash.com/photo-1543352658-92901426fce0?w=500",
    },
    {
      id: 2,
      title: "Persiapan Ramadhan di Guangzhou",
      date: "08 Mar 2026",
      category: "Community",
      img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500",
    },
    {
      id: 3,
      title: "Review Restoran Lanzhou Lamian Terbaik",
      date: "05 Mar 2026",
      category: "Food",
      img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500",
    },
  ];

  return (
    <Layout style={{ background: "#fff" }}>
      {/* --- NAVBAR (Konsisten dengan Landing Page) --- */}
      <Header
        style={{
          background: "#fff",
          padding: isMobile ? "0 16px" : "0 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={() => onNavigate("home")}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: "#2E7D32",
              borderRadius: 6,
            }}
          />
          <Title level={4} style={{ margin: 0 }}>
            QingzhenMu
          </Title>
        </div>
        {!isMobile && (
          <Space size={20}>
            <Button type="text" onClick={() => onNavigate("finder")}>
              Finder
            </Button>
            <Button type="text" onClick={() => onNavigate("community")}>
              Community
            </Button>
            <Button type="link" strong>
              Blog
            </Button>
            <Button
              type="primary"
              shape="round"
              style={{ background: "#2E7D32" }}
            >
              Sign In
            </Button>
          </Space>
        )}
      </Header>

      <Content style={{ padding: isMobile ? "20px" : "40px 50px" }}>
        <div
          className="container-xl"
          style={{ maxWidth: 1200, margin: "0 auto" }}
        >
          {/* --- HERO SECTION BLOG --- */}
          <div style={{ marginBottom: 40 }}>
            <Title level={2}>
              QingzhenMu <span style={{ color: "#2E7D32" }}>Blog</span>
            </Title>
            <Paragraph type="secondary" style={{ fontSize: 16 }}>
              Wawasan terbaru mengenai gaya hidup halal, destinasi wisata, dan
              komunitas Muslim di Tiongkok.
            </Paragraph>
            <Input
              placeholder="Cari artikel..."
              prefix={<SearchOutlined />}
              style={{ maxWidth: 400, borderRadius: 20 }}
              size="large"
            />
          </div>

          <Row gutter={[32, 32]}>
            {/* --- MAIN CONTENT (Kiri) --- */}
            <Col xs={24} lg={16}>
              {/* Featured Post */}
              <Card
                hoverable
                cover={
                  <img
                    alt="featured"
                    src={FEATURED_POST.image}
                    style={{ height: 350, objectFit: "cover" }}
                  />
                }
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  marginBottom: 32,
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Tag color="gold" style={{ marginBottom: 12 }}>
                  FEATURED
                </Tag>
                <Title level={2}>{FEATURED_POST.title}</Title>
                <Paragraph type="secondary" style={{ fontSize: 16 }}>
                  {FEATURED_POST.excerpt}
                </Paragraph>
                <Space split={<Divider type="vertical" />}>
                  <Text type="secondary">
                    <UserOutlined /> {FEATURED_POST.author}
                  </Text>
                  <Text type="secondary">
                    <CalendarOutlined /> {FEATURED_POST.date}
                  </Text>
                </Space>
                <div style={{ marginTop: 20 }}>
                  <Button
                    type="primary"
                    shape="round"
                    style={{ background: "#2E7D32" }}
                  >
                    Baca Selengkapnya <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>

              {/* Grid Artikel Lainnya */}
              <Row gutter={[20, 20]}>
                {POSTS.map((post) => (
                  <Col xs={24} sm={12} key={post.id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt="blog"
                          src={post.img}
                          style={{ height: 180, objectFit: "cover" }}
                        />
                      }
                      style={{ borderRadius: 12, overflow: "hidden" }}
                    >
                      <Tag color="green">{post.category}</Tag>
                      <Title level={5} style={{ marginTop: 10 }}>
                        {post.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {post.date}
                      </Text>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Pagination
                style={{ marginTop: 40, textAlign: "center" }}
                total={50}
              />
            </Col>

            {/* --- SIDEBAR (Kanan) --- */}
            <Col xs={24} lg={8}>
              {/* Kategori */}
              <Card
                title="Kategori"
                style={{ borderRadius: 16, marginBottom: 24 }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Travel Guide</Text>
                    <Badge
                      count={12}
                      style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                    />
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Halal Food</Text>
                    <Badge
                      count={8}
                      style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                    />
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Community</Text>
                    <Badge
                      count={5}
                      style={{ backgroundColor: "#f5f5f5", color: "#999" }}
                    />
                  </div>
                </Space>
              </Card>

              {/* Newsletter (Gaya Glassmorphism) */}
              <Card
                style={{
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                  color: "#fff",
                }}
              >
                <FireOutlined style={{ fontSize: 30, color: "#faad14" }} />
                <Title level={4} style={{ color: "#fff", marginTop: 10 }}>
                  Jangan Ketinggalan!
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                  Dapatkan update destinasi halal terbaru langsung di email
                  kamu.
                </Text>
                <Input
                  placeholder="Email Anda"
                  style={{ margin: "16px 0", borderRadius: 8 }}
                />
                <Button
                  block
                  type="primary"
                  style={{
                    background: "#faad14",
                    border: "none",
                    borderRadius: 8,
                  }}
                >
                  Subscribe Now
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default BlogPage;
