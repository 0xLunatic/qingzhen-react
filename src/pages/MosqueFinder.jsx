// src/pages/MosqueFinder.jsx
<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Typography,
  Avatar,
  message,
  Spin,
  Empty,
  Drawer,
  List,
  Form,
  Rate,
  Upload,
  Divider,
  Modal,
  Tag,
  Tabs,
  Tooltip,
  Dropdown,
  Radio,
  Grid,
  Space,
=======
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
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
  BankOutlined,
  ReadFilled,
=======
  ShopOutlined,
  BankOutlined,
  TeamOutlined,
  WomanOutlined,
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  ClockCircleOutlined,
  WifiOutlined,
  CarOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
<<<<<<< HEAD
  TeamOutlined,
  CheckOutlined,
  EyeFilled,
  WomanOutlined,
=======
  CheckOutlined,
  EyeFilled,
  ThunderboltFilled,
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  DownOutlined,
  AppstoreOutlined,
  TranslationOutlined,
  UnorderedListOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
<<<<<<< HEAD
} from "@ant-design/icons";
import { FaWalking, FaBicycle, FaMotorcycle, FaCar, FaMosque } from "react-icons/fa";
=======
  EnvironmentFilled,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { FaWalking, FaBicycle, FaMotorcycle, FaCar } from "react-icons/fa";
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
<<<<<<< HEAD
=======
  Popup,
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

<<<<<<< HEAD
// 👇 IMPORT LIBRARY ADHAN
import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';

// Import CSS
import "../App.css";

=======
// Import CSS
import "../App.css";

// 👇 IMPORT API HELPER
import api from "../utils/api";

>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
// 👇 IMPORT BAHASA
import { en } from "../lang/en";
import { cn } from "../lang/cn";

<<<<<<< HEAD
const { Title, Text } = Typography;
const { TextArea } = Input;
=======
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab

// --- CONSTANTS ---
const THEME_COLOR = "#1B4D3E";
const ACCENT_COLOR = "#C6A87C";
const MECCA_COORDS = { lat: 21.4225, lng: 39.8262 };
const MAX_RADIUS_METERS = 5000;
<<<<<<< HEAD
const MAX_RESULTS = 40;

const SPEEDS = {
  walk: 5,
  bike: 15,
  moto: 40,
  car: 30,
};

// --- ASSETS & DATA MASJID ---
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
  "Air Conditioned"
];
const CATEGORIES = ["Grand Mosque", "Musalla", "Community Center", "Historic"];

const INITIAL_REVIEWS = [
  {
    user: "Abdullah",
    rating: 5,
    text: "MashaAllah, very peaceful and clean.",
    date: "1 day ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah",
  },
  {
    user: "Fatima",
    rating: 5,
    text: "Spacious women's area and clean wudu facility.",
    date: "3 days ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
  },
];
=======
const MAX_RESULTS = 30;
// 👇 Ganti sesuai port backend Anda
const BACKEND_URL = "http://localhost:5000";

const SPEEDS = { walk: 5, bike: 15, moto: 40, car: 30 };

// --- GAMBAR MASJID PLACEHOLDER ---
const MOSQUE_IMAGES = [
  "https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=600&q=60",
  "https://images.unsplash.com/photo-1542385151-570ea55845eb?w=600&q=60",
  "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&q=60",
  "https://images.unsplash.com/photo-1596409865198-d1434316d926?w=600&q=60",
];

const POSSIBLE_TAGS = [
  "Jumu'ah Prayer",
  "Ladies Section",
  "Wudu Area",
  "Air Conditioned",
  "Parking",
];
const CATEGORIES = ["Grand Mosque", "Musalla", "Islamic Center", "Prayer Room"];
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab

// --- UTILS ---
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

<<<<<<< HEAD
// ============================================
// 👇 PRAYER STATUS CALCULATION (USING ADHAN)
// ============================================
const getFormattedTime = (date) => {
  if (!date) return "";
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const getMosqueStatus = (lat, lng, t) => {
  // 1. Validasi Koordinat
  if (!isValidCoordinate(lat, lng)) {
    return {
      isOpen: true,
      text: t ? t("status_open_prayer") || "Open for Prayer" : "Open for Prayer",
      color: "#2e7d32",
    };
  }

  // 2. Setup Adhan
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

  // 3. Logika Status
  // Case A: Sedang waktu sholat (Selain Sunrise/None)
  if (currentPrayer !== Prayer.None && currentPrayer !== Prayer.Sunrise) {
    return {
      isOpen: true,
      text: `Now: ${capitalize(currentPrayer)}`, // e.g., "Now: Asr"
      color: "#2e7d32", // Hijau
    };
  }
  
  // Case B: Di antara Isya dan Subuh (Biasanya masjid tutup)
  // 'None' di Adhan.js biasanya berarti setelah Isya sebelum Subuh (atau sebelum Fajr)
  if (currentPrayer === Prayer.None && nextPrayer === Prayer.Fajr) {
     const timeStr = nextPrayerTime ? getFormattedTime(nextPrayerTime) : "";
     return {
       isOpen: false,
       text: `Closed (Fajr ${timeStr})`, 
       color: "#cf1322", // Merah
     };
  }

  // Case C: Menunggu waktu sholat berikutnya (misal setelah Sunrise sebelum Dhuhr, atau setelah Dhuhr sebelum Asr)
  if (nextPrayer !== Prayer.None && nextPrayerTime) {
    return {
      isOpen: true,
      text: `Next: ${capitalize(nextPrayer)} ${getFormattedTime(nextPrayerTime)}`,
      color: "#d48806", // Oranye/Kuning
    };
  }

  // Default Fallback
  return {
    isOpen: true,
    text: "Open for Prayer",
    color: "#2e7d32",
  };
};

=======
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
};

<<<<<<< HEAD
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createCustomIcon = (price, isActive) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div class="custom-icon-pin ${
      isActive ? "active" : ""
    }"><i>
      <svg width="14" height="14" fill="white" viewBox="0 0 512 512">
        <path d="M256 0c-24.8 0-48.2 4.6-69.7 13 41.5 24 69.7 68.8 69.7 119.9 0 76.5-62 138.5-138.5 138.5-20.9 0-40.8-4.4-58.8-12.2C76 295.4 163.6 384 271.5 384c97.6 0 178.5-70.1 196.2-162.9-20.3 5.9-41.8 9.1-64.2 9.1-123.7 0-224-100.3-224-224 0-2.3.1-4.6.2-6.9C205.8 4.6 230.4 0 256 0z"/>
      </svg>
    </i></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

