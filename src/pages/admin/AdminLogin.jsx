// src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Alert, ConfigProvider, Row, Col, theme } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import api from "../../utils/api";

// PASTIKAN FILE INI ADA
import logoImg from "../../assets/logo.png"; 

const { Title, Text } = Typography;

// --- WARNA TEMA ---
const COLORS = {
  bgGradient: "linear-gradient(135deg, #021a12 0%, #0d382e 100%)",
  gold: "#E3B505",
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassBorder: "1px solid rgba(255, 255, 255, 0.1)",
  inputBg: "rgba(0, 0, 0, 0.2)",
  textWhite: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.5)",
};

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (values) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const payload = {
        identifier: values.email,
        password: values.password,
      };

      const response = await api.post("/auth/login", payload);

      if (response.data.success) {
        const { user, token } = response.data.data;

        if (user.role !== "admin") {
          setErrorMsg("Access Denied: You are not an Administrator.");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        message.success("Welcome back, Admin!");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.message;
      setErrorMsg(serverMsg || "Invalid credentials or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            transition: background-color 9999s ease-in-out 0s;
            -webkit-text-fill-color: white !important;
            caret-color: white !important;
        }
      `}</style>

      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: COLORS.gold,
            fontFamily: "'Inter', sans-serif",
            colorBgContainer: COLORS.inputBg,
            colorBorder: "rgba(255,255,255,0.1)",
            colorTextPlaceholder: "rgba(255,255,255,0.3)",
            colorText: "white",
          },
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            background: COLORS.bgGradient,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Dekorasi Background */}
          <div style={{
              position: 'absolute', top: -100, left: -100, width: 400, height: 400,
              background: COLORS.gold, filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%'
          }} />
          <div style={{
              position: 'absolute', bottom: -100, right: -100, width: 300, height: 300,
              background: '#10b981', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%'
          }} />

          {/* --- MAIN CARD --- */}
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              background: COLORS.glassBg,
              backdropFilter: "blur(20px)",
              border: COLORS.glassBorder,
              borderRadius: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            <Row>
              {/* --- LEFT SIDE (VISUAL) --- */}
              <Col xs={0} md={12} 
                  style={{ 
                      background: "rgba(0,0,0,0.2)", 
                      padding: "40px", 
                      display: "flex", 
                      flexDirection: "column", 
                      justifyContent: "center",
                      position: "relative"
                  }}
              >
                  <div style={{ position: "relative", zIndex: 2 }}>
                      {/* 👇 LOGO LANGSUNG (Tanpa Container Box Kuning) */}
                      <img 
                        src={logoImg} 
                        alt="Logo QingzhenMu" 
                        style={{ 
                            width: 100, // Ukuran logo disesuaikan
                            height: 'auto',
                            marginBottom: 24,
                            // Efek shadow glowing warna emas agar pop-out di background gelap
                            filter: `drop-shadow(0 0 15px ${COLORS.gold}60)` 
                        }} 
                      />

                      <Title level={1} style={{ color: "white", margin: 0, fontWeight: 800, fontSize: 36 }}>
                          QingzhenMu
                      </Title>
                      <Title level={3} style={{ color: COLORS.gold, margin: "0 0 16px 0", fontWeight: 400 }}>
                          Admin Portal
                      </Title>
                      <Text style={{ color: COLORS.textMuted, fontSize: 16, lineHeight: 1.6 }}>
                          Manage mosques, verify contributors, and monitor user activities in one unified dashboard.
                      </Text>
                  </div>
                  
                  <div style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      opacity: 0.3
                  }} />
              </Col>

              {/* --- RIGHT SIDE (FORM) --- */}
              <Col xs={24} md={12} style={{ padding: "40px 40px 60px" }}>
                  <div style={{ textAlign: "left", marginBottom: 32 }}>
                      {/* Logo Mobile */}
                      <div className="mobile-logo" style={{ display: 'none', marginBottom: 20 }}>
                           <img 
                             src={logoImg} 
                             alt="Logo" 
                             style={{ 
                                width: 60, 
                                height: 'auto', 
                                filter: `drop-shadow(0 0 10px ${COLORS.gold}40)` 
                             }} 
                           />
                      </div>
                      <Title level={2} style={{ margin: "0 0 8px", color: "white" }}>Sign In</Title>
                      <Text style={{ color: COLORS.textMuted }}>Welcome back! Please enter your details.</Text>
                  </div>

                  {errorMsg && (
                      <Alert
                          message={errorMsg}
                          type="error"
                          showIcon
                          style={{ marginBottom: 24, background: 'rgba(255, 77, 79, 0.1)', border: '1px solid #ff4d4f' }}
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
                          label={<span style={{ color: COLORS.textMuted }}>Email Address</span>}
                          rules={[
                              { required: true, message: "Please input your Email!" },
                              { type: "email", message: "Invalid email format" },
                          ]}
                      >
                          <Input 
                              prefix={<UserOutlined style={{ color: COLORS.textMuted }} />} 
                              placeholder="admin@qingzhenmu.com" 
                              style={{ 
                                borderRadius: 8, 
                                padding: "10px 12px", 
                                backgroundColor: COLORS.inputBg,
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}
                          />
                      </Form.Item>

                      <Form.Item
                          name="password"
                          label={<span style={{ color: COLORS.textMuted }}>Password</span>}
                          rules={[{ required: true, message: "Please input your Password!" }]}
                      >
                          <Input.Password 
                              prefix={<LockOutlined style={{ color: COLORS.textMuted }} />} 
                              placeholder="••••••••" 
                              style={{ 
                                borderRadius: 8, 
                                padding: "10px 12px",
                                backgroundColor: COLORS.inputBg,
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}
                          />
                      </Form.Item>

                      <Form.Item style={{ marginTop: 32 }}>
                          <Button
                              type="primary"
                              htmlType="submit"
                              block
                              loading={loading}
                              style={{
                                  backgroundColor: COLORS.gold,
                                  borderColor: COLORS.gold,
                                  color: "#021a12",
                                  fontWeight: "bold",
                                  height: 48,
                                  borderRadius: 8,
                                  fontSize: 16
                              }}
                          >
                              Sign In
                          </Button>
                      </Form.Item>
                  </Form>

                  <div style={{ textAlign: "center", marginTop: 16 }}>
                      <a href="/" style={{ color: COLORS.textMuted, textDecoration: 'none', fontSize: 14 }}>
                          ← Back to Application
                      </a>
                  </div>
              </Col>
            </Row>
          </div>
        </div>
        
        <style>{`
          @media (max-width: 768px) {
              .mobile-logo { display: block !important; }
          }
        `}</style>
      </ConfigProvider>
    </>
  );
};

export default AdminLogin;