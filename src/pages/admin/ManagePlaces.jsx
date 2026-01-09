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
} from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FireFilled,
  ClockCircleOutlined,
  GoogleOutlined,
  StopOutlined,
  SafetyCertificateFilled,
} from "@ant-design/icons";
import api from "../../utils/api";

const { Text, Link } = Typography;

// URL Backend
const BACKEND_URL = import.meta.env.VITE_API_URL;

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
                width: 120,
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
          // Jika a hidden dan b live, a duluan
          if (a.is_verified === false && b.is_verified === true) return -1;
          if (a.is_verified === true && b.is_verified === false) return 1;
          return 0; // Kalau sama, biarkan urutan created_at (dari backend)
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
      // Update state lokal: Ubah halal_status dan is_verified
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, halal_status: "Verified", is_verified: true }
            : p
        )
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

  // Fungsi Buka Modal Detail
  const showDetail = (record) => {
    setSelectedPlace(record);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Image",
      key: "image",
      width: 70,
      render: (_, record) => (
        <Image
          src={getPhotoUrl(
            record.image_url || (record.photos && record.photos[0])
          )}
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: 6 }}
          fallback="https://via.placeholder.com/60x60?text=Error"
        />
      ),
    },
    {
      title: "Place Name",
      key: "info",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: "bold", fontSize: 14 }}>
            {record.name_en}
            {record.is_promo && (
              <FireFilled
                style={{ color: "#ff4d4f", marginLeft: 6, fontSize: 12 }}
              />
            )}
          </div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
            {record.name_cn || "-"}
          </div>
          <Tag color="blue" style={{ fontSize: 10 }}>
            {record.category}
          </Tag>
        </div>
      ),
    },
    {
      title: "Halal Type",
      dataIndex: "halal_status",
      key: "halal_status",
      width: 130,
      render: (status) => {
        let color =
          status === "Verified"
            ? "green"
            : status === "Muslim Owned"
            ? "cyan"
            : "orange";
        // Tambahkan ikon agar lebih jelas
        let icon = status === "Verified" ? <SafetyCertificateFilled /> : null;
        return (
          <Tag icon={icon} color={color}>
            {status}
          </Tag>
        );
      },
    },
    // 👇 KOLOM BARU: VISIBILITY (Menentukan muncul di Frontend atau tidak)
    {
      title: "Visibility",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 100,
      render: (isVerified) =>
        isVerified ? (
          <Badge
            status="processing"
            text={
              <span style={{ color: "green", fontWeight: "bold" }}>LIVE</span>
            }
          />
        ) : (
          <Badge
            status="error"
            text={
              <span style={{ color: "red", fontWeight: "bold" }}>HIDDEN</span>
            }
          />
        ),
    },
    {
      title: "Contributor",
      key: "contributor",
      render: (_, record) => (
        <div style={{ fontSize: 12, color: "#555" }}>
          {record.contributor ? record.contributor.name : "System"}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => showDetail(record)}
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
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              />
            </Tooltip>
          )}

          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
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
        <h2>Manage Places</h2>
        <Button onClick={fetchPlaces}>Refresh Data</Button>
      </div>

      <Table
        columns={columns}
        dataSource={places}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* --- MODAL DETAIL TEMPAT --- */}
      <Modal
        title={selectedPlace?.name_en}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          // Jika di modal ingin ada tombol verify juga
          !selectedPlace?.is_verified && (
            <Button
              key="verify"
              type="primary"
              onClick={() => {
                handleVerify(selectedPlace.id);
                setIsModalOpen(false);
              }}
              style={{ backgroundColor: "#52c41a" }}
            >
              Verify & Publish
            </Button>
          ),
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedPlace && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="System Status">
              {selectedPlace.is_verified ? (
                <Tag color="success">PUBLISHED (User Can See)</Tag>
              ) : (
                <Tag color="error">UNVERIFIED (Hidden)</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Chinese Name">
              {selectedPlace.name_cn || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Category & Type">
              <Tag color="blue">{selectedPlace.category}</Tag>
              {selectedPlace.food_type && (
                <Tag color="geekblue">{selectedPlace.food_type}</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Halal Status">
              <Tag
                color={
                  selectedPlace.halal_status === "Verified" ? "green" : "orange"
                }
              >
                {selectedPlace.halal_status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              <EnvironmentOutlined /> {selectedPlace.address}
            </Descriptions.Item>
            <Descriptions.Item label="Coordinates">
              <Space>
                <Text copyable>
                  {selectedPlace.latitude}, {selectedPlace.longitude}
                </Text>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.latitude},${selectedPlace.longitude}`}
                  target="_blank"
                >
                  <GoogleOutlined /> Open in Maps
                </Link>
              </Space>
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
              <ClockCircleOutlined />
              <div style={{ marginTop: 8 }}>
                {renderOpeningHours(selectedPlace.opening_hours)}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Contributor">
              {selectedPlace.contributor?.name} (
              {selectedPlace.contributor?.username})
            </Descriptions.Item>
            <Descriptions.Item label="Main Image">
              <Image
                src={getPhotoUrl(selectedPlace.image_url)}
                height={200}
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ManagePlaces;
