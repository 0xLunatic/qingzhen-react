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
  TranslationOutlined, // Icon Bahasa
} from "@ant-design/icons";
import "../App.css";
import logoImage from "../assets/logo.png";

// 👇 Import Kamus Bahasa
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function AuthenticationPage({ onNavigate }) {
  const [authMode, setAuthMode] = useState("login");
  const [loginMethod, setLoginMethod] = useState("password");
  const [loading, setLoading] = useState(false);

  // 👇 State Bahasa (Default Inggris)
  const [lang, setLang] = useState("en");

  // 👇 Helper Bahasa
  const TRANSLATIONS = { en, cn };
  const t = (key) => TRANSLATIONS[lang][key];

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "cn" : "en"));
    message.success(lang === "en" ? "切换到中文" : "Switched to English");
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="86">
      <Select style={{ width: 80 }}>
        <Option value="86">🇨🇳 +86</Option>
        <Option value="62">🇮🇩 +62</Option>
      </Select>
    </Form.Item>
  );

  const onFinishLogin = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (values.login_identifier) {
        message.success(
          `Welcome back! Logged in via ${values.login_identifier}`
        );
      } else if (values.phone) {
        message.success("Welcome back! Logged in via SMS Code");
      }
      onNavigate("landing");
    }, 1500);
  };

  const onFinishRegister = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Account created! Please login.");
      setAuthMode("login");
    }, 1500);
  };

  const SocialButtons = () => (
    <div className="social-login-gap">
      <Button
        icon={<WechatOutlined style={{ fontSize: 20, color: "#07C160" }} />}
        block
        size="large"
        style={{ color: "#07C160", borderColor: "#07C160" }}
      >
        WeChat
      </Button>
      <Button
        icon={<QqOutlined style={{ fontSize: 20, color: "#12B7F5" }} />}
        block
        size="large"
        style={{ color: "#12B7F5", borderColor: "#12B7F5" }}
      >
        QQ
      </Button>
      <Button
        icon={<AppleFilled style={{ fontSize: 20 }} />}
        block
        size="large"
        style={{ background: "black", color: "white", borderColor: "black" }}
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
              <Form.Item name="login_identifier" rules={[{ required: true }]}>
                <Input prefix={<UserOutlined />} placeholder={t("input_id")} />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true }]}>
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
              <Form.Item name="phone" rules={[{ required: true }]}>
                <Input
                  prefix={<MobileOutlined />}
                  addonBefore={prefixSelector}
                  placeholder={t("input_phone")}
                />
              </Form.Item>
              <div style={{ display: "flex", gap: 8 }}>
                <Form.Item
                  name="otp"
                  style={{ flex: 1 }}
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<SafetyOutlined />}
                    placeholder={t("input_code")}
                  />
                </Form.Item>
                <Button
                  size="large"
                  onClick={() => message.success("Code sent: 1234")}
                >
                  {t("btn_get_code")}
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
      ]}
    />
  );

  const renderRegisterForm = () => (
    <Form
      layout="vertical"
      onFinish={onFinishRegister}
      size="large"
      requiredMark={false}
      initialValues={{ prefix: "86" }}
    >
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input prefix={<UserOutlined />} placeholder={t("input_username")} />
      </Form.Item>
      <Form.Item name="email" rules={[{ type: "email" }, { required: true }]}>
        <Input prefix={<MailOutlined />} placeholder={t("input_email")} />
      </Form.Item>
      <Form.Item name="phone" rules={[{ required: true }]}>
        <Input
          prefix={<MobileOutlined />}
          addonBefore={prefixSelector}
          placeholder={t("input_phone")}
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
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
