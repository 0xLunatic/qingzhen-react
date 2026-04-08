// src/pages/MosqueFinder.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Typography,
  Avatar,
  Rate,
  Modal,
  message,
  Grid,
  Divider,
  Dropdown,
  Space,
  Select,
  Form,
  Upload,
  Spin,
  Drawer,
  List,
  Empty,
  Tooltip,
  Radio,
  Tabs,
  FloatButton,
  Image,
  Badge,
} from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  StarFilled,
  AimOutlined,
  LoadingOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  CompassFilled,
  StopOutlined,
  CameraOutlined,
  ArrowRightOutlined,
  FilterOutlined,
  SafetyCertificateOutlined,
  BankOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  WifiOutlined,
  CarOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  ReadFilled,
  CheckOutlined,
  EyeFilled,
  ThunderboltFilled,
  DownOutlined,
  AppstoreOutlined,
  TranslationOutlined,
  UnorderedListOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  EnvironmentFilled,
  FileTextOutlined,
  PictureOutlined,
  WomanOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  FaWalking,
  FaBicycle,
  FaMotorcycle,
  FaCar,
  FaMosque,
} from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// 👇 IMPORT LIBRARY ADHAN
import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from "adhan";

import "../App.css";
import logoImage from "../assets/logo.png"; // Pastikan path logo benar
import api from "../utils/api";
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

// --- CONSTANTS ---
const THEME_COLOR = "#1B4D3E";
const ACCENT_COLOR = "#C6A87C";
const MECCA_COORDS = { lat: 21.4225, lng: 39.8262 };
const MAX_RADIUS_METERS = 5000;
const MAX_RESULTS = 30;

// 👇 SESUAIKAN PORT BACKEND
const BACKEND_URL = import.meta.env.VITE_API_URL;

const SPEEDS = { walk: 5, bike: 15, moto: 40, car: 30 };

// --- ASSETS & DATA MOSQUE ---
const MOSQUE_IMAGES = [
  "https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=600&q=60",
  "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&q=60",
  "https://images.unsplash.com/photo-1596401057633-565652b8ddbe?w=600&q=60",
  "https://images.unsplash.com/photo-1537242194686-259160a229ba?w=600&q=60",
];

const POSSIBLE_TAGS = [
  "Jumu'ah Available",
  "Women Area",
  "Wudu Facility",
  "Quran Class",
  "Parking",
  "Air Conditioned",
  "Ladies Section",
];

const CATEGORIES = [
  "Grand Mosque",
  "Musalla",
  "Islamic Center",
  "Prayer Room",
  "Historic",
];

// --- UTILS ---

// 👇 FUNGSI PENTING: MEMBERSIHKAN URL GAMBAR DARI DB
const getPhotoUrl = (path) => {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith("http")) return path;

  let cleanPath = path.replace(/\\/g, "/");

  if (cleanPath.startsWith("public/")) {
    cleanPath = cleanPath.replace("public/", "");
  } else if (cleanPath.startsWith("/public/")) {
    cleanPath = cleanPath.replace("/public/", "");
  }

  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }

  return `${BACKEND_URL}${cleanPath}`;
};

const DEFAULT_IMAGE = "";

const isValidCoordinate = (lat, lng) =>
  lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2))
    return 0;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getAddressFromTags = (tags) => {
  const street = tags["addr:street"] || tags["street"] || "";
  const number = tags["addr:housenumber"] || "";
  const city = tags["addr:city"] || "";
  return street ? `${number} ${street}, ${city}`.trim() : "Nearby location";
};

const calculateQiblaDirection = (userLat, userLng) => {
  const lat1 = (userLat * Math.PI) / 180;
  const lng1 = (userLng * Math.PI) / 180;
  const lat2 = (MECCA_COORDS.lat * Math.PI) / 180;
  const lng2 = (MECCA_COORDS.lng * Math.PI) / 180;
  const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

// 👇 ADHAN LOGIC UNTUK STATUS MASJID
const getFormattedTime = (date) => {
  if (!date) return "";
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
};

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const getMosqueStatus = (lat, lng, t) => {
  if (!isValidCoordinate(lat, lng)) {
    return {
      isOpen: true,
      text: t
        ? t("status_open_prayer") || "Open for Prayer"
        : "Open for Prayer",
      color: "#2e7d32",
    };
  }

  const coordinates = new Coordinates(lat, lng);
  const date = new Date();
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = params.madhab;

  let prayerTimes;
  try {
    prayerTimes = new PrayerTimes(coordinates, date, params);
  } catch (e) {
    return { isOpen: true, text: "Open", color: "#2e7d32" };
  }

  const currentPrayer = prayerTimes.currentPrayer();
  const nextPrayer = prayerTimes.nextPrayer();
  const nextPrayerTime = prayerTimes.timeForPrayer(nextPrayer);

  if (currentPrayer !== Prayer.None && currentPrayer !== Prayer.Sunrise) {
    return {
      isOpen: true,
      text: `Now: ${capitalize(currentPrayer)}`,
      color: "#2e7d32",
    };
  }

  if (currentPrayer === Prayer.None && nextPrayer === Prayer.Fajr) {
    const timeStr = nextPrayerTime ? getFormattedTime(nextPrayerTime) : "";
    return {
      isOpen: false,
      text: `Closed (Fajr ${timeStr})`,
      color: "#cf1322",
    };
  }

  if (nextPrayer !== Prayer.None && nextPrayerTime) {
    return {
      isOpen: true,
      text: `Next: ${capitalize(nextPrayer)} ${getFormattedTime(
        nextPrayerTime,
      )}`,
      color: "#d48806",
    };
  }

  return {
    isOpen: true,
    text: "Open for Prayer",
    color: "#2e7d32",
  };
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
};

// --- CUSTOM MARKER ICON (MOSQUE) ---
const createCustomIcon = (source, isActive) => {
  const color = source === "contributor" ? "#D4AF37" : "#1B4D3E";
  const zIndex = source === "contributor" ? 200 : 100;
  const scale = isActive ? 1.2 : 1;

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="transform: scale(${scale}); transition: all 0.3s;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          <path d="M22.5 12h-2.1c.3-1.6.6-3.2.6-5 0-3.3-2.7-6-6-6s-6 2.7-6 6c0 1.8.3 3.4.6 5H4.5c-1.4 0-2.5 1.1-2.5 2.5v7h20v-7c0-1.4-1.1-2.5-2.5-2.5zM12 4c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm-4 17v-4h8v4H8z"/>
          ${
            source === "contributor"
              ? '<circle cx="18" cy="6" r="3" fill="#FF5252" stroke="white" stroke-width="1"/>'
              : ""
          }
        </svg>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    zIndexOffset: isActive ? 1000 : zIndex,
  });
};

