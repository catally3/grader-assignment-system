CREATE DATABASE IF NOT EXISTS `grader_assignment`;
USE `grader_assignment`;
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
-- Table structure for table `applicants`
--

DROP TABLE IF EXISTS `applicants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicants` (
  `student_id` varchar(12) NOT NULL DEFAULT '0000000000',
  `document_id` varchar(8) DEFAULT '0000000',
  `semester` varchar(255) NOT NULL DEFAULT 'Semester',
  `applicant_name` varchar(255) DEFAULT NULL,
  `applicant_email` varchar(50) DEFAULT 'xxx000000@utdallas.edu',
  `school_year` varchar(10) DEFAULT 'Masters',
  `university` varchar(35) DEFAULT 'The University of Texas at Dallas',
  `school` varchar(255) DEFAULT 'Erik Jonsson School of Engineering and Computer Science',
  `graduation_date` varchar(10) DEFAULT '2026-05-01',
  `major` varchar(255) DEFAULT 'Computer Science',
  `qualified` tinyint DEFAULT NULL,
  `continuing` tinyint DEFAULT NULL,
  `gpa` float unsigned DEFAULT NULL,
  `resume_path` varchar(255) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `document_id_UNIQUE` (`document_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `applicants` WRITE;
/*!40000 ALTER TABLE `applicants` DISABLE KEYS */;
/*!40000 ALTER TABLE `applicants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `semester` varchar(255) NOT NULL DEFAULT 'Semester',
  `professor_name` varchar(255) DEFAULT NULL,
  `professor_email` varchar(255) DEFAULT 'xxx000000@utdallas.edu',
  `course_number` varchar(10) DEFAULT NULL,
  `course_section` varchar(5) DEFAULT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `number_of_graders` int DEFAULT NULL,
  `keywords` JSON DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `applicant_student_id` varchar(12) DEFAULT NULL,
  `course_id` int unsigned DEFAULT NULL,
  `score` float DEFAULT NULL,
  `reasoning` text DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prof_id_idx` (`course_id`),
  KEY `fk_applicant_id_idx` (`applicant_student_id`),
  CONSTRAINT `fk_applicant_id` FOREIGN KEY (`applicant_student_id`) REFERENCES `applicants` (`student_id`),
  CONSTRAINT `fk_prof_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `semester` varchar(255) NOT NULL DEFAULT 'Semester',
  `professor_id` int unsigned DEFAULT NULL,
  `applicant_name` varchar(255) DEFAULT NULL,
  `applicant_student_id` varchar(12) DEFAULT '000000000',
  PRIMARY KEY (`id`),
  KEY `fk_prof_id_idx` (`professor_id`),
  KEY `fk_applicant_id_idx` (`applicant_student_id`),
  CONSTRAINT `fk_applicant_id2` FOREIGN KEY (`applicant_student_id`) REFERENCES `applicants` (`student_id`),
  CONSTRAINT `fk_prof_id2` FOREIGN KEY (`professor_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `recommendations` WRITE; 
/*!40000 ALTER TABLE `recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
