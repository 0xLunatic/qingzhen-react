// src/pages/admin/ManageReviews.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Popconfirm,
  message,
  Typography,
  ConfigProvider,
  Rate,
} from "antd";

import {
  UserOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import api from "../../utils/api";

const { Title, Text } = Typography;

const THEME = {
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassBorder: "1px solid rgba(255, 255, 255, 0.1)",
  textMain: "#ffffff",
  textSec: "rgba(255, 255, 255, 0.6)",
  danger: "#ff4d4f",
};

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reviews");
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch {
      message.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/reviews/${id}`);
      message.success("Review deleted");
      fetchReviews();
    } catch {
      message.error("Failed to delete review");
    }
  };

  const columns = [
    {
      title: <span style={{ color: THEME.textSec }}>Reviewer</span>,
      key: "user",
      width: 260,
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar
            src={r.User?.avatar_url}
            icon={<UserOutlined />}
            size={42}
            style={{ border: "2px solid rgba(255,255,255,0.2)" }}
          />
          <div>
            <div style={{ color: "white", fontWeight: 600 }}>
              {r.reviewUser?.name || "Anonymous"}
            </div>
            <div style={{ color: THEME.textSec, fontSize: 12 }}>
              @{r.reviewUser?.username || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Place</span>,
      key: "place",
      render: (_, r) => (
        <div style={{ color: "white" }}>{r.reviewPlace?.name_en || "-"}</div>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Rating</span>,
      dataIndex: "rating",
      width: 180,
      render: (rating) => <Rate disabled value={rating} />,
    },
    {
      title: <span style={{ color: THEME.textSec }}>Comment</span>,
      dataIndex: "comment",
      render: (comment) => (
        <div style={{ color: "rgba(255,255,255,0.85)", maxWidth: 350 }}>
          {comment || "-"}
        </div>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Action</span>,
      key: "action",
      width: 80,
      align: "center",
      render: (_, r) => (
        <Popconfirm
          title={<span style={{ color: "red" }}>Delete this review?</span>}
          onConfirm={() => handleDelete(r.id)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
          cancelButtonProps={{
            style: { color: "#aaa" },
          }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            style={{ background: "rgba(255,77,79,0.15)", borderRadius: 10 }}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
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
          Pagination: {
            itemActiveBg: "transparent",
            colorText: "white",
          },
        },
      }}
    >
      <div style={{ paddingBottom: 32 }}>
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
              Review Management
            </Title>
            <Text style={{ color: THEME.textSec }}>
              Moderate user reviews for halal places
            </Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchReviews}
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
            dataSource={reviews}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              position: ["bottomRight"],
              style: { marginRight: 24 },
            }}
            scroll={{ x: 900 }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ManageReviews;
