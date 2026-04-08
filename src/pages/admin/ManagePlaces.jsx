// src/pages/admin/ManagePlaces.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  message,
  Popconfirm,
  Image,
  Modal,
  Descriptions,
  Typography,
  Tooltip,
  Badge,
  ConfigProvider,
  Avatar,
} from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FireFilled,
  ClockCircleOutlined,
  GoogleOutlined,
  SafetyCertificateFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import api from "../../utils/api";

const { Text, Link, Title } = Typography;

// URL Backend
const BACKEND_URL = import.meta.env.VITE_API_URL;

// --- WARNA TEMA MODERN ---
const THEME = {
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassBorder: "1px solid rgba(255, 255, 255, 0.1)",
  textMain: "#ffffff",
  textSec: "rgba(255, 255, 255, 0.6)",
  gold: "#D4AF37",
  green: "#1B4D3E",
  danger: "#ff4d4f",
};

const ManagePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Detail
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- HELPER GAMBAR ---
  const getPhotoUrl = (path) => {
    if (!path) return "https://via.placeholder.com/100x100?text=No+Img";
    if (path.startsWith("http")) return path;
    let cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("public/"))
      cleanPath = cleanPath.replace("public/", "");
    else if (cleanPath.startsWith("/public/"))
      cleanPath = cleanPath.replace("/public/", "");
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
    return `${BACKEND_URL}${cleanPath}`;
  };

  // Helper Parse Opening Hours
  const renderOpeningHours = (hours) => {
    if (!hours) return <Text type="secondary">Not available</Text>;
    try {
      const schedule = typeof hours === "string" ? JSON.parse(hours) : hours;
      return (
        <div style={{ fontSize: 12 }}>
          {Object.entries(schedule).map(([day, time]) => (
            <div
              key={day}
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 140,
                marginBottom: 4,
              }}
            >
              <span style={{ textTransform: "capitalize", fontWeight: "bold" }}>
                {day}:
              </span>
              <span>{time}</span>
            </div>
          ))}
        </div>
      );
    } catch (e) {
      return <Text>Invalid Format</Text>;
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/places");
      if (res.data.success) {
        // Sortir: Yang belum verified (Hidden) ditaruh paling atas agar Admin notice
        const sorted = res.data.data.sort((a, b) => {
          if (a.is_verified === false && b.is_verified === true) return -1;
          if (a.is_verified === true && b.is_verified === false) return 1;
          return 0;
        });
        setPlaces(sorted);
      }
    } catch (error) {
      message.error("Failed to load places");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await api.put(`/admin/places/${id}/verify`);
      message.success("Place Verified & Published!");
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, halal_status: "Verified", is_verified: true }
            : p,
        ),
      );
    } catch (error) {
      message.error("Failed to verify");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/places/${id}`);
      message.success("Place deleted");
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      message.error("Failed to delete");
    }
  };

  const showDetail = (record) => {
    setSelectedPlace(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: <span style={{ color: THEME.textSec }}>Place Info</span>,
      key: "info",
      width: 280,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Avatar
              shape="square"
              size={50}
              src={getPhotoUrl(
                record.image_url || (record.photos && record.photos[0]),
              )}
              style={{ borderRadius: 10, border: `1px solid ${THEME.gold}` }}
            />
            {record.is_promo && (
              <div
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#ff4d4f",
                  color: "white",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                }}
              >
                <FireFilled />
              </div>
            )}
          </div>
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: 14,
                color: THEME.textMain,
              }}
            >
              {record.name_en}
            </div>
            <div
              style={{ fontSize: 12, color: THEME.textSec, marginBottom: 4 }}
            >
              {record.name_cn || "No Chinese Name"}
            </div>
            <Tag
              color="blue"
              style={{
                borderRadius: 10,
                fontSize: 10,
                border: "none",
                background: "rgba(24, 144, 255, 0.2)",
              }}
            >
              {record.category}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Status</span>,
      key: "status",
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          {/* Halal Status */}
          {record.halal_status === "Verified" ? (
            <Tag
              color="success"
              icon={<SafetyCertificateFilled />}
              style={{
                borderRadius: 20,
                border: "none",
                background: "rgba(82, 196, 26, 0.2)",
              }}
            >
              Verified Halal
            </Tag>
          ) : (
            <Tag
              color="warning"
              style={{
                borderRadius: 20,
                border: "none",
                background: "rgba(250, 173, 20, 0.2)",
              }}
            >
              {record.halal_status}
            </Tag>
          )}

          {/* Visibility Status */}
          {record.is_verified ? (
            <Badge
              status="processing"
              text={
                <span
                  style={{ color: "#52c41a", fontSize: 11, fontWeight: 600 }}
                >
                  LIVE (Visible)
                </span>
              }
            />
          ) : (
            <Badge
              status="error"
              text={
                <span
                  style={{ color: "#ff4d4f", fontSize: 11, fontWeight: 600 }}
                >
                  HIDDEN (Pending)
                </span>
              }
            />
          )}
        </Space>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Address</span>,
      dataIndex: "address",
      key: "address",
      width: 200,
      render: (text) => (
        <div style={{ color: THEME.textSec, fontSize: 12, lineHeight: 1.3 }}>
          <EnvironmentOutlined style={{ marginRight: 6, color: THEME.gold }} />
          {text && text.length > 40 ? text.substring(0, 40) + "..." : text}
        </div>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Contributor</span>,
      key: "contributor",
      render: (_, record) => (
        <div style={{ fontSize: 12, color: THEME.textMain }}>
          {record.contributor ? (
            record.contributor.name
          ) : (
            <span style={{ fontStyle: "italic", color: THEME.textSec }}>
              System Admin
            </span>
          )}
        </div>
      ),
    },
    {
      title: <span style={{ color: THEME.textSec }}>Action</span>,
      key: "action",
      width: 140,
      align: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => showDetail(record)}
              style={{ color: "white", background: "rgba(255,255,255,0.1)" }}
            />
          </Tooltip>

          {/* Tombol Verify hanya muncul jika belum verified */}
          {!record.is_verified && (
            <Tooltip title="Approve & Publish">
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleVerify(record.id)}
                style={{
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                  color: "#fff",
                }}
              />
            </Tooltip>
          )}

          <Popconfirm
            title={<span style={{ color: "red" }}>Delete Place?</span>}
            description="Are you sure?"
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
              size="small"
              icon={<DeleteOutlined />}
              style={{ background: "rgba(255, 77, 79, 0.1)" }}
            />
          </Popconfirm>
        </Space>
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
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div>
            <Title
              level={2}
              style={{ color: "white", margin: 0, fontWeight: 700 }}
            >
              Manage Places
            </Title>
            <Text style={{ color: THEME.textSec }}>
              Verify, edit, or remove places submitted by contributors.
            </Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPlaces}
            style={{
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50px",
              height: 40,
              padding: "0 24px",
              fontWeight: 500,
            }}
          >
            Refresh Data
          </Button>
        </div>

        {/* GLASS CARD CONTAINER */}
        <div
          style={{
            background: THEME.glassBg,
            backdropFilter: "blur(20px)",
            border: THEME.glassBorder,
            borderRadius: 24,
            overflow: "hidden",
            padding: "8px 0",
          }}
        >
          <Table
            columns={columns}
            dataSource={places}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 8, style: { marginRight: 24 } }}
            scroll={{ x: 900 }}
          />
        </div>

        {/* --- MODAL DETAIL TEMPAT --- */}
        <Modal
          title={
            <span style={{ fontSize: 18, fontWeight: "bold" }}>
              {selectedPlace?.name_en}
            </span>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            !selectedPlace?.is_verified && (
              <Button
                key="verify"
                type="primary"
                onClick={() => {
                  handleVerify(selectedPlace.id);
                  setIsModalOpen(false);
                }}
                style={{
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                  borderRadius: 20,
                }}
              >
                Verify & Publish
              </Button>
            ),
            <Button
              key="close"
              onClick={() => setIsModalOpen(false)}
              style={{ borderRadius: 20 }}
            >
              Close
            </Button>,
          ]}
          width={700}
          centered
        >
          {selectedPlace && (
            <Descriptions
              bordered
              column={1}
              size="small"
              labelStyle={{ width: 150, fontWeight: "bold" }}
            >
              <Descriptions.Item label="System Status">
                {selectedPlace.is_verified ? (
                  <Tag color="success">PUBLISHED</Tag>
                ) : (
                  <Tag color="error">UNVERIFIED (Hidden)</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Chinese Name">
                {selectedPlace.name_cn || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                <Tag color="blue">{selectedPlace.category}</Tag>
                {selectedPlace.food_type && (
                  <Tag color="geekblue">{selectedPlace.food_type}</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Halal Status">
                <Tag
                  color={
                    selectedPlace.halal_status === "Verified"
                      ? "green"
                      : "orange"
                  }
                >
                  {selectedPlace.halal_status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedPlace.address}
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.latitude},${selectedPlace.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1890ff", fontSize: 12 }}
                >
                  <GoogleOutlined /> View on Google Maps
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Promo Info">
                {selectedPlace.is_promo ? (
                  <Text type="danger">
                    <FireFilled /> {selectedPlace.promo_details}
                  </Text>
                ) : (
                  <Text type="secondary">No active promo</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Opening Hours">
                {renderOpeningHours(selectedPlace.opening_hours)}
              </Descriptions.Item>
              <Descriptions.Item label="Contributor">
                {selectedPlace.contributor?.name || "System Admin"}
              </Descriptions.Item>
              <Descriptions.Item label="Image Preview">
                <Image
                  src={getPhotoUrl(selectedPlace.image_url)}
                  height={200}
                  width="100%"
                  style={{ borderRadius: 8, objectFit: "cover" }}
                />
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ManagePlaces;
