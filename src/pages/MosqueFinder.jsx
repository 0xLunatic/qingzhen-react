// src/pages/MosqueFinder.jsx
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
  ReadFilled,
  ClockCircleOutlined,
  WifiOutlined,
  CarOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
  TeamOutlined,
  CheckOutlined,
  EyeFilled,
  WomanOutlined,
  DownOutlined,
  AppstoreOutlined,
  TranslationOutlined,
  UnorderedListOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { FaWalking, FaBicycle, FaMotorcycle, FaCar, FaMosque } from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// 👇 IMPORT LIBRARY ADHAN
import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from 'adhan';

// Import CSS
import "../App.css";

// 👇 IMPORT BAHASA
import { en } from "../lang/en";
import { cn } from "../lang/cn";

const { Title, Text } = Typography;
const { TextArea } = Input;

// --- CONSTANTS ---
const THEME_COLOR = "#1B4D3E";
const ACCENT_COLOR = "#C6A87C";
const MECCA_COORDS = { lat: 21.4225, lng: 39.8262 };
const MAX_RADIUS_METERS = 5000;
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

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
};

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
  // 👇 GUNAKAN FUNGSI ADHAN BARU DI SINI
  const status = getMosqueStatus(data.lat, data.lng, t);

  return (
    <div
      className={`sidebar-card ${active ? "active" : ""}`}
      onClick={() => onClick(data)}
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
      <img src={data.img} alt="" className="card-bg-faded" />
      <div className="card-content-wrapper">
        <div className="card-title">{data.fullName}</div>
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
          {data.tags.includes("Women Area") && (
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

  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [userReviews, setUserReviews] = useState({});
  const [visitedIds, setVisitedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [mobileListVisible, setMobileListVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.success("Logged out");
  };

  const userMenuItems = [
    { key: "profile", label: "My Profile", icon: <UserOutlined /> },
    { key: "settings", label: "Settings", icon: <SettingOutlined /> },
    { type: "divider" },
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

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

  const mosqueTypeItems = CATEGORIES.map((cat) => ({
    key: cat,
    label: cat,
    onClick: () => setActiveFilter(cat),
  }));

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
    }
  }, [selectedPlace, transportMode, userLocation]);

  const handleTransportChange = (e) => {
    setTransportMode(e.target.value);
  };

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
    } finally {
      setIsLoading(false);
    }
  };

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
    message.loading("Calculating route to Mosque...", 1.0);
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
        message.warning("Using approximate location (IP).");
      }
    } catch (error) {
      const defaultLoc = [-6.1702, 106.8314];
      setUserLocation(defaultLoc);
      setMapCenter({ lat: defaultLoc[0], lng: defaultLoc[1] });
      fetchPlaces(defaultLoc[0], defaultLoc[1]);
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

  const handleMapMoveEnd = (center) => setMapCenter(center);
  const handleSearchArea = () => {
    if (mapCenter) fetchPlaces(mapCenter.lat, mapCenter.lng);
  };
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

  const renderListContent = () => (
    <>
      <div className="sidebar-header">
        <Input
          id="sidebar-search"
          placeholder="Search mosques..."
          className="sidebar-search-input"
          prefix={<SearchOutlined style={{ color: "#999" }} />}
          onChange={(e) => setSearchText(e.target.value)}
          bordered={false}
        />
        <div className="sidebar-tabs">
          <div
            className={`tab-item ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            <BankOutlined /> All
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
            <WomanOutlined /> Women Area
          </div>
          <div
            className={`tab-item ${
              activeFilter === "Quran Class" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Quran Class")}
          >
            <ReadFilled /> Quran Class
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
        )}
      </div>
    </>
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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

          <div
            style={{
              position: "absolute",
              bottom: isMobile ? 100 : 32,
              right: isMobile ? 16 : 32,
              zIndex: 900,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Button
              icon={<AimOutlined style={{ fontSize: 20 }} />}
              onClick={handleLocateMe}
              style={{ width: 44, height: 44, borderRadius: 8 }}
            />
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
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">
                    {selectedPlace.distanceFormatted}
                  </span>
                  <span className="stat-label">Distance</span>
                </div>
                
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
                  ESTIMATED TIME
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
                    <FaWalking /> Walk
                  </Radio.Button>
                  <Radio.Button
                    value="moto"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <FaMotorcycle /> Moto
                  </Radio.Button>
                  <Radio.Button
                    value="car"
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <FaCar /> Car
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<CompassFilled />}
                  style={{
                    flex: 1,
                    background: THEME_COLOR,
                    height: 50,
                    borderRadius: 14,
                  }}
                  onClick={handleStartNavigation}
                >
                  {t("btn_navigate")}
                </Button>
                <Button
                  size="large"
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
                            <Text strong>{t("lbl_location")}</Text>
                            <Text type="secondary" style={{ display: "block" }}>
                              {selectedPlace.address}
                            </Text>
                          </div>
                        </div>
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
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: "Reviews",
                    children: (
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
                    ),
                  },
                ]}
              />
            </div>
          </>
        )}
      </Drawer>
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
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ background: THEME_COLOR }}
          >
            Post Review
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default MosqueFinder;