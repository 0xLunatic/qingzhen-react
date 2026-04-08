// src/pages/HalalFinder.jsx
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
  ShopOutlined,
  CoffeeOutlined,
  ClockCircleOutlined,
  WifiOutlined,
  CarOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  FireFilled,
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
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { FaWalking, FaBicycle, FaMotorcycle, FaCar } from "react-icons/fa";

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

import "../App.css";
import logoImage from "../assets/logo.png";
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
const BACKEND_URL = import.meta.env.VITE_API_URL;
const SPEEDS = { walk: 5, bike: 15, moto: 40, car: 30 };

// --- ASSETS & DATA ---
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=60",
  "https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=60",
  "https://images.unsplash.com/photo-1541544744-5e3a01993108?w=600&q=60",
  "https://images.unsplash.com/photo-1606756790138-7c4864384077?w=600&q=60",
];

const DEFAULT_IMAGE = "";
const POSSIBLE_TAGS = [
  "Verified Halal",
  "Muslim Owned",
  "No Alcohol",
  "Prayer Room",
  "Family Friendly",
];
const CATEGORIES = ["Vegan Option", "Real Food", "Non-Vegan", "Fast Food"];

// --- UTILS ---
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

const getOpenStatus = (openHour, closeHour, t) => {
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= openHour && currentHour < closeHour;
  return {
    isOpen,
    text: isOpen
      ? `${t ? t("status_open") : "Open"} • ${
          t ? t("status_closes") : "Closes"
        } ${closeHour}:00`
      : `${t ? t("status_closed") : "Closed"} • ${
          t ? t("status_opens") : "Opens"
        } ${openHour}:00`,
    color: isOpen ? "#2e7d32" : "#d32f2f",
  };
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
};

