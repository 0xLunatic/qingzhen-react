// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Popconfirm,
  message,
  Select,
  Typography,
  ConfigProvider,
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownOutlined,
  SafetyCertificateFilled,
} from "@ant-design/icons";
import api from "../../utils/api";

const { Title, Text } = Typography;
const { Option } = Select;

/* ================= THEME ================= */
const THEME = {
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassBorder: "1px solid rgba(255, 255, 255, 0.1)",
  textMain: "#ffffff",
  textSec: "rgba(255, 255, 255, 0.6)",
  gold: "#D4AF37",
  danger: "#ff4d4f",
  blue: "#1890ff",
  roleBg: {
    admin: "rgba(255, 77, 79, 0.15)",
    contributor: "rgba(212, 175, 55, 0.15)",
    user: "rgba(24, 144, 255, 0.15)",
  },
};

/* ================= ROLE BADGE ================= */
const RoleBadge = ({ role }) => {
  let color = THEME.blue;
  let bg = THEME.roleBg.user;
  let text = "USER";
  let icon = <UserOutlined />;

  if (role === "admin") {
    color = THEME.danger;
    bg = THEME.roleBg.admin;
    text = "ADMIN";
    icon = <SafetyCertificateFilled />;
  } else if (role === "contributor") {
    color = THEME.gold;
    bg = THEME.roleBg.contributor;
    text = "CONTRIBUTOR";
    icon = <UserOutlined />;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        background: bg,
        border: `1px solid ${color}`,
        color,
        padding: "4px 14px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: "bold",
        letterSpacing: "0.6px",
        boxShadow: `0 0 8px ${color}30`,
        whiteSpace: "nowrap",
      }}
    >
      {icon} {text}
    </div>
  );
};

/* ================= MAIN ================= */
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      if (res.data.success) setUsers(res.data.data);
    } catch {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      message.success("User deleted");
      fetchUsers();
    } catch {
      message.error("Failed to delete user");
    }
  };

  const handleRoleChange = async (userId, role) => {
    setRoleLoading((p) => ({ ...p, [userId]: true }));
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role });
      if (res.data.success) {
        message.success(`Role updated to ${role.toUpperCase()}`);
        setUsers((u) => u.map((x) => (x.id === userId ? { ...x, role } : x)));
      }
    } catch {
      message.error("Failed to update role");
    } finally {
      setRoleLoading((p) => ({ ...p, [userId]: false }));
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns = [
    {
      title: <span style={{ color: THEME.textSec }}>User Info</span>,
      key: "name",
      width: 260,
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar
            src={r.avatar_url}
            icon={<UserOutlined />}
            size={42}
            style={{
              border: `2px solid ${THEME.gold}`,
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <div>
            <div style={{ color: "white", fontWeight: 600 }}>
              {r.name || "Unnamed User"}
            </div>
            <div style={{ color: THEME.textSec, fontSize: 12 }}>
              @{r.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Contact</span>,
      key: "contact",
      render: (_, r) => (
        <>
          <div style={{ color: "rgba(255,255,255,0.9)" }}>{r.email}</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            {r.phone_number || "-"}
          </div>
        </>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Role Access</span>,
      dataIndex: "role",
      width: 180,
      render: (role, r) => (
        <Select
          value={role}
          style={{ width: 160 }}
          bordered={false}
          optionLabelProp="label"
          popupClassName="role-select-dropdown"
          suffixIcon={
            <DownOutlined
              style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}
            />
          }
          loading={roleLoading[r.id]}
          disabled={roleLoading[r.id]}
          onChange={(v) => handleRoleChange(r.id, v)}
        >
          <Option value="user" label={<RoleBadge role="user" />}>
            <RoleBadge role="user" />
          </Option>
          <Option value="contributor" label={<RoleBadge role="contributor" />}>
            <RoleBadge role="contributor" />
          </Option>
          <Option value="admin" label={<RoleBadge role="admin" />}>
            <RoleBadge role="admin" />
          </Option>
        </Select>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Action</span>,
      key: "action",
      width: 80,
      align: "center",
      render: (_, r) =>
        r.role !== "admin" && (
          <Popconfirm
            title={<span style={{ color: "red" }}>Delete this user?</span>}
            onConfirm={() => handleDelete(r.id)}
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              style={{
                background: "rgba(255,77,79,0.15)",
                borderRadius: 10,
              }}
            />
          </Popconfirm>
        ),
    },
  ];

  return (
    <>
      {/* ===== CSS OVERRIDE ===== */}
      <style>{`
        /* SELECT CONTAINER */
        .ant-select-selector {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          height: auto !important;
        }

        /* VALUE DI DALAM SELECT */
        .ant-select-selection-item {
          padding: 0 !important;
          display: flex;
          align-items: center;
        }

        /* HILANGKAN BACKGROUND SAAT FOCUS */
        .ant-select-focused .ant-select-selector {
          box-shadow: none !important;
        }

        /* --- DROPDOWN POPUP STYLE --- */
        .role-select-dropdown {
          background-color: #021a12 !important;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 6px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.6);
        }

        /* ITEM DI DALAM DROPDOWN */
        .role-select-dropdown .ant-select-item {
          padding: 6px 10px !important;
          background: transparent !important;
          border-radius: 12px;
        }

        /* HAPUS BACKGROUND BAWAAN ANT SAAT SELECTED / ACTIVE */
        .role-select-dropdown .ant-select-item-option-selected,
        .role-select-dropdown .ant-select-item-option-active {
          background: transparent !important;
        }
      `}</style>

      <ConfigProvider
        theme={{
          token: { colorText: "white", fontFamily: "'Inter', sans-serif" },
          components: {
            Table: {
              colorBgContainer: "transparent",
              colorTextHeading: "rgba(255,255,255,0.6)",
              borderColor: "rgba(255,255,255,0.05)",
              headerBg: "rgba(0,0,0,0.2)",
              rowHoverBg: "rgba(255,255,255,0.05)",
            },
            // Tambahan Pagination agar terlihat
            Pagination: {
              itemActiveBg: "transparent", // Background pagination aktif jadi transparan
              colorText: "white",
            },
          },
        }}
      >
        <div style={{ paddingBottom: 32 }}>
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 24,
              alignItems: "end",
            }}
          >
            <div>
              <Title
                level={2}
                style={{ color: "white", margin: 0, fontWeight: 700 }}
              >
                User Management
              </Title>
              <Text style={{ color: THEME.textSec }}>
                Control access and manage registered users
              </Text>
            </div>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchUsers}
              style={{
                background: "transparent",
                color: "white",
                borderRadius: 30,
                border: "1px solid rgba(255,255,255,0.25)",
                height: 40,
              }}
            >
              Refresh
            </Button>
          </div>

          {/* TABLE CONTAINER */}
          <div
            style={{
              background: THEME.glassBg,
              border: THEME.glassBorder,
              borderRadius: 24,
              backdropFilter: "blur(20px)",
              padding: "8px 0",
              overflow: "hidden",
            }}
          >
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                position: ["bottomRight"],
                style: { marginRight: 24 }, // Geser pagination biar gak mepet
              }}
              scroll={{ x: 800 }}
            />
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default ManageUsers;
