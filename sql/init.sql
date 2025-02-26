CREATE DATABASE  IF NOT EXISTS `grader_assignment` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `grader_assignment`;
-- Host: localhost    Database: grader_assignment
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `applicant_resume`
--

DROP TABLE IF EXISTS `applicant_resume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicant_resume` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `applicant_net_id` char(10) DEFAULT NULL,
  `skills` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_applicant_id_idx` (`applicant_net_id`),
  CONSTRAINT `fk_applicant_net_id` FOREIGN KEY (`applicant_net_id`) REFERENCES `applicants` (`net_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicant_resume`
--

LOCK TABLES `applicant_resume` WRITE;
/*!40000 ALTER TABLE `applicant_resume` DISABLE KEYS */;
/*!40000 ALTER TABLE `applicant_resume` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applicants`
--

DROP TABLE IF EXISTS `applicants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicants` (
  `net_id` char(10) NOT NULL DEFAULT 'xxx000000',
  `applicant_name` varchar(45) DEFAULT NULL,
  `applicant_email` char(25) DEFAULT 'xxx000000@utdallas.edu',
  `school_year` char(10) DEFAULT 'Masters',
  `university` char(35) DEFAULT 'The University of Texas at Dallas',
  `school` varchar(60) DEFAULT 'Erik Jonsson School of Engineering and Computer Science',
  `graduation_date` char(10) DEFAULT '2026-05-01',
  `major` varchar(170) DEFAULT 'Computer Science',
  `qualified` tinyint DEFAULT NULL,
  PRIMARY KEY (`net_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicants`
--

LOCK TABLES `applicants` WRITE;
/*!40000 ALTER TABLE `applicants` DISABLE KEYS */;
/*!40000 ALTER TABLE `applicants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `applicant_id` char(10) DEFAULT NULL,
  `course_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prof_id_idx` (`course_id`),
  KEY `fk_applicant_id_idx` (`applicant_id`),
  CONSTRAINT `fk_applicant_id` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`net_id`),
  CONSTRAINT `fk_prof_id` FOREIGN KEY (`course_id`) REFERENCES `professor_courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor_courses`
--

DROP TABLE IF EXISTS `professor_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor_courses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `professor_name` varchar(45) DEFAULT NULL,
  `professor_email` varchar(45) DEFAULT 'xxx000000@utdallas.edu',
  `course_number` char(10) DEFAULT NULL,
  `course_section` char(5) DEFAULT NULL,
  `course_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor_courses`
--

LOCK TABLES `professor_courses` WRITE;
/*!40000 ALTER TABLE `professor_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `professor_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recomendations`
--

DROP TABLE IF EXISTS `recomendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recomendations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `professor_course_id` int unsigned DEFAULT NULL,
  `student_net_id` char(10) DEFAULT 'xxx000000',
  PRIMARY KEY (`id`),
  KEY `fk_prof_id_idx` (`professor_course_id`),
  KEY `fk_student_id_idx` (`student_net_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recomendations`
--

LOCK TABLES `recomendations` WRITE;
/*!40000 ALTER TABLE `recomendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `recomendations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