// --- CUSTOM MARKER ICON ---
// [MODIFIED] Logic icon di sini diubah untuk handle 'isVisited'
const createCustomIcon = (source, isActive, isVisited) => {
  const scale = isActive ? 1.2 : 1;
  let svgContent = "";
  let iconColor = "#1B4D3E"; // Default Green

  if (isVisited) {
    // [NEW] Bintang Merah jika Visited
    iconColor = "#D32F2F"; // Merah
    svgContent = `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="${iconColor}" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `;
  } else {
    // Normal Marker
    if (source === "contributor") iconColor = "#D4AF37"; // Gold for contributor
    svgContent = `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="${iconColor}" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        ${
          source === "contributor"
            ? '<circle cx="17" cy="5" r="3" fill="#FF5252" stroke="white" stroke-width="1"/>'
            : ""
        }
      </svg>
    `;
  }

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="transform: scale(${scale}); transition: all 0.3s;">
        ${svgContent}
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    zIndexOffset: isActive ? 1000 : isVisited ? 300 : 100, // Visited z-index lebih tinggi dari normal
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
        html: `<div style="font-size: 40px; color: #D32F2F; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); cursor: move;"><i class="anticon anticon-environment"><svg viewBox="64 64 896 896" focusable="false" data-icon="environment" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C324.3 64 172 216.3 172 404c0 148.8 126.7 334.8 322.2 446.9 10.8 6.2 24.8 6.2 35.6 0C725.3 738.8 852 552.8 852 404 852 216.3 699.7 64 512 64zm0 464c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128z"></path></svg></i></div>`,
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

// --- AUTO FIT BOUNDS ---
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
const SidebarCard = ({ data, active, onClick, visitStatus, t }) => {
  const status = getOpenStatus(data.openTime, data.closeTime, t);
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
      {data.isPromo && <div className="promo-ribbon">PROMO</div>}
      {visitStatus === "Visited" && (
        <Tooltip title="Visited">
          <div className="visited-badge">
            <CheckOutlined />
          </div>
        </Tooltip>
      )}

      <img
        src={data.img}
        alt={data.fullName}
        className="card-bg-faded"
        onError={(e) => {
          e.target.src = DEFAULT_IMAGE;
        }}
      />

      <div className="card-content-wrapper">
        <div className="card-title">
          {data.fullName}
          {data.source === "contributor" && (
            <Tooltip title="QingzhenMu Verified">
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
          {data.type} • {data.price}
        </span>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: status.color,
            marginBottom: 6,
          }}
        >
          {status.isOpen ? <ClockCircleOutlined /> : <StopOutlined />}{" "}
          {status.text}
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
              <ThunderboltFilled /> {data.categoryTag}
            </span>
          )}
          {data.tags.includes("Verified Halal") && (
            <span className="card-pill">
              <SafetyCertificateOutlined /> Halal
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
function HalalFinder({ onNavigate }) {
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

  // [MODIFIED] State ini sangat penting untuk re-render marker
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

  // --- USER MENU ---
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
        onClick={() => onNavigate("blog-page")}
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

  const foodTypeItems = CATEGORIES.map((cat) => ({
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
      // 1. Request Database (Verified/Saved Places)
      const dbPromise = api.get("/places");

      // 2. Request OSM (Public Data)
      const query = `[out:json][timeout:15];(node["amenity"~"restaurant|cafe|fast_food"](around:${MAX_RADIUS_METERS}, ${lat}, ${lng}););out ${MAX_RESULTS};`;
      const osmPromise = fetch(
        "https://overpass.kumi.systems/api/interpreter",
        { method: "POST", body: query },
      );

      const [dbRes, osmRes] = await Promise.allSettled([dbPromise, osmPromise]);

      let combined = [];
      // 👇 Set ini berguna untuk mencatat ID OSM mana saja yang sudah ada di DB
      let existingOsmIds = new Set();

      // --- A. PROSES DATA DATABASE (PRIORITAS UTAMA) ---
      if (dbRes.status === "fulfilled" && dbRes.value.data.success) {
        const rawData = dbRes.value.data.data;

        // Catat OSM ID yang sudah tersimpan di DB
        rawData.forEach((p) => {
          if (p.osm_id) existingOsmIds.add(String(p.osm_id));
        });

        const dbPlaces = rawData.map((p) => {
          let tags = [p.halal_status];
          if (p.food_type) tags.push(p.food_type);

          let placeImage =
            FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)];
          if (p.image_url) {
            placeImage = getPhotoUrl(p.image_url);
          } else if (p.photos) {
            let parsedPhotos = p.photos;
            if (typeof p.photos === "string")
              try {
                parsedPhotos = JSON.parse(p.photos);
              } catch (e) {}
            if (Array.isArray(parsedPhotos) && parsedPhotos.length > 0)
              placeImage = getPhotoUrl(parsedPhotos[0]);
          }

          return {
            id: `db-${p.id}`,
            originalId: p.id,
            osm_id: p.osm_id,
            contributor_id: p.contributor_id,
            fullName: p.name_en,
            name_cn: p.name_cn,
            lat: parseFloat(p.latitude),
            lng: parseFloat(p.longitude),
            type: p.category,
            price: "🍴🍴",
            rating: p.avgRating ? parseFloat(p.avgRating).toFixed(1) : "New",
            reviews: p.reviewCount ? parseInt(p.reviewCount) : 0,
            img: placeImage,
            source: "contributor",
            tags: tags,
            categoryTag: p.food_type,
            isPromo: p.is_promo,
            promoText: p.promo_details,
            openTime: 9,
            closeTime: 21,
            address: p.address,
          };
        });
        combined = [...combined, ...dbPlaces];
      }

      // --- B. PROSES DATA OSM (FILTER DUPLIKAT) ---
      if (osmRes.status === "fulfilled" && osmRes.value.ok) {
        const osmData = await osmRes.value.json();

        const osmPlaces = osmData.elements
          .filter((item) => !existingOsmIds.has(String(item.id)))
          .map((item, i) => {
            let tags = ["Verified Halal"];
            const pool = ["Muslim Owned", "No Alcohol", "Prayer Room"].sort(
              () => 0.5 - Math.random(),
            );
            tags.push(...pool.slice(0, 3));

            return {
              id: `osm-${item.id}`,
              originalId: item.id,
              fullName: item.tags["name:en"] || item.tags.name || "Halal Spot",
              name_cn: item.tags.name,
              lat: item.lat,
              lng: item.lon,
              type: item.tags.cuisine
                ? item.tags.cuisine.charAt(0).toUpperCase() +
                  item.tags.cuisine.slice(1)
                : "Restaurant",
              rating: (3.8 + Math.random() * 1.2).toFixed(1),
              reviews: Math.floor(Math.random() * 50) + 1,
              price: "🍴🍴",
              img: FOOD_IMAGES[i % FOOD_IMAGES.length],
              tags: [...new Set(tags)],
              categoryTag: "Real Food",
              isPromo: Math.random() > 0.9,
              promoText: "Special Deal",
              openTime: 9,
              closeTime: 21,
              address: getAddressFromTags(item.tags),
              source: "osm",
            };
          });

        const validOsm = osmPlaces.filter((p) => p.fullName !== "Halal Spot");
        combined = [...combined, ...validOsm];
      }

      const finalData = recalculateDistances(combined, lat, lng);
      setAllPlaces(finalData);
    } catch (err) {
      console.error("Fetch Logic Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FETCH REVIEWS ---
  const fetchReviews = async (placeId) => {
    try {
      if (!placeId) return;
      const placeIdStr = placeId.toString();

      if (placeIdStr.startsWith("osm-")) {
        setPlaceReviews([]);
        return;
      }

      const realId = placeIdStr.replace("db-", "");
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
            id: r.id,
            user: r.user ? r.user.name || r.user.username : "Anonymous",
            avatar: r.user?.avatar_url ? getPhotoUrl(r.user.avatar_url) : null,
            rating: parseFloat(r.rating),
            text: r.comment,
            date: new Date(r.created_at).toLocaleDateString(),
            photos: reviewPhotos.map((p) => getPhotoUrl(p)),
          };
        });
        setPlaceReviews(mappedReviews);
      }
    } catch (error) {
      console.error("Fetch Review Error:", error);
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

  // SUBMIT PLACE (WITH PHOTOS)
  const handleSubmitPlace = async (values) => {
    setIsSubmittingPlace(true);
    try {
      const formData = new FormData();
      formData.append("name_en", values.name_en);
      if (values.name_cn) formData.append("name_cn", values.name_cn);
      formData.append("category", values.category);
      formData.append("halal_status", values.halal_status);
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

      message.success("Thank you! Place submitted with photos.");
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

  // ==========================================
  // 👇 FUNGSI UPDATE PLACE (EDIT LOGIC)
  // ==========================================
  const handleOpenEdit = () => {
    if (!selectedPlace) return;
    editForm.setFieldsValue({
      name_en: selectedPlace.fullName,
      name_cn: selectedPlace.name_cn,
      category: selectedPlace.type,
      halal_status: selectedPlace.tags[0],
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
      formData.append("category", values.category);
      formData.append("halal_status", values.halal_status);
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
        message.error("Cannot edit this place (OSM Data).");
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

      message.success("Place updated successfully!");
      setIsEditModalOpen(false);
      fetchPlaces(mapCenter.lat, mapCenter.lng);

      setSelectedPlace((prev) => ({
        ...prev,
        fullName: values.name_en,
        name_cn: values.name_cn,
        type: values.category,
        address: values.address,
        promoText: values.promo_details,
        isPromo: !!values.promo_details,
      }));
    } catch (error) {
      console.error("Update Error:", error);
      message.error(
        "Failed to update: " + (error.response?.data?.message || error.message),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // --- SUBMIT REVIEW HANDLER ---
  const handleReviewSubmit = async (values) => {
    if (!user) {
      message.warning("Please login to review");
      return onNavigate("auth");
    }

    setIsSubmittingReview(true);

    try {
      const formData = new FormData();

      if (selectedPlace.source === "osm") {
        formData.append("is_osm", "true");
        formData.append("osm_id", selectedPlace.originalId);
        formData.append("name", selectedPlace.fullName);
        formData.append("lat", selectedPlace.lat);
        formData.append("lng", selectedPlace.lng);
        formData.append("address", selectedPlace.address);

        let cat = "Restaurant";
        if (
          selectedPlace.type === "Supermarket" ||
          selectedPlace.type === "Convenience"
        ) {
          cat = "Market";
        }
        formData.append("category", cat);
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

      fetchReviews(selectedPlace.id);
      fetchPlaces(mapCenter.lat, mapCenter.lng);
    } catch (error) {
      console.error("Submit Review Error:", error);
      const errMsg = error.response?.data?.message || "Failed to post review";
      message.error(errMsg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // --- TOGGLE STATUS (VISITED/WISHLIST) ---
  const handleToggleStatus = async (placeId, statusType) => {
    if (!user) {
      message.warning("Please login first");
      return onNavigate("auth");
    }
    if (!statusType) statusType = "Visited";

    // 1. Optimistic UI Update
    const oldStatus = userVisits[placeId];
    const newVisits = { ...userVisits };

    if (oldStatus === statusType) {
      delete newVisits[placeId];
    } else {
      newVisits[placeId] = statusType;
    }

    // [MODIFIED] State ini yang akan memicu re-render Marker icon
    setUserVisits(newVisits);

    try {
      const payload = {
        status: statusType,
        place_data: selectedPlace
          ? {
              name: selectedPlace.fullName,
              address: selectedPlace.address,
              lat: selectedPlace.lat,
              lng: selectedPlace.lng,
              rating: selectedPlace.rating,
              img: selectedPlace.img,
            }
          : {},
      };

      const idStr = String(placeId);

      if (idStr.startsWith("db-")) {
        payload.place_id = idStr.replace("db-", "");
        payload.is_osm = false;
      } else if (idStr.startsWith("osm-")) {
        payload.is_osm = true;
        payload.osm_id = idStr.replace("osm-", "");
        payload.name = selectedPlace.fullName;
        payload.lat = selectedPlace.lat;
        payload.lng = selectedPlace.lng;
        payload.address = selectedPlace.address;

        let cat = "Restaurant";
        if (
          selectedPlace.type === "Supermarket" ||
          selectedPlace.type === "Convenience"
        ) {
          cat = "Market";
        }
        payload.category = cat;
      } else {
        payload.place_id = placeId;
      }

      await api.post("/user/visits", payload);

      message.success(
        oldStatus === statusType
          ? "Removed from list"
          : `Marked as ${statusType}`,
      );

      if (idStr.startsWith("osm-")) {
        fetchPlaces(mapCenter.lat, mapCenter.lng);
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error("Failed. " + (error.response?.data?.message || ""));
      // Rollback UI jika gagal
      setUserVisits(userVisits);
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
      if (activeFilter === "Promo") result = result.filter((p) => p.isPromo);
      else if (CATEGORIES.includes(activeFilter))
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
        console.warn("Locate me error:", err);
        message.error("Check GPS settings / Allow Location Access");
        fallbackToIpLocation();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      fallbackToIpLocation();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter({ lat: latitude, lng: longitude });
        fetchPlaces(latitude, longitude);
      },
      (err) => {
        fallbackToIpLocation();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
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
          placeholder={t("finder_placeholder")}
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
            <ShopOutlined /> {t("pill_all")}
          </div>
          <Dropdown menu={{ items: foodTypeItems }} trigger={["click"]}>
            <div
              className={`tab-item ${
                CATEGORIES.includes(activeFilter) ? "active" : ""
              }`}
              style={{ cursor: "pointer" }}
            >
              <AppstoreOutlined /> {t("pill_food_type")}{" "}
              <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
            </div>
          </Dropdown>
          <div
            className={`tab-item ${activeFilter === "Promo" ? "active" : ""}`}
            onClick={() => setActiveFilter("Promo")}
          >
            <FireFilled style={{ color: "#f5222d" }} /> {t("pill_promo")}
          </div>
          <div
            className={`tab-item ${
              activeFilter === "Verified Halal" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Verified Halal")}
          >
            <SafetyCertificateOutlined /> {t("filter_verified")}
          </div>
          <div
            className={`tab-item ${
              activeFilter === "Prayer Room" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Prayer Room")}
          >
            <CompassFilled /> {t("filter_prayer")}
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
                <SafetyCertificateOutlined style={{ fontSize: 18 }} />
                <span>{t("list_title")}</span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  cursor: "pointer",
                  fontWeight: 500,
                  opacity: 0.8,
                }}
              >
                {t("list_view_all")}
              </span>
            </div>
            {safeFilteredPlaces.map((place) => (
              <SidebarCard
                key={place.id}
                data={place}
                active={selectedPlace?.id === place.id}
                visitStatus={userVisits[place.id]}
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
            description={t("list_empty")}
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
            <Button
              type="link"
              className="active text-green"
              onClick={() => onNavigate("finder")}
            >
              {t("nav_finder")}
            </Button>
            <Button
              type="link"
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
            <Button type="link" onClick={() => onNavigate("blog-page")}>
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
                    <span>{t("map_btn_search")}</span>
                  </div>
                  {!isMobile && (
                    <>
                      <div className="overlay-divider"></div>
                      <button
                        className="overlay-text-btn"
                        onClick={() => setActiveFilter("Verified Halal")}
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
                    <ShopOutlined /> {t("lbl_restaurants")}
                  </div>
                  <div
                    className={`overlay-pill ${
                      activeFilter === "Prayer Room" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("Prayer Room")}
                  >
                    <CompassFilled /> {t("filter_prayer")}
                  </div>
                  <div
                    className={`overlay-pill ${
                      activeFilter === "Family Friendly" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("Family Friendly")}
                  >
                    <CoffeeOutlined /> {t("filter_family")}
                  </div>
                </div>
              </div>
            )
          )}

          {/* QIBLA WIDGET */}
          {userLocation && !isPickingLocation && (
            <div
              className="qibla-widget-container"
              style={{
                top: isMobile ? 16 : 24,
                right: isMobile ? 16 : 24,
              }}
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
                  // [MODIFIED] Gunakan prop 'isVisited' untuk trigger icon merah
                  icon={createCustomIcon(
                    place.source,
                    selectedPlace?.id === place.id,
                    userVisits[place.id] === "Visited",
                  )}
                  eventHandlers={{
                    click: () => {
                      setSelectedPlace(place);
                      setDrawerVisible(true);
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
              gap: 16,
              alignItems: "flex-end",
            }}
          >
            {/* 1. Add Place Button (Floating Action Button style) */}
            {!isPickingLocation && !isNavigating && user && (
              <Tooltip title="Contribute New Place" placement="left">
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  icon={
                    <PlusOutlined
                      style={{ fontSize: 24, fontWeight: "bold" }}
                    />
                  }
                  onClick={startAddPlace}
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#D4AF37",
                    borderColor: "#D4AF37",
                    boxShadow: "0 6px 16px rgba(212, 175, 55, 0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "2px solid #fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "scale(1.1) rotate(90deg)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(212, 175, 55, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(212, 175, 55, 0.4)";
                  }}
                />
              </Tooltip>
            )}

            {/* Tombol Locate Me */}
            <Tooltip title="Locate Me" placement="left">
              <Button
                icon={<AimOutlined style={{ fontSize: 20, color: "#555" }} />}
                onClick={handleLocateMe}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  backgroundColor: "white",
                  color: "#333",
                }}
              />
            </Tooltip>

            {/* Tombol Redo Search */}
            {!isNavigating && !isPickingLocation && (
              <Button
                icon={<SearchOutlined />}
                onClick={handleSearchArea}
                loading={isLoading}
                shape="round"
                style={{
                  height: 40,
                  padding: "0 20px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  fontWeight: 600,
                  backgroundColor: "white",
                  color: THEME_COLOR,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
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
          title="Halal Places"
          placement="bottom"
          onClose={() => setMobileListVisible(false)}
          open={mobileListVisible}
          height="85vh"
          className="mobile-list-drawer"
          styles={{ body: { padding: 0 } }}
        >
          <div
            className="finder-list-container"
            style={{ width: "100%", height: "100%" }}
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
                {selectedPlace.isPromo && (
                  <div
                    style={{
                      background: "#D32F2F",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: 4,
                      fontWeight: "bold",
                      display: "inline-block",
                      marginBottom: 8,
                      width: "fit-content",
                    }}
                  >
                    <FireFilled /> {selectedPlace.promoText}
                  </div>
                )}
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
                  {selectedPlace.rating} ★ Superb
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
                    {selectedPlace.type} • {selectedPlace.price}
                  </Text>
                  {selectedPlace.tags.includes("Verified Halal") && (
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
                      <CheckCircleFilled style={{ fontSize: "14px" }} />{" "}
                      Verified Halal
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
                  icon={
                    userVisits[selectedPlace.id] === "Visited" ? (
                      <CheckCircleFilled />
                    ) : (
                      <CheckCircleOutlined />
                    )
                  }
                  onClick={() =>
                    handleToggleStatus(selectedPlace.id, "Visited")
                  }
                  style={{
                    borderRadius: 20,
                    backgroundColor:
                      userVisits[selectedPlace.id] === "Visited"
                        ? THEME_COLOR
                        : undefined,
                    color:
                      userVisits[selectedPlace.id] === "Visited"
                        ? "#fff"
                        : undefined,
                    transition: "all 0.3s",
                  }}
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
                <div className="stat-box">
                  <span
                    className="stat-value"
                    style={{
                      color: getOpenStatus(
                        selectedPlace.openTime,
                        selectedPlace.closeTime,
                        t,
                      ).color,
                    }}
                  >
                    {getOpenStatus(
                      selectedPlace.openTime,
                      selectedPlace.closeTime,
                      t,
                    ).isOpen
                      ? t("status_open").toUpperCase()
                      : t("status_closed").toUpperCase()}
                  </span>
                  <span className="stat-label">
                    {selectedPlace.openTime}:00 - {selectedPlace.closeTime}:00
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">
                    {selectedPlace.categoryTag}
                  </span>
                  <span className="stat-label">Type</span>
                </div>
              </div>

              <div className="qibla-widget">{/* ... Qibla content ... */}</div>

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
                          style={{
                            display: "flex",
                            gap: 16,
                            marginBottom: 20,
                          }}
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
                        {(() => {
                          const facilitiesData = [
                            {
                              icon: <WifiOutlined />,
                              label: t("fac_wifi") || "Free Wifi",
                            },
                            {
                              icon: <CarOutlined />,
                              label: t("fac_parking") || "Parking",
                            },
                            {
                              icon: <CompassFilled />,
                              label: t("fac_prayer") || "Prayer Room",
                            },
                            {
                              icon: <ClockCircleOutlined />,
                              label: t("fac_ac") || "Full AC",
                            },
                            { icon: <CheckCircleFilled />, label: "Toilet" },
                            {
                              icon: <SafetyCertificateOutlined />,
                              label: "Reservation",
                            },
                          ];
                          return (
                            <div className="facilities-grid">
                              {facilitiesData.map((item, index) => (
                                <div key={index} className="facility-box">
                                  <div className="facility-icon-wrapper">
                                    {item.icon}
                                  </div>
                                  <span className="facility-label">
                                    {item.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
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
                                  style={{
                                    fontSize: 12,
                                    color: ACCENT_COLOR,
                                  }}
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
              }}
            >
              {t("review_btn_post")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* --- MODAL CONTRIBUTE PLACE (NEW & IMPROVED) --- */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <EnvironmentFilled style={{ color: "#D4AF37", fontSize: 24 }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Add New Place
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
                label="Place Name (English)"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="e.g. Lanzhou Lamian" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name_cn" label="Place Name (Chinese)">
                <Input placeholder="e.g. 兰州拉面" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select type">
                  <Option value="Restaurant">Restaurant</Option>
                  <Option value="Mosque">Mosque</Option>
                  <Option value="Market">Market</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="halal_status"
                label="Halal Status"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select status">
                  <Option value="Verified">Verified Halal</Option>
                  <Option value="Muslim Owned">Muslim Owned</Option>
                  <Option value="No Pork">No Pork (Neutral)</Option>
                </Select>
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

          {/* New Field: Menu / Description */}
          <Form.Item
            name="promo_details"
            label={
              <span>
                <FileTextOutlined /> Recommended Menu / Description
              </span>
            }
          >
            <TextArea
              rows={3}
              placeholder="e.g. Best Beef Noodles, 10% student discount, Open 24h..."
            />
          </Form.Item>

          {/* New Field: Photo Upload */}
          <Form.Item
            label={
              <span>
                <PictureOutlined /> Upload Photos (Menu/Place)
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
                Edit Place Info
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Restaurant">Restaurant</Option>
                  <Option value="Mosque">Mosque</Option>
                  <Option value="Market">Market</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="halal_status"
                label="Halal Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Verified">Verified Halal</Option>
                  <Option value="Muslim Owned">Muslim Owned</Option>
                  <Option value="No Pork">No Pork</Option>
                </Select>
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

          <Form.Item name="promo_details" label="Promo / Menu Highlight">
            <TextArea rows={2} placeholder="Update promo info..." />
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

export default HalalFinder;
