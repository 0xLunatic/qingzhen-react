import React, { useState } from "react";
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
  Divider,
  Space,
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
  ClockCircleOutlined,
  ShoppingCartOutlined,
  CoffeeOutlined,
  FireOutlined,
  GlobalOutlined,
  AppleFilled,
  AndroidFilled,
  FilterOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "../App.css";

const { Title, Text, Paragraph } = Typography;

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
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState(["Verified Halal"]);
  const [activeStep, setActiveStep] = useState("search");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // --- HANDLERS ---
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

  const toggleFilter = (filterName) => {
    if (activeFilters.includes(filterName)) {
      setActiveFilters(activeFilters.filter((f) => f !== filterName));
    } else {
      setActiveFilters([...activeFilters, filterName]);
    }
  };

  // --- RENDER CONTENT FOR "HOW IT WORKS" ---
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
              <Title level={4}>Restaurants</Title>
              <Text type="secondary">Prayer room available</Text>
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
              <Tag color="green">No Alcohol</Tag>
              <Tag color="blue" style={{ marginTop: 8 }}>
                Family Friendly
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
              <Title level={4}>Halal Labels</Title>
              <Text type="secondary">
                Verified Halal, Muslim-owned, <br /> No Pork, No Alcohol
              </Text>
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
            <Title level={3}>Smart Filters</Title>
            <Paragraph
              type="secondary"
              style={{ fontSize: 16, maxWidth: 600, margin: "0 auto 24px" }}
            >
              Easily filter for specific needs: <b>Pork-Free</b>,{" "}
              <b>Prayer Space</b>, or <b>Kids Friendly</b>.
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
                Certified Halal
              </Tag>
              <Tag color="blue" style={{ padding: "8px 16px", fontSize: 14 }}>
                Prayer Space
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
            <Title level={3}>Go with Confidence</Title>
            <Paragraph
              type="secondary"
              style={{ fontSize: 16, maxWidth: 600, margin: "0 auto 24px" }}
            >
              Check real photos, read reviews from fellow Muslim travelers, and
              use built-in maps navigation.
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
      {/* HEADER */}
      <header className="navbar-container">
        <div className="container navbar">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <GlobalOutlined className="logo-icon" />
            </div>
            <span>QingzhenMu</span>
          </div>

          <div className="nav-links">
            <Button
              type="link"
              onClick={() => {
                onNavigate("finder");
              }}
            >
              Halal Finder
            </Button>
            <Button type="link">Mosque</Button>
            <Button type="link">Prayer Times</Button>
            <Button type="link">Community</Button>
            <Button type="link">Blog</Button>
          </div>
          <div className="nav-actions">
            <Button
              type="text"
              onClick={() => message.info("Login coming soon!")}
            >
              Sign in
            </Button>
            <Button
              type="primary"
              shape="round"
              className="btn-gold"
              onClick={() => setIsDownloadModalOpen(true)}
            >
              Download App
            </Button>
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
                  fontSize: "3.5rem",
                  marginBottom: 16,
                  lineHeight: 1.2,
                  fontWeight: 800,
                }}
              >
                Find Halal. <br /> Feel at Ease.
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "1.2rem",
                  marginBottom: 40,
                  maxWidth: "90%",
                }}
              >
                Halal restaurants, prayer-friendly places, and trusted
                info—wherever you go in China.
              </Paragraph>

              <div className="hero-search-bar">
                <Input
                  placeholder="Search city / food / halal shop..."
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
                      {isSearching ? "Searching" : "Search"}
                    </Button>
                  }
                  bordered={false}
                />
              </div>

              {/* Interactive Filters */}
              <div className="hero-filters">
                <FilterPill
                  icon={<SafetyCertificateFilled />}
                  text="Verified Halal"
                  active={activeFilters.includes("Verified Halal")}
                  onClick={() => toggleFilter("Verified Halal")}
                />
                <FilterPill
                  icon={<StopOutlined />}
                  text="No Alcohol"
                  active={activeFilters.includes("No Alcohol")}
                  onClick={() => toggleFilter("No Alcohol")}
                />
                <FilterPill
                  icon={<UsergroupAddOutlined />}
                  text="Family-Friendly"
                  active={activeFilters.includes("Family-Friendly")}
                  onClick={() => toggleFilter("Family-Friendly")}
                />
                <FilterPill
                  icon={<CompassOutlined />}
                  text="Prayer Space"
                  active={activeFilters.includes("Prayer Space")}
                  onClick={() => toggleFilter("Prayer Space")}
                />
              </div>
            </Col>

            <Col xs={24} md={10}>
              <Card className="glass-card">
                <CheckListItem text="Verified listings & trusted sources" />
                <CheckListItem text="Community reviews you can rely on" />
                <CheckListItem text="Clear halal labels (certified/muslim-owned)" />
                <div style={{ marginTop: 24 }}>
                  <Button
                    type="primary"
                    block
                    className="btn-green"
                    size="large"
                    shape="round"
                  >
                    Explore Map <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* FEATURES SECTION (UPDATED LAYOUT) */}
      <section className="section-container">
        <div className="container">
          <Title
            level={2}
            className="text-center mb-large"
            style={{ color: "var(--primary-green)" }}
          >
            Discover Halal & Muslim-friendly Features
          </Title>

          <Row gutter={[24, 24]}>
            {/* LEFT COLUMN: GABUNGAN HALAL FINDER & MOSQUE (1 CARD) */}
            <Col xs={24} lg={15}>
              <Card
                className="feature-card"
                bordered={false}
                bodyStyle={{ padding: 0 }} // Reset padding
              >
                <Row>
                  {/* Left Side: Halal Finder */}
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
                        Halal Finder
                      </Title>
                    </div>
                    <Paragraph
                      type="secondary"
                      style={{ marginBottom: 24, flex: 1 }}
                    >
                      Neatify halal restaurants, groceries, hotels & more
                      nearby.
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

                  {/* Right Side: Mosque */}
                  <Col
                    xs={24}
                    md={12}
                    style={{
                      padding: "24px 24px 0 24px",
                      display: "flex",
                      flexDirection: "column",
                      borderLeft: "1px solid #f0f0f0",
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
                      <CompassOutlined
                        style={{ fontSize: 24, color: "var(--primary-green)" }}
                      />
                      <Title
                        level={4}
                        style={{ margin: 0, color: "var(--text-dark)" }}
                      >
                        Mosque Space
                      </Title>
                    </div>
                    <Paragraph
                      type="secondary"
                      style={{ marginBottom: 24, flex: 1 }}
                    >
                      Find our mosques matane, prayer spaces, locally areas
                      comfortably.
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

            {/* RIGHT COLUMN: TOP CATEGORIES (SIDEBAR) */}
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
                      Top Categories
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
                    New All
                  </Tag>
                </div>

                {/* Styled Buttons/Pills for Categories */}
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
                      Restaurants
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
                      Groceries
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
                      Hotels
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
                      Cafes
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
                      Butcher
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
                    View All Categories
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
                Find Halal & Prayer Spots Easily
              </Title>

              {/* TAB BUTTONS */}
              <div className="step-tabs" style={{ justifyContent: "center" }}>
                <Button
                  type={activeStep === "search" ? "primary" : "text"}
                  className={activeStep === "search" ? "btn-green" : ""}
                  icon={<SearchOutlined />}
                  shape="round"
                  size="large"
                  onClick={() => setActiveStep("search")}
                >
                  Search
                </Button>
                <Button
                  type={activeStep === "filter" ? "primary" : "text"}
                  className={activeStep === "filter" ? "btn-green" : ""}
                  icon={<FilterOutlined />}
                  shape="round"
                  size="large"
                  onClick={() => setActiveStep("filter")}
                >
                  Filter by halal level
                </Button>
                <Button
                  type={activeStep === "go" ? "primary" : "text"}
                  className={activeStep === "go" ? "btn-green" : ""}
                  icon={<LikeFilled />}
                  shape="round"
                  size="large"
                  onClick={() => setActiveStep("go")}
                >
                  Go with confidence
                </Button>
              </div>

              {/* CONTENT FRAME */}
              <Card className="section-frame-card" bordered={false}>
                {renderStepContent()}
              </Card>

              {/* 2. FRAME BAWAH (CONFIDENCE) */}
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
                        Halal Confidence
                      </Title>
                      <Text type="secondary">
                        Reliable data verified by community & certificates.
                      </Text>
                    </div>
                  </div>
                </div>

                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <div className="sub-feature">
                      <CheckCircleFilled className="sub-feature-icon" />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Verified Halal
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          Listing places with verified certificates.
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
                          Muslim-Owned
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          Prioritizing local Muslim businesses.
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
                          Real Reviews
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          Honest feedback from travelers.
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
            Loved by Muslim Travelers
          </Title>
          <Row gutter={[24, 24]}>
            {[
              {
                name: "Aisyah Rahman",
                img: "https://i.pravatar.cc/150?img=5",
                text: "Love this app! Found a halal restaurant with a prayer space easily right in Beijing.",
              },
              {
                name: "Hassan Abdullah",
                img: "https://i.pravatar.cc/150?img=11",
                text: "Great to find family friendly places with no alcohol. Super useful for travelers.",
              },
              {
                name: "Nurul Wahyuni",
                img: "https://i.pravatar.cc/150?img=9",
                text: "Reliable halal ratings and detailed notes. A must-have for Muslims in China!",
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
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        className="section-container bg-gray text-center"
        style={{ padding: "80px 0" }}
      >
        <div className="container">
          <Title level={2}>Partners & For Business</Title>
          <Paragraph
            type="secondary"
            style={{
              fontSize: "1.2rem",
              maxWidth: 600,
              margin: "0 auto 32px auto",
            }}
          >
            Attract Muslim customers to your restaurant, hotel, or business in
            China.
          </Paragraph>
          <Button
            type="primary"
            shape="round"
            className="btn-gold-large"
            onClick={() =>
              message.success("Thank you! We will contact you soon.")
            }
          >
            Get Listed
          </Button>
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
                Your trusted companion for Muslim-friendly travel in China.
              </Paragraph>
            </div>

            <div className="footer-links">
              <Button type="link">About Us</Button>
              <Button type="link">Careers</Button>
              <Button type="link">Privacy Policy</Button>
              <Button type="link">Terms</Button>
              <Button type="link">Contact</Button>
            </div>

            <div className="footer-social">
              <FacebookFilled style={{ cursor: "pointer", color: "white" }} />
              <InstagramFilled style={{ cursor: "pointer", color: "white" }} />
              <YoutubeFilled style={{ cursor: "pointer", color: "white" }} />
            </div>
          </div>

          <div className="copyright">
            <Text style={{ color: "rgba(255,255,255,0.4)" }}>
              © 2024 QingzhenMu Inc. All rights reserved.
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
          <Title level={3}>Download QingzhenMu</Title>
          <Paragraph>
            Get the full experience on your mobile device. Available on iOS and
            Android.
          </Paragraph>
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
    </div>
  );
}

export default LandingPage;