=======
// --- CUSTOM MARKER ICON (MASJID) ---
const createCustomIcon = (source, isActive) => {
  const color = source === "contributor" ? "#D4AF37" : "#1B4D3E";
  const zIndex = source === "contributor" ? 200 : 100;
  const scale = isActive ? 1.3 : 1;

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="transform: scale(${scale}); transition: all 0.3s; display: flex; justify-content: center; align-items: center;">
        <div style="background: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                 <path d="M22.5 12h-2.1c.3-1.6.6-3.2.6-5 0-3.3-2.7-6-6-6s-6 2.7-6 6c0 1.8.3 3.4.6 5H4.5c-1.4 0-2.5 1.1-2.5 2.5v7h20v-7c0-1.4-1.1-2.5-2.5-2.5zM12 4c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm-4 17v-4h8v4H8z"/>
            </svg>
        </div>
         ${
           source === "contributor"
             ? '<div style="position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; background: #FF5252; border-radius: 50%; border: 2px solid white;"></div>'
             : ""
         }
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    zIndexOffset: isActive ? 1000 : zIndex,
  });
};

const LocationPickerMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) setPosition(marker.getLatLng());
      },
    }),
    [setPosition]
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
      <Popup>Hold & Drag</Popup>
    </Marker>
  );
};

>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
// --- ROUTING MACHINE ---
const RoutingMachine = ({ userLocation, destination, transportMode }) => {
  const map = useMap();
  const routingControlRef = useRef(null);
<<<<<<< HEAD

  useEffect(() => {
    if (!map || !userLocation || !destination) return;

    let osrmProfile = "driving";
    if (transportMode === "walk") osrmProfile = "foot";
    if (transportMode === "bike") osrmProfile = "bike";

=======
  useEffect(() => {
    if (!map || !userLocation || !destination) return;
    let osrmProfile = "driving";
    if (transportMode === "walk") osrmProfile = "foot";
    if (transportMode === "bike") osrmProfile = "bike";
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (e) {}
      routingControlRef.current = null;
    }
<<<<<<< HEAD

=======
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD

=======
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
    try {
      routingControl.addTo(map);
      routingControlRef.current = routingControl;
    } catch (e) {}
<<<<<<< HEAD

=======
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
    return () => {
      if (map && routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {}
        routingControlRef.current = null;
      }
    };
  }, [map, userLocation, destination, transportMode]);
<<<<<<< HEAD

  return null;
};

=======
  return null;
};
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD

=======
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
const MapEvents = ({ onMoveEnd }) => {
  useMapEvents({ moveend: (e) => onMoveEnd(e.target.getCenter()) });
  return null;
};

