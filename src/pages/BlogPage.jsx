import React, { useState, useEffect } from "react";
import {
  Modal,
  Drawer,
  Form,
  Input,
  Select,
  Upload,
  message,
  Grid,
} from "antd";
import {
  CameraOutlined,
  MenuOutlined,
  TranslationOutlined,
  UserOutlined,
} from "@ant-design/icons";

// Tambahkan font di index.html:
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

const { TextArea } = Input;
const { useBreakpoint } = Grid;

const CHINA_REGIONS = [
  "Beijing",
  "Shanghai",
  "Xi'an",
  "Guangzhou",
  "Xinjiang",
  "Yunnan",
];

const ARTICLES = [
  {
    id: 1,
    title: "Beijing's Oldest Mosque Renovation Completed",
    excerpt:
      "The historical restoration project in Niujie has finally reached its completion phase, breathing new life into this 1,000-year-old landmark.",
    region: "Beijing",
    author: "Li Ming",
    authorInitials: "LM",
    date: "Apr 5, 2026",
    image:
      "https://images.unsplash.com/photo-1590076215667-875d4ef2d97e?w=600&q=80",
  },
  {
    id: 2,
    title: "Muslim Quarter Street Food Guide: 2026 Edition",
    excerpt:
      "From yangrou paomo to roujiamo, our updated guide walks you through every must-try stall in Xi'an's iconic Muslim Quarter.",
    region: "Xi'an",
    author: "Fang Yu",
    authorInitials: "FY",
    date: "Apr 3, 2026",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  },
  {
    id: 3,
    title: "Yunnan's Hui Community Hosts Annual Cultural Fest",
    excerpt:
      "Thousands gathered in Kunming as the Hui Muslim community opened their doors for the annual Eid celebration and cultural exchange.",
    region: "Yunnan",
    author: "Aisha Wang",
    authorInitials: "AW",
    date: "Apr 1, 2026",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
  },
];

const TRENDING = [
  {
    num: "01",
    title: "Xinjiang Lamb Skewers Make Comeback in Southern Cities",
    region: "Xinjiang",
    date: "Apr 4, 2026",
    views: "5.1k",
  },
  {
    num: "02",
    title: "New Halal Certification Standard to Roll Out Nationwide",
    region: "Policy",
    date: "Apr 3, 2026",
    views: "4.7k",
  },
  {
    num: "03",
    title: "Guangzhou Welcomes First Purpose-Built Halal Food Court",
    region: "Guangzhou",
    date: "Apr 2, 2026",
    views: "3.9k",
  },
  {
    num: "04",
    title: "Shanghai's Jing'An Mosque Opens Community Library",
    region: "Shanghai",
    date: "Apr 1, 2026",
    views: "3.2k",
  },
  {
    num: "05",
    title: "Eid Travel Tips: Best Halal-Friendly Hotels in China 2026",
    region: "Travel",
    date: "Mar 30, 2026",
    views: "2.8k",
  },
];

const REGIONS = [
  {
    name: "Beijing",
    count: 42,
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80",
  },
  {
    name: "Shanghai",
    count: 38,
    image:
      "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&q=80",
  },
  {
    name: "Xi'an",
    count: 55,
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80",
  },
  {
    name: "Xinjiang",
    count: 61,
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80",
  },
  {
    name: "Yunnan",
    count: 29,
    image:
      "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=600&q=80",
  },
  {
    name: "Guangzhou",
    count: 23,
    image:
      "https://images.unsplash.com/photo-1567880905822-56f8e06fe630?w=600&q=80",
  },
];

const QUICK_READS = [
  {
    title: "5 Halal Dishes You Must Try in Yunnan",
    date: "Mar 29 · 3 min read",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&q=80",
  },
  {
    title: "A Traveler's Guide to Mosques in Shanghai",
    date: "Mar 27 · 4 min read",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80",
  },
  {
    title: "How to Read a Halal Certificate in China",
    date: "Mar 25 · 2 min read",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80",
  },
];

