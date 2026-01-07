// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import { Table, Avatar, Button, Popconfirm, message, Tag, Select } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../utils/api";

const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State lokal untuk loading saat ganti role per user (biar gak nge-freeze semua)
  const [roleLoading, setRoleLoading] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      if (res.data.success) setUsers(res.data.data);
    } catch (error) {
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
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  // 👇 Fungsi Ganti Role
  const handleRoleChange = async (userId, newRole) => {
    // Set loading spesifik untuk user ini
    setRoleLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await api.put(`/admin/users/${userId}/role`, {
        role: newRole,
      });

      if (res.data.success) {
        message.success(`Role updated to ${newRole}`);

        // Update state lokal users agar UI berubah tanpa refresh API penuh
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error) {
      message.error("Failed to update role");
    } finally {
      setRoleLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar_url",
      key: "avatar",
      width: 80,
      render: (url) => <Avatar src={url} icon={<UserOutlined />} />,
    },
    {
      title: "Name/Username",
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: "bold" }}>{record.name || "-"}</div>
          <div style={{ color: "#888", fontSize: 12 }}>@{record.username}</div>
        </div>
      ),
    },
    {
      title: "Email / Phone",
      key: "contact",
      render: (_, record) => (
        <div>
          <div>{record.email || "-"}</div>
          <div style={{ color: "#888", fontSize: 12 }}>
            {record.phone_number}
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (role, record) => {
        // Jangan biarkan admin mengubah role dirinya sendiri di sini (untuk keamanan UX)
        // Atau biarkan saja, tapi hati-hati. Di sini saya disable jika itu akun admin utama (opsional)

        return (
          <Select
            defaultValue={role}
            style={{ width: 140 }}
            onChange={(value) => handleRoleChange(record.id, value)}
            loading={roleLoading[record.id]}
            disabled={roleLoading[record.id]} // Disable saat loading
          >
            <Option value="user">
              <Tag color="geekblue">USER</Tag>
            </Option>
            <Option value="contributor">
              <Tag color="green">CONTRIBUTOR</Tag>
            </Option>
            <Option value="admin">
              <Tag color="red">ADMIN</Tag>
            </Option>
          </Select>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) =>
        record.role !== "admin" && (
          <Popconfirm
            title="Delete user?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Manage Users</h2>
        <Button onClick={fetchUsers}>Refresh Data</Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ManageUsers;