// --- DRAGGABLE MARKER FOR ADD PLACE ---
const LocationPickerMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={L.divIcon({
        className: "picker-marker",
        html: `<div style="font-size: 40px; color: #D32F2F; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); cursor: move;"><i class="anticon anticon-environment"><svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M512 64C324.3 64 172 216.3 172 404c0 148.8 126.7 334.8 322.2 446.9 10.8 6.2 24.8 6.2 35.6 0C725.3 738.8 852 552.8 852 404 852 216.3 699.7 64 512 64zm0 464c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128z"></path></svg></i></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      })}
    >
      <Popup>Hold & Drag to Pinpoint Location</Popup>
    </Marker>
  );
};

// --- ROUTING MACHINE ---
const RoutingMachine = ({ userLocation, destination, transportMode }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !userLocation || !destination) return;
    let osrmProfile = "driving";
    if (transportMode === "walk") osrmProfile = "foot";
    if (transportMode === "bike") osrmProfile = "bike";

    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (e) {}
      routingControlRef.current = null;
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1]),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: osrmProfile,
      }),
      lineOptions: {
        styles: [{ color: THEME_COLOR, weight: 6, opacity: 0.8 }],
        extendToWaypoints: false,
        missingRouteTolerance: 100,
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null,
    });

    try {
      routingControl.addTo(map);
      routingControlRef.current = routingControl;
    } catch (e) {}

    return () => {
      if (map && routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {}
        routingControlRef.current = null;
      }
    };
  }, [map, userLocation, destination, transportMode]);
  return null;
};

const AutoFitBounds = ({ places }) => {
  const map = useMap();
  const hasFitted = useRef(false);
  useEffect(() => {
    if (places.length > 0 && !hasFitted.current) {
      const validPlaces = places.filter((p) => isValidCoordinate(p.lat, p.lng));
      if (validPlaces.length > 0) {
        const bounds = L.latLngBounds(validPlaces.map((p) => [p.lat, p.lng]));
        if (bounds.isValid()) {
          map.flyToBounds(bounds, {
            padding: [100, 100],
            maxZoom: 15,
            duration: 1.5,
          });
          hasFitted.current = true;
        }
      }
    }
  }, [places, map]);
  useEffect(() => {
    hasFitted.current = false;
  }, [places.length]);
  return null;
};

const MapEvents = ({ onMoveEnd }) => {
  useMapEvents({ moveend: (e) => onMoveEnd(e.target.getCenter()) });
  return null;
};

// --- SIDEBAR CARD ---
const SidebarCard = ({ data, active, onClick, isVisited, t }) => {
  const status = getMosqueStatus(data.lat, data.lng, t);
  return (
    <div
      className={`sidebar-card ${active ? "active" : ""}`}
      onClick={() => onClick(data)}
      style={{
        borderLeft:
          data.source === "contributor"
            ? "4px solid #D4AF37"
            : "4px solid transparent",
      }}
    >
      {data.tags.includes("Jumu'ah Available") && (
        <div className="promo-ribbon" style={{ background: "#1B4D3E" }}>
          JUMUAH
        </div>
      )}
      {isVisited && (
        <Tooltip title="Visited">
          <div className="visited-badge">
            <CheckOutlined />
          </div>
        </Tooltip>
      )}
      <img
        src={data.img}
        alt=""
        className="card-bg-faded"
        onError={(e) => (e.target.src = DEFAULT_IMAGE)}
      />
      <div className="card-content-wrapper">
        <div className="card-title">
          {data.fullName}
          {data.source === "contributor" && (
            <Tooltip title="Community Verified">
              <SafetyCertificateOutlined
                style={{ color: "#D4AF37", marginLeft: 6 }}
              />
            </Tooltip>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <StarFilled style={{ color: "#F4C150", fontSize: 13 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>
            {data.rating}
          </span>
          <span style={{ fontSize: 12, color: "#999" }}>({data.reviews})</span>
          <span style={{ margin: "0 4px", color: "#ccc" }}>•</span>
          <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>
            {data.distanceFormatted}
          </span>
        </div>
        <span className="card-meta">
          <FaMosque style={{ marginRight: 4, color: THEME_COLOR }} />{" "}
          {data.type}
        </span>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: status.color,
            marginBottom: 6,
          }}
        >
          <ClockCircleOutlined /> {status.text}
        </div>
        <div className="card-pills-row">
          {data.categoryTag && (
            <span
              className="card-pill"
              style={{
                borderColor: "#b7eb8f",
                color: "#389e0d",
                background: "#f6ffed",
              }}
            >
              <BankOutlined /> {data.categoryTag}
            </span>
          )}
          {(data.tags.includes("Women Area") ||
            data.tags.includes("Ladies Section")) && (
            <span className="card-pill">
              <WomanOutlined /> Women Area
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
function MosqueFinder({ onNavigate }) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const [lang, setLang] = useState("en");
  const TRANSLATIONS = { en, cn };
  const t = (key) => TRANSLATIONS[lang]?.[key] || key;
  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "cn" : "en"));
    message.success(lang === "en" ? "切换到中文" : "Switched to English");
  };

  // Data States
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [placeReviews, setPlaceReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userVisits, setUserVisits] = useState({});

  // UI States
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [mobileListVisible, setMobileListVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- STATE UNTUK CONTRIBUTION (ADD PLACE) ---
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [newPlaceLocation, setNewPlaceLocation] = useState(null);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isSubmittingPlace, setIsSubmittingPlace] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // --- STATE UNTUK EDIT PLACE (NEW) ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm] = Form.useForm();
  const [editFileList, setEditFileList] = useState([]);

  // 👇 STATE FILE UPLOAD
  const [fileList, setFileList] = useState([]);
  const [reviewFileList, setReviewFileList] = useState([]);

  // Navigation States
  const [isNavigating, setIsNavigating] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [transportMode, setTransportMode] = useState("car");
  const [routeInfo, setRouteInfo] = useState({
    totalDistance: 0,
    totalTime: 0,
  });

  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("nearest");
  const [userLocation, setUserLocation] = useState([39.9042, 116.4074]);
  const [mapCenter, setMapCenter] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(0);

  const [form] = Form.useForm();
  const [contributeForm] = Form.useForm();

  // 👇 STATE USER
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.success("Logged out");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => message.info("Profile Page"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Helper untuk konten menu mobile (Drawer)
  const renderMobileMenu = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        onClick={() => {
          onNavigate("finder");
          setIsMobileMenuOpen(false);
        }}
      >
        {t("nav_finder")}
      </Button>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        className="text-green"
        onClick={() => {
          onNavigate("mosque");
          setIsMobileMenuOpen(false);
        }}
      >
        {t("nav_mosque")}
      </Button>
      <Button
        type="link"
        block
        style={{ textAlign: "left" }}
        onClick={() => {
          onNavigate("prayer");
          setIsMobileMenuOpen(false);
        }}
      >
        {t("nav_prayer")}
      </Button>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        onClick={() => onNavigate("community-page")}
      >
        {t("nav_community")}
      </Button>
      <Button
        type="text"
        block
        style={{ textAlign: "left" }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {t("nav_blog")}
      </Button>

      <Divider style={{ margin: "8px 0" }} />

      {user ? (
        <div style={{ padding: "0 8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Avatar src={user.avatar_url} icon={<UserOutlined />} />
            <Text strong>{user.name || user.username}</Text>
          </div>
          <Button
            block
            icon={<UserOutlined />}
            onClick={() => message.info("Profile")}
            style={{ marginBottom: 8 }}
          >
            My Profile
          </Button>
          <Button block icon={<LogoutOutlined />} danger onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      ) : (
        <Button type="primary" block onClick={() => onNavigate("auth")}>
          {t("nav_signin")}
        </Button>
      )}

      <Button
        block
        onClick={() => {
          toggleLanguage();
          setIsMobileMenuOpen(false);
        }}
        icon={<TranslationOutlined />}
      >
        {lang === "en" ? "CN" : "EN"}
      </Button>

      <Button
        block
        shape="round"
        className="btn-gold"
        onClick={() => {
          setIsMobileMenuOpen(false);
          message.info("Download app modal");
        }}
      >
        {t("nav_download")}
      </Button>
    </div>
  );

  const mosqueTypeItems = CATEGORIES.map((cat) => ({
    key: cat,
    label: cat,
    onClick: () => setActiveFilter(cat),
  }));

  // --- LOCAL ROUTE CALCULATION ---
  const calculateRouteData = (mode, start, end) => {
    if (!start || !end) return;
    const distKm = calculateDistance(start[0], start[1], end[0], end[1]);
    const speed = SPEEDS[mode] || SPEEDS.car;
    const timeHours = distKm / speed;
    const timeSeconds = timeHours * 3600;
    const realDistMeters = distKm * 1000 * 1.3;
    const realTimeSeconds = timeSeconds * 1.3;
    setRouteInfo({ totalDistance: realDistMeters, totalTime: realTimeSeconds });
  };

  useEffect(() => {
    if (selectedPlace && userLocation) {
      calculateRouteData(transportMode, userLocation, [
        selectedPlace.lat,
        selectedPlace.lng,
      ]);
    }
  }, [selectedPlace, transportMode, userLocation]);

  const handleTransportChange = (e) => {
    setTransportMode(e.target.value);
  };

  // ==========================================
  // 👇 API FETCH LOGIC (UPDATED WITH IMAGE & COORDS)
  // ==========================================
  const fetchPlaces = async (lat, lng, retryCount = 0) => {
    setIsLoading(true);
    try {
      const dbPromise = api.get("/places");
      // Query Overpass khusus untuk Masjid
      const query = `[out:json][timeout:15];(node["amenity"="place_of_worship"]["religion"="muslim"](around:${MAX_RADIUS_METERS}, ${lat}, ${lng}););out ${MAX_RESULTS};`;
      const osmPromise = fetch(
        "https://overpass.kumi.systems/api/interpreter",
        { method: "POST", body: query },
      );
      const [dbRes, osmRes] = await Promise.allSettled([dbPromise, osmPromise]);

      let combined = [];

      // --- 1. PROSES DB PLACES ---
      if (dbRes.status === "fulfilled" && dbRes.value.data.success) {
        const dbPlaces = dbRes.value.data.data
          .filter((p) => p.category === "Mosque") // Filter hanya masjid dari DB
          .map((p) => {
            let tags = ["Verified"];
            if (
              p.promo_details &&
              p.promo_details.toLowerCase().includes("jumuah")
            )
              tags.push("Jumu'ah Available");

            // Logic Prioritas Gambar
            let placeImage =
              MOSQUE_IMAGES[Math.floor(Math.random() * MOSQUE_IMAGES.length)];

            if (p.image_url) {
              placeImage = getPhotoUrl(p.image_url);
            } else if (p.photos) {
              let parsedPhotos = p.photos;
              if (typeof p.photos === "string") {
                try {
                  parsedPhotos = JSON.parse(p.photos);
                } catch (e) {}
              }
              if (Array.isArray(parsedPhotos) && parsedPhotos.length > 0) {
                placeImage = getPhotoUrl(parsedPhotos[0]);
              }
            }

            // Ambil Rating Asli
            const avgRating = p.avgRating
              ? parseFloat(p.avgRating).toFixed(1)
              : "New";
            const reviewCount = p.reviewCount ? parseInt(p.reviewCount) : 0;

            return {
              id: `db-${p.id}`,
              originalId: p.id,
              contributor_id: p.contributor_id,
              fullName: p.name_en,
              name_cn: p.name_cn,
              lat: parseFloat(p.latitude),
              lng: parseFloat(p.longitude),
              type: "Mosque",
              rating: avgRating,
              reviews: reviewCount,
              img: placeImage,
              source: "contributor",
              tags: tags,
              categoryTag: "Grand Mosque",
              isPromo: p.is_promo,
              promoText: p.promo_details, // Info fasilitas
              address: p.address,
            };
          });
        combined = [...combined, ...dbPlaces];
      }

      // --- 2. PROSES OSM PLACES ---
      if (osmRes.status === "fulfilled" && osmRes.value.ok) {
        const osmData = await osmRes.value.json();
        const osmPlaces = osmData.elements.map((item, i) => {
          let tags = ["Jumu'ah Available"];
          const pool = POSSIBLE_TAGS.sort(() => 0.5 - Math.random());
          tags.push(...pool.slice(0, 3));

          return {
            id: `osm-${item.id}`,
            originalId: item.id,
            fullName: item.tags["name:en"] || item.tags.name || "Masjid Nearby",
            name_cn: item.tags.name,
            lat: item.lat,
            lng: item.lon,
            type: "Mosque",
            rating: (4.0 + Math.random()).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 10,
            img: MOSQUE_IMAGES[i % MOSQUE_IMAGES.length],
            tags: [...new Set(tags)],
            categoryTag:
              CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            address: getAddressFromTags(item.tags),
            source: "osm",
          };
        });
        combined = [...combined, ...osmPlaces];
      }
      const finalData = recalculateDistances(combined, lat, lng);
      setAllPlaces(finalData);
    } catch (err) {
      console.error("Hybrid Fetch Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FETCH REVIEWS ---
  const fetchReviews = async (placeId) => {
    if (!placeId) return;
    const placeIdStr = placeId.toString();

    // Skip if it's strictly OSM unless handled by hybrid logic
    if (placeIdStr.startsWith("osm-")) {
      setPlaceReviews([]);
      return;
    }
    const realId = placeIdStr.replace("db-", "");

    try {
      const response = await api.get(`/reviews/${realId}`);
      if (response.data.success) {
        const mappedReviews = response.data.data.map((r) => {
          let reviewPhotos = [];
          if (r.photos) {
            try {
              reviewPhotos =
                typeof r.photos === "string" ? JSON.parse(r.photos) : r.photos;
            } catch (e) {}
          }
          if (!Array.isArray(reviewPhotos)) reviewPhotos = [];

          return {
            user: r.user ? r.user.name || r.user.username : "Anonymous",
            avatar: r.user?.avatar_url ? getPhotoUrl(r.user.avatar_url) : null,
            rating: r.rating,
            text: r.comment,
            date: new Date(r.created_at).toLocaleDateString(),
            photos: reviewPhotos.map((p) => getPhotoUrl(p)),
          };
        });
        setPlaceReviews(mappedReviews);
      }
    } catch (error) {
      setPlaceReviews([]);
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      fetchReviews(selectedPlace.id);
    } else {
      setPlaceReviews([]);
    }
  }, [selectedPlace]);

  const recalculateDistances = (places, centerLat, centerLng) => {
    if (!isValidCoordinate(centerLat, centerLng)) return places;
    return places.map((p) => {
      const dist = calculateDistance(centerLat, centerLng, p.lat, p.lng);
      return {
        ...p,
        rawDistance: dist,
        distanceFormatted:
          dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`,
      };
    });
  };

  // --- CONTRIBUTION HANDLERS ---
  const startAddPlace = () => {
    if (!user) {
      message.warning("Please sign in to contribute.");
      return onNavigate("auth");
    }
    setIsPickingLocation(true);
    setNewPlaceLocation(mapCenter);
    setDrawerVisible(false);
    message.info("Drag the red pin to the exact location!");
  };

  const confirmLocation = () => {
    setIsPickingLocation(false);
    setIsContributeModalOpen(true);
  };

  const cancelAddPlace = () => {
    setIsPickingLocation(false);
    setNewPlaceLocation(null);
  };

  const handleSubmitPlace = async (values) => {
    setIsSubmittingPlace(true);
    try {
      const formData = new FormData();
      formData.append("name_en", values.name_en);
      if (values.name_cn) formData.append("name_cn", values.name_cn);

      // Force category Mosque & Verified
      formData.append("category", "Mosque");
      formData.append("halal_status", "Verified");

      formData.append("address", values.address);
      if (values.promo_details)
        formData.append("promo_details", values.promo_details);

      formData.append("latitude", newPlaceLocation.lat);
      formData.append("longitude", newPlaceLocation.lng);

      if (fileList && fileList.length > 0) {
        fileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append("photos", file.originFileObj);
          }
        });
      }

      await api.post("/places/contribute", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Thank you! Mosque submitted.");
      setIsContributeModalOpen(false);
      contributeForm.resetFields();
      setFileList([]);
      setNewPlaceLocation(null);
      fetchPlaces(mapCenter.lat, mapCenter.lng);
    } catch (error) {
      message.error("Failed to submit.");
    } finally {
      setIsSubmittingPlace(false);
    }
  };

  // --- EDIT HANDLER (Contributor/Admin) ---
  const handleOpenEdit = () => {
    if (!selectedPlace) return;
    editForm.setFieldsValue({
      name_en: selectedPlace.fullName,
      name_cn: selectedPlace.name_cn,
      category: "Mosque",
      halal_status: "Verified",
      address: selectedPlace.address,
      promo_details: selectedPlace.promoText,
    });
    setEditFileList([]);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (values) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name_en", values.name_en);
      if (values.name_cn) formData.append("name_cn", values.name_cn);
      formData.append("category", "Mosque");
      formData.append("halal_status", "Verified");
      formData.append("address", values.address);
      if (values.promo_details)
        formData.append("promo_details", values.promo_details);

      if (editFileList && editFileList.length > 0) {
        editFileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append("photos", file.originFileObj);
          }
        });
      }

      if (!selectedPlace.id.toString().startsWith("db-")) {
        message.error("Cannot edit OSM data directly.");
        return;
      }

      const placeId = selectedPlace.originalId;
      const endpoint =
        user.role === "admin"
          ? `/admin/places/${placeId}`
          : `/places/${placeId}`;

      await api.put(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Mosque info updated!");
      setIsEditModalOpen(false);
      fetchPlaces(mapCenter.lat, mapCenter.lng);

      setSelectedPlace((prev) => ({
        ...prev,
        fullName: values.name_en,
        name_cn: values.name_cn,
        address: values.address,
        promoText: values.promo_details,
      }));
    } catch (error) {
      message.error(
        "Update failed: " + (error.response?.data?.message || "Error"),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // --- REVIEW HANDLER (Hybrid Support) ---
  const handleReviewSubmit = async (values) => {
    if (!user) {
      message.warning("Please login to review");
      return onNavigate("auth");
    }

    setIsSubmittingReview(true);
    try {
      const formData = new FormData();

      // LOGIC HYBRID OSM/DB
      if (selectedPlace.source === "osm") {
        formData.append("is_osm", "true");
        formData.append("osm_id", selectedPlace.originalId);
        formData.append("name", selectedPlace.fullName);
        formData.append("lat", selectedPlace.lat);
        formData.append("lng", selectedPlace.lng);
        formData.append("address", selectedPlace.address);
        formData.append("category", "Mosque");
      } else {
        formData.append("is_osm", "false");
        formData.append("place_id", selectedPlace.originalId);
      }

      formData.append("rating", values.rating);
      formData.append("comment", values.review);

      if (reviewFileList && reviewFileList.length > 0) {
        reviewFileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append("photos", file.originFileObj);
          }
        });
      }

      await api.post("/reviews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Review posted successfully!");
      setReviewModalVisible(false);
      form.resetFields();
      setReviewFileList([]);

      // Refresh Data
      fetchReviews(selectedPlace.id);
      fetchPlaces(mapCenter.lat, mapCenter.lng);
    } catch (error) {
      message.error("Failed to post review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // --- EVENT HANDLERS ---
  const handleToggleVisited = async (id) => {
    if (!user) return onNavigate("auth");
    const statusType = "Visited";
    const oldStatus = userVisits[id];
    const newVisits = { ...userVisits };

    if (oldStatus === statusType) delete newVisits[id];
    else newVisits[id] = statusType;

    setUserVisits(newVisits);

    try {
      const placeDataSnapshot = selectedPlace
        ? {
            name: selectedPlace.fullName,
            address: selectedPlace.address,
            lat: selectedPlace.lat,
            lng: selectedPlace.lng,
            rating: selectedPlace.rating,
            img: selectedPlace.img,
          }
        : {};

      // Gunakan originalId jika source db, jika osm kirim ID string
      const placeIdToSend =
        selectedPlace.source === "osm"
          ? `osm-${selectedPlace.originalId}`
          : selectedPlace.originalId;

      await api.post("/user/visits", {
        place_id: String(placeIdToSend),
        status: statusType,
        place_data: placeDataSnapshot,
      });
      message.success(oldStatus === statusType ? "Removed" : "Marked Visited");
    } catch (e) {
      setUserVisits(userVisits); // Rollback
    }
  };

  const handleStartNavigation = () => {
    if (!selectedPlace) return;
    setDestinationCoords([selectedPlace.lat, selectedPlace.lng]);
    setIsNavigating(true);
    setDrawerVisible(false);
    setMobileListVisible(false);
    message.loading("Calculating route...", 1.0);
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setDestinationCoords(null);
    message.info("Navigation ended");
  };

  const handleGetDirections = () => {
    if (!selectedPlace) return;
    window.location.href = `geo:${selectedPlace.lat},${selectedPlace.lng}?q=${selectedPlace.lat},${selectedPlace.lng}(${selectedPlace.fullName})`;
  };

  // --- EFFECTS ---
  useEffect(() => {
    let result = [...allPlaces];
    if (activeFilter !== "All") {
      if (CATEGORIES.includes(activeFilter))
        result = result.filter((p) => p.categoryTag === activeFilter);
      else result = result.filter((p) => p.tags.includes(activeFilter));
    }
    if (sortBy === "nearest")
      result.sort((a, b) => a.rawDistance - b.rawDistance);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    setFilteredPlaces(result);
  }, [allPlaces, activeFilter, sortBy]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchText && mapCenter) fetchPlaces(mapCenter.lat, mapCenter.lng);
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  useEffect(() => {
    if (userLocation)
      setQiblaDirection(
        calculateQiblaDirection(userLocation[0], userLocation[1]),
      );
  }, [userLocation]);

  // --- GPS & LOCATION LOGIC ---
  const fallbackToIpLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        setUserLocation([lat, lng]);
        setMapCenter({ lat, lng });
        fetchPlaces(lat, lng);
        message.warning("GPS failed. Using approximate location.");
      }
    } catch (error) {
      message.error("Could not determine location.");
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      fallbackToIpLocation();
      return;
    }
    message.loading("Locating...", 1);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter({ lat: latitude, lng: longitude });
        fetchPlaces(latitude, longitude);
        message.success("Location found!");
      },
      (err) => {
        fallbackToIpLocation();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

  const handleMapMoveEnd = (center) => setMapCenter(center);
  const handleSearchArea = () => {
    if (mapCenter) fetchPlaces(mapCenter.lat, mapCenter.lng);
  };
  const safeFilteredPlaces = filteredPlaces.filter((p) =>
    isValidCoordinate(p.lat, p.lng),
  );
  const safeUserLocation = isValidCoordinate(
    userLocation?.[0],
    userLocation?.[1],
  )
    ? userLocation
    : [39.9042, 116.4074];

  // --- RENDER CONTENT HELPER ---
  const renderListContent = () => (
    <>
      <div className="sidebar-header">
        <Input
          id="sidebar-search"
          placeholder="Search mosques..."
          className="sidebar-search-input"
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          onChange={(e) => setSearchText(e.target.value)}
          variant="borderless"
        />
        <div className="sidebar-tabs">
          <div
            className={`tab-item ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            <BankOutlined /> {t("pill_all")}
          </div>
          <Dropdown menu={{ items: mosqueTypeItems }} trigger={["click"]}>
            <div
              className={`tab-item ${
                CATEGORIES.includes(activeFilter) ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
            >
              <AppstoreOutlined /> Type{" "}
              <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
            </div>
          </Dropdown>
          <div
            className={`tab-item ${
              activeFilter === "Jumu'ah Available" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Jumu'ah Available")}
          >
            <TeamOutlined /> Jumu'ah
          </div>
          <div
            className={`tab-item ${
              activeFilter === "Women Area" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Women Area")}
          >
            <WomanOutlined /> Women
          </div>
        </div>
      </div>
      <div className="list-scroll-area">
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: THEME_COLOR }}
                  spin
                />
              }
            />
          </div>
        ) : safeFilteredPlaces.length > 0 ? (
          <>
            <div className="list-section-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaMosque style={{ fontSize: 18, color: THEME_COLOR }} />
                <span>Mosques Nearby</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                {safeFilteredPlaces.length} found
              </span>
            </div>
            {safeFilteredPlaces.map((place) => (
              <SidebarCard
                key={place.id}
                data={place}
                active={selectedPlace?.id === place.id}
                isVisited={userVisits[place.id]}
                t={t}
                onClick={() => {
                  setSelectedPlace(place);
                  setDrawerVisible(true);
                  if (isMobile) setMobileListVisible(false);
                }}
              />
            ))}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No mosques found nearby"
          />
        )}
      </div>
    </>
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* NAVBAR */}
      <header className="navbar-container" style={{ padding: "0 20px" }}>
        <div
          className="container navbar"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
          }}
        >
          <div
            className="brand-logo"
            onClick={() => onNavigate("landing")}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div className="logo-icon-wrapper">
              <img
                src={logoImage}
                alt="Logo Brand"
                className="logo-icon"
                style={{ width: "32px" }}
              />
            </div>
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              QingzhenMu
            </span>
          </div>

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <div
            className="nav-links desktop-only"
            style={{ display: isMobile ? "none" : "flex", gap: "20px" }}
          >
            <Button type="link" onClick={() => onNavigate("finder")}>
              {t("nav_finder")}
            </Button>
            <Button
              type="link"
              className="active text-green"
              onClick={() => {
                onNavigate("mosque");
                setIsMobileMenuOpen(false);
              }}
            >
              {t("nav_mosque")}
            </Button>
            <Button type="link" onClick={() => onNavigate("prayer")}>
              {t("nav_prayer")}
            </Button>
            <Button type="link" onClick={() => onNavigate("community-page")}>
              {t("nav_community")}
            </Button>
            <Button type="link" onClick={() => onNavigate("blog")}>
              {t("nav_blog")}
            </Button>
          </div>

          <div
            className="nav-actions"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            {!isMobile && (
              <Button
                type="text"
                icon={<TranslationOutlined />}
                onClick={toggleLanguage}
                style={{ fontWeight: "bold", marginRight: 8 }}
              >
                {lang === "en" ? "CN" : "EN"}
              </Button>
            )}

            <div
              className="hide-mobile"
              style={{ display: isMobile ? "none" : "block" }}
            >
              {user ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    style={{ height: "auto", padding: "4px 8px" }}
                  >
                    <Space>
                      <Avatar
                        src={user.avatar_url}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "var(--primary-green)" }}
                      />
                      <Text strong style={{ color: "var(--text-dark)" }}>
                        {user.name || user.username || "User"}
                      </Text>
                      <DownOutlined style={{ fontSize: 10, color: "#999" }} />
                    </Space>
                  </Button>
                </Dropdown>
              ) : (
                <Button type="text" onClick={() => onNavigate("auth")}>
                  {t("nav_signin")}
                </Button>
              )}
            </div>

            {!isMobile && (
              <Button
                type="primary"
                shape="round"
                className="btn-gold"
                onClick={() => {}}
              >
                {t("nav_download")}
              </Button>
            )}

            {/* Tombol Hamburger Menu (Hanya di Mobile) */}
            {isMobile && (
              <Button
                type="text"
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                icon={<MenuOutlined style={{ fontSize: "20px" }} />}
              />
            )}
          </div>
        </div>
      </header>

      {/* DRAWER UNTUK MENU MOBILE */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={280}
      >
        {renderMobileMenu()}
      </Drawer>

      {/* MAIN CONTENT */}
      <div
        className="finder-layout"
        style={{ flexDirection: isMobile ? "column" : "row" }}
      >
        {/* ... (Sisa konten map dan list tidak berubah, hanya dibungkus layout ini) ... */}
        <div
          className="finder-map-container"
          style={{
            width: isMobile ? "100%" : "calc(100% - 400px)",
            height: "100%",
          }}
        >
          {/* OVERLAY: PICKING LOCATION */}
          {isPickingLocation ? (
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                background: "white",
                padding: "10px 20px",
                borderRadius: 30,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <EnvironmentFilled style={{ color: "#D32F2F" }} />
              <Text strong>Drag marker to adjust location</Text>
              <Button type="primary" size="small" onClick={confirmLocation}>
                Confirm
              </Button>
              <Button
                size="small"
                onClick={cancelAddPlace}
                icon={<CloseOutlined />}
              />
            </div>
          ) : (
            !isNavigating && (
              <div
                className="map-overlay-top-left"
                style={{
                  position: "absolute",
                  top: isMobile ? 16 : 24,
                  left: isMobile ? 16 : 24,
                  right: isMobile ? 120 : "auto",
                }}
              >
                <div className="main-overlay-bar">
                  <div
                    className="overlay-search-btn"
                    onClick={() =>
                      isMobile
                        ? setMobileListVisible(true)
                        : document.getElementById("sidebar-search").focus()
                    }
                  >
                    <SearchOutlined style={{ flexShrink: 0 }} />{" "}
                    <span>Search Mosques...</span>
                  </div>
                  {!isMobile && (
                    <>
                      <div className="overlay-divider"></div>
                      <button
                        className="overlay-text-btn"
                        onClick={() => setActiveFilter("Jumu'ah Available")}
                      >
                        <FilterOutlined /> {t("map_btn_filter")}
                      </button>
                      <div className="overlay-divider"></div>
                      <button className="overlay-text-btn">
                        <SafetyCertificateOutlined /> {t("map_btn_conf")}
                      </button>
                    </>
                  )}
                </div>
                <div className="overlay-pills">
                  <div
                    className={`overlay-pill ${
                      activeFilter === "All" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("All")}
                  >
                    <BankOutlined /> All
                  </div>
                  <div
                    className={`overlay-pill ${
                      activeFilter === "Jumu'ah Available" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("Jumu'ah Available")}
                  >
                    <TeamOutlined /> Jumu'ah
                  </div>
                  <div
                    className={`overlay-pill ${
                      activeFilter === "Women Area" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("Women Area")}
                  >
                    <WomanOutlined /> Women
                  </div>
                </div>
              </div>
            )
          )}

          {/* QIBLA WIDGET */}
          {userLocation && !isPickingLocation && (
            <div
              className="qibla-widget-container"
              style={{ top: isMobile ? 16 : 24, right: isMobile ? 16 : 24 }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: "800",
                  color: THEME_COLOR,
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                {t("qibla_title")}
              </div>
              <div
                style={{
                  width: 50,
                  height: 50,
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  background: "#f5f5f5",
                  border: `1px solid ${ACCENT_COLOR}`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    fontSize: 8,
                    fontWeight: "bold",
                    color: "#999",
                  }}
                >
                  N
                </div>
                <CompassFilled
                  style={{
                    fontSize: 42,
                    color: ACCENT_COLOR,
                    transform: `rotate(${qiblaDirection}deg)`,
                    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    filter: "drop-shadow(0 2px 4px rgba(198, 168, 124, 0.4))",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#333",
                  marginTop: 8,
                }}
              >
                {Math.round(qiblaDirection)}°
              </div>
            </div>
          )}

          {/* NEW NAVIGATION HUD */}
          {isNavigating && (
            <div
              style={{
                position: "absolute",
                top: isMobile ? 20 : 24,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(5px)",
                padding: "8px 20px",
                borderRadius: "30px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                border: "1px solid rgba(0,0,0,0.05)",
                minWidth: 200,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  color: THEME_COLOR,
                  background: "#e6f7ff",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {transportMode === "walk" ? (
                  <FaWalking />
                ) : transportMode === "bike" ? (
                  <FaBicycle />
                ) : transportMode === "moto" ? (
                  <FaMotorcycle />
                ) : (
                  <FaCar />
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  lineHeight: 1.1,
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 800, color: "#333" }}>
                  {formatDuration(routeInfo.totalTime)}
                </span>
                <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>
                  {(routeInfo.totalDistance / 1000).toFixed(1)} km
                </span>
              </div>
            </div>
          )}

          <MapContainer
            center={safeUserLocation}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onMoveEnd={handleMapMoveEnd} />
            {!isNavigating && !isPickingLocation && (
              <AutoFitBounds places={safeFilteredPlaces} />
            )}
            {isNavigating && safeUserLocation && destinationCoords && (
              <RoutingMachine
                userLocation={safeUserLocation}
                destination={destinationCoords}
                transportMode={transportMode}
              />
            )}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: "user-marker",
                  html: `<div style="width: 20px; height: 20px; background: #1890ff; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.4);"></div>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                })}
                zIndexOffset={100}
              />
            )}

            {isPickingLocation && newPlaceLocation && (
              <LocationPickerMarker
                position={newPlaceLocation}
                setPosition={setNewPlaceLocation}
              />
            )}

            {!isPickingLocation &&
              safeFilteredPlaces.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lng]}
                  icon={createCustomIcon(
                    place.source,
                    selectedPlace?.id === place.id,
                  )}
                  eventHandlers={{
                    click: () => {
                      setSelectedPlace(place);
                      setDrawerVisible(true);
                      if (isMobile) setMobileListVisible(false);
                    },
                  }}
                />
              ))}
          </MapContainer>

          {/* BOTTOM CONTROLS & FLOATING BUTTON */}
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? 100 : 32,
              right: isMobile ? 16 : 32,
              zIndex: 900,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "flex-end",
            }}
          >
            {/* FAB - ADD PLACE BUTTON (CONTRIBUTOR) */}
            {!isPickingLocation && !isNavigating && user && (
              <Tooltip title="Add New Mosque" placement="left">
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  icon={<PlusOutlined style={{ fontSize: 20 }} />}
                  onClick={startAddPlace}
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: "#D4AF37",
                    borderColor: "#D4AF37",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              </Tooltip>
            )}

            <Button
              icon={<AimOutlined style={{ fontSize: 20 }} />}
              onClick={handleLocateMe}
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            {!isNavigating && !isPickingLocation && (
              <Button
                icon={<SearchOutlined />}
                onClick={handleSearchArea}
                loading={isLoading}
                style={{
                  height: 44,
                  padding: "0 16px",
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontWeight: 600,
                }}
              >
                {isMobile ? "Redo" : t("btn_redo")}
              </Button>
            )}
          </div>

          {isMobile &&
            !isNavigating &&
            !drawerVisible &&
            !isPickingLocation && (
              <div
                style={{
                  position: "absolute",
                  bottom: 32,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 999,
                }}
              >
                <Button
                  type="primary"
                  shape="round"
                  icon={<UnorderedListOutlined />}
                  size="large"
                  className="btn-green"
                  style={{
                    padding: "0 32px",
                    height: 48,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  }}
                  onClick={() => setMobileListVisible(true)}
                >
                  View List
                </Button>
              </div>
            )}

          {isNavigating && (
            <Button
              shape="round"
              size="large"
              type="primary"
              danger
              icon={<StopOutlined />}
              onClick={handleStopNavigation}
              style={{
                position: "absolute",
                bottom: 40,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                height: 48,
                fontWeight: 600,
              }}
            >
              {t("btn_exit_nav")}
            </Button>
          )}
        </div>

        {!isMobile && (
          <div className="finder-list-container">{renderListContent()}</div>
        )}
      </div>

      {isMobile && (
        <Drawer
          title="Mosques Nearby"
          placement="bottom"
          onClose={() => setMobileListVisible(false)}
          open={mobileListVisible}
          height="85vh"
          className="mobile-list-drawer"
          styles={{ body: { padding: 0 } }}
        >
          <div
            className="finder-list-container"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "white",
            }}
          >
            {renderListContent()}
          </div>
        </Drawer>
      )}

      {/* DRAWER DETAILS */}
      <Drawer
        title={null}
        placement={isMobile ? "bottom" : "right"}
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={isMobile ? "100%" : 480}
        height={isMobile ? "90vh" : "100%"}
        className="place-detail-drawer"
        styles={{ body: { padding: 0 } }}
      >
        {selectedPlace && (
          <>
            <div className="detail-hero">
              <img
                src={selectedPlace.img}
                className="detail-hero-img"
                alt="Cover"
              />
              <div className="detail-hero-overlay">
                <Tag
                  color="gold"
                  style={{
                    width: "fit-content",
                    border: "none",
                    color: "#333",
                    fontWeight: "800",
                    marginBottom: 8,
                  }}
                >
                  {selectedPlace.rating} ★ Excellent
                </Tag>
                <Title
                  level={2}
                  style={{
                    color: "white",
                    margin: 0,
                    fontSize: 28,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {selectedPlace.fullName}
                </Title>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}
                  >
                    {selectedPlace.type} • {selectedPlace.categoryTag}
                  </Text>
                  {selectedPlace.tags.includes("Jumu'ah Available") && (
                    <span
                      style={{
                        backgroundColor: "#1B4D3E",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid #45a049",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <TeamOutlined style={{ fontSize: "14px" }} />
                      Jumu'ah
                    </span>
                  )}
                </div>
              </div>
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                }}
                onClick={() => setDrawerVisible(false)}
              />
            </div>
            <div className="detail-sheet-content">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 16,
                }}
              >
                <Button
                  type={
                    userVisits[selectedPlace.id] === "Visited"
                      ? "primary"
                      : "default"
                  }
                  ghost={!userVisits[selectedPlace.id]}
                  icon={
                    userVisits[selectedPlace.id] === "Visited" ? (
                      <CheckCircleFilled />
                    ) : (
                      <CheckCircleOutlined />
                    )
                  }
                  onClick={() => handleToggleVisited(selectedPlace.id)}
                  style={{ borderRadius: 20 }}
                >
                  {userVisits[selectedPlace.id] === "Visited"
                    ? "Visited"
                    : "Mark Visited"}
                </Button>
              </div>
              {/* Stats Grid */}
              <div className="detail-stats-grid">
                <div className="stat-box">
                  <span className="stat-value" style={{ color: ACCENT_COLOR }}>
                    {selectedPlace.rating}
                  </span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">
                    {selectedPlace.distanceFormatted || "Nearby"}
                  </span>
                  <span className="stat-label">Distance</span>
                </div>

                {(() => {
                  const detailStatus = getMosqueStatus(
                    selectedPlace.lat,
                    selectedPlace.lng,
                    t,
                  );
                  return (
                    <div className="stat-box">
                      <span
                        className="stat-value"
                        style={{
                          color: detailStatus.color,
                          fontSize: 13,
                          lineHeight: "1.2",
                        }}
                      >
                        {detailStatus.text}
                      </span>
                      <span className="stat-label">Prayer Time</span>
                    </div>
                  );
                })()}

                <div className="stat-box">
                  <span className="stat-value">
                    {selectedPlace.categoryTag}
                  </span>
                  <span className="stat-label">Type</span>
                </div>
              </div>

              {/* 👇 QIBLA WIDGET YANG SUDAH DIPERBAIKI (MENGGANTIKAN DIV KOSONG) */}
              <div
                style={{
                  backgroundColor: THEME_COLOR,
                  borderRadius: 16,
                  padding: "16px 20px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                  boxShadow: "0 4px 12px rgba(27, 77, 62, 0.2)",
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    Qibla Direction
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    Relative to your location
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>
                    {Math.round(qiblaDirection)}°
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CompassFilled
                      style={{
                        fontSize: 20,
                        transform: `rotate(${qiblaDirection}deg)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Mode Selector */}
              <div className="transport-section">
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  ESTIMATED TRIP ({t("nav_est_time")})
                </Text>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: 12,
                    borderRadius: 12,
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: THEME_COLOR,
                    }}
                  >
                    {formatDuration(routeInfo.totalTime)}
                  </span>
                  <span style={{ fontSize: 14, color: "#666" }}>
                    {(routeInfo.totalDistance / 1000).toFixed(1)} km
                  </span>
                </div>
                <Radio.Group
                  value={transportMode}
                  onChange={handleTransportChange}
                  buttonStyle="solid"
                  style={{ display: "flex", width: "100%", gap: 8 }}
                >
                  <Radio.Button
                    value="walk"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <FaWalking style={{ marginRight: 6 }} /> Walk
                  </Radio.Button>
                  <Radio.Button
                    value="bike"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <FaBicycle style={{ marginRight: 6 }} /> Bike
                  </Radio.Button>
                  <Radio.Button
                    value="moto"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <FaMotorcycle style={{ marginRight: 6 }} /> Moto
                  </Radio.Button>
                  <Radio.Button
                    value="car"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <FaCar style={{ marginRight: 6 }} /> Car
                  </Radio.Button>
                </Radio.Group>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 24,
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<CompassFilled />}
                  style={{
                    height: 50,
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 16,
                    background: THEME_COLOR,
                    flex: 1,
                    minWidth: 0,
                  }}
                  onClick={handleStartNavigation}
                >
                  {t("btn_navigate")}
                </Button>

                {/* 👇 TOMBOL EDIT (HANYA MUNCUL JIKA ADMIN ATAU PEMILIK) */}
                {user &&
                  (user.role === "admin" ||
                    user.id === selectedPlace.contributor_id) && (
                    <Tooltip title="Edit Place Info">
                      <Button
                        size="large"
                        icon={<EditOutlined />}
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 14,
                          borderColor: "#D4AF37",
                          color: "#D4AF37",
                          flex: "none",
                        }}
                        onClick={handleOpenEdit}
                      />
                    </Tooltip>
                  )}

                <Button
                  size="large"
                  icon={<PlusOutlined />}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 14,
                    borderColor: "#eee",
                    flex: "none",
                  }}
                  onClick={() => setReviewModalVisible(true)}
                />
                <Button
                  size="large"
                  icon={<ArrowRightOutlined rotate={-45} />}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 14,
                    borderColor: "#eee",
                    flex: "none",
                  }}
                  onClick={handleGetDirections}
                />
              </div>

              <Tabs
                defaultActiveKey="1"
                className="custom-tabs"
                items={[
                  {
                    key: "1",
                    label: "Overview",
                    children: (
                      <div style={{ paddingTop: 12 }}>
                        <div
                          style={{ display: "flex", gap: 16, marginBottom: 20 }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              background: "#f0f5f2",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: THEME_COLOR,
                            }}
                          >
                            <EnvironmentOutlined style={{ fontSize: 20 }} />
                          </div>
                          <div>
                            <Text
                              strong
                              style={{ fontSize: 15, display: "block" }}
                            >
                              {t("lbl_location")}
                            </Text>
                            <Text type="secondary">
                              {selectedPlace.address}
                            </Text>
                          </div>
                        </div>
                        {/* Facilities Grid */}
                        <Text
                          strong
                          style={{
                            fontSize: 15,
                            display: "block",
                            marginBottom: 12,
                          }}
                        >
                          {t("lbl_facilities")}
                        </Text>
                        <div className="facilities-grid">
                          {selectedPlace.tags.map((tag, i) => {
                            let icon = <CheckOutlined />;
                            if (tag.includes("Jumu")) icon = <TeamOutlined />;
                            if (tag.includes("Women") || tag.includes("Ladies"))
                              icon = <WomanOutlined />;
                            if (tag.includes("Wudu")) icon = <FaMosque />;
                            if (tag.includes("Parking")) icon = <CarOutlined />;
                            if (tag.includes("Air"))
                              icon = <ClockCircleOutlined />;
                            if (tag.includes("Quran")) icon = <ReadFilled />;

                            return (
                              <div key={i} className="facility-box">
                                <div className="facility-icon-wrapper">
                                  {icon}
                                </div>
                                <span className="facility-label">{tag}</span>
                              </div>
                            );
                          })}
                        </div>
                        <Divider style={{ margin: "20px 0" }} />
                        <div
                          style={{
                            background: "#FFF8E6",
                            padding: 16,
                            borderRadius: 12,
                            display: "flex",
                            gap: 12,
                          }}
                        >
                          <InfoCircleOutlined
                            style={{
                              color: "#faad14",
                              fontSize: 18,
                              marginTop: 2,
                            }}
                          />
                          <div>
                            <Text strong style={{ color: "#d48806" }}>
                              {t("lbl_halal_note")}
                            </Text>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 13,
                                color: "#d48806",
                                opacity: 0.9,
                              }}
                            >
                              {t("txt_halal_note")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: `${t("lbl_reviews")} (${placeReviews.length || 0})`,
                    children: (
                      <div style={{ paddingTop: 12 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16,
                          }}
                        >
                          <Title level={5} style={{ margin: 0 }}>
                            {t("lbl_reviews")}
                          </Title>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => setReviewModalVisible(true)}
                          >
                            {t("btn_write_review")}
                          </Button>
                        </div>
                        <List
                          dataSource={placeReviews}
                          split={false}
                          locale={{
                            emptyText: "No reviews yet. Be the first!",
                          }}
                          renderItem={(item) => (
                            <div className="review-card-modern">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: 8,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 10,
                                    alignItems: "center",
                                  }}
                                >
                                  <Avatar
                                    src={
                                      item.avatar ||
                                      `https://api.dicebear.com/7.x/initials/svg?seed=${item.user}`
                                    }
                                    size={36}
                                  />
                                  <div>
                                    <Text
                                      strong
                                      style={{
                                        fontSize: 14,
                                        display: "block",
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {item.user}
                                    </Text>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 11 }}
                                    >
                                      {item.date}
                                    </Text>
                                  </div>
                                </div>
                                <Rate
                                  disabled
                                  value={item.rating}
                                  style={{ fontSize: 12, color: ACCENT_COLOR }}
                                />
                              </div>
                              <Text
                                style={{
                                  color: "#555",
                                  fontSize: 14,
                                  lineHeight: 1.6,
                                }}
                              >
                                {item.text}
                              </Text>
                              {item.photos && item.photos.length > 0 && (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 8,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Image.PreviewGroup>
                                    {item.photos.map((photo, idx) => (
                                      <Image
                                        key={idx}
                                        src={photo}
                                        width={80}
                                        height={80}
                                        style={{
                                          objectFit: "cover",
                                          borderRadius: 8,
                                        }}
                                        fallback={DEFAULT_IMAGE}
                                      />
                                    ))}
                                  </Image.PreviewGroup>
                                </div>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </>
        )}
      </Drawer>

      {/* MODAL REVIEWS */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0, textAlign: "center" }}>
            {t("review_title")}
          </Title>
        }
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
        centered
        width={500}
        styles={{ body: { padding: "24px 32px" } }}
      >
        <Form
          form={form}
          onFinish={handleReviewSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="rating"
            label={t("review_label_rating")}
            initialValue={5}
            style={{ textAlign: "center" }}
          >
            <Rate style={{ color: ACCENT_COLOR, fontSize: 32 }} />
          </Form.Item>
          <Form.Item
            name="review"
            label={t("review_label_exp")}
            rules={[{ required: true, message: "Please write something!" }]}
          >
            <TextArea
              rows={5}
              placeholder={t("review_ph_exp")}
              style={{ borderRadius: 12, resize: "none" }}
            />
          </Form.Item>
          <Form.Item label={t("review_label_photo")}>
            <Upload
              listType="picture-card"
              maxCount={3}
              beforeUpload={() => false}
              onChange={({ fileList }) => setReviewFileList(fileList)}
              fileList={reviewFileList}
            >
              <div>
                <CameraOutlined style={{ fontSize: 24, color: "#999" }} />
                <div style={{ marginTop: 8, color: "#999" }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isSubmittingReview}
              style={{
                height: 50,
                borderRadius: 25,
                fontWeight: 600,
                fontSize: 16,
                background: THEME_COLOR,
              }}
            >
              {t("review_btn_post")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* --- MODAL CONTRIBUTE PLACE --- */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <EnvironmentFilled style={{ color: "#D4AF37", fontSize: 24 }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Add New Mosque
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Help the community by adding hidden gems!
              </Text>
            </div>
          </div>
        }
        open={isContributeModalOpen}
        onCancel={() => setIsContributeModalOpen(false)}
        footer={null}
        centered
        width={600}
      >
        <Form
          form={contributeForm}
          layout="vertical"
          onFinish={handleSubmitPlace}
          size="large"
          style={{ marginTop: 20 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name_en"
                label="Mosque Name (English)"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="e.g. Masjid Al-Hikmah" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name_cn" label="Name (Chinese)">
                <Input placeholder="e.g. 清真寺" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Detailed Address"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={2}
              placeholder="Building name, Floor, Street number..."
            />
          </Form.Item>

          <Form.Item
            name="promo_details"
            label={
              <span>
                <FileTextOutlined /> Facilities / Notes
              </span>
            }
          >
            <TextArea
              rows={3}
              placeholder="e.g. Ladies area on 2nd floor, Jumuah starts at 1:00 PM..."
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <PictureOutlined /> Upload Photos
              </span>
            }
          >
            <Upload
              listType="picture-card"
              maxCount={3}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              fileList={fileList}
            >
              <div>
                <CameraOutlined style={{ fontSize: 24, color: "#999" }} />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmittingPlace}
            style={{
              height: 48,
              backgroundColor: "#D4AF37",
              borderColor: "#D4AF37",
              fontWeight: "bold",
            }}
          >
            Submit Contribution
          </Button>
        </Form>
      </Modal>

      {/* --- MODAL EDIT PLACE (FITUR BARU) --- */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <EditOutlined style={{ color: "#D4AF37", fontSize: 24 }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Edit Mosque Info
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Update information for better accuracy
              </Text>
            </div>
          </div>
        }
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        centered
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateSubmit}
          size="large"
          style={{ marginTop: 20 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name_en"
                label="Name (English)"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name_cn" label="Name (Chinese)">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="promo_details" label="Facilities / Notes">
            <TextArea rows={2} placeholder="Update facilities info..." />
          </Form.Item>

          <Form.Item label="Update Photo (Optional)">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList }) => setEditFileList(fileList)}
              fileList={editFileList}
            >
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8 }}>Change</div>
              </div>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isUpdating}
            style={{
              height: 48,
              backgroundColor: "#1B4D3E",
              borderColor: "#1B4D3E",
              fontWeight: "bold",
            }}
          >
            Save Changes
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default MosqueFinder;