const TAGS = [
  "Halal Food",
  "Mosque",
  "Travel",
  "Community",
  "Culture",
  "Events",
  "Policy",
  "Eid",
  "Recipe",
  "Ramadan",
  "Xi'an",
  "Beijing",
];

const styles = `
  .blog-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .blog-root {
    font-family: 'DM Sans', sans-serif;
    background: #f7f5f0;
    color: #1a1a1a;
    min-height: 100vh;
  }
  .blog-navbar {
    background: #fff;
    border-bottom: 1px solid #e8e4dc;
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .blog-nav-brand {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: #1a4a2e; cursor: pointer;
  }
  .blog-nav-logo {
    width: 34px; height: 34px;
    background: #1a4a2e; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #d4a853; font-size: 16px; font-weight: 800;
    font-family: 'Playfair Display', serif;
  }
  .blog-nav-links { display: flex; gap: 4px; }
  .blog-nav-link {
    padding: 6px 14px; border-radius: 20px;
    font-size: 14px; font-weight: 500;
    color: #555; cursor: pointer;
    border: none; background: transparent;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .blog-nav-link:hover { background: #f0ede6; color: #1a4a2e; }
  .blog-nav-link.active { background: #eaf3e6; color: #1a4a2e; font-weight: 600; }
  .blog-nav-actions { display: flex; align-items: center; gap: 10px; }
  .blog-btn-post {
    background: #d4a853; color: #fff;
    border: none; padding: 8px 20px;
    border-radius: 20px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .blog-btn-post:hover { background: #b8913e; }
  .blog-btn-lang {
    background: transparent; border: 1px solid #e0dbd0;
    padding: 6px 12px; border-radius: 16px;
    font-size: 13px; font-weight: 600;
    cursor: pointer; color: #555;
    font-family: 'DM Sans', sans-serif;
  }
  .blog-hero {
    background: linear-gradient(135deg, #1a4a2e 0%, #0f2e1b 60%, #1a3a2a 100%);
    padding: 72px 32px 80px; text-align: center;
    position: relative; overflow: hidden;
  }
  .blog-hero::before {
    content: ''; position: absolute;
    top: -60px; right: -60px;
    width: 300px; height: 300px; border-radius: 50%;
    background: rgba(212,168,83,0.08);
  }
  .blog-hero::after {
    content: ''; position: absolute;
    bottom: -80px; left: -40px;
    width: 250px; height: 250px; border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }
  .blog-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(212,168,83,0.18); color: #d4a853;
    padding: 5px 14px; border-radius: 20px;
    font-size: 12px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 20px;
  }
  .blog-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 5vw, 3.6rem);
    font-weight: 800; color: #fff;
    line-height: 1.15; margin-bottom: 16px;
  }
  .blog-hero h1 span { color: #d4a853; }
  .blog-hero-sub {
    color: rgba(255,255,255,0.72); font-size: 1rem;
    max-width: 540px; margin: 0 auto 36px; line-height: 1.7;
  }
  .blog-hero-search {
    max-width: 560px; margin: 0 auto;
    display: flex; background: #fff;
    border-radius: 32px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  }
  .blog-hero-search input {
    flex: 1; border: none; padding: 14px 20px;
    font-size: 15px; font-family: 'DM Sans', sans-serif;
    outline: none; color: #1a1a1a; background: transparent;
  }
  .blog-hero-search input::placeholder { color: #aaa; }
  .blog-hero-search-btn {
    background: #d4a853; border: none;
    padding: 0 24px; color: #fff;
    font-weight: 600; font-size: 14px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .blog-stats-bar {
    background: #fff; border-bottom: 1px solid #e8e4dc;
    padding: 0 32px; display: flex;
    align-items: center; overflow-x: auto;
  }
  .blog-stat-item {
    padding: 16px 28px; border-right: 1px solid #f0ece4;
    white-space: nowrap;
  }
  .blog-stat-item:first-child { padding-left: 0; }
  .blog-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #1a4a2e;
  }
  .blog-stat-label { font-size: 12px; color: #888; line-height: 1.3; }
  .blog-filter-section {
    padding: 28px 32px 0;
    display: flex; gap: 8px; overflow-x: auto;
  }
  .blog-filter-pill {
    padding: 8px 18px; border-radius: 20px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    border: 1.5px solid #e0dbd0; background: #fff;
    color: #555; white-space: nowrap; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .blog-filter-pill:hover { border-color: #1a4a2e; color: #1a4a2e; }
  .blog-filter-pill.active { background: #1a4a2e; border-color: #1a4a2e; color: #fff; }
  .blog-content { padding: 32px 32px 60px; }
  .blog-section-header {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 24px;
  }
  .blog-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: #1a1a1a;
    display: flex; align-items: center; gap: 10px;
  }
  .blog-section-title::before {
    content: ''; display: block;
    width: 4px; height: 22px;
    background: #d4a853; border-radius: 2px;
  }
  .blog-see-all {
    font-size: 13px; color: #1a4a2e; font-weight: 600;
    cursor: pointer; text-decoration: none;
    display: flex; align-items: center; gap: 4px;
    background: none; border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .blog-featured-card {
    display: grid; grid-template-columns: 1fr 1fr;
    background: #fff; border-radius: 20px;
    overflow: hidden; border: 1px solid #e8e4dc;
    margin-bottom: 40px; min-height: 380px;
  }
  .blog-featured-img { position: relative; overflow: hidden; }
  .blog-featured-img img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform 0.5s;
  }
  .blog-featured-card:hover .blog-featured-img img { transform: scale(1.03); }
  .blog-featured-badge {
    position: absolute; top: 16px; left: 16px;
    background: #d4a853; color: #fff;
    padding: 5px 12px; border-radius: 12px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase;
  }
  .blog-featured-body {
    padding: 48px 44px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .blog-featured-meta {
    display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
  }
  .blog-meta-tag {
    background: #eaf3e6; color: #1a4a2e;
    padding: 4px 10px; border-radius: 10px;
    font-size: 11px; font-weight: 600;
  }
  .blog-meta-date { font-size: 12px; color: #999; }
  .blog-featured-body h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem; font-weight: 700;
    color: #1a1a1a; line-height: 1.3; margin-bottom: 14px;
  }
  .blog-featured-body p {
    font-size: 15px; color: #666;
    line-height: 1.7; margin-bottom: 28px;
  }
  .blog-btn-read {
    display: inline-flex; align-items: center; gap: 8px;
    background: #1a4a2e; color: #fff;
    padding: 12px 24px; border-radius: 24px;
    font-size: 14px; font-weight: 600;
    cursor: pointer; border: none;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s; width: fit-content;
  }
  .blog-btn-read:hover { background: #0f2e1b; }
  .blog-arrow { font-size: 12px; transition: transform 0.2s; }
  .blog-featured-card:hover .blog-arrow { transform: translateX(3px); }
  .blog-author-row {
    display: flex; align-items: center; gap: 10px;
    margin-top: 24px; padding-top: 20px;
    border-top: 1px solid #f0ece4;
  }
  .blog-author-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: #1a4a2e; display: flex;
    align-items: center; justify-content: center;
    color: #fff; font-size: 13px; font-weight: 600; flex-shrink: 0;
  }
  .blog-author-name { font-size: 13px; font-weight: 600; color: #333; }
  .blog-author-role { font-size: 11px; color: #999; }
  .blog-read-time { margin-left: auto; font-size: 12px; color: #aaa; }
  .blog-news-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-bottom: 40px;
  }
  .blog-news-card {
    background: #fff; border-radius: 16px;
    overflow: hidden; border: 1px solid #e8e4dc;
    transition: transform 0.25s, box-shadow 0.25s; cursor: pointer;
  }
  .blog-news-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
  .blog-news-img { height: 200px; overflow: hidden; position: relative; }
  .blog-news-img img {
    width: 100%; height: 100%;
    object-fit: cover; transition: transform 0.4s;
  }
  .blog-news-card:hover .blog-news-img img { transform: scale(1.05); }
  .blog-news-img-badge {
    position: absolute; bottom: 12px; left: 12px;
    background: rgba(26,74,46,0.9); color: #fff;
    padding: 3px 10px; border-radius: 10px;
    font-size: 10px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .blog-news-body { padding: 20px; }
  .blog-news-body h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1rem; font-weight: 700;
    color: #1a1a1a; line-height: 1.4; margin-bottom: 8px;
  }
  .blog-news-body p {
    font-size: 13px; color: #777;
    line-height: 1.6; margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .blog-news-footer {
    display: flex; align-items: center;
    justify-content: space-between;
    padding-top: 14px; border-top: 1px solid #f0ece4;
  }
  .blog-news-footer-left { display: flex; align-items: center; gap: 8px; }
  .blog-mini-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: #d4a853; display: flex;
    align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: #fff;
  }
  .blog-news-author { font-size: 12px; font-weight: 600; color: #555; }
  .blog-news-date { font-size: 11px; color: #bbb; }
  .blog-link-btn {
    font-size: 12px; color: #1a4a2e; font-weight: 600;
    cursor: pointer; border: none; background: none;
    display: flex; align-items: center; gap: 4px;
    font-family: 'DM Sans', sans-serif; padding: 0;
  }
  .blog-two-col {
    display: grid; grid-template-columns: 1fr 340px;
    gap: 24px; margin-bottom: 40px;
  }
  .blog-sidebar-col { display: flex; flex-direction: column; gap: 20px; }
  .blog-sidebar-card {
    background: #fff; border-radius: 16px;
    border: 1px solid #e8e4dc; overflow: hidden;
  }
  .blog-sidebar-header {
    padding: 18px 20px 14px; border-bottom: 1px solid #f0ece4;
    font-family: 'Playfair Display', serif;
    font-size: 16px; font-weight: 700; color: #1a1a1a;
  }
  .blog-sidebar-body { padding: 16px 20px; }
  .blog-trending-list { display: flex; flex-direction: column; }
  .blog-trending-item {
    display: flex; gap: 14px;
    padding: 16px 20px;
    border-bottom: 1px solid #f0ece4; cursor: pointer;
    transition: background 0.15s;
  }
  .blog-trending-item:last-child { border-bottom: none; }
  .blog-trending-item:hover { background: #faf9f6; }
  .blog-trending-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 800;
    color: #e8e4dc; line-height: 1; width: 32px; flex-shrink: 0;
  }
  .blog-trending-content h4 {
    font-size: 14px; font-weight: 600;
    color: #1a1a1a; line-height: 1.4; margin-bottom: 4px;
  }
  .blog-trending-meta {
    font-size: 11px; color: #aaa;
    display: flex; align-items: center; gap: 6px;
  }
  .blog-t-dot {
    width: 3px; height: 3px; border-radius: 50%; background: #ccc;
    display: inline-block;
  }
  .blog-tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .blog-tag-chip {
    padding: 5px 12px; border-radius: 12px;
    font-size: 12px; font-weight: 500;
    background: #f7f5f0; color: #555;
    border: 1px solid #e8e4dc; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .blog-tag-chip:hover { background: #1a4a2e; color: #fff; border-color: #1a4a2e; }
  .blog-quick-read-item {
    display: flex; gap: 12px; align-items: flex-start; cursor: pointer;
  }
  .blog-quick-read-item img {
    width: 64px; height: 56px;
    object-fit: cover; border-radius: 10px; flex-shrink: 0;
  }
  .blog-quick-read-title {
    font-size: 13px; font-weight: 600;
    color: #1a1a1a; line-height: 1.4; margin-bottom: 4px;
  }
  .blog-quick-read-date { font-size: 11px; color: #aaa; }
  .blog-divider { height: 1px; background: #f0ece4; margin: 14px 0; }
  .blog-region-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-bottom: 40px;
  }
  .blog-region-card {
    border-radius: 14px; overflow: hidden;
    position: relative; height: 130px; cursor: pointer;
  }
  .blog-region-card img {
    width: 100%; height: 100%;
    object-fit: cover; transition: transform 0.4s;
  }
  .blog-region-card:hover img { transform: scale(1.08); }
  .blog-region-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%);
    display: flex; flex-direction: column;
    justify-content: flex-end; padding: 14px;
  }
  .blog-region-name {
    color: #fff; font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 700;
  }
  .blog-region-count { color: rgba(255,255,255,0.7); font-size: 11px; }
  .blog-newsletter {
    background: linear-gradient(135deg, #1a4a2e 0%, #0f2e1b 100%);
    border-radius: 20px; padding: 44px 40px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 32px; margin-bottom: 40px;
  }
  .blog-newsletter-text h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700;
    color: #fff; margin-bottom: 8px;
  }
  .blog-newsletter-text p { color: rgba(255,255,255,0.65); font-size: 14px; }
  .blog-newsletter-form {
    display: flex;
    background: rgba(255,255,255,0.12);
    border-radius: 24px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.2); flex-shrink: 0;
  }
  .blog-newsletter-form input {
    background: transparent; border: none;
    padding: 12px 20px; color: #fff;
    font-size: 14px; outline: none;
    font-family: 'DM Sans', sans-serif; width: 240px;
  }
  .blog-newsletter-form input::placeholder { color: rgba(255,255,255,0.5); }
  .blog-newsletter-form button {
    background: #d4a853; border: none;
    padding: 12px 24px; color: #fff;
    font-weight: 600; font-size: 14px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  @media (max-width: 768px) {
    .blog-featured-card { grid-template-columns: 1fr; }
    .blog-featured-body { padding: 28px; }
    .blog-news-grid { grid-template-columns: 1fr; }
    .blog-two-col { grid-template-columns: 1fr; }
    .blog-region-grid { grid-template-columns: repeat(2, 1fr); }
    .blog-newsletter { flex-direction: column; align-items: flex-start; }
    .blog-newsletter-form { width: 100%; }
    .blog-newsletter-form input { width: 100%; }
    .blog-nav-links { display: none; }
    .blog-content { padding: 24px 16px 60px; }
    .blog-hero { padding: 48px 16px 56px; }
    .blog-filter-section { padding: 20px 16px 0; }
    .blog-stats-bar { padding: 0 16px; }
  }
`;

