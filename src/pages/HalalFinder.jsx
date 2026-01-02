// src/pages/HalalFinder.jsx
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
} from "@ant-design/icons";
import { FaWalking, FaBicycle, FaMotorcycle, FaCar } from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

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
const MAX_RADIUS_METERS = 3000;
const MAX_RESULTS = 30;

// --- SPEED CONSTANTS (km/h) ---
const SPEEDS = {
  walk: 5,
  bike: 15,
  moto: 40,
  car: 30,
};

// --- ASSETS & DATA ---
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=60",
  "https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=60",
  "https://images.unsplash.com/photo-1541544744-5e3a01993108?w=600&q=60",
  "https://images.unsplash.com/photo-1606756790138-7c4864384077?w=600&q=60",
];

const POSSIBLE_TAGS = [
  "Verified Halal",
  "Muslim Owned",
  "No Alcohol",
  "Prayer Room",
  "Family Friendly",
];
const CATEGORIES = ["Vegan Option", "Real Food", "Non-Vegan", "Fast Food"];

const INITIAL_REVIEWS = [
  {
    user: "Ahmed",
    rating: 5,
    text: "Alhamdulillah, very authentic taste.",
    date: "2 days ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
  },
  {
    user: "Siti",
    rating: 4,
    text: "Good food, specifically the beef noodles.",
    date: "1 week ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createCustomIcon = (price, isActive) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div class="custom-icon-pin ${
      isActive ? "active" : ""
    }"><i><svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg></i></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// --- ROUTING MACHINE (VISUAL ONLY) ---
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
      } catch (e) {
        console.warn("Cleanup warning", e);
      }
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
    } catch (e) {
      console.error("Routing add error", e);
    }

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
  const status = getOpenStatus(data.openTime, data.closeTime, t);
  return (
    <div
      className={`sidebar-card ${active ? "active" : ""}`}
      onClick={() => onClick(data)}
    >
      {data.isPromo && <div className="promo-ribbon">PROMO</div>}
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

  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [userReviews, setUserReviews] = useState({});
  const [visitedIds, setVisitedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [mobileListVisible, setMobileListVisible] = useState(false);

  // STATE MOBILE MENU
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // USER STATE
  const [user, setUser] = useState(null);

  // EFFECT: Load User
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

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.success("Logged out");
  };

  // MENU ITEMS (DESKTOP)
  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => message.info("Profile Page"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => message.info("Settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

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

  // --- API FETCH LOGIC ---
  const fetchPlaces = async (lat, lng, retryCount = 0) => {
    setIsLoading(true);
    const generateNearbyMockData = (cLat, cLng) => {
      return Array.from({ length: 15 }).map((_, i) => {
        const isPromo = Math.random() > 0.6;
        const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        let myTags = ["Verified Halal"];
        const pool = POSSIBLE_TAGS.filter((t) => t !== "Verified Halal").sort(
          () => 0.5 - Math.random()
        );
        myTags.push(...pool.slice(0, 3));
        if (i % 2 === 0 || Math.random() > 0.5) myTags.push("Family Friendly");
        return {
          id: `mock-${i}`,
          fullName: `Halal Kitchen ${i + 1}`,
          lat: cLat + (Math.random() - 0.5) * 0.02,
          lng: cLng + (Math.random() - 0.5) * 0.02,
          type: "Restaurant",
          rating: (4 + Math.random()).toFixed(1),
          reviews: 120,
          img: FOOD_IMAGES[i % FOOD_IMAGES.length],
          tags: [...new Set(myTags)],
          categoryTag: cat,
          isPromo: isPromo,
          promoText: isPromo ? "20% Off for Lunch" : null,
          openTime: 10,
          closeTime: 22,
          address: "Nearby location",
          price: "🍴🍴",
        };
      });
    };

    try {
      const query = `[out:json][timeout:15];(node["amenity"~"restaurant|cafe|fast_food"](around:${MAX_RADIUS_METERS}, ${lat}, ${lng}););out ${MAX_RESULTS};`;
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
        let tags = ["Verified Halal"];
        const pool = POSSIBLE_TAGS.filter((t) => t !== "Verified Halal").sort(
          () => 0.5 - Math.random()
        );
        tags.push(...pool.slice(0, 3));
        if (i % 2 === 0 || Math.random() > 0.5) tags.push("Family Friendly");
        return {
          id: item.id,
          fullName: item.tags.name || item.tags["name:en"] || "Halal Spot",
          lat: item.lat,
          lng: item.lon,
          type: item.tags.cuisine
            ? item.tags.cuisine.charAt(0).toUpperCase() +
              item.tags.cuisine.slice(1)
            : "Restaurant",
          rating: (3.8 + Math.random() * 1.2).toFixed(1),
          reviews: Math.floor(Math.random() * 200) + 10,
          price: ["🍴", "🍴🍴", "🍴🍴🍴"][Math.floor(Math.random() * 3)],
          img: FOOD_IMAGES[i % FOOD_IMAGES.length],
          tags: [...new Set(tags)],
          categoryTag:
            CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          isPromo: Math.random() > 0.8,
          promoText: "Special Deal",
          openTime: 9,
          closeTime: 21,
          address: getAddressFromTags(item.tags),
        };
      });
      const validPlaces = mapped.filter((p) => p.fullName !== "Halal Spot");
      const withDistance = recalculateDistances(validPlaces, lat, lng);
      setAllPlaces(
        withDistance.filter((p) => p.rawDistance * 1000 <= MAX_RADIUS_METERS)
      );
    } catch (err) {
      console.warn("Using fallback");
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

  // --- EVENT HANDLERS ---
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
        calculateQiblaDirection(userLocation[0], userLocation[1])
      );
  }, [userLocation]);

  // --- GPS & LOCATION LOGIC (IMPROVED: FALLBACK TO IP) ---

  // Fungsi Fallback: Cari lokasi via IP Address (Kurang akurat tapi jalan)
  const fallbackToIpLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        console.log("Using IP Location:", lat, lng);
        setUserLocation([lat, lng]);
        setMapCenter({ lat, lng });
        fetchPlaces(lat, lng);
        message.warning("GPS failed. Using approximate location from IP.");
      }
    } catch (error) {
      console.error("IP Location failed:", error);
      message.error("Could not determine location. Using default.");
      // Default ke Beijing atau Jakarta jika semua gagal
      const defaultLoc = [39.9042, 116.4074];
      setUserLocation(defaultLoc);
      setMapCenter({ lat: defaultLoc[0], lng: defaultLoc[1] });
      fetchPlaces(defaultLoc[0], defaultLoc[1]);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation not supported");
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
        fallbackToIpLocation(); // Coba fallback
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Auto-locate on Mount (Dengan Fallback)
  useEffect(() => {
    if (!navigator.geolocation) {
      fallbackToIpLocation();
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    // Coba ambil lokasi sekali saat load
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("GPS Success:", latitude, longitude);
        setUserLocation([latitude, longitude]);
        setMapCenter({ lat: latitude, lng: longitude });
        fetchPlaces(latitude, longitude);
      },
      (err) => {
        console.warn("GPS Initial Error:", err.message);
        // Jika error (User deny / Timeout / Unavailable), pakai IP
        fallbackToIpLocation();
      },
      geoOptions
    );

    // NOTE: watchPosition dihapus untuk mencegah spam error
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
    : [39.9042, 116.4074];
  const getCurrentReviews = () => {
    if (!selectedPlace) return [];
    return [...(userReviews[selectedPlace.id] || []), ...INITIAL_REVIEWS];
  };

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
          bordered={false}
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
          <div
            className={`tab-item ${
              activeFilter === "Family Friendly" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Family Friendly")}
          >
            <CoffeeOutlined /> {t("filter_family")}
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
            description={t("list_empty")}
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
            <Button type="link" onClick={() => setIsMobileMenuOpen(false)}>
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

      {/* MAIN CONTENT - MOBILE ADJUSTMENT */}
      <div
        className="finder-layout"
        style={{ flexDirection: isMobile ? "column" : "row" }}
      >
        {/* MAP CONTAINER - Full Height on Mobile */}
        <div
          className="finder-map-container"
          style={{
            width: isMobile ? "100%" : "calc(100% - 400px)",
            height: "100%",
          }}
        >
          {/* MAP OVERLAY - Mobile Optimization */}
          {!isNavigating && (
            <div
              className="map-overlay-top-left"
              style={{
                position: "absolute",
                top: isMobile ? 16 : 24,
                left: isMobile ? 16 : 24,
                right: isMobile ? 120 : "auto",
                // zIndex: 900, sudah ada di CSS
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

              {/* PILLS: Tampilan ini akan diatur CSS jadi Vertical di Mobile */}
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
          )}

          {/* QIBLA WIDGET */}
          {userLocation && (
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

          {/* NEW NAVIGATION HUD (DYNAMIC ISLAND) */}
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
                  html: `<div style="width: 20px; height: 20px; background: #1890ff; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.4);"></div>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                })}
                zIndexOffset={100}
              />
            )}
            {safeFilteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={createCustomIcon(
                  place.price,
                  selectedPlace?.id === place.id
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

          {/* BOTTOM CONTROLS */}
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
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            {!isNavigating && (
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

          {/* MOBILE "VIEW LIST" BUTTON */}
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

        {/* SIDEBAR LIST (DESKTOP) */}
        {!isMobile && (
          <div className="finder-list-container">{renderListContent()}</div>
        )}
      </div>

      {/* MOBILE LIST DRAWER */}
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

      {/* DRAWER DETAILS MODERN */}
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
                        t
                      ).color,
                    }}
                  >
                    {getOpenStatus(
                      selectedPlace.openTime,
                      selectedPlace.closeTime,
                      t
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
              <div className="qibla-widget">
                <div>
                  <Text
                    strong
                    style={{ color: "white", fontSize: 16, display: "block" }}
                  >
                    {t("qibla_title")}
                  </Text>
                  <Text
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}
                  >
                    {t("qibla_desc")}
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: "bold", fontSize: 20 }}>
                    {Math.round(qiblaDirection)}°
                  </span>
                  <div className="compass-circle">
                    <CompassFilled
                      style={{
                        transform: `rotate(${qiblaDirection}deg)`,
                        transition: "transform 1s",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* MODE SELECTOR (TRANSPORT SECTION) */}
              {/* Tambahkan class transport-section yang sudah dibuat di CSS */}
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

              {/* TOMBOL NAVIGASI UTAMA (FIX TABRAKAN) */}
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
                    flex: 1, // Agar lebar otomatis mengisi
                    minWidth: 0, // Mencegah overflow
                  }}
                  onClick={handleStartNavigation}
                >
                  {t("btn_navigate")}
                </Button>
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

                        {/* --- FACILITIES SECTION (UPDATED GRID) --- */}
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
                        {/* ------------------------------------- */}

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
                    label: `${t("lbl_reviews")} (${selectedPlace.reviews})`,
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
                          dataSource={getCurrentReviews()}
                          split={false}
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
                                  <Avatar src={item.avatar} size={36} />
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
              beforeUpload={() => false}
              maxCount={3}
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
    </div>
  );
}

export default HalalFinder;
