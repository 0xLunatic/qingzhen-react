// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Spin } from "antd";
import {
  UserOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import api from "../../utils/api"; // Sesuaikan path utils/api Anda

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
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

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Overview</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} style={{ background: "#e6f7ff" }}>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: "#f6ffed" }}>
            <Statistic
              title="Total Places"
              value={stats?.totalPlaces}
              prefix={<ShopOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: "#fff7e6" }}>
            <Statistic
              title="Pending Verification"
              value={stats?.pendingPlaces}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: "#fff0f6" }}>
            <Statistic
              title="Total User Visits"
              value={stats?.totalReviews}
              prefix={<CommentOutlined />}
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