function BlogPage({ onNavigate }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [lang, setLang] = useState("en");
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState("All China");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    message.success("Logged out successfully");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="blog-root">
        {/* NAVBAR */}
        <nav className="blog-navbar">
          <div
            className="blog-nav-brand"
            onClick={() => onNavigate?.("landing")}
          >
            <div className="blog-nav-logo">Q</div>
            QingzhenMu
          </div>
          {!isMobile && (
            <div className="blog-nav-links">
              <button
                className="blog-nav-link"
                onClick={() => onNavigate?.("finder")}
              >
                Halal Finder
              </button>
              <button
                className="blog-nav-link"
                onClick={() => onNavigate?.("mosque")}
              >
                Mosque Map
              </button>
              <button
                className="blog-nav-link"
                onClick={() => onNavigate?.("prayer")}
              >
                Prayer
              </button>
              <button className="blog-nav-link active">Blog</button>
            </div>
          )}
          <div className="blog-nav-actions">
            {!isMobile && (
              <button
                className="blog-btn-lang"
                onClick={() => setLang(lang === "en" ? "cn" : "en")}
              >
                {lang === "en" ? "CN" : "EN"}
              </button>
            )}
            {user ? (
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#1a4a2e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {user.name?.[0] || "U"}
              </div>
            ) : (
              <button
                className="blog-btn-lang"
                onClick={() => onNavigate?.("auth")}
              >
                Sign In
              </button>
            )}
            {isMobile ? (
              <button
                className="blog-btn-lang"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                ☰
              </button>
            ) : (
              <button
                className="blog-btn-post"
                onClick={() => setIsUploadModalOpen(true)}
              >
                ✏ Post News
              </button>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="blog-hero">
          <div className="blog-hero-eyebrow">📰 China Halal News</div>
          <h1>
            {lang === "en" ? (
              <>
                Stay Informed About
                <br />
                <span>Halal Life</span> in China
              </>
            ) : (
              <>
                了解中国
                <br />
                <span>清真</span>生活资讯
              </>
            )}
          </h1>
          <p className="blog-hero-sub">
            Discover the latest culinary trends, mosque stories, and community
            events across mainland China.
          </p>
          <div className="blog-hero-search">
            <input placeholder="Search region, topic, or keyword..." />
            <button className="blog-hero-search-btn">Search</button>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="blog-stats-bar">
          {[
            { num: "248", label: "Total Articles" },
            { num: "12", label: "Regions Covered" },
            { num: "34k", label: "Monthly Readers" },
            { num: "6", label: "New This Week" },
          ].map((s) => (
            <div className="blog-stat-item" key={s.label}>
              <div className="blog-stat-num">{s.num}</div>
              <div className="blog-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTER PILLS */}
        <div className="blog-filter-section">
          {["All China", ...CHINA_REGIONS].map((r) => (
            <button
              key={r}
              className={`blog-filter-pill${activeRegion === r ? " active" : ""}`}
              onClick={() => setActiveRegion(r)}
            >
              {r === "All China" ? "🌏 " : ""}
              {r}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="blog-content">
          {/* FEATURED */}
          <div className="blog-section-header">
            <div className="blog-section-title">Featured Story</div>
            <button className="blog-see-all">View all →</button>
          </div>
          <div className="blog-featured-card">
            <div className="blog-featured-img">
              <img
                src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1000&q=80"
                alt="Featured"
              />
              <div className="blog-featured-badge">Must Read</div>
            </div>
            <div className="blog-featured-body">
              <div className="blog-featured-meta">
                <span className="blog-meta-tag">Food Culture</span>
                <span className="blog-meta-date">April 5, 2026</span>
              </div>
              <h2>The Rising Popularity of Halal Hotpot in Shanghai</h2>
              <p>
                As the demand for diverse culinary experiences grows, halal
                hotpot establishments are becoming the new center for social
                gatherings among Muslim and non-Muslim communities alike.
              </p>
              <button className="blog-btn-read">
                Read Full Story <span className="blog-arrow">→</span>
              </button>
              <div className="blog-author-row">
                <div className="blog-author-avatar">ZH</div>
                <div>
                  <div className="blog-author-name">Zhang Hui</div>
                  <div className="blog-author-role">Food Correspondent</div>
                </div>
                <div className="blog-read-time">8 min read · 2.4k views</div>
              </div>
            </div>
          </div>

          {/* NEWS GRID */}
          <div className="blog-section-header">
            <div className="blog-section-title">Latest News</div>
            <button className="blog-see-all">See all →</button>
          </div>
          <div className="blog-news-grid">
            {ARTICLES.map((article) => (
              <div className="blog-news-card" key={article.id}>
                <div className="blog-news-img">
                  <img src={article.image} alt={article.title} />
                  <div className="blog-news-img-badge">{article.region}</div>
                </div>
                <div className="blog-news-body">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="blog-news-footer">
                    <div className="blog-news-footer-left">
                      <div className="blog-mini-avatar">
                        {article.authorInitials}
                      </div>
                      <div>
                        <div className="blog-news-author">{article.author}</div>
                        <div className="blog-news-date">{article.date}</div>
                      </div>
                    </div>
                    <button className="blog-link-btn">Read →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TRENDING + SIDEBAR */}
          <div className="blog-two-col">
            <div>
              <div className="blog-section-header">
                <div className="blog-section-title">Trending This Week</div>
              </div>
              <div className="blog-sidebar-card">
                <div className="blog-trending-list">
                  {TRENDING.map((item) => (
                    <div className="blog-trending-item" key={item.num}>
                      <div className="blog-trending-num">{item.num}</div>
                      <div className="blog-trending-content">
                        <h4>{item.title}</h4>
                        <div className="blog-trending-meta">
                          {item.region}
                          <span className="blog-t-dot" />
                          {item.date}
                          <span className="blog-t-dot" />
                          {item.views} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="blog-sidebar-col">
              <div className="blog-sidebar-card">
                <div className="blog-sidebar-header">Browse by Topic</div>
                <div className="blog-sidebar-body">
                  <div className="blog-tag-list">
                    {TAGS.map((tag) => (
                      <span key={tag} className="blog-tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="blog-sidebar-card">
                <div className="blog-sidebar-header">Quick Read</div>
                <div className="blog-sidebar-body">
                  {QUICK_READS.map((item, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="blog-divider" />}
                      <div className="blog-quick-read-item">
                        <img src={item.image} alt={item.title} />
                        <div>
                          <div className="blog-quick-read-title">
                            {item.title}
                          </div>
                          <div className="blog-quick-read-date">
                            {item.date}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* REGION SPOTLIGHT */}
          <div className="blog-section-header">
            <div className="blog-section-title">Explore by Region</div>
            <button className="blog-see-all">View map →</button>
          </div>
          <div className="blog-region-grid">
            {REGIONS.map((region) => (
              <div className="blog-region-card" key={region.name}>
                <img src={region.image} alt={region.name} />
                <div className="blog-region-overlay">
                  <div className="blog-region-name">{region.name}</div>
                  <div className="blog-region-count">
                    {region.count} articles
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* NEWSLETTER */}
          <div className="blog-newsletter">
            <div className="blog-newsletter-text">
              <h3>Never Miss a Story</h3>
              <p>
                Get weekly halal news and updates delivered straight to your
                inbox.
              </p>
            </div>
            <div className="blog-newsletter-form">
              <input placeholder="Your email address..." />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        {/* MODAL UPLOAD */}
        <Modal
          title={
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Publish New Article
              </div>
              <div style={{ fontSize: 13, color: "#888", fontWeight: 400 }}>
                Share news or guides with the community
              </div>
            </div>
          }
          open={isUploadModalOpen}
          onCancel={() => setIsUploadModalOpen(false)}
          footer={null}
          centered
          width={600}
        >
          <Form layout="vertical" size="large" style={{ marginTop: 24 }}>
            <Form.Item label="News Title">
              <Input placeholder="Enter title" style={{ borderRadius: 12 }} />
            </Form.Item>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Form.Item label="Region">
                <Select
                  placeholder="Select Region"
                  style={{ borderRadius: 12 }}
                >
                  {CHINA_REGIONS.map((r) => (
                    <Select.Option key={r} value={r}>
                      {r}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Category">
                <Select placeholder="Category" style={{ borderRadius: 12 }}>
                  <Select.Option value="food">Food Guide</Select.Option>
                  <Select.Option value="event">Community Event</Select.Option>
                  <Select.Option value="mosque">Mosque</Select.Option>
                  <Select.Option value="travel">Travel</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item label="Content Article">
              <TextArea
                rows={5}
                placeholder="Write the full story..."
                style={{ borderRadius: 12 }}
              />
            </Form.Item>
            <Form.Item label="Cover Image">
              <Upload listType="picture-card">
                <div>
                  <CameraOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
            <button
              type="button"
              style={{
                width: "100%",
                height: 48,
                background: "#1a4a2e",
                color: "#fff",
                border: "none",
                borderRadius: 24,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Publish Now
            </button>
          </Form>
        </Modal>

        {/* MOBILE DRAWER */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setIsMobileMenuOpen(false)}
          open={isMobileMenuOpen}
          width={280}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["Home", "Halal Finder", "Mosque Map", "Prayer", "Blog"].map(
              (item, i) => (
                <button
                  key={item}
                  onClick={() => {
                    onNavigate?.(
                      ["landing", "finder", "mosque", "prayer", "blog"][i],
                    );
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    fontSize: 15,
                    padding: "8px 0",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: item === "Blog" ? 600 : 400,
                    color: item === "Blog" ? "#1a4a2e" : "#333",
                  }}
                >
                  {item}
                </button>
              ),
            )}
            <hr style={{ border: "none", borderTop: "1px solid #e8e4dc" }} />
            <button
              className="blog-btn-post"
              onClick={() => {
                setIsUploadModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              ✏ Post News
            </button>
          </div>
        </Drawer>
      </div>
    </>
  );
}

export default BlogPage;
