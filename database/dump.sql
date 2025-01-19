-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 19, 2025 at 03:50 PM
-- Server version: 10.11.10-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u706445648_quintessential`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_tokens`
--

CREATE TABLE `auth_tokens` (
  `rec_id` int(11) NOT NULL,
  `user_id` varchar(48) NOT NULL,
  `access_token` varchar(254) NOT NULL,
  `refresh_token` varchar(254) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `auth_tokens`
--

INSERT INTO `auth_tokens` (`rec_id`, `user_id`, `access_token`, `refresh_token`, `created_at`, `updated_at`) VALUES
(3, 'usr_LBLE@9h3L9McmLUW', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyX0xCTEVAOWgzTDlNY21MVVciLCJpYXQiOjE3MzczMDA1NDMsImV4cCI6MTczNzMwMDg0M30.shvxfHfr9z81XCqxvy9Cd4OK_UYsRYEDELDTxYmwDKI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyX0xCTEVAOWgzTDlNY21MVVciLCJpYXQiOjE3MzcyODY0NjEsImV4cCI6MTczNzg5MTI2MX0._XEewk8yZk4AApkfAxwLpLZcZZoGGiEeNRJEcq1Imho', '2025-01-19 11:34:21', '2025-01-19 15:29:03');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` varchar(48) NOT NULL,
  `user_id` varchar(48) NOT NULL,
  `title` varchar(254) NOT NULL,
  `graphic_url` text DEFAULT NULL,
  `description` text NOT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `user_id`, `title`, `graphic_url`, `description`, `likes`, `created_at`, `updated_at`) VALUES
('pst__IJbgfKEq1!B%sxY', 'usr_LBLE@9h3L9McmLUW', 'Post 1', 'https://google.com', 'description demo 1', 0, '2025-01-19 13:11:24', '2025-01-19 13:11:24'),
('pst_oipAh1EAd0fGGqCG', 'usr_LBLE@9h3L9McmLUW', 'Post 2', 'https://google.com', 'description demo 2', 0, '2025-01-19 13:22:52', '2025-01-19 13:22:52');

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `comment_id` varchar(48) NOT NULL,
  `user_id` varchar(48) NOT NULL,
  `post_id` varchar(48) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_comments`
--

INSERT INTO `post_comments` (`comment_id`, `user_id`, `post_id`, `comment`, `created_at`, `updated_at`) VALUES
('cmd_qE0yAs5I7AzCDhIv', 'usr_LBLE@9h3L9McmLUW', 'pst_oipAh1EAd0fGGqCG', 'This is a demo comment', '2025-01-19 15:29:44', '2025-01-19 15:29:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(48) NOT NULL,
  `first_name` varchar(254) NOT NULL,
  `last_name` varchar(254) NOT NULL,
  `username` varchar(254) NOT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(254) NOT NULL,
  `password` varchar(254) NOT NULL,
  `profile_pic_url` text DEFAULT NULL,
  `activated` tinyint(1) NOT NULL DEFAULT 0,
  `request_password_change` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `username`, `email`, `phone`, `password`, `profile_pic_url`, `activated`, `request_password_change`, `created_at`, `updated_at`) VALUES
('usr_LBLE@9h3L9McmLUW', 'Anastasios', 'Tsalmas', 'tsalmas_anastasios', 'tsalmanastasios@gmail.com', '+306949694043', '$2b$12$0AgMnkYzXAYKhdsv5/g7he6y0UgEeXcZGXOp75qZ1wkVXWik749NG', NULL, 1, 0, '2025-01-19 09:44:53', '2025-01-19 09:44:53'),
('usr_m_yAlGQ7s~9ciPku', 'John', 'Doe', 'johnd', 'johnd@test.com', '+306985964152', '$2b$12$cQR5bl/SiYoH23VQRb0z5.C3Q6jdmjO04F7TPRpTMRbPLtoAvDW5W', NULL, 1, 0, '2025-01-19 09:46:34', '2025-01-19 09:46:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD PRIMARY KEY (`rec_id`),
  ADD UNIQUE KEY `auth_tokens_unique` (`user_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `posts_users_FK` (`user_id`);

--
-- Indexes for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `post_comments_posts_FK` (`post_id`),
  ADD KEY `post_comments_users_FK` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  MODIFY `rec_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD CONSTRAINT `auth_tokens_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `post_comments_posts_FK` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `post_comments_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
