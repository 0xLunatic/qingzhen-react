// src/components/ChinaPrayerSchedule.jsx
import React, { useState, useEffect } from "react";
import { Card, Select, Typography, List, Badge, Statistic } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Coordinates, CalculationMethod, PrayerTimes, Prayer } from "adhan";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { Countdown } = Statistic;

// Data Kota Besar di China (Zona Waktu UTC+8 tapi Matahari berbeda)
const CHINA_CITIES = [
  { name: "Beijing", lat: 39.9042, lng: 116.4074 },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737 },
  { name: "Guangzhou", lat: 23.1291, lng: 113.2644 },
  { name: "Yiwu", lat: 29.3151, lng: 120.0768 },
  { name: "Xi'an", lat: 34.3416, lng: 108.9398 },
  { name: "Lanzhou", lat: 36.0611, lng: 103.8343 },
  { name: "Urumqi", lat: 43.8256, lng: 87.6168 }, // Waktu sangat berbeda!
  { name: "Kashgar", lat: 39.4677, lng: 75.9898 },
];

const THEME_COLOR = "#1B4D3E";

const ChinaPrayerSchedule = () => {
  const [selectedCity, setSelectedCity] = useState(CHINA_CITIES[0]);
  const [prayers, setPrayers] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeToNext, setTimeToNext] = useState(null);

  const calculatePrayers = () => {
    if (!selectedCity) return;

    const coords = new Coordinates(selectedCity.lat, selectedCity.lng);
    const date = new Date();
    const params = CalculationMethod.MuslimWorldLeague();

    const times = new PrayerTimes(coords, date, params);

    const formattedPrayers = [
      { name: "Fajr", time: dayjs(times.fajr), key: Prayer.Fajr },
      { name: "Sunrise", time: dayjs(times.sunrise), key: Prayer.Sunrise },
      { name: "Dhuhr", time: dayjs(times.dhuhr), key: Prayer.Dhuhr },
      { name: "Asr", time: dayjs(times.asr), key: Prayer.Asr },
      { name: "Maghrib", time: dayjs(times.maghrib), key: Prayer.Maghrib },
      { name: "Isha", time: dayjs(times.isha), key: Prayer.Isha },
    ];

    setPrayers(formattedPrayers);

    const current = times.currentPrayer();
    const next = times.nextPrayer();

    if (next !== Prayer.None) {
      const nextTime = times.timeForPrayer(next);
      setNextPrayer({ name: capitalize(next), time: nextTime });
      setTimeToNext(dayjs(nextTime).diff(dayjs()));
    } else {
      setNextPrayer({ name: "Fajr (Tmw)", time: null });
      setTimeToNext(null);
    }
  };

  useEffect(() => {
    calculatePrayers();
    const interval = setInterval(calculatePrayers, 60000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  return (
    <Card
      style={{
        borderRadius: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflow: "hidden",
        border: "none",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div
        style={{
          background: THEME_COLOR,
          padding: "16px 20px",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: 12,
          }}
        >
          <div>
            <Text
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 10,
                letterSpacing: 1,
              }}
            >
              LOCATION
            </Text>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <EnvironmentOutlined />
              <Select
                value={selectedCity.name}
                onChange={(val) =>
                  setSelectedCity(CHINA_CITIES.find((c) => c.name === val))
                }
                dropdownStyle={{ zIndex: 2000 }}
                style={{ width: 140 }}
                bordered={false}
                className="city-selector-dropdown"
              >
                {CHINA_CITIES.map((city) => (
                  <Option key={city.name} value={city.name}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Text
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 10,
                letterSpacing: 1,
              }}
            >
              NEXT PRAYER
            </Text>
            <div style={{ fontWeight: "bold", fontSize: 16 }}>
              {nextPrayer ? nextPrayer.name : "-"}
            </div>
          </div>
        </div>
        {timeToNext && (
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>Time Remaining</Text>
            <Countdown
              value={Date.now() + timeToNext}
              format="HH:mm:ss"
              valueStyle={{
                color: "#fbdb14",
                fontSize: 16,
                fontWeight: "bold",
              }}
            />
          </div>
        )}
      </div>
      <div style={{ padding: "0 12px" }}>
        <List
          size="small"
          dataSource={prayers || []}
          renderItem={(item) => {
            const isNext = nextPrayer && nextPrayer.name === item.name;
            return (
              <List.Item
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  padding: "10px 8px",
                  backgroundColor: isNext ? "#f6ffed" : "transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text
                    strong={isNext}
                    style={{
                      color: item.key === Prayer.Sunrise ? "#999" : "#333",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    strong={isNext}
                    style={{ color: isNext ? THEME_COLOR : "#555" }}
                  >
                    {item.time.format("HH:mm")}
                  </Text>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    </Card>
  );
};

export default ChinaPrayerSchedule;
