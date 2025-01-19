CREATE TABLE `post_comments` (
  `comment_id` varchar(48) NOT NULL,
  `user_id` varchar(48) NOT NULL,
  `post_id` varchar(48) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`comment_id`),
  KEY `post_comments_posts_FK` (`post_id`),
  KEY `post_comments_users_FK` (`user_id`),
  CONSTRAINT `post_comments_posts_FK` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_comments_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;