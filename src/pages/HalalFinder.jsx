// src/pages/HalalFinder.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Typography,
  Avatar,
  Select,
  Space,
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
} from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  CheckCircleFilled,
  UsergroupAddOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  AimOutlined,
  LoadingOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  CompassFilled,
  StopOutlined,
  UserOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "../App.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- CONFIGURATION ---
const MAX_RADIUS_METERS = 3000;
const MAX_RESULTS = 30;

// --- ASSETS ---
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

// --- MOCK INITIAL REVIEWS (Agar tidak kosong saat dibuka) ---
const INITIAL_REVIEWS = [
  {
    user: "Ahmed",
    rating: 5,
    text: "Alhamdulillah, very authentic taste. Highly recommended!",
    date: "2 days ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
  },
  {
    user: "Siti Nurhaliza",
    rating: 4,
    text: "Good food, specifically the beef noodles. A bit spicy though.",
    date: "1 week ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
  },
];

// --- UTILS ---
const isValidCoordinate = (lat, lng) => {
  return (
    lat !== null &&
    lng !== null &&
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng)
  );
};

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
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getAddressFromTags = (tags) => {
  const street = tags["addr:street"] || tags["street"] || "";
  const number = tags["addr:housenumber"] || "";
  const city = tags["addr:city"] || "";
  if (street) return `${number} ${street}, ${city}`.trim();
  return "Nearby location";
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createCustomIcon = (price, isActive) => {
  return L.divIcon({
    className: "custom-icon",
    html: `
      <div style="
        background-color: ${isActive ? "#222" : "white"}; 
        color: ${isActive ? "white" : "#222"}; 
        width: 36px; height: 36px;
        border-radius: 50%; 
        display: flex; align-items: center; justify-content: center;
        font-size: 18px;
        border: 2px solid white; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        position: relative; 
        transition: transform 0.2s; 
        transform: ${isActive ? "scale(1.2)" : "scale(1)"}; 
        z-index: ${isActive ? 999 : 1};
      ">
        🍴
        <div style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid ${
          isActive ? "#222" : "white"
        };"></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
  });
};

// --- MAP COMPONENTS ---
const RoutingMachine = ({ userLocation, destination }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !userLocation || !destination) return;
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1]),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: { styles: [{ color: "#1890ff", weight: 6, opacity: 0.8 }] },
      createMarker: () => null,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);
    return () => map.removeControl(routingControl);
  }, [map, userLocation, destination]);
  return null;
};

const AutoFitBounds = ({ places }) => {
  const map = useMap();
  const hasFitted = useRef(false);
  useEffect(() => {
    if (places.length > 0 && !hasFitted.current) {
      const validPlaces = places.filter((p) => isValidCoordinate(p.lat, p.lng));
      if (validPlaces.length > 0) {
        try {
          const bounds = L.latLngBounds(validPlaces.map((p) => [p.lat, p.lng]));
          if (bounds.isValid()) {
            map.flyToBounds(bounds, {
              padding: [50, 50],
              maxZoom: 15,
              duration: 1.5,
            });
            hasFitted.current = true;
          }
        } catch (e) {
          console.warn(e);
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

// --- CARD ---
const LuxuryCard = ({ data, active, onClick }) => {
  return (
    <div
      className={`luxury-card ${active ? "active-card" : ""}`}
      onClick={() => onClick(data)}
      id={`card-${data.id}`}
    >
      <div className="card-image-container" style={{ height: 140 }}>
        <img
          src={data.img}
          alt={data.name}
          className="card-image"
          loading="lazy"
        />
        <div className="card-badge-overlay">
          <CheckCircleFilled /> {data.tags[0]}
        </div>
      </div>
      <div className="card-content" style={{ padding: 12 }}>
        <div className="card-meta-row">
          <Text
            type="secondary"
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {data.type} •{" "}
            <span style={{ color: "var(--primary-green)" }}>
              {data.distanceFormatted}
            </span>
          </Text>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <StarFilled style={{ color: "var(--accent-gold)", fontSize: 12 }} />
            <Text strong style={{ fontSize: 12 }}>
              {data.rating}
            </Text>
          </div>
        </div>
        <Title
          level={5}
          style={{ margin: "0 0 4px 0", fontSize: 16 }}
          ellipsis={{ rows: 1 }}
        >
          {data.fullName}
        </Title>
        <Text type="secondary" style={{ fontSize: 11 }} ellipsis>
          {data.address}
        </Text>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
function HalalFinder({ onNavigate }) {
  // Data State
  const [allPlaces, setAllPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [userReviews, setUserReviews] = useState({}); // { placeId: [ReviewObj] } - DATABASE DUMMY

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  // Navigation
  const [isNavigating, setIsNavigating] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Filters & Map
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("nearest");
  const [userLocation, setUserLocation] = useState([39.9042, 116.4074]);
  const [mapCenter, setMapCenter] = useState(null);

  // Form
  const [form] = Form.useForm();

  // --- API FETCH (OVERPASS - KUMI SERVER) ---
  const fetchPlaces = async (lat, lng, retryCount = 0) => {
    setIsLoading(true);

    // Fallback Generator
    const generateNearbyMockData = (cLat, cLng) => {
      return Array.from({ length: 10 }).map((_, i) => ({
        id: `mock-${i}`,
        fullName: `Halal Restaurant ${i + 1}`,
        lat: cLat + (Math.random() - 0.5) * 0.01,
        lng: cLng + (Math.random() - 0.5) * 0.01,
        type: "Restaurant",
        rating: "4.5",
        reviews: 120,
        img: FOOD_IMAGES[i % FOOD_IMAGES.length],
        tags: ["Verified Halal", "Prayer Room"],
        address: "Nearby location",
        price: "🍴🍴",
      }));
    };

    try {
      const query = `
        [out:json][timeout:15];
        (
          node["amenity"~"restaurant|cafe|fast_food"](around:${MAX_RADIUS_METERS}, ${lat}, ${lng});
        );
        out ${MAX_RESULTS};
      `;

      const response = await fetch(
        "https://overpass.kumi.systems/api/interpreter",
        {
          method: "POST",
          body: query,
        }
      );

      if (response.status === 429) {
        if (retryCount < 2) {
          await wait(2000);
          return fetchPlaces(lat, lng, retryCount + 1);
        } else {
          throw new Error("Busy");
        }
      }

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();

      // Jika kosong, pakai mock data agar tidak blank
      if (!data.elements || data.elements.length === 0) {
        const mocks = generateNearbyMockData(lat, lng);
        const withDist = recalculateDistances(mocks, lat, lng);
        setAllPlaces(withDist);
        setIsLoading(false);
        return;
      }

      const mapped = data.elements.map((item, i) => {
        const tags = [
          "Verified Halal",
          ...POSSIBLE_TAGS.sort(() => 0.5 - Math.random()).slice(0, 2),
        ];
        const name = item.tags.name || item.tags["name:en"] || "Halal Spot";

        return {
          id: item.id,
          fullName: name,
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
          tags: tags,
          address: getAddressFromTags(item.tags),
        };
      });

      const validPlaces = mapped.filter((p) => p.fullName !== "Halal Spot");
      const withDistance = recalculateDistances(validPlaces, lat, lng);
      const finalPlaces = withDistance.filter(
        (p) => p.rawDistance * 1000 <= MAX_RADIUS_METERS
      );

      if (finalPlaces.length === 0) {
        // Fallback if filter result is empty
        const mocks = generateNearbyMockData(lat, lng);
        setAllPlaces(recalculateDistances(mocks, lat, lng));
      } else {
        setAllPlaces(finalPlaces);
      }
    } catch (err) {
      console.warn("API Busy/Error, using fallback");
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

  // --- FEATURE HANDLERS ---

  const handleStartNavigation = () => {
    if (!selectedPlace) return;
    setDestinationCoords([selectedPlace.lat, selectedPlace.lng]);
    setIsNavigating(true);
    setDrawerVisible(false);
    message.loading("Calculating route...", 1.5);
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setDestinationCoords(null);
    message.info("Navigation ended");
  };

  const handleGetDirections = () => {
    if (!selectedPlace) return;
    const { lat, lng, fullName } = selectedPlace;
    window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${fullName})`;
  };

  // --- REVIEW SUBMISSION LOGIC ---
  const handleReviewSubmit = (values) => {
    if (!selectedPlace) return;

    const newReview = {
      user: "You",
      rating: values.rating,
      text: values.review,
      date: "Just now",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    };

    // Simpan ke state (In-Memory Database)
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
    if (activeFilter !== "All")
      result = result.filter((p) => p.tags.includes(activeFilter));
    if (sortBy === "nearest")
      result.sort((a, b) => a.rawDistance - b.rawDistance);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    setFilteredPlaces(result);
  }, [allPlaces, activeFilter, sortBy]);

  // Handle Search Text
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchText && mapCenter) {
        fetchPlaces(mapCenter.lat, mapCenter.lng);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return message.error("No GPS");
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (isValidCoordinate(latitude, longitude)) {
          setUserLocation([latitude, longitude]);
          setMapCenter({ lat: latitude, lng: longitude });
          fetchPlaces(latitude, longitude);
          message.success("Location found!");
        }
      },
      () => {
        // Fallback Beijing if GPS fails
        const beijing = [39.9042, 116.4074];
        setUserLocation(beijing);
        setMapCenter({ lat: beijing[0], lng: beijing[1] });
        fetchPlaces(beijing[0], beijing[1]);
        message.warning("GPS blocked. Using Beijing.");
      }
    );
  };

  const handleMapMoveEnd = (center) => setMapCenter(center);
  const handleSearchArea = () => {
    if (mapCenter && isValidCoordinate(mapCenter.lat, mapCenter.lng)) {
      fetchPlaces(mapCenter.lat, mapCenter.lng);
    }
  };
  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setDrawerVisible(true);
  };

  useEffect(() => {
    handleLocateMe();
  }, []);

  const safeFilteredPlaces = filteredPlaces.filter((p) =>
    isValidCoordinate(p.lat, p.lng)
  );
  const safeUserLocation = isValidCoordinate(
    userLocation?.[0],
    userLocation?.[1]
  )
    ? userLocation
    : [39.9042, 116.4074];

  // --- RENDER HELPERS ---

  // Gabungkan Review Mock + Review User
  const getCurrentReviews = () => {
    if (!selectedPlace) return [];
    const userAdded = userReviews[selectedPlace.id] || [];
    return [...userAdded, ...INITIAL_REVIEWS];
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        className="navbar-container"
        style={{ flexShrink: 0, height: 60, padding: "0" }}
      >
        <div
          className="container navbar"
          style={{ maxWidth: "100%", padding: "0 24px", height: "100%" }}
        >
          <div
            className="brand-logo"
            onClick={() => onNavigate("landing")}
            style={{ cursor: "pointer", fontSize: 20 }}
          >
            <GlobalOutlined className="logo-icon" style={{ fontSize: 24 }} />{" "}
            <span>QingzhenMu</span>
          </div>
          <div className="nav-actions">
            <Avatar
              style={{ backgroundColor: "var(--primary-green)" }}
              icon={<UsergroupAddOutlined />}
            />
          </div>
        </div>
      </header>

      <div className="finder-layout">
        <div className="finder-list-container">
          <div className="finder-header-luxury">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Nearby Halal ({filteredPlaces.length})
              </Title>
              <Button
                icon={<AimOutlined />}
                onClick={handleLocateMe}
                shape="circle"
                type="primary"
                ghost
              />
            </div>
            <Input
              placeholder="Search food..."
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              style={{
                borderRadius: 12,
                backgroundColor: "#f8f9fa",
                border: "none",
                marginBottom: 12,
              }}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Space wrap style={{ width: "100%" }}>
              <Select
                defaultValue="nearest"
                style={{ width: 110 }}
                variant="borderless"
                className="custom-select"
                onChange={setSortBy}
              >
                <Option value="nearest">Nearest</Option>
                <Option value="rating">Top Rated</Option>
              </Select>
              <div
                className="filter-scroll-container"
                style={{
                  display: "inline-flex",
                  verticalAlign: "middle",
                  marginTop: 0,
                }}
              >
                {["All", ...POSSIBLE_TAGS].map((cat) => (
                  <button
                    key={cat}
                    className={`luxury-filter-pill ${
                      activeFilter === cat ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Space>
          </div>

          <div style={{ paddingBottom: 40 }}>
            {isLoading ? (
              <div style={{ textAlign: "center", padding: 50 }}>
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 32, color: "var(--primary-green)" }}
                      spin
                    />
                  }
                />
                <p style={{ marginTop: 16, color: "#888" }}>
                  Finding halal food within 3km...
                </p>
              </div>
            ) : filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <LuxuryCard
                  key={place.id}
                  data={place}
                  active={selectedPlace?.id === place.id}
                  onClick={handlePlaceClick}
                />
              ))
            ) : (
              <Empty
                description="No places found within 3km"
                style={{ marginTop: 40 }}
              />
            )}
          </div>
        </div>

        <div className="finder-map-container">
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
              />
            )}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: "user-marker",
                  html: '<div style="width: 16px; height: 16px; background: #1890ff; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2);"></div>',
                })}
              >
                <Popup>You</Popup>
              </Marker>
            )}
            {safeFilteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={createCustomIcon(
                  place.price,
                  selectedPlace?.id === place.id
                )}
                eventHandlers={{ click: () => handlePlaceClick(place) }}
              />
            ))}
          </MapContainer>

          {!isNavigating && (
            <Button
              shape="round"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearchArea}
              loading={isLoading}
              style={{
                position: "absolute",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                fontWeight: 600,
                zIndex: 1000,
              }}
            >
              Search this area
            </Button>
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
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                fontWeight: "bold",
                zIndex: 1000,
                height: 48,
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              Exit Navigation
            </Button>
          )}
        </div>
      </div>

      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
        styles={{ body: { padding: 0 } }}
        className="place-detail-drawer"
      >
        {selectedPlace && (
          <div>
            <div style={{ position: "relative", height: 200 }}>
              <img
                src={selectedPlace.img}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="Cover"
              />
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "rgba(255,255,255,0.8)",
                }}
                onClick={() => setDrawerVisible(false)}
              />
            </div>
            <div style={{ padding: 24 }}>
              <Title level={3} style={{ margin: 0 }}>
                {selectedPlace.fullName}
              </Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <Rate
                  disabled
                  defaultValue={parseFloat(selectedPlace.rating)}
                  style={{ fontSize: 14 }}
                  allowHalf
                />
                <Text type="secondary">({selectedPlace.reviews} reviews)</Text>
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <EnvironmentOutlined
                  style={{ marginTop: 4, color: "var(--primary-green)" }}
                />
                <div>
                  <Text strong style={{ display: "block" }}>
                    Address
                  </Text>
                  <Text type="secondary">{selectedPlace.address}</Text>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <Tag color="green">3KM Radius</Tag>
                <Tag color="blue">{selectedPlace.type}</Tag>
              </div>

              <Divider />
              <div style={{ display: "flex", gap: 12 }}>
                <Button
                  type="primary"
                  block
                  shape="round"
                  size="large"
                  icon={<CompassFilled />}
                  onClick={handleStartNavigation}
                >
                  Nav Here (In-App)
                </Button>
                <Button
                  block
                  shape="round"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setReviewModalVisible(true)}
                >
                  Review
                </Button>
              </div>
              <Button
                type="link"
                block
                onClick={handleGetDirections}
                style={{ marginTop: 8 }}
              >
                Open in Maps App ↗
              </Button>
              <Divider />
              <Title level={5}>Reviews</Title>

              {/* DYNAMIC REVIEW LIST */}
              <List
                dataSource={getCurrentReviews()}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={
                            item.avatar || "https://joeschmoe.io/api/v1/random"
                          }
                        />
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text strong>{item.user}</Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {item.date}
                          </Text>
                        </div>
                      }
                      description={
                        <>
                          <Rate
                            disabled
                            defaultValue={item.rating}
                            style={{ fontSize: 12 }}
                            count={5}
                          />
                          <div style={{ marginTop: 4 }}>{item.text}</div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        title="Write a Review"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
          <Form.Item name="rating" label="Rating" initialValue={5}>
            <Rate />
          </Form.Item>
          <Form.Item
            name="review"
            label="Your Experience"
            rules={[{ required: true, message: "Please write something!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Add Photos">
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={3}
            >
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Post Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default HalalFinder;
