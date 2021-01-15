-- Adminer 4.7.8 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `subject` smallint unsigned NOT NULL,
  `tutee` smallint unsigned NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `recurrence` varchar(8) DEFAULT 'NULL',
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tutee` (`tutee`),
  KEY `subject` (`subject`),
  CONSTRAINT `lessons_ibfk_4` FOREIGN KEY (`tutee`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `lessons_ibfk_5` FOREIGN KEY (`subject`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP VIEW IF EXISTS `schedule`;
CREATE TABLE `schedule` (`lid` smallint unsigned, `uid` smallint unsigned, `sid` smallint unsigned, `title` varchar(255), `description` varchar(255), `start` datetime, `end` datetime);


DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `level` varchar(255) NOT NULL,
  `fees` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(9) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `role` tinyint unsigned NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `unit` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP VIEW IF EXISTS `v_users`;
CREATE TABLE `v_users` (`unit` varchar(255), `latitude` double, `longitude` double, `id` smallint unsigned, `username` varchar(255), `name` varchar(255), `phone` varchar(9), `email` varchar(255), `address` varchar(255), `role` tinyint unsigned);


DROP TABLE IF EXISTS `schedule`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `schedule` AS select `l`.`id` AS `lid`,`u`.`id` AS `uid`,`s`.`id` AS `sid`,`u`.`name` AS `title`,`s`.`name` AS `description`,`l`.`start` AS `start`,`l`.`end` AS `end` from ((`lessons` `l` join `users` `u` on((`l`.`tutee` = `u`.`id`))) join `subjects` `s` on((`l`.`subject` = `s`.`id`)));

DROP TABLE IF EXISTS `v_users`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_users` AS select `users`.`unit` AS `unit`,`users`.`latitude` AS `latitude`,`users`.`longitude` AS `longitude`,`users`.`id` AS `id`,`users`.`username` AS `username`,`users`.`name` AS `name`,`users`.`phone` AS `phone`,`users`.`email` AS `email`,`users`.`address` AS `address`,`users`.`role` AS `role` from `users`;

-- 2021-01-15 00:50:03