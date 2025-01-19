CREATE TABLE `posts` (
  `post_id` varchar(48) NOT NULL,
  `user_id` varchar(48) NOT NULL,
  `title` varchar(254) NOT NULL,
  `graphic_url` text DEFAULT NULL,
  `description` text NOT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`post_id`),
  KEY `posts_users_FK` (`user_id`),
  CONSTRAINT `posts_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;