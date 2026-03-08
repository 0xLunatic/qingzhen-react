// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Typography, List, Avatar, Button, Space, Grid } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  CommentOutlined,
  ReloadOutlined,
  RightOutlined,
  BellFilled 
} from "@ant-design/icons";
import api from "../../utils/api";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// --- WARNA TEMA MODERN ---
const THEME = {
  glassBg: "rgba(255, 255, 255, 0.03)", 
  glassBorder: "1px solid rgba(255, 255, 255, 0.08)",
  gold: "#E3B505", 
  textMain: "#ffffff",
  textSec: "rgba(255, 255, 255, 0.5)",
  cardHover: "rgba(255, 255, 255, 0.08)"
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint(); // Hook Responsif

  // Dummy Data
  const recentActivities = [
    { title: "New mosque added: Masjid Al-Ikhlas", time: "2 min ago", type: "place" },
    { title: "User 'Ahmad' reported a review", time: "1 hour ago", type: "report" },
    { title: "Verification request: Halal Beef Noodle", time: "3 hours ago", type: "verify" },
    { title: "New User Registered: Siti Aminah", time: "5 hours ago", type: "user" },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/stats");
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- COMPONENT: Modern Glass Card ---
  const GlassCard = ({ children, title, extra, ...props }) => (
    <div style={{
      background: THEME.glassBg,
      backdropFilter: "blur(20px)",
      border: THEME.glassBorder,
      borderRadius: 24, 
      padding: screens.xs ? "16px" : "24px", // Padding lebih kecil di HP
      height: "100%",
      display: 'flex',
      flexDirection: 'column',
      transition: "all 0.3s ease",
      position: 'relative', 
      overflow: 'hidden',
      ...props.style
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = THEME.cardHover}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = THEME.glassBg}
    >
        {(title || extra) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center', position: 'relative', zIndex: 2 }}>
                {title && <Text style={{ color: THEME.textMain, fontWeight: 600, fontSize: 16 }}>{title}</Text>}
                {extra}
            </div>
        )}
        <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
            {children}
        </div>
    </div>
  );

  // --- COMPONENT: Stat Item ---
  const StatItem = ({ title, value, icon, color, trend }) => (
    <div style={{
      background: THEME.glassBg,
      backdropFilter: "blur(12px)",
      border: THEME.glassBorder,
      borderRadius: 24,
      padding: "24px",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.3s",
      cursor: "default"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ 
          position: 'absolute', top: -15, right: -20, opacity: 0.1, 
          transform: 'rotate(-20deg)', fontSize: 100, color: color,
          zIndex: 0, pointerEvents: 'none'
      }}>
         {icon}
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ 
            width: 48, height: 48, borderRadius: 14, 
            background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color, fontSize: 22, marginBottom: 16,
            border: `1px solid ${color}30`
        }}>
           {icon}
        </div>
        <Text style={{ color: THEME.textSec, fontSize: 13, fontWeight: 500 }}>{title}</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
             <Title level={2} style={{ color: THEME.textMain, margin: 0, fontWeight: 700 }}>
                 {value || 0}
             </Title>
             {trend && (
                 <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600, background: "rgba(74, 222, 128, 0.1)", padding: "2px 8px", borderRadius: 10 }}>
                     {trend}
                 </span>
             )}
        </div>
      </div>
    </div>
  );

  if (loading && !stats)
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 20, color: "rgba(255,255,255,0.7)" }}>Dashboard Loading...</p>
      </div>
    );

  return (
    <div style={{ paddingBottom: 20 }}>
      
      {/* HEADER DASHBOARD */}
      <div style={{ 
          marginBottom: 32, 
          display: 'flex', 
          // Responsif: Column di HP, Row di Desktop
          flexDirection: screens.xs ? "column" : "row", 
          justifyContent: "space-between", 
          alignItems: screens.xs ? "start" : "end",
          gap: 16
      }}>
        <div>
            <Title level={2} style={{ color: "white", margin: 0, fontWeight: 700, letterSpacing: -0.5 }}>
                Dashboard Overview
            </Title>
            <Text style={{ color: THEME.textSec }}>Real-time update stats & activities.</Text>
        </div>
        
        <Space size="middle" style={{ width: screens.xs ? "100%" : "auto", justifyContent: screens.xs ? "start" : "end" }}>
            <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchStats}
                style={{ 
                    background: "transparent", 
                    color: "white", 
                    border: "1px solid rgba(255,255,255,0.2)", 
                    borderRadius: "50px", 
                    height: 40,
                    padding: "0 20px",
                    fontWeight: 500,
                    flex: screens.xs ? 1 : "none" // Full width di HP
                }}
            >
                Refresh
            </Button>
            
            <Button 
                type="primary" 
                icon={<BellFilled />} 
                style={{ 
                    background: THEME.gold, 
                    borderColor: THEME.gold,
                    color: '#052018', 
                    fontWeight: 'bold',
                    borderRadius: "50px", 
                    height: 40,
                    padding: "0 24px",
                    boxShadow: "0 4px 14px rgba(227, 181, 5, 0.3)",
                    flex: screens.xs ? 1 : "none"
                }}
            >
                Notifications
            </Button>
        </Space>
      </div>

      {/* STAT CARDS ROW */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <StatItem title="Total Users" value={stats?.totalUsers} icon={<UserOutlined />} color="#3b82f6" trend="↑ 2%" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatItem title="Verified Places" value={stats?.totalPlaces} icon={<ShopOutlined />} color="#10b981" trend="↑ New" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatItem title="Pending Verification" value={stats?.pendingPlaces} icon={<SafetyCertificateOutlined />} color={THEME.gold} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatItem title="Total Interactions" value={stats?.totalReviews} icon={<CommentOutlined />} color="#f472b6" />
        </Col>
      </Row>

      {/* CHARTS & ACTIVITY ROW */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={16}>
          <GlassCard title="Analytics">
            <div style={{ 
                height: 320, width: '100%', 
                border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.1)'
            }}>
                Chart Visualization Area
            </div>
          </GlassCard>
        </Col>

        <Col xs={24} lg={8}>
          <GlassCard title="Recent Activity">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              split={false}
              renderItem={(item) => (
                <List.Item style={{ padding: "12px 0", borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <List.Item.Meta
                    avatar={
                        <Avatar shape="square" icon={item.type === 'verify' ? <SafetyCertificateOutlined /> : item.type === 'report' ? <CommentOutlined /> : <ShopOutlined />} 
                            style={{ 
                                borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)",
                                color: item.type === 'verify' ? THEME.gold : item.type === 'report' ? '#ef4444' : '#10b981'
                            }} 
                        />
                    }
                    title={<span style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>{item.title}</span>}
                    description={<span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{item.time}</span>}
                  />
                </List.Item>
              )}
            />
            <Button type="link" style={{ color: THEME.gold, paddingLeft: 0, fontWeight: 600 }}>
                View All Activity <RightOutlined style={{ fontSize: 10 }} />
            </Button>
          </GlassCard>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;