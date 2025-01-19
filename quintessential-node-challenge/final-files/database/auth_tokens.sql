CREATE TABLE `auth_tokens` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(48) NOT NULL,
  `access_token` varchar(254) NOT NULL,
  `refresh_token` varchar(254) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`rec_id`),
  UNIQUE KEY `auth_tokens_unique` (`user_id`),
  CONSTRAINT `auth_tokens_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;