-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: spy_family
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message` (
  `message_id` bigint NOT NULL AUTO_INCREMENT,
  `content_type` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `room_id` varchar(255) DEFAULT NULL,
  `send_user_id` varchar(255) DEFAULT NULL,
  `type` tinyint DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `is_read` bit(1) NOT NULL,
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
INSERT INTO `chat_message` VALUES (1,NULL,'바보',NULL,NULL,1,NULL,_binary '\0'),(2,NULL,'ㄴㅇㄹ','3333','21',1,NULL,_binary '\0'),(3,NULL,'ㄴㅇㄹ','3333','21',1,NULL,_binary '\0'),(4,NULL,'ㄹㄹㄹ','3333','21',1,NULL,_binary '\0'),(5,NULL,'fㅇㄴ','3333','21',1,NULL,_binary '\0'),(6,NULL,'ㄴㅇㄹ','3333','21',1,NULL,_binary '\0'),(7,NULL,'ㅀㅀ','3333','21',1,NULL,_binary '\0'),(8,NULL,'ㅎㅎㄹ','3333','21',1,NULL,_binary '\0'),(9,NULL,'ddf','3333','20',1,NULL,_binary '\0'),(10,NULL,'gs','3333','20',1,NULL,_binary '\0'),(11,NULL,'ㄹdd','3333','20',1,NULL,_binary '\0'),(12,NULL,'asdf','3333','20',1,NULL,_binary '\0'),(13,NULL,'gg','3333','20',1,NULL,_binary '\0');
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-30 22:04:24
