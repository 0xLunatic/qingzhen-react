// src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateFilled,
} from "@ant-design/icons";
import api from "../../utils/api";

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Persiapkan Payload sesuai Backend (butuh 'identifier')
      const payload = {
        identifier: values.email, // Mapping input email ke identifier
        password: values.password,
      };

      // 2. Panggil API Login
      const response = await api.post("/auth/login", payload);

      if (response.data.success) {
        // 3. Ambil data dari response.data.data (Sesuai AuthController)
        const { user, token } = response.data.data;

        // 4. CEK ROLE
        if (user.role !== "admin") {
          setErrorMsg("Access Denied: You are not an Administrator.");
          setLoading(false);
          return;
        }

        // 5. Simpan Session
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        message.success("Welcome back, Admin!");

        // 6. Reload agar AdminRoute di App.jsx mendeteksi session baru
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      // Handle error message dari backend
      const serverMsg = error.response?.data?.message;
      setErrorMsg(serverMsg || "Invalid credentials or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1B4D3E 0%, #0d2820 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SafetyCertificateFilled
            style={{ fontSize: 48, color: "#1B4D3E", marginBottom: 16 }}
          />
          <Title level={3} style={{ marginBottom: 0, color: "#1B4D3E" }}>
            Admin Portal
          </Title>
          <Text type="secondary">Sign in to manage QingzhenMu</Text>
        </div>

        {errorMsg && (
          <Alert
            message="Login Failed"
            description={errorMsg}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          name="admin_login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Admin Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                backgroundColor: "#1B4D3E",
                borderColor: "#1B4D3E",
                fontWeight: "bold",
              }}
            >
              ACCESS DASHBOARD
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <a href="/" style={{ color: "#888" }}>
            &larr; Back to App
          </a>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
