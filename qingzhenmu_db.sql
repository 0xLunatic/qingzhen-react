-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2026 at 08:35 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qingzhenmu_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_reviews`
--

CREATE TABLE `app_reviews` (
  `id` int(11) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_reviews`
--

INSERT INTO `app_reviews` (`id`, `user_id`, `guest_name`, `rating`, `comment`, `is_featured`, `created_at`) VALUES
(1, '5bc1378d-5461-4fcd-ad2a-97731676d927', 'Anonymous', 5, 'Test', 0, '2026-01-07 15:58:07'),
(2, '5bc1378d-5461-4fcd-ad2a-97731676d927', 'Anonymous', 5, 'Aplikasi berjalan baik!', 0, '2026-01-07 16:28:56');

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

CREATE TABLE `places` (
  `id` int(11) NOT NULL,
  `name_cn` varchar(255) DEFAULT NULL,
  `name_en` varchar(255) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `address` text DEFAULT NULL,
  `category` enum('Restaurant','Mosque','Market') NOT NULL,
  `halal_status` enum('Verified','Muslim Owned','No Pork') DEFAULT 'No Pork',
  `food_type` enum('Vegan','Real Food','Fast Food') DEFAULT NULL,
  `is_promo` tinyint(1) DEFAULT 0,
  `promo_details` text DEFAULT NULL,
  `opening_hours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`opening_hours`)),
  `contributor_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `osm_id` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `photos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`photos`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `places`
--

INSERT INTO `places` (`id`, `name_cn`, `name_en`, `latitude`, `longitude`, `address`, `category`, `halal_status`, `food_type`, `is_promo`, `promo_details`, `opening_hours`, `contributor_id`, `is_verified`, `created_at`, `updated_at`, `osm_id`, `image_url`, `photos`) VALUES
(12, NULL, 'Menco', -7.83853860, 110.41126150, 'Jl. Pleret,', 'Restaurant', 'No Pork', NULL, 0, NULL, NULL, '5bc1378d-5461-4fcd-ad2a-97731676d927', 1, '2026-01-07 22:46:50', '2026-01-07 22:46:50', '3636083365', NULL, NULL),
(13, NULL, 'Monggo Resto', -7.84556490, 110.40292030, 'Nearby location', 'Restaurant', 'No Pork', NULL, 0, NULL, NULL, '5bc1378d-5461-4fcd-ad2a-97731676d927', 1, '2026-01-07 22:49:51', '2026-01-07 23:40:20', '3451607266', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `place_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `photos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`photos`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `wechat_id` varchar(255) DEFAULT NULL,
  `apple_id` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT 'I love halal food!',
  `location` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT 1,
  `points` int(11) DEFAULT 0,
  `badges` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`badges`)),
  `role` enum('user','contributor','admin') DEFAULT 'user',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `phone_number`, `password_hash`, `wechat_id`, `apple_id`, `avatar_url`, `bio`, `location`, `level`, `points`, `badges`, `role`, `created_at`, `updated_at`) VALUES
('5bc1378d-5461-4fcd-ad2a-97731676d927', 'Administrator', 'admin', 'admin@qingzhen.com', '+6282137855872', '$2b$12$e81RNerNZsmUkSuZWviGlus6O.qaOZyFQRS8A2K9UlplgW16PitB2', NULL, NULL, NULL, 'I love halal food!', NULL, 1, 0, '[]', 'admin', '2026-01-05 10:41:50', '2026-01-05 10:41:50'),
('5c59c0fb-c0ad-43bc-896a-adba65d41b5f', 'Testt', 'test', 'test@gmail.com', '+629127317236123', '$2b$12$BhGO/Jd2lNfserWWAHM9heA6DTutBoMcnYmJu2yV3rIg6YHhsFWKq', NULL, NULL, NULL, 'I love halal food!', NULL, 1, 0, '[]', 'contributor', '2026-01-07 16:02:43', '2026-01-07 16:03:22');

-- --------------------------------------------------------

--
-- Table structure for table `user_visits`
--

CREATE TABLE `user_visits` (
  `id` int(11) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `place_id` int(11) NOT NULL,
  `place_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`place_data`)),
  `visited_at` datetime DEFAULT NULL,
  `status` enum('Visited','Wishlist') NOT NULL DEFAULT 'Visited',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_visits`
--

INSERT INTO `user_visits` (`id`, `user_id`, `place_id`, `place_data`, `visited_at`, `status`, `created_at`, `updated_at`) VALUES
(22, '5bc1378d-5461-4fcd-ad2a-97731676d927', 13, '{\"name\":\"Monggo Resto\",\"address\":\"Nearby location\",\"lat\":-7.8455649,\"lng\":110.4029203,\"rating\":\"New\",\"img\":\"https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&q=60\"}', '2026-01-07 23:39:02', 'Visited', '2026-01-07 23:39:02', '2026-01-07 23:39:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_reviews`
--
ALTER TABLE `app_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `osm_id` (`osm_id`),
  ADD UNIQUE KEY `osm_id_2` (`osm_id`),
  ADD UNIQUE KEY `osm_id_3` (`osm_id`),
  ADD UNIQUE KEY `osm_id_4` (`osm_id`),
  ADD UNIQUE KEY `osm_id_5` (`osm_id`),
  ADD UNIQUE KEY `osm_id_6` (`osm_id`),
  ADD UNIQUE KEY `osm_id_7` (`osm_id`),
  ADD UNIQUE KEY `osm_id_8` (`osm_id`),
  ADD UNIQUE KEY `osm_id_9` (`osm_id`),
  ADD UNIQUE KEY `osm_id_10` (`osm_id`),
  ADD UNIQUE KEY `osm_id_11` (`osm_id`),
  ADD UNIQUE KEY `osm_id_12` (`osm_id`),
  ADD UNIQUE KEY `osm_id_13` (`osm_id`),
  ADD UNIQUE KEY `osm_id_14` (`osm_id`),
  ADD UNIQUE KEY `osm_id_15` (`osm_id`),
  ADD UNIQUE KEY `osm_id_16` (`osm_id`),
  ADD UNIQUE KEY `osm_id_17` (`osm_id`),
  ADD KEY `idx_osm_id` (`osm_id`),
  ADD KEY `contributor_id` (`contributor_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `place_id` (`place_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone_number` (`phone_number`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `wechat_id` (`wechat_id`),
  ADD UNIQUE KEY `apple_id` (`apple_id`);

--
-- Indexes for table `user_visits`
--
ALTER TABLE `user_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `place_id` (`place_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_reviews`
--
ALTER TABLE `app_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `places`
--
ALTER TABLE `places`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_visits`
--
ALTER TABLE `user_visits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `app_reviews`
--
ALTER TABLE `app_reviews`
  ADD CONSTRAINT `app_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `places`
--
ALTER TABLE `places`
  ADD CONSTRAINT `places_ibfk_1` FOREIGN KEY (`contributor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_visits`
--
ALTER TABLE `user_visits`
  ADD CONSTRAINT `user_visits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_visits_ibfk_2` FOREIGN KEY (`place_id`) REFERENCES `places` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