<<<<<<< HEAD
// --- SIDEBAR CARD ---
const SidebarCard = ({ data, active, onClick, isVisited, t }) => {
  // 👇 GUNAKAN FUNGSI ADHAN BARU DI SINI
  const status = getMosqueStatus(data.lat, data.lng, t);

=======
// --- SIDEBAR CARD (Mosque Variant) ---
const SidebarCard = ({ data, active, onClick, isVisited }) => {
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  return (
    <div
      className={`sidebar-card ${active ? "active" : ""}`}
      onClick={() => onClick(data)}
<<<<<<< HEAD
    >
      {data.tags.includes("Jumu'ah Available") && (
        <div className="promo-ribbon" style={{ background: "#1B4D3E" }}>
          JUMUAH
        </div>
      )}
=======
      style={{
        borderLeft:
          data.source === "contributor"
            ? "4px solid #D4AF37"
            : "4px solid transparent",
      }}
    >
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
      {isVisited && (
        <Tooltip title="Visited">
          <div className="visited-badge">
            <CheckOutlined />
          </div>
        </Tooltip>
      )}
      <img src={data.img} alt="" className="card-bg-faded" />
      <div className="card-content-wrapper">
<<<<<<< HEAD
        <div className="card-title">{data.fullName}</div>
=======
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
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
        <span className="card-meta">
          <FaMosque style={{ marginRight: 4, color: THEME_COLOR }} /> {data.type}
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
=======
        <span className="card-meta">{data.type}</span>

        <div className="card-pills-row" style={{ marginTop: 8 }}>
          {data.tags.includes("Jumu'ah Prayer") && (
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
            <span
              className="card-pill"
              style={{
                borderColor: "#b7eb8f",
                color: "#389e0d",
                background: "#f6ffed",
              }}
            >
<<<<<<< HEAD
              <BankOutlined /> {data.categoryTag}
            </span>
          )}
          {data.tags.includes("Women Area") && (
            <span className="card-pill">
              <WomanOutlined /> Women Area
=======
              <TeamOutlined /> Jumu'ah
            </span>
          )}
          {data.tags.includes("Ladies Section") && (
            <span className="card-pill">
              <WomanOutlined /> Ladies
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
    message.success(lang === "en" ? "切换到中文" : "Switched to English");
  };

  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [userReviews, setUserReviews] = useState({});
  const [visitedIds, setVisitedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
=======
  };

  // Data States
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [placeReviews, setPlaceReviews] = useState([]);
  const [visitedIds, setVisitedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // UI & User States
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [mobileListVisible, setMobileListVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

<<<<<<< HEAD
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {}
    }
=======
  // Contributor States
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [newPlaceLocation, setNewPlaceLocation] = useState(null);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isSubmittingPlace, setIsSubmittingPlace] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [reviewFileList, setReviewFileList] = useState([]);

  // Nav States
  const [isNavigating, setIsNavigating] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [transportMode, setTransportMode] = useState("car");
  const [routeInfo, setRouteInfo] = useState({
    totalDistance: 0,
    totalTime: 0,
  });

  // Filters
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [userLocation, setUserLocation] = useState([39.9042, 116.4074]);
  const [mapCenter, setMapCenter] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(0);

  const [form] = Form.useForm();
  const [contributeForm] = Form.useForm();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
<<<<<<< HEAD
    message.success("Logged out");
  };

  const userMenuItems = [
    { key: "profile", label: "My Profile", icon: <UserOutlined /> },
    { key: "settings", label: "Settings", icon: <SettingOutlined /> },
    { type: "divider" },
=======
    onNavigate("auth");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => message.info("Profile"),
    },
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

<<<<<<< HEAD
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

=======
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  const mosqueTypeItems = CATEGORIES.map((cat) => ({
    key: cat,
    label: cat,
    onClick: () => setActiveFilter(cat),
  }));

<<<<<<< HEAD
  const calculateRouteData = (mode, start, end) => {
    if (!start || !end) return;
    const distKm = calculateDistance(start[0], start[1], end[0], end[1]);
    const speed = SPEEDS[mode] || SPEEDS.car;
    const timeHours = distKm / speed;
    const timeSeconds = timeHours * 3600;
    const realDistMeters = distKm * 1000 * 1.3;
    const realTimeSeconds = timeSeconds * 1.3;
    setRouteInfo({
      totalDistance: realDistMeters,
      totalTime: realTimeSeconds,
    });
  };

  useEffect(() => {
    if (selectedPlace && userLocation) {
      calculateRouteData(transportMode, userLocation, [
        selectedPlace.lat,
        selectedPlace.lng,
      ]);
=======
  // Route Calc
  useEffect(() => {
    if (selectedPlace && userLocation) {
      const distKm = calculateDistance(
        userLocation[0],
        userLocation[1],
        selectedPlace.lat,
        selectedPlace.lng
      );
      const speed = SPEEDS[transportMode] || SPEEDS.car;
      setRouteInfo({
        totalDistance: distKm * 1000 * 1.3,
        totalTime: (distKm / speed) * 3600 * 1.3,
      });
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
    }
  }, [selectedPlace, transportMode, userLocation]);

  const handleTransportChange = (e) => {
    setTransportMode(e.target.value);
  };

<<<<<<< HEAD
  const fetchPlaces = async (lat, lng, retryCount = 0) => {
    setIsLoading(true);
    const generateNearbyMockData = (cLat, cLng) => {
      return Array.from({ length: 15 }).map((_, i) => {
        const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        let myTags = ["Jumu'ah Available", "Wudu Facility"];
        const pool = POSSIBLE_TAGS.filter((t) => !myTags.includes(t)).sort(
          () => 0.5 - Math.random()
        );
        myTags.push(...pool.slice(0, 3));

        return {
          id: `mock-mosque-${i}`,
          fullName: `Masjid Al-Nur ${i + 1}`,
          lat: cLat + (Math.random() - 0.5) * 0.04,
          lng: cLng + (Math.random() - 0.5) * 0.04,
          type: "Mosque",
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          reviews: Math.floor(Math.random() * 500) + 20,
          img: MOSQUE_IMAGES[i % MOSQUE_IMAGES.length],
          tags: [...new Set(myTags)],
          categoryTag: cat,
          address: "Nearby Islamic Center",
          price: "Free",
        };
      });
    };

    try {
      const query = `[out:json][timeout:15];(node["amenity"="place_of_worship"]["religion"="muslim"](around:${MAX_RADIUS_METERS}, ${lat}, ${lng}););out ${MAX_RESULTS};`;
      const response = await fetch(
        "https://overpass.kumi.systems/api/interpreter",
        { method: "POST", body: query }
      );
      if (response.status === 429) {
        if (retryCount < 2) {
          await wait(2000);
          return fetchPlaces(lat, lng, retryCount + 1);
        } else throw new Error("Busy");
      }
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      if (!data.elements || data.elements.length === 0) {
        const mocks = generateNearbyMockData(lat, lng);
        setAllPlaces(recalculateDistances(mocks, lat, lng));
        setIsLoading(false);
        return;
      }
      const mapped = data.elements.map((item, i) => {
        let tags = ["Wudu Facility"];
        const pool = POSSIBLE_TAGS.sort(() => 0.5 - Math.random());
        tags.push(...pool.slice(0, 3));
        const name =
          item.tags.name ||
          item.tags["name:en"] ||
          item.tags["name:ar"] ||
          "Masjid Nearby";
        return {
          id: item.id,
          fullName: name,
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
          price: "Free",
        };
      });
      const withDistance = recalculateDistances(mapped, lat, lng);
      setAllPlaces(
        withDistance.filter((p) => p.rawDistance * 1000 <= MAX_RADIUS_METERS)
      );
    } catch (err) {
      const mocks = generateNearbyMockData(lat, lng);
      setAllPlaces(recalculateDistances(mocks, lat, lng));
=======
  // --- FETCH MOSQUES ---
  const fetchPlaces = async (lat, lng) => {
    setIsLoading(true);
    try {
      const dbPromise = api.get("/places");
      const query = `[out:json][timeout:15];(node["amenity"="place_of_worship"]["religion"="muslim"](around:${MAX_RADIUS_METERS}, ${lat}, ${lng}););out ${MAX_RESULTS};`;
      const osmPromise = fetch(
        "https://overpass.kumi.systems/api/interpreter",
        { method: "POST", body: query }
      );

      const [dbRes, osmRes] = await Promise.allSettled([dbPromise, osmPromise]);
      let combined = [];

      // DB Data
      if (dbRes.status === "fulfilled" && dbRes.value.data.success) {
        const dbPlaces = dbRes.value.data.data
          .filter((p) => p.category === "Mosque")
          .map((p) => {
            let placeImage = MOSQUE_IMAGES[0];
            if (p.photos && p.photos.length > 0) {
              try {
                let parsed =
                  typeof p.photos === "string"
                    ? JSON.parse(p.photos)
                    : p.photos;
                if (parsed.length > 0) {
                  placeImage = parsed[0].startsWith("http")
                    ? parsed[0]
                    : `${BACKEND_URL}${parsed[0]}`;
                }
              } catch (e) {}
            }
            return {
              id: `db-${p.id}`,
              originalId: p.id,
              fullName: p.name_en,
              name_cn: p.name_cn,
              lat: parseFloat(p.latitude),
              lng: parseFloat(p.longitude),
              type: "Mosque",
              rating: 5.0,
              reviews: 1,
              img: placeImage,
              source: "contributor",
              tags: ["Jumu'ah Prayer"],
              address: p.address,
              categoryTag: "Grand Mosque",
            };
          });
        combined = [...combined, ...dbPlaces];
      }

      // OSM Data
      if (osmRes.status === "fulfilled" && osmRes.value.ok) {
        const osmData = await osmRes.value.json();
        const osmPlaces = osmData.elements.map((item, i) => {
          let tags = ["Jumu'ah Prayer"];
          const pool = [
            "Ladies Section",
            "Wudu Area",
            "Air Conditioned",
            "Parking",
          ].sort(() => 0.5 - Math.random());
          tags.push(...pool.slice(0, 3));
          return {
            id: `osm-${item.id}`,
            originalId: item.id,
            fullName:
              item.tags["name:en"] || item.tags.name || "Masjid / Musalla",
            name_cn: item.tags.name,
            lat: item.lat,
            lng: item.lon,
            type: "Mosque",
            rating: (4.0 + Math.random()).toFixed(1),
            reviews: Math.floor(Math.random() * 50) + 10,
            img: MOSQUE_IMAGES[i % MOSQUE_IMAGES.length],
            tags: [...new Set(tags)],
            categoryTag: "Masjid",
            address: getAddressFromTags(item.tags),
            source: "osm",
          };
        });
        combined = [...combined, ...osmPlaces];
      }

      const finalData = combined.map((p) => {
        const dist = calculateDistance(lat, lng, p.lat, p.lng);
        return {
          ...p,
          rawDistance: dist,
          distanceFormatted:
            dist < 1
              ? `${(dist * 1000).toFixed(0)} m`
              : `${dist.toFixed(1)} km`,
        };
      });
      setAllPlaces(finalData);
    } catch (err) {
      console.error(err);
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  // --- FETCH REVIEWS ---
  const fetchReviews = async (placeId) => {
    try {
      const response = await api.get(`/reviews/${placeId}`);
      if (response.data.success) {
        const mappedReviews = response.data.data.map((r) => {
          let photos = [];
          try {
            photos =
              typeof r.photos === "string" ? JSON.parse(r.photos) : r.photos;
          } catch (e) {}
          if (!Array.isArray(photos)) photos = [];
          return {
            user: r.user ? r.user.name || r.user.username : "Anonymous",
            avatar: r.user?.avatar_url
              ? `${BACKEND_URL}${r.user.avatar_url}`
              : null,
            rating: r.rating,
            text: r.comment,
            date: new Date(r.created_at).toLocaleDateString(),
            photos: photos.map((p) =>
              p.startsWith("http") ? p : `${BACKEND_URL}${p}`
            ),
          };
        });
        setPlaceReviews(mappedReviews);
      }
    } catch (e) {
      setPlaceReviews([]);
    }
  };

  useEffect(() => {
    if (selectedPlace) fetchReviews(selectedPlace.id);
  }, [selectedPlace]);

  // --- HANDLERS (DEFINISIKAN SEMUA DISINI) ---

  const startAddPlace = () => {
    if (!user) {
      message.warning("Please sign in to contribute.");
      return onNavigate("auth");
    }
    setIsPickingLocation(true);
    setNewPlaceLocation(mapCenter);
    setDrawerVisible(false);
    message.info("Drag the red pin to the mosque location!");
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

      formData.append("category", "Mosque");
      formData.append("halal_status", "Verified");

      formData.append("address", values.address);
      if (values.promo_details)
        formData.append("promo_details", values.promo_details);
      formData.append("latitude", newPlaceLocation.lat);
      formData.append("longitude", newPlaceLocation.lng);

      fileList.forEach((file) => {
        if (file.originFileObj) formData.append("photos", file.originFileObj);
      });

      await api.post("/places/contribute", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Mosque submitted!");
      setIsContributeModalOpen(false);
      contributeForm.resetFields();
      setFileList([]);
      setNewPlaceLocation(null);
      fetchPlaces(mapCenter.lat, mapCenter.lng);
    } catch (err) {
      message.error("Failed to submit.");
    } finally {
      setIsSubmittingPlace(false);
    }
  };

  const handleReviewSubmit = async (values) => {
    if (!user) {
      message.warning("Please login to review");
      return onNavigate("auth");
    }
    setIsSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append("place_id", selectedPlace.id);
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

      message.success("Review posted!");
      setReviewModalVisible(false);
      form.resetFields();
      setReviewFileList([]);
      fetchReviews(selectedPlace.id);
    } catch (error) {
      message.error("Failed to post review");
    } finally {
      setIsSubmittingReview(false);
    }
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  };

  const handleToggleVisited = (id) => {
    const newSet = new Set(visitedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setVisitedIds(newSet);
    message.success(
      newSet.has(id) ? "Marked as visited" : "Removed from history"
    );
  };

  const handleStartNavigation = () => {
    if (!selectedPlace) return;
    setDestinationCoords([selectedPlace.lat, selectedPlace.lng]);
    setIsNavigating(true);
    setDrawerVisible(false);
    setMobileListVisible(false);
<<<<<<< HEAD
    message.loading("Calculating route to Mosque...", 1.0);
=======
    message.loading("Calculating route...", 1.0);
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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

<<<<<<< HEAD
  const handleReviewSubmit = (values) => {
    const newReview = {
      user: "You",
      rating: values.rating,
      text: values.review,
      date: "Just now",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    };
    setUserReviews((prev) => ({
      ...prev,
      [selectedPlace.id]: [newReview, ...(prev[selectedPlace.id] || [])],
    }));
    message.success("Review posted successfully!");
    setReviewModalVisible(false);
    form.resetFields();
  };

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
        calculateQiblaDirection(userLocation[0], userLocation[1])
      );
  }, [userLocation]);

=======
  // --- LOCATE & FILTER EFFECT ---
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
        message.warning("Using approximate location (IP).");
      }
    } catch (error) {
      const defaultLoc = [-6.1702, 106.8314];
      setUserLocation(defaultLoc);
      setMapCenter({ lat: defaultLoc[0], lng: defaultLoc[1] });
      fetchPlaces(defaultLoc[0], defaultLoc[1]);
=======
        message.warning("GPS failed. Using approximate location.");
      }
    } catch (error) {
      message.error("Could not determine location.");
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
      () => {
        message.error("Check GPS settings");
        fallbackToIpLocation();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

=======
      (err) => {
        fallbackToIpLocation();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  const handleMapMoveEnd = (center) => setMapCenter(center);
  const handleSearchArea = () => {
    if (mapCenter) fetchPlaces(mapCenter.lat, mapCenter.lng);
  };
<<<<<<< HEAD
  const safeFilteredPlaces = filteredPlaces.filter((p) =>
    isValidCoordinate(p.lat, p.lng)
  );
  const safeUserLocation = isValidCoordinate(
    userLocation?.[0],
    userLocation?.[1]
  )
    ? userLocation
    : [-6.1702, 106.8314];
  const getCurrentReviews = () => {
    if (!selectedPlace) return [];
    return [...(userReviews[selectedPlace.id] || []), ...INITIAL_REVIEWS];
  };

=======

  useEffect(() => {
    let result = [...allPlaces];
    if (activeFilter !== "All") {
      if (CATEGORIES.includes(activeFilter))
        result = result.filter(
          (p) =>
            p.categoryTag === activeFilter || p.fullName.includes(activeFilter)
        );
      else result = result.filter((p) => p.tags.includes(activeFilter));
    }
    if (searchText)
      result = result.filter((p) =>
        p.fullName.toLowerCase().includes(searchText.toLowerCase())
      );

    result.sort((a, b) => a.rawDistance - b.rawDistance);
    setFilteredPlaces(result);
  }, [allPlaces, activeFilter, searchText]);

  useEffect(() => {
    handleLocateMe();
  }, []);
  useEffect(() => {
    if (userLocation)
      setQiblaDirection(
        calculateQiblaDirection(userLocation[0], userLocation[1])
      );
  }, [userLocation]);

  // --- RENDER CONTENT ---
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
  const renderListContent = () => (
    <>
      <div className="sidebar-header">
        <Input
<<<<<<< HEAD
          id="sidebar-search"
          placeholder="Search mosques..."
          className="sidebar-search-input"
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          onChange={(e) => setSearchText(e.target.value)}
          bordered={false}
=======
          placeholder="Search Mosque..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          variant="borderless"
          className="sidebar-search-input"
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
        />
        <div className="sidebar-tabs">
          <div
            className={`tab-item ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            <BankOutlined /> All
          </div>
<<<<<<< HEAD
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
=======
          <div
            className={`tab-item ${
              activeFilter === "Jumu'ah Prayer" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Jumu'ah Prayer")}
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
          >
            <TeamOutlined /> Jumu'ah
          </div>
          <div
            className={`tab-item ${
<<<<<<< HEAD
              activeFilter === "Women Area" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Women Area")}
          >
            <WomanOutlined /> Women Area
          </div>
          <div
            className={`tab-item ${
              activeFilter === "Quran Class" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Quran Class")}
          >
            <ReadFilled /> Quran Class
=======
              activeFilter === "Ladies Section" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Ladies Section")}
          >
            <WomanOutlined /> Ladies
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
        ) : safeFilteredPlaces.length > 0 ? (
          <>
            <div className="list-section-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaMosque style={{ fontSize: 16 }} />
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
                isVisited={visitedIds.has(place.id)}
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
=======
        ) : (
          filteredPlaces.map((p) => (
            <SidebarCard
              key={p.id}
              data={p}
              active={selectedPlace?.id === p.id}
              onClick={() => {
                setSelectedPlace(p);
                setDrawerVisible(true);
                if (isMobile) setMobileListVisible(false);
              }}
            />
          ))
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
        )}
      </div>
    </>
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
<<<<<<< HEAD
      {/* NAVBAR */}
      <header className="navbar-container">
              <div className="container navbar">
                <div
                  className="brand-logo"
                  onClick={() => onNavigate("landing")}
                  style={{ cursor: "pointer" }}
                >
                  <GlobalOutlined className="logo-icon" /> <span>QingzhenMu</span>
                </div>
      
                {/* MENU LINKS (DESKTOP + MOBILE DROPDOWN) */}
                <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
                  <Button
                    type="link"
                    className="active text-green"
                    onClick={() => {
                      onNavigate("finder");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {t("nav_finder")}
                  </Button>
                  <Button type="link" onClick={() => onNavigate("mosque")}>
                                {t("nav_mosque")}
                    </Button>
                  <Button type="link" onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav_prayer")}
                  </Button>
                  <Button type="link" onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav_community")}
                  </Button>
                  <Button type="link" onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav_blog")}
                  </Button>
      
                  {/* ITEM KHUSUS MOBILE DALAM DROPDOWN */}
                  {isMobile && (
                    <>
                      <Divider style={{ margin: "8px 0" }} />
      
                      {/* Mobile: Tampilan User jika Login */}
                      {user ? (
                        <div style={{ padding: "0 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            <Avatar src={user.avatar_url} icon={<UserOutlined />} />
                            {/* 👇 FIX: Utamakan 'name', lalu 'username' */}
                            <Text strong>{user.name || user.username}</Text>
                          </div>
                          <Button
                            block
                            icon={<UserOutlined />}
                            style={{ marginBottom: 8 }}
                            onClick={() => message.info("Profile")}
                          >
                            My Profile
                          </Button>
                          <Button
                            block
                            icon={<LogoutOutlined />}
                            danger
                            onClick={handleLogout}
                          >
                            Log Out
                          </Button>
                        </div>
                      ) : (
                        /* Mobile: Tampilan Sign In jika Belum Login */
                        <Button type="text" onClick={() => onNavigate("auth")}>
                          {t("nav_signin")}
                        </Button>
                      )}
      
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="text"
                        onClick={() => {
                          toggleLanguage();
                          setIsMobileMenuOpen(false);
                        }}
                        icon={<TranslationOutlined />}
                      >
                        {lang === "en" ? "Switch to Chinese" : "Switch to English"}
                      </Button>
                    </>
                  )}
                </div>
      
                <div className="nav-actions">
                  {/* Tombol Bahasa & Sign In: Tambahkan class 'hide-mobile' */}
                  <Button
                    type="text"
                    className="hide-mobile"
                    icon={<TranslationOutlined />}
                    onClick={toggleLanguage}
                    style={{ fontWeight: "bold", marginRight: 8 }}
                  >
                    {lang === "en" ? "CN" : "EN"}
                  </Button>
      
                  {/* 👇 LOGIC TOMBOL LOGIN / PROFILE (Desktop) */}
                  <div className="hide-mobile">
                    {user ? (
                      // Jika User Login: Tampilkan Dropdown Profile
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
                              {/* 👇 FIX: Utamakan 'name', lalu 'username' */}
                              {user.name || user.username || "User"}
                            </Text>
                            <DownOutlined style={{ fontSize: 10, color: "#999" }} />
                          </Space>
                        </Button>
                      </Dropdown>
                    ) : (
                      // Jika Belum Login: Tampilkan Tombol Sign In
                      <Button type="text" onClick={() => onNavigate("auth")}>
                        {t("nav_signin")}
                      </Button>
                    )}
                  </div>
      
                  <Button className="btn-gold" shape="round">
                    {t("nav_download")}
                  </Button>
      
                  {/* TOMBOL HAMBURGER */}
                  <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                  </button>
                </div>
              </div>
            </header>
            
      {/* MAIN CONTENT */}
=======
      <header className="navbar-container">
        <div className="container navbar">
          <div
            className="brand-logo"
            onClick={() => onNavigate("landing")}
            style={{ cursor: "pointer" }}
          >
            <GlobalOutlined className="logo-icon" /> <span>QingzhenMu</span>
          </div>
          <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
            <Button type="link" onClick={() => onNavigate("finder")}>
              {t("nav_finder")}
            </Button>
            <Button type="link" className="active text-green">
              {t("nav_mosque")}
            </Button>
            <Button type="link">{t("nav_prayer")}</Button>
            <Button type="link">{t("nav_community")}</Button>
            {/* User Profile / Logout */}
            {user ? (
              <div className="hide-mobile" style={{ marginLeft: 10 }}>
                <Dropdown menu={{ items: userMenuItems }}>
                  <Button type="text">
                    <Avatar src={user.avatar_url} icon={<UserOutlined />} />{" "}
                    {user.name || user.username} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            ) : (
              <Button type="text" onClick={() => onNavigate("auth")}>
                {t("nav_signin")}
              </Button>
            )}
          </div>
          <div className="nav-actions">
            <Button
              type="text"
              className="hide-mobile"
              onClick={toggleLanguage}
            >
              {lang === "en" ? "CN" : "EN"}
            </Button>
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuOutlined />
            </button>
          </div>
        </div>
      </header>

>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
          {/* MAP OVERLAY (SEARCH BAR & PILLS) */}
          {!isNavigating && (
            <div
              className="map-overlay-top-left"
              style={{
                position: "absolute",
                top: isMobile ? 16 : 24,
                left: isMobile ? 16 : 24,
                right: isMobile ? 120 : "auto", // Gunakan logika HalalFinder asli agar tidak menabrak
                zIndex: 900,
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
                  <SearchOutlined style={{ flexShrink: 0 }} />
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
          )}

          {/* QIBLA WIDGET (ICON BULAT) */}
          {userLocation && (
            <div
              className="qibla-widget-container"
              style={{
                top: isMobile ? 16 : 24,
                right: isMobile ? 16 : 24,
                zIndex: 1001,
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

          {/* NAV HUD */}
          {isNavigating && (
            <div
              style={{
                position: "absolute",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                background: "rgba(255, 255, 255, 0.95)",
                padding: "8px 20px",
                borderRadius: "30px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                display: "flex",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 20, color: THEME_COLOR }}>
                <FaMosque />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.1,
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 800 }}>
                  {formatDuration(routeInfo.totalTime)}
                </span>
                <span style={{ fontSize: 12, color: "#888" }}>
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
            {!isNavigating && <AutoFitBounds places={safeFilteredPlaces} />}
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
                  html: `<div style="width: 20px; height: 20px; background: #1890ff; border: 3px solid white; border-radius: 50%;"></div>`,
                })}
              />
            )}
            {safeFilteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={createCustomIcon(selectedPlace?.id === place.id)}
                eventHandlers={{
                  click: () => {
                    setSelectedPlace(place);
                    setDrawerVisible(true);
                  },
                }}
              />
            ))}
          </MapContainer>

=======
          {isPickingLocation && (
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
              <EnvironmentFilled style={{ color: "#D32F2F" }} />{" "}
              <Text strong>Drag marker to mosque location</Text>
              <Button type="primary" size="small" onClick={confirmLocation}>
                Confirm
              </Button>
              <Button
                size="small"
                onClick={cancelAddPlace}
                icon={<CloseOutlined />}
              />
            </div>
          )}

          {/* Map Controls */}
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
          <div
            style={{
              position: "absolute",
              bottom: isMobile ? 100 : 32,
              right: isMobile ? 16 : 32,
              zIndex: 900,
              display: "flex",
              flexDirection: "column",
              gap: 12,
<<<<<<< HEAD
            }}
          >
=======
              alignItems: "flex-end",
            }}
          >
            {!isPickingLocation && !isNavigating && user && (
              <Tooltip title="Add Mosque" placement="left">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined style={{ fontSize: 20 }} />}
                  onClick={startAddPlace}
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: "#D4AF37",
                    borderColor: "#D4AF37",
                  }}
                />
              </Tooltip>
            )}
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
            <Button
              icon={<AimOutlined style={{ fontSize: 20 }} />}
              onClick={handleLocateMe}
              style={{ width: 44, height: 44, borderRadius: 8 }}
            />
<<<<<<< HEAD
            {!isNavigating && (
              <Button
                icon={<SearchOutlined />}
                onClick={handleSearchArea}
                loading={isLoading}
                style={{ height: 44, borderRadius: 8 }}
              >
                {isMobile ? "Redo" : t("btn_redo")}
              </Button>
            )}
          </div>
          {isMobile && !isNavigating && !drawerVisible && (
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
              }}
            >
              Exit Navigation
            </Button>
          )}
        </div>
=======
            <Button
              icon={<SearchOutlined />}
              onClick={handleSearchArea}
              loading={isLoading}
              style={{ height: 44, fontWeight: 600 }}
            >
              {isMobile ? "Redo" : "Redo Search"}
            </Button>
          </div>

          <MapContainer
            center={userLocation || [39.9, 116.4]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEvents onMoveEnd={handleMapMoveEnd} />
            {!isNavigating && !isPickingLocation && (
              <AutoFitBounds places={filteredPlaces} />
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
                  html: `<div style="width: 20px; height: 20px; background: #1890ff; border: 3px solid white; border-radius: 50%;"></div>`,
                })}
              />
            )}

            {isPickingLocation && newPlaceLocation && (
              <LocationPickerMarker
                position={newPlaceLocation}
                setPosition={setNewPlaceLocation}
              />
            )}

            {!isPickingLocation &&
              filteredPlaces.map((p) => (
                <Marker
                  key={p.id}
                  position={[p.lat, p.lng]}
                  icon={createCustomIcon(p.source, selectedPlace?.id === p.id)}
                  eventHandlers={{
                    click: () => {
                      setSelectedPlace(p);
                      setDrawerVisible(true);
                    },
                  }}
                />
              ))}
          </MapContainer>
        </div>

>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
        {!isMobile && (
          <div className="finder-list-container">{renderListContent()}</div>
        )}
      </div>

<<<<<<< HEAD
      {isMobile && (
        <Drawer
          title="Mosques Nearby"
          placement="bottom"
          onClose={() => setMobileListVisible(false)}
          open={mobileListVisible}
          height="85vh"
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

      <Drawer
        title={null}
        placement={isMobile ? "bottom" : "right"}
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={isMobile ? "100%" : 480}
        height={isMobile ? "90vh" : "100%"}
=======
      <Drawer
        title={null}
        placement={isMobile ? "bottom" : "right"}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={isMobile ? "100%" : 480}
        height="85vh"
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
        className="place-detail-drawer"
        styles={{ body: { padding: 0 } }}
      >
        {selectedPlace && (
          <>
            <div className="detail-hero">
              <img
                src={selectedPlace.img}
                className="detail-hero-img"
                alt="Mosque"
              />
              <div className="detail-hero-overlay">
<<<<<<< HEAD
                <Tag
                  color="gold"
                  style={{
                    width: "fit-content",
                    marginBottom: 8,
                    fontWeight: 800,
                  }}
                >
                  {selectedPlace.rating} ★ Rated
                </Tag>
                <Title level={2} style={{ color: "white", margin: 0 }}>
                  {selectedPlace.fullName}
                </Title>
                <Text
                  style={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}
                >
                  {selectedPlace.type} • {selectedPlace.categoryTag}
                </Text>
              </div>
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "none",
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
                    visitedIds.has(selectedPlace.id) ? "primary" : "default"
                  }
                  ghost={!visitedIds.has(selectedPlace.id)}
                  icon={
                    visitedIds.has(selectedPlace.id) ? (
                      <CheckCircleFilled />
                    ) : (
                      <EyeFilled />
                    )
                  }
                  onClick={() => handleToggleVisited(selectedPlace.id)}
                  style={{ borderRadius: 20 }}
                >
                  {visitedIds.has(selectedPlace.id)
                    ? "Visited"
                    : "Mark Visited"}
                </Button>
              </div>
              <div className="detail-stats-grid">
                <div className="stat-box">
                  <span className="stat-value" style={{ color: ACCENT_COLOR }}>
                    {selectedPlace.rating}
                  </span>
=======
                <Title level={2} style={{ color: "white", margin: 0 }}>
                  {selectedPlace.fullName}
                </Title>
                <Text style={{ color: "white" }}>
                  {selectedPlace.categoryTag}
                </Text>
              </div>
            </div>
            <div className="detail-sheet-content">
              <div className="detail-stats-grid">
                <div className="stat-box">
                  <span className="stat-value">{selectedPlace.rating}</span>
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">
                    {selectedPlace.distanceFormatted}
                  </span>
                  <span className="stat-label">Distance</span>
                </div>
<<<<<<< HEAD
                
                {/* 👇 UPDATE TAMPILAN STATUS DRAWER MENGGUNAKAN ADHAN */}
                {(() => {
                    const detailStatus = getMosqueStatus(selectedPlace.lat, selectedPlace.lng, t);
                    return (
                        <div className="stat-box">
                          <span 
                            className="stat-value" 
                            style={{ 
                                color: detailStatus.color, 
                                fontSize: 13, 
                                lineHeight: '1.2' 
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
=======
              </div>

>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
                  ESTIMATED TIME
=======
                  ESTIMATED TRIP ({t("nav_est_time")})
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
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
<<<<<<< HEAD
                    <FaWalking /> Walk
=======
                    <FaWalking style={{ marginRight: 6 }} /> Walk
                  </Radio.Button>
                  <Radio.Button
                    value="bike"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <FaBicycle style={{ marginRight: 6 }} /> Bike
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                  </Radio.Button>
                  <Radio.Button
                    value="moto"
                    style={{ flex: 1, textAlign: "center" }}
                  >
<<<<<<< HEAD
                    <FaMotorcycle /> Moto
=======
                    <FaMotorcycle style={{ marginRight: 6 }} /> Moto
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                  </Radio.Button>
                  <Radio.Button
                    value="car"
                    style={{ flex: 1, textAlign: "center" }}
                  >
<<<<<<< HEAD
                    <FaCar /> Car
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
=======
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
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                <Button
                  type="primary"
                  size="large"
                  icon={<CompassFilled />}
                  style={{
<<<<<<< HEAD
                    flex: 1,
                    background: THEME_COLOR,
                    height: 50,
                    borderRadius: 14,
=======
                    height: 50,
                    borderRadius: 14,
                    fontWeight: 700,
                    fontSize: 16,
                    background: THEME_COLOR,
                    flex: 1,
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                  }}
                  onClick={handleStartNavigation}
                >
                  {t("btn_navigate")}
                </Button>
                <Button
                  size="large"
<<<<<<< HEAD
                  icon={<ArrowRightOutlined rotate={-45} />}
                  style={{
                    flex: "none",
                    height: 50,
                    width: 50,
                    borderRadius: 14,
                  }}
                  onClick={handleGetDirections}
                />
              </div>
              <Tabs
                defaultActiveKey="1"
=======
                  icon={<PlusOutlined />}
                  style={{ height: 50, width: 50, borderRadius: 14 }}
                  onClick={() => setReviewModalVisible(true)}
                />
                <Button
                  size="large"
                  icon={<ArrowRightOutlined rotate={-45} />}
                  style={{ height: 50, width: 50, borderRadius: 14 }}
                  onClick={handleGetDirections}
                />
              </div>

              <Tabs
                defaultActiveKey="1"
                className="custom-tabs"
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                items={[
                  {
                    key: "1",
                    label: "Overview",
                    children: (
<<<<<<< HEAD
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
                            <Text strong>{t("lbl_location")}</Text>
                            <Text type="secondary" style={{ display: "block" }}>
=======
                      <div style={{ marginTop: 16 }}>
                        <div
                          style={{ display: "flex", gap: 10, marginBottom: 16 }}
                        >
                          <EnvironmentOutlined
                            style={{ fontSize: 20, color: THEME_COLOR }}
                          />
                          <div>
                            <Text strong>Location</Text>
                            <br />
                            <Text type="secondary">
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                              {selectedPlace.address}
                            </Text>
                          </div>
                        </div>
<<<<<<< HEAD
                        <Text
                          strong
                          style={{
                            fontSize: 15,
                            display: "block",
                            marginBottom: 12,
                          }}
                        >
                          Facilities
                        </Text>
                        <div className="facilities-grid">
                          {[
                            { icon: <TeamOutlined />, label: "Jumu'ah" },
                            { icon: <WomanOutlined />, label: "Women Area" },
                            { icon: <FaMosque />, label: "Wudu Area" },
                            { icon: <CarOutlined />, label: "Parking" },
                            { icon: <ClockCircleOutlined />, label: "AC" },
                            { icon: <ReadFilled />, label: "Quran Class" },
                          ].map((f, i) => (
                            <div key={i} className="facility-box">
                              <div className="facility-icon-wrapper">
                                {f.icon}
                              </div>
                              <span className="facility-label">{f.label}</span>
                            </div>
=======
                        <Text strong>Facilities:</Text>
                        <div
                          className="facilities-grid"
                          style={{ marginTop: 8 }}
                        >
                          {selectedPlace.tags.map((tag) => (
                            <Tag
                              key={tag}
                              color="green"
                              style={{ padding: "4px 8px", fontSize: 13 }}
                            >
                              {tag}
                            </Tag>
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: "Reviews",
                    children: (
<<<<<<< HEAD
                      <div style={{ paddingTop: 12 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 16,
                          }}
                        >
                          <Title level={5} style={{ margin: 0 }}>
                            Recent Reviews
                          </Title>
                          <Button
                            type="link"
                            onClick={() => setReviewModalVisible(true)}
                          >
                            Write Review
                          </Button>
                        </div>
                        <List
                          dataSource={getCurrentReviews()}
                          renderItem={(item) => (
                            <div className="review-card-modern">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div style={{ display: "flex", gap: 10 }}>
                                  <Avatar src={item.avatar} />
                                  <div>
                                    <Text strong>{item.user}</Text>
                                    <Text
                                      type="secondary"
                                      style={{ display: "block", fontSize: 11 }}
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
                                  display: "block",
                                  marginTop: 8,
                                  color: "#555",
                                }}
                              >
                                {item.text}
                              </Text>
                            </div>
                          )}
                        />
                      </div>
=======
                      <List
                        dataSource={placeReviews}
                        renderItem={(item) => (
                          <div className="review-card-modern">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ display: "flex", gap: 10 }}>
                                <Avatar src={item.avatar} />{" "}
                                <div>
                                  <Text strong>{item.user}</Text>
                                  <br />
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
                                style={{ fontSize: 12 }}
                              />
                            </div>
                            <p style={{ marginTop: 8 }}>{item.text}</p>
                            {item.photos &&
                              item.photos.map((p, i) => (
                                <img
                                  key={i}
                                  src={p}
                                  style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 8,
                                    marginRight: 8,
                                  }}
                                />
                              ))}
                          </div>
                        )}
                      />
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
                    ),
                  },
                ]}
              />
            </div>
          </>
        )}
      </Drawer>
<<<<<<< HEAD
      <Modal
        title="Write Review"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
        centered
      >
        <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
          <Form.Item
            name="rating"
            label="Rating"
            initialValue={5}
            style={{ textAlign: "center" }}
          >
            <Rate style={{ color: ACCENT_COLOR, fontSize: 32 }} />
          </Form.Item>
          <Form.Item
            name="review"
            label="Review"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
=======

      <Modal
        title="Add Mosque"
        open={isContributeModalOpen}
        onCancel={() => setIsContributeModalOpen(false)}
        footer={null}
      >
        <Form
          form={contributeForm}
          layout="vertical"
          onFinish={handleSubmitPlace}
        >
          <Form.Item
            name="name_en"
            label="Mosque Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Masjid Al-Hikmah" />
          </Form.Item>
          <Form.Item name="name_cn" label="Name (Chinese) - Optional">
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="promo_details" label="Facilities / Notes">
            <TextArea placeholder="e.g. Ladies area on 2nd floor, Jumuah starts at 1:00 PM" />
          </Form.Item>
          <Form.Item label="Upload Photos">
            <Upload
              listType="picture-card"
              maxCount={3}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              fileList={fileList}
            >
              <div>
                <CameraOutlined /> <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
<<<<<<< HEAD
            style={{ background: THEME_COLOR }}
=======
            loading={isSubmittingPlace}
            style={{ backgroundColor: "#D4AF37", borderColor: "#D4AF37" }}
          >
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Write Review"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
          <Form.Item name="rating" label="Rating" initialValue={5}>
            <Rate />
          </Form.Item>
          <Form.Item name="review" label="Review" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Photos">
            <Upload
              listType="picture-card"
              maxCount={3}
              beforeUpload={() => false}
              onChange={({ fileList }) => setReviewFileList(fileList)}
              fileList={reviewFileList}
            >
              <div>
                <CameraOutlined />
              </div>
            </Upload>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmittingReview}
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
          >
            Post Review
          </Button>
        </Form>
      </Modal>
<<<<<<< HEAD
=======

      {isMobile && (
        <Drawer
          title="Mosques Nearby"
          placement="bottom"
          open={mobileListVisible}
          onClose={() => setMobileListVisible(false)}
          height="85vh"
        >
          {renderListContent()}
        </Drawer>
      )}
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
    </div>
  );
}

<<<<<<< HEAD
export default MosqueFinder;
=======
export default MosqueFinder;
>>>>>>> 955c6d9c729ed2d392af86f00e2bea8092976dab
