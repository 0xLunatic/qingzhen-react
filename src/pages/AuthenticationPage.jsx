// src/pages/AuthenticationPage.jsx
import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  Checkbox,
  Divider,
  message,
  Tabs,
  Select,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  WechatOutlined,
  AppleFilled,
  ArrowLeftOutlined,
  SafetyOutlined,
  MailOutlined,
  QqOutlined,
  GlobalOutlined,
  TranslationOutlined,
  IdcardOutlined, // Icon untuk Nama Asli
} from "@ant-design/icons";
import "../App.css";
import logoImage from "../assets/logo.png";

// 👇 Import API Helper
import api from "../utils/api";

// 👇 Import Kamus Bahasa
import { en } from "../lang/en";
import { cn } from "../lang/cn";

// 👇 FIX: Tambahkan Paragraph di sini
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function AuthenticationPage({ onNavigate }) {
  const [authMode, setAuthMode] = useState("login");
  const [loginMethod, setLoginMethod] = useState("password");
  const [loading, setLoading] = useState(false);

  // 👇 State Bahasa
  const [lang, setLang] = useState("en");
  const TRANSLATIONS = { en, cn };
  const t = (key) => TRANSLATIONS[lang][key];

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "cn" : "en"));
    message.success(lang === "en" ? "切换到中文" : "Switched to English");
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 80 }}>
        <Option value="86">🇨🇳 +86</Option>
        <Option value="62">🇮🇩 +62</Option>
      </Select>
    </Form.Item>
  );

  // --- REAL LOGIN LOGIC ---
  const onFinishLogin = async (values) => {
    setLoading(true);
    try {
      let identifier = values.login_identifier;

      // Jika login pakai Tab SMS atau input phone
      if (loginMethod === "otp" || values.phone) {
        const prefix = values.prefix || "86";
        identifier = `+${prefix}${values.phone}`;
      }

      const response = await api.post("/auth/login", {
        identifier: identifier,
        password: values.password,
      });

      // Simpan Token & User
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      message.success("Welcome back!");
      onNavigate("landing");
    } catch (error) {
      console.error("Login Error:", error);
      const msg =
        error.response?.data?.message ||
        "Login failed. Check your credentials.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- REAL REGISTER LOGIC (UPDATED) ---
  const onFinishRegister = async (values) => {
    setLoading(true);
    try {
      // Format nomor HP (+86/+62)
      const prefix = values.prefix || "86";
      const formattedPhone = `+${prefix}${values.phone}`;

      console.log("Registering:", values);

      // Panggil API Backend (Sesuai update backend terbaru: ada field 'name')
      await api.post("/auth/register", {
        name: values.name, // 👈 Kirim nama asli (opsional di backend, tapi baik dikirim)
        username: values.username,
        email: values.email,
        phone_number: formattedPhone,
        password: values.password,
      });

      message.success("Account created successfully! Please login.");
      setAuthMode("login");
    } catch (error) {
      console.error("Register Error:", error);
      const msg =
        error.response?.data?.message || "Registration failed. Try again.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const SocialButtons = () => (
    <div className="social-login-gap">
      <Button
        icon={<WechatOutlined style={{ fontSize: 20, color: "#07C160" }} />}
        block
        size="large"
        style={{ color: "#07C160", borderColor: "#07C160" }}
        onClick={() => message.info("WeChat Login coming soon!")}
      >
        WeChat
      </Button>
      <Button
        icon={<QqOutlined style={{ fontSize: 20, color: "#12B7F5" }} />}
        block
        size="large"
        style={{ color: "#12B7F5", borderColor: "#12B7F5" }}
        onClick={() => message.info("QQ Login coming soon!")}
      >
        QQ
      </Button>
      <Button
        icon={<AppleFilled style={{ fontSize: 20 }} />}
        block
        size="large"
        style={{ background: "black", color: "white", borderColor: "black" }}
        onClick={() => message.info("Apple Login coming soon!")}
      >
        Apple
      </Button>
    </div>
  );

  const renderLoginForm = () => (
    <Tabs
      activeKey={loginMethod}
      onChange={setLoginMethod}
      centered
      items={[
        {
          key: "password",
          label: t("tab_password"),
          children: (
            <Form
              layout="vertical"
              onFinish={onFinishLogin}
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="login_identifier"
                rules={[
                  {
                    required: true,
                    message: "Please enter username/email/phone",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder={t("input_id")} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder={t("input_pass")}
                />
              </Form.Item>
              <div className="auth-actions-row">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>{t("chk_remember")}</Checkbox>
                </Form.Item>
                <Button
                  type="link"
                  style={{ padding: 0, color: "var(--accent-gold)" }}
                >
                  {t("link_forgot")}
                </Button>
              </div>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="btn-green"
                loading={loading}
              >
                {t("btn_signin")}
              </Button>
            </Form>
          ),
        },
        {
          key: "otp",
          label: t("tab_sms"),
          children: (
            <Form
              layout="vertical"
              onFinish={onFinishLogin}
              size="large"
              requiredMark={false}
              initialValues={{ prefix: "86" }}
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input
                  prefix={<MobileOutlined />}
                  addonBefore={prefixSelector}
                  placeholder={t("input_phone")}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password (SMS logic pending)"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="btn-green"
                loading={loading}
              >
                {t("btn_signin")}
              </Button>
            </Form>
          ),
        },
      ]}
    />
  );

  const renderRegisterForm = () => (
    <Form
      layout="vertical"
      onFinish={onFinishRegister}
      size="large"
      requiredMark={false}
      initialValues={{ prefix: "62" }} // Default ID (+62) agar user Indo mudah
    >
      {/* Field Nama Asli (Baru) */}
      <Form.Item
        name="name"
        rules={[
          { required: true, min: 2, message: "Name must be at least 2 chars" },
        ]}
      >
        <Input prefix={<IdcardOutlined />} placeholder="Full Name" />
      </Form.Item>

      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            min: 3,
            message: "Username must be at least 3 chars",
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder={t("input_username")} />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[{ type: "email", message: "Invalid email address" }]}
      >
        <Input prefix={<MailOutlined />} placeholder={t("input_email")} />
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[{ required: true, message: "Phone number is required" }]}
      >
        <Input
          prefix={<MobileOutlined />}
          addonBefore={prefixSelector}
          placeholder="81234567890" // Contoh tanpa 0
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, min: 8, message: "Password min 8 chars" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t("input_pass")}
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        block
        className="btn-green"
        loading={loading}
      >
        {t("btn_create")}
      </Button>
    </Form>
  );

  return (
    <div className="auth-page-wrapper">
      {/* LEFT SIDE */}
      <div className="auth-banner-side">
        <div className="auth-overlay">
          <div className="brand-logo white-logo">
            <div className="logo-icon-wrapper">
              <img src={logoImage} alt="Logo" className="logo-icon" />
            </div>
            <span>QingzhenMu</span>
          </div>
          <div className="auth-quote">
            <Title level={1} style={{ color: "white", marginBottom: 16 }}>
              {t("auth_welcome")}
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
              {t("auth_desc")}
            </Paragraph>
            <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
              <Tooltip title="Secure Login">
                <SafetyOutlined
                  style={{ fontSize: 24, color: "white", opacity: 0.8 }}
                />
              </Tooltip>
              <Tooltip title="Global Access">
                <GlobalOutlined
                  style={{ fontSize: 24, color: "white", opacity: 0.8 }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form-side">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => onNavigate("landing")}
          >
            {t("auth_back")}
          </Button>

          {/* TOMBOL BAHASA */}
          <Button
            type="text"
            icon={<TranslationOutlined />}
            onClick={toggleLanguage}
            style={{ fontWeight: "bold" }}
          >
            {lang === "en" ? "CN" : "EN"}
          </Button>
        </div>

        <div className="auth-form-container">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title
              level={2}
              style={{ color: "var(--primary-green)", margin: 0 }}
            >
              {authMode === "login"
                ? t("auth_login_title")
                : t("auth_join_title")}
            </Title>
            <Text type="secondary">
              {authMode === "login"
                ? t("auth_login_subtitle")
                : t("auth_join_subtitle")}
            </Text>
          </div>

          <div
            style={{
              marginBottom: 20,
              display: "flex",
              justifyContent: "center",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderBottom:
                  authMode === "login"
                    ? "2px solid var(--primary-green)"
                    : "none",
                fontWeight: authMode === "login" ? "bold" : "normal",
                color: authMode === "login" ? "var(--primary-green)" : "#666",
              }}
              onClick={() => setAuthMode("login")}
            >
              {t("btn_login")}
            </div>
            <div
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderBottom:
                  authMode === "register"
                    ? "2px solid var(--primary-green)"
                    : "none",
                fontWeight: authMode === "register" ? "bold" : "normal",
                color:
                  authMode === "register" ? "var(--primary-green)" : "#666",
              }}
              onClick={() => setAuthMode("register")}
            >
              {t("btn_register")}
            </div>
          </div>

          {authMode === "login" ? renderLoginForm() : renderRegisterForm()}

          <Divider plain>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t("divider_connect")}
            </Text>
          </Divider>
          <SocialButtons />

          <div
            style={{
              textAlign: "center",
              marginTop: 32,
              fontSize: 12,
              color: "#999",
            }}
          >
            <Text type="secondary">
              {authMode === "login" ? t("text_new") : t("text_have_acc")}
            </Text>
            <Button
              type="link"
              style={{
                padding: 0,
                fontWeight: "bold",
                color: "var(--primary-green)",
              }}
              onClick={() =>
                setAuthMode(authMode === "login" ? "register" : "login")
              }
            >
              {authMode === "login" ? t("link_signup") : t("link_login")}
            </Button>
            <br /> <br />
            {t("footer_agree")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationPage;
