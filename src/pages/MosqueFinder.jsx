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
  BankOutlined,
  TeamOutlined,
  WomanOutlined,
  ClockCircleOutlined,
  WifiOutlined,
  CarOutlined,
  CheckCircleFilled,
  InfoCircleOutlined,
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

// Import CSS
import "../App.css";

// 👇 IMPORT API HELPER
import api from "../utils/api";

// 👇 IMPORT BAHASA
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

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
};

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

// --- SIDEBAR CARD (Mosque Variant) ---
const SidebarCard = ({ data, active, onClick, isVisited }) => {
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
      {isVisited && (
        <Tooltip title="Visited">
          <div className="visited-badge">
            <CheckOutlined />
          </div>
        </Tooltip>
      )}
      <img src={data.img} alt="" className="card-bg-faded" />
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
        <span className="card-meta">{data.type}</span>

        <div className="card-pills-row" style={{ marginTop: 8 }}>
          {data.tags.includes("Jumu'ah Prayer") && (
            <span
              className="card-pill"
              style={{
                borderColor: "#b7eb8f",
                color: "#389e0d",
                background: "#f6ffed",
              }}
            >
              <TeamOutlined /> Jumu'ah
            </span>
          )}
          {data.tags.includes("Ladies Section") && (
            <span className="card-pill">
              <WomanOutlined /> Ladies
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
  };

  // Data States
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [placeReviews, setPlaceReviews] = useState([]);
  const [visitedIds, setVisitedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // UI & User States
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [mobileListVisible, setMobileListVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    onNavigate("auth");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => message.info("Profile"),
    },
    {
      key: "logout",
      label: "Log Out",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const mosqueTypeItems = CATEGORIES.map((cat) => ({
    key: cat,
    label: cat,
    onClick: () => setActiveFilter(cat),
  }));

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
    }
  }, [selectedPlace, transportMode, userLocation]);

  const handleTransportChange = (e) => {
    setTransportMode(e.target.value);
  };

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
    } finally {
      setIsLoading(false);
    }
  };

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

  // --- LOCATE & FILTER EFFECT ---
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleMapMoveEnd = (center) => setMapCenter(center);
  const handleSearchArea = () => {
    if (mapCenter) fetchPlaces(mapCenter.lat, mapCenter.lng);
  };

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
  const renderListContent = () => (
    <>
      <div className="sidebar-header">
        <Input
          placeholder="Search Mosque..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          variant="borderless"
          className="sidebar-search-input"
        />
        <div className="sidebar-tabs">
          <div
            className={`tab-item ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            <BankOutlined /> All
          </div>
          <div
            className={`tab-item ${
              activeFilter === "Jumu'ah Prayer" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Jumu'ah Prayer")}
          >
            <TeamOutlined /> Jumu'ah
          </div>
          <div
            className={`tab-item ${
              activeFilter === "Ladies Section" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Ladies Section")}
          >
            <WomanOutlined /> Ladies
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
        )}
      </div>
    </>
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
            <Button
              icon={<AimOutlined style={{ fontSize: 20 }} />}
              onClick={handleLocateMe}
              style={{ width: 44, height: 44, borderRadius: 8 }}
            />
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

        {!isMobile && (
          <div className="finder-list-container">{renderListContent()}</div>
        )}
      </div>

      <Drawer
        title={null}
        placement={isMobile ? "bottom" : "right"}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={isMobile ? "100%" : 480}
        height="85vh"
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
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">
                    {selectedPlace.distanceFormatted}
                  </span>
                  <span className="stat-label">Distance</span>
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
                  }}
                  onClick={handleStartNavigation}
                >
                  {t("btn_navigate")}
                </Button>
                <Button
                  size="large"
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
                items={[
                  {
                    key: "1",
                    label: "Overview",
                    children: (
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
                              {selectedPlace.address}
                            </Text>
                          </div>
                        </div>
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
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: "Reviews",
                    children: (
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
                    ),
                  },
                ]}
              />
            </div>
          </>
        )}
      </Drawer>

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
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
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
          >
            Post Review
          </Button>
        </Form>
      </Modal>

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
    </div>
  );
}

export default MosqueFinder;
