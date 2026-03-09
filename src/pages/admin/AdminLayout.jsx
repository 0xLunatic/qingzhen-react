// src/pages/admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Badge,
  ConfigProvider,
  Tooltip,
  Grid,
  Drawer,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  BellFilled,
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

// --- STYLE CONSTANTS ---
const COLORS = {
  bgGradient: "linear-gradient(135deg, #021a12 0%, #0d382e 100%)",
  sidebarBg: "rgba(20, 40, 35, 0.85)", // Sedikit lebih gelap agar kontras di mobile
  gold: "#E3B505",
  blueHighlight: "linear-gradient(90deg, #E3B505 0%, #E3B505 100%)",
  textWhite: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.5)",
  glassBorder: "1px solid rgba(255, 255, 255, 0.1)",
  dangerBg: "rgba(255, 77, 79, 0.15)",
  dangerBorder: "1px solid rgba(255, 77, 79, 0.3)",
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint(); // Hook responsif AntD

  // Otomatis collapse saat layar kecil (Tablet/HP)
  useEffect(() => {
    if (!screens.lg) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [screens.lg]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const getMenuItemStyle = (key) => {
    const isActive = location.pathname === key;
    return {
      background: isActive ? COLORS.blueHighlight : "transparent",
      color: isActive ? "#052018" : "rgba(255,255,255,0.7)",
      borderRadius: "12px",
      marginBottom: "8px",
      fontWeight: isActive ? "700" : "500",
      transition: "all 0.3s",
    };
  };

  const menuItems = [
    { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/admin/users", icon: <UserOutlined />, label: "Manage Users" },
    { key: "/admin/places", icon: <ShopOutlined />, label: "Manage Places" },
    { key: "/admin/reviews", icon: <ShopOutlined />, label: "Manage Reviews" },
  ].map((item) => ({ ...item, style: getMenuItemStyle(item.key) }));

  // Konten Sidebar (Dipisah agar bisa dipakai di Sider & Drawer)
  const SidebarContent = () => (
    <>
      <div
        style={{
          height: 90,
          display: "flex",
          alignItems: "center",
          paddingLeft: collapsed && screens.lg ? 24 : 28,
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: COLORS.gold,
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 20px ${COLORS.gold}40`,
            flexShrink: 0,
          }}
        >
          <GlobalOutlined style={{ fontSize: 22, color: "#052018" }} />
        </div>
        {(!collapsed || !screens.lg) && (
          <span
            style={{
              color: COLORS.textWhite,
              fontWeight: "700",
              fontSize: 20,
              letterSpacing: 0.5,
            }}
          >
            QingzhenMu
          </span>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => {
          navigate(key);
          if (!screens.lg) setCollapsed(true); // Tutup menu saat klik di mobile
        }}
        items={menuItems}
        style={{ background: "transparent", border: "none", padding: "0 16px" }}
      />
    </>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.gold,
          fontFamily: "'Inter', sans-serif",
        },
        components: {
          Menu: {
            itemSelectedBg: "transparent",
            itemSelectedColor: "#052018",
            itemHoverBg: "rgba(255,255,255,0.1)",
            iconSize: 18,
          },
        },
      }}
    >
      <Layout
        style={{
          height: "100vh",
          background: COLORS.bgGradient,
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR: Hanya muncul di Desktop (lg ke atas) */}
        {screens.lg && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={260}
            style={{
              background: COLORS.sidebarBg,
              backdropFilter: "blur(15px)",
              borderRight: COLORS.glassBorder,
            }}
          >
            <SidebarContent />
          </Sider>
        )}

        {/* DRAWER: Sidebar versi Mobile/Tablet */}
        {!screens.lg && (
          <Drawer
            placement="left"
            onClose={() => setCollapsed(true)}
            open={!collapsed}
            styles={{
              body: {
                padding: 0,
                background: COLORS.sidebarBg,
                backdropFilter: "blur(20px)",
              },
            }}
            width={260}
            closeIcon={null}
          >
            <SidebarContent />
          </Drawer>
        )}

        {/* MAIN LAYOUT */}
        <Layout style={{ background: "transparent" }}>
          {/* HEADER */}
          <Header
            style={{
              padding: screens.xs ? "0 16px" : "0 32px", // Padding responsif
              background: "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 90,
              flexShrink: 0,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "20px",
                color: COLORS.textWhite,
                width: 40,
                height: 40,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: screens.xs ? 12 : 20,
              }}
            >
              {/* Notifikasi */}
              <Badge dot color={COLORS.gold} offset={[-6, 6]}>
                <Button
                  shape="circle"
                  type="text"
                  icon={
                    <BellFilled
                      style={{ color: COLORS.textWhite, fontSize: 20 }}
                    />
                  }
                />
              </Badge>

              <div
                style={{
                  height: 24,
                  width: 1,
                  background: "rgba(255,255,255,0.1)",
                }}
              ></div>

              {/* Profil Admin */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "6px 16px 6px 6px",
                  borderRadius: 30,
                  border: COLORS.glassBorder,
                }}
              >
                <Avatar
                  size="large"
                  style={{
                    backgroundColor: COLORS.gold,
                    color: "#052018",
                    fontWeight: "bold",
                  }}
                >
                  A
                </Avatar>
                {/* Sembunyikan nama di layar HP sangat kecil */}
                {screens.sm && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1.1,
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 13,
                      }}
                    >
                      Admin
                    </span>
                  </div>
                )}
              </div>

              <Tooltip title="Logout">
                <Button
                  shape="circle"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{
                    background: COLORS.dangerBg,
                    border: COLORS.dangerBorder,
                    color: "#ff4d4f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </Tooltip>
            </div>
          </Header>

          {/* CONTENT AREA */}
          <Content
            style={{
              margin: screens.xs ? "0 16px 16px" : "0 24px 24px", // Margin responsif
              paddingRight: 4,
              overflowY: "auto",
              overflowX: "hidden",
              borderRadius: 20,
            }}
            className="custom-scrollbar"
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;
