// src/pages/TravelPlan.jsx
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
  Space,
  Drawer,
  Steps,
  Timeline,
  Tag,
  Rate,
  Empty,
} from "antd";
import {
  EnvironmentFilled,
  CarOutlined,
  StarFilled,
  CoffeeOutlined,
  CompassOutlined,
  CalendarOutlined,
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  MenuOutlined,
  TranslationOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { FaUtensils, FaHotel, FaMapMarkedAlt, FaWalking } from "react-icons/fa";

import logoImage from "../assets/logo.png";
import "../App.css";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { Option } = Select;

const THEME_COLOR = "#1B4D3E";
const ACCENT_COLOR = "#C6A87C";

function TravelPlan({ onNavigate }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  // Mock Data Itinerary (Ini nantinya didapat dari AI atau API Backend)
  const [itinerary, setItinerary] = useState([
    {
      day: 1,
      date: "2024-03-20",
      plans: [
        {
          id: 1,
          type: "Hotel",
          name: "The Halal Oasis Hotel",
          time: "14:00",
          rating: 4.8,
          distance: "0 km",
          category: "Accommodation",
          halalStatus: "Certified",
          icon: <FaHotel color="#1890ff" />,
        },
        {
          id: 2,
          type: "Food",
          name: "Al-Barka Kebab House",
          time: "18:30",
          rating: 4.5,
          distance: "1.2 km from Hotel",
          category: "Turkish Cuisine",
          halalStatus: "Muslim Owned",
          icon: <FaUtensils color="#f5222d" />,
        },
      ],
    },
    {
      day: 2,
      date: "2024-03-21",
      plans: [
        {
          id: 3,
          type: "Tourism",
          name: "Grand City Mosque & Museum",
          time: "09:00",
          rating: 4.9,
          distance: "3.5 km",
          category: "Culture",
          halalStatus: "Prayer Room Available",
          icon: <FaMapMarkedAlt color="#52c41a" />,
        },
      ],
    },
  ]);

  // --- HANDLERS ---
  const generateNewPlan = () => {
    setLoading(true);
    message.loading("Generating your Halal Travel Plan...", 1.5);
    setTimeout(() => {
      setLoading(false);
      message.success("New plan generated successfully!");
    }, 2000);
  };

  const getStatusColor = (status) => {
    if (status === "Certified") return "green";
    if (status === "Muslim Owned") return "blue";
    return "orange";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f7fa",
      }}
    >
      {/* --- NAVBAR (Same as PrayerTime for consistency) --- */}
      <header
        className="navbar-container"
        style={{
          padding: "0 20px",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
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
            onClick={() => onNavigate("landing")}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img src={logoImage} alt="Logo" style={{ width: "32px" }} />
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              QingzhenMu
            </span>
          </div>

          <div
            className="nav-links desktop-only"
            style={{ display: isMobile ? "none" : "flex", gap: "20px" }}
          >
            <Button type="link" onClick={() => onNavigate("finder")}>
              Halal Finder
            </Button>
            <Button type="link" onClick={() => onNavigate("mosque")}>
              Mosque
            </Button>
            <Button type="link" className="active text-green">
              Travel Plan
            </Button>
          </div>

          <Button
            type="primary"
            shape="round"
            className="btn-gold"
            onClick={generateNewPlan}
            icon={<PlusOutlined />}
          >
            Create New Plan
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: isMobile ? "16px" : "32px 20px" }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Row gutter={[24, 24]}>
            {/* LEFT: Trip Overview & Day Selection */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <>
                    <CalendarOutlined /> Trip Overview
                  </>
                }
                style={{ borderRadius: 16, marginBottom: 24 }}
              >
                <div style={{ marginBottom: 20 }}>
                  <Text type="secondary">Destination</Text>
                  <Title level={4} style={{ margin: 0 }}>
                    Beijing, China
                  </Title>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <Steps
                  direction="vertical"
                  current={selectedDay}
                  onChange={(c) => setSelectedDay(c)}
                  size="small"
                  items={itinerary.map((item) => ({
                    title: `Day ${item.day}`,
                    description: item.date,
                  }))}
                />
              </Card>

              <Card
                style={{
                  borderRadius: 16,
                  background: THEME_COLOR,
                  color: "white",
                }}
              >
                <Space direction="vertical">
                  <Text style={{ color: ACCENT_COLOR }}>Pro Tip:</Text>
                  <Text style={{ color: "white" }}>
                    All recommendations are filtered based on high rating and
                    proximity to prayer rooms.
                  </Text>
                </Space>
              </Card>
            </Col>

            {/* RIGHT: Detailed Itinerary */}
            <Col xs={24} lg={16}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "100px 0" }}>
                  <Spin size="large" />
                </div>
              ) : itinerary.length > 0 ? (
                <div
                  style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 32,
                    }}
                  >
                    <Title level={3} style={{ margin: 0 }}>
                      Day {itinerary[selectedDay].day} Itinerary
                    </Title>
                    <Tag color="gold">{itinerary[selectedDay].date}</Tag>
                  </div>

                  <Timeline mode="left">
                    {itinerary[selectedDay].plans.map((item) => (
                      <Timeline.Item
                        key={item.id}
                        label={
                          <Text strong style={{ fontSize: 16 }}>
                            {item.time}
                          </Text>
                        }
                        dot={
                          <div
                            style={{
                              padding: 8,
                              background: "#f0f0f0",
                              borderRadius: "50%",
                            }}
                          >
                            {item.icon}
                          </div>
                        }
                      >
                        <Card
                          hoverable
                          style={{
                            marginBottom: 16,
                            borderRadius: 12,
                            borderLeft: `4px solid ${THEME_COLOR}`,
                          }}
                        >
                          <Row gutter={16} align="middle">
                            <Col flex="auto">
                              <Space direction="vertical" size={0}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {item.type.toUpperCase()}
                                </Text>
                                <Text strong style={{ fontSize: 18 }}>
                                  {item.name}
                                </Text>
                                <Space split={<Divider type="vertical" />}>
                                  <span>
                                    <Rate
                                      disabled
                                      defaultValue={item.rating}
                                      style={{ fontSize: 12 }}
                                    />{" "}
                                    <Text type="secondary">
                                      ({item.rating})
                                    </Text>
                                  </span>
                                  <Text type="secondary">
                                    <FaWalking /> {item.distance}
                                  </Text>
                                </Space>
                              </Space>
                            </Col>
                            <Col>
                              <Tag color={getStatusColor(item.halalStatus)}>
                                {item.halalStatus}
                              </Tag>
                            </Col>
                          </Row>

                          <div
                            style={{ marginTop: 12, display: "flex", gap: 8 }}
                          >
                            <Button size="small">Details</Button>
                            <Button size="small" icon={<EnvironmentFilled />}>
                              Maps
                            </Button>
                          </div>
                        </Card>

                        {/* Estimation Label between items */}
                        <div style={{ padding: "0 0 20px 20px" }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <CarOutlined /> ~15 mins travel time
                          </Text>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>

                  <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    style={{ height: 50, borderRadius: 8 }}
                  >
                    Add Custom Activity
                  </Button>
                </div>
              ) : (
                <Empty description="No travel plan yet" />
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default TravelPlan;
