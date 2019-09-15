-- MySQL dump 10.13  Distrib 8.0.12, for osx10.13 (x86_64)
--
-- Host: localhost    Database: node_server
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acl_meta`
--

DROP TABLE IF EXISTS `acl_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_meta` (
  `key` varchar(255) NOT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_meta`
--

LOCK TABLES `acl_meta` WRITE;
/*!40000 ALTER TABLE `acl_meta` DISABLE KEYS */;
INSERT INTO `acl_meta` VALUES ('users','[\"5b6f5094-2c4d-4c70-b42b-94db82a77b48\"]','2019-07-07 17:56:40','2019-07-07 17:56:40');
/*!40000 ALTER TABLE `acl_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_parents`
--

DROP TABLE IF EXISTS `acl_parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_parents` (
  `key` varchar(255) NOT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_parents`
--

LOCK TABLES `acl_parents` WRITE;
/*!40000 ALTER TABLE `acl_parents` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_parents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_permissions`
--

DROP TABLE IF EXISTS `acl_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_permissions` (
  `key` varchar(255) NOT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_permissions`
--

LOCK TABLES `acl_permissions` WRITE;
/*!40000 ALTER TABLE `acl_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_resources`
--

DROP TABLE IF EXISTS `acl_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_resources` (
  `key` varchar(255) NOT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_resources`
--

LOCK TABLES `acl_resources` WRITE;
/*!40000 ALTER TABLE `acl_resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_roles`
--

DROP TABLE IF EXISTS `acl_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_roles` (
  `key` varchar(255) NOT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_roles`
--

LOCK TABLES `acl_roles` WRITE;
/*!40000 ALTER TABLE `acl_roles` DISABLE KEYS */;
INSERT INTO `acl_roles` VALUES ('SUPERADMIN','[\"5b6f5094-2c4d-4c70-b42b-94db82a77b48\"]','2019-07-07 17:56:40','2019-07-07 17:56:40');
/*!40000 ALTER TABLE `acl_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_users`
--

DROP TABLE IF EXISTS `acl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `acl_users` (
  `key` varchar(255) NOT NULL,
  `value` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_users`
--

LOCK TABLES `acl_users` WRITE;
/*!40000 ALTER TABLE `acl_users` DISABLE KEYS */;
INSERT INTO `acl_users` VALUES ('5b6f5094-2c4d-4c70-b42b-94db82a77b48','[\"SUPERADMIN\"]','2019-07-07 17:56:40','2019-07-07 17:56:40'),('c7aa1c90-bd99-4631-83e8-b16dbd1eb47c','[\"SUPERADMIN\"]','2019-07-07 17:56:40','2019-07-07 17:56:40');
/*!40000 ALTER TABLE `acl_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Areas`
--

DROP TABLE IF EXISTS `Areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Areas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codeid` int(11) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  `cityname` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Areas`
--

LOCK TABLES `Areas` WRITE;
/*!40000 ALTER TABLE `Areas` DISABLE KEYS */;
/*!40000 ALTER TABLE `Areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cabinets`
--

DROP TABLE IF EXISTS `Cabinets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Cabinets` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT '',
  `number` varchar(255) DEFAULT '',
  `deadlinetime` varchar(255) DEFAULT '',
  `cost` varchar(255) DEFAULT '',
  `deposit` varchar(255) DEFAULT '',
  `payment` varchar(255) DEFAULT '',
  `payee` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `storeid` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `cabinets_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cabinets`
--

LOCK TABLES `Cabinets` WRITE;
/*!40000 ALTER TABLE `Cabinets` DISABLE KEYS */;
/*!40000 ALTER TABLE `Cabinets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Coaches`
--

DROP TABLE IF EXISTS `Coaches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Coaches` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '',
  `sex` int(2) DEFAULT '1',
  `cellphone` varchar(255) DEFAULT '',
  `groupId` int(11) DEFAULT '0',
  `coachType` int(4) DEFAULT '1',
  `allowCourse` varchar(255) DEFAULT '',
  `feature` varchar(255) DEFAULT '0',
  `position` varchar(255) DEFAULT '',
  `course` varchar(255) DEFAULT '',
  `honor` varchar(255) DEFAULT '',
  `descript` varchar(255) DEFAULT '',
  `isOpenCoach` int(1) DEFAULT '0',
  `dailyLessonNumLimit` int(11) DEFAULT '0',
  `workTime` varchar(255) DEFAULT '',
  `workBeginDate` varchar(255) DEFAULT '',
  `workEndDate` varchar(255) DEFAULT '',
  `pauseWorkBeginDate` varchar(255) DEFAULT '',
  `pauseWorkEndDate` varchar(255) DEFAULT '',
  `images` varchar(2048) DEFAULT '',
  `headimags` varchar(2048) DEFAULT '',
  `score` int(11) DEFAULT '0',
  `weight` int(11) DEFAULT '0',
  `weeks` varchar(2048) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `pdmemberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `userid` (`userid`),
  KEY `storeid` (`storeid`),
  KEY `pdmemberid` (`pdmemberid`),
  CONSTRAINT `coaches_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `coaches_ibfk_2` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `coaches_ibfk_3` FOREIGN KEY (`pdmemberid`) REFERENCES `pdmembers` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Coaches`
--

LOCK TABLES `Coaches` WRITE;
/*!40000 ALTER TABLE `Coaches` DISABLE KEYS */;
/*!40000 ALTER TABLE `Coaches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CoachGroups`
--

DROP TABLE IF EXISTS `CoachGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `CoachGroups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '',
  `parentid` int(11) unsigned DEFAULT NULL,
  `gtype` int(2) DEFAULT NULL,
  `treetype` int(2) DEFAULT NULL,
  `isSelected` tinyint(1) DEFAULT '0',
  `storeid` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CoachGroups`
--

LOCK TABLES `CoachGroups` WRITE;
/*!40000 ALTER TABLE `CoachGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `CoachGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CoachPositions`
--

DROP TABLE IF EXISTS `CoachPositions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `CoachPositions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `storeid` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CoachPositions`
--

LOCK TABLES `CoachPositions` WRITE;
/*!40000 ALTER TABLE `CoachPositions` DISABLE KEYS */;
/*!40000 ALTER TABLE `CoachPositions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CoachScores`
--

DROP TABLE IF EXISTS `CoachScores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `CoachScores` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coachId` int(11) DEFAULT NULL,
  `memberId` varchar(255) DEFAULT '',
  `score` int(11) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `coachscores_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CoachScores`
--

LOCK TABLES `CoachScores` WRITE;
/*!40000 ALTER TABLE `CoachScores` DISABLE KEYS */;
/*!40000 ALTER TABLE `CoachScores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CommonConfs`
--

DROP TABLE IF EXISTS `CommonConfs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `CommonConfs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `groupLessonOrderTimeLimit` int(11) DEFAULT '5',
  `groupLessonCancelOrderTimeLimit` int(11) DEFAULT '10',
  `priavteLessonOrderTimeLimit` int(11) DEFAULT '5',
  `privateLessonCancelOrderTimeLimit` int(11) DEFAULT '10',
  `remark` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `commonconfs_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CommonConfs`
--

LOCK TABLES `CommonConfs` WRITE;
/*!40000 ALTER TABLE `CommonConfs` DISABLE KEYS */;
/*!40000 ALTER TABLE `CommonConfs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Courses`
--

DROP TABLE IF EXISTS `Courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Courses` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `coursename` varchar(255) DEFAULT '',
  `coursekind` varchar(255) DEFAULT '1',
  `needConfine` varchar(255) DEFAULT '1',
  `stopOrderCourse` int(11) DEFAULT '1',
  `stopCancelCourse` int(11) DEFAULT '1',
  `coursetime` varchar(255) DEFAULT '',
  `beforeDay` int(11) DEFAULT '0',
  `orderTime` varchar(255) DEFAULT '',
  `mincoursemember` int(11) DEFAULT '0',
  `maxcoursemember` int(11) DEFAULT '0',
  `coverUrl` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `notifyMsgStatus` varchar(255) DEFAULT '',
  `images` varchar(2048) DEFAULT '',
  `recommendWeight` int(11) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Courses`
--

LOCK TABLES `Courses` WRITE;
/*!40000 ALTER TABLE `Courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `Courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Deposits`
--

DROP TABLE IF EXISTS `Deposits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Deposits` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `use` varchar(255) DEFAULT '',
  `chargetime` datetime DEFAULT NULL,
  `returntime` datetime DEFAULT NULL,
  `cost` varchar(255) DEFAULT '',
  `payment` int(2) DEFAULT '0',
  `returntype` int(2) DEFAULT '0',
  `payee` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `status` int(2) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `deposits_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Deposits`
--

LOCK TABLES `Deposits` WRITE;
/*!40000 ALTER TABLE `Deposits` DISABLE KEYS */;
/*!40000 ALTER TABLE `Deposits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Earnests`
--

DROP TABLE IF EXISTS `Earnests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Earnests` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `chargetime` datetime DEFAULT NULL,
  `returntime` datetime DEFAULT NULL,
  `cost` varchar(255) DEFAULT '',
  `payment` int(2) DEFAULT '0',
  `returntype` int(2) DEFAULT '0',
  `payee` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `status` int(2) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `earnests_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Earnests`
--

LOCK TABLES `Earnests` WRITE;
/*!40000 ALTER TABLE `Earnests` DISABLE KEYS */;
/*!40000 ALTER TABLE `Earnests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmployeeGroups`
--

DROP TABLE IF EXISTS `EmployeeGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `EmployeeGroups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '',
  `parentid` int(11) unsigned DEFAULT NULL,
  `gtype` int(2) DEFAULT NULL,
  `treetype` int(2) DEFAULT NULL,
  `isSelected` tinyint(1) DEFAULT '0',
  `storeid` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmployeeGroups`
--

LOCK TABLES `EmployeeGroups` WRITE;
/*!40000 ALTER TABLE `EmployeeGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmployeeGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EmployeePositions`
--

DROP TABLE IF EXISTS `EmployeePositions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `EmployeePositions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `storeid` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmployeePositions`
--

LOCK TABLES `EmployeePositions` WRITE;
/*!40000 ALTER TABLE `EmployeePositions` DISABLE KEYS */;
/*!40000 ALTER TABLE `EmployeePositions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employees`
--

DROP TABLE IF EXISTS `Employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Employees` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '',
  `sex` int(2) DEFAULT '1',
  `cellphone` varchar(255) DEFAULT '',
  `groupId` int(11) DEFAULT '0',
  `position` varchar(255) DEFAULT '',
  `isMember` tinyint(1) DEFAULT NULL,
  `dataAuth` varchar(255) DEFAULT '',
  `storeid` varchar(255) DEFAULT '',
  `images` varchar(2048) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `pdmemberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `userid` (`userid`),
  KEY `pdmemberid` (`pdmemberid`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`pdmemberid`) REFERENCES `pdmembers` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50000000 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employees`
--

LOCK TABLES `Employees` WRITE;
/*!40000 ALTER TABLE `Employees` DISABLE KEYS */;
/*!40000 ALTER TABLE `Employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Experiences`
--

DROP TABLE IF EXISTS `Experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Experiences` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '',
  `phone` varchar(255) DEFAULT '',
  `ordertime` varchar(255) DEFAULT '',
  `enterTime` varchar(255) DEFAULT '',
  `leavetime` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `operaFlag` tinyint(1) DEFAULT '0',
  `storeid` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `employeeId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `employeeId` (`employeeId`),
  CONSTRAINT `experiences_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Experiences`
--

LOCK TABLES `Experiences` WRITE;
/*!40000 ALTER TABLE `Experiences` DISABLE KEYS */;
/*!40000 ALTER TABLE `Experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Follows`
--

DROP TABLE IF EXISTS `Follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Follows` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `personnel` varchar(255) DEFAULT '',
  `mode` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Follows`
--

LOCK TABLES `Follows` WRITE;
/*!40000 ALTER TABLE `Follows` DISABLE KEYS */;
/*!40000 ALTER TABLE `Follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GroupLessons`
--

DROP TABLE IF EXISTS `GroupLessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `GroupLessons` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `courseDate` varchar(255) DEFAULT NULL,
  `beginTime` varchar(255) DEFAULT NULL,
  `endTime` varchar(255) DEFAULT NULL,
  `allowCards` varchar(255) DEFAULT '',
  `status` int(2) DEFAULT '0',
  `currentNumber` int(11) DEFAULT '0',
  `signDate` varchar(255) DEFAULT '',
  `signOkDate` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `recommendWeight` int(11) DEFAULT '0',
  `minNum` int(11) DEFAULT '0',
  `maxNum` int(11) DEFAULT '0',
  `haveDevice` int(2) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `courseId` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `coachId` bigint(20) DEFAULT NULL,
  `recordPersonId` bigint(20) DEFAULT NULL,
  `roomId` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `storeid` (`storeid`),
  KEY `courseId` (`courseId`),
  KEY `coachId` (`coachId`),
  KEY `recordPersonId` (`recordPersonId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `grouplessons_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `grouplessons_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `courses` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `grouplessons_ibfk_3` FOREIGN KEY (`coachId`) REFERENCES `coaches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `grouplessons_ibfk_4` FOREIGN KEY (`recordPersonId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `grouplessons_ibfk_5` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GroupLessons`
--

LOCK TABLES `GroupLessons` WRITE;
/*!40000 ALTER TABLE `GroupLessons` DISABLE KEYS */;
/*!40000 ALTER TABLE `GroupLessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HardWare`
--

DROP TABLE IF EXISTS `HardWare`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `HardWare` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `devid` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `hardware_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HardWare`
--

LOCK TABLES `HardWare` WRITE;
/*!40000 ALTER TABLE `HardWare` DISABLE KEYS */;
/*!40000 ALTER TABLE `HardWare` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Integrals`
--

DROP TABLE IF EXISTS `Integrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Integrals` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `arrange` varchar(255) DEFAULT '',
  `integration` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `storeid` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `integrals_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Integrals`
--

LOCK TABLES `Integrals` WRITE;
/*!40000 ALTER TABLE `Integrals` DISABLE KEYS */;
/*!40000 ALTER TABLE `Integrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IntelCabinetLogs`
--

DROP TABLE IF EXISTS `IntelCabinetLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `IntelCabinetLogs` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(255) DEFAULT '',
  `rfid` int(11) DEFAULT '0',
  `type` int(2) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `intelcabinetlogs_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IntelCabinetLogs`
--

LOCK TABLES `IntelCabinetLogs` WRITE;
/*!40000 ALTER TABLE `IntelCabinetLogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `IntelCabinetLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IntelCabinets`
--

DROP TABLE IF EXISTS `IntelCabinets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `IntelCabinets` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(255) DEFAULT '',
  `rfid` int(11) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `intelcabinets_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `intelcabinets_ibfk_2` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IntelCabinets`
--

LOCK TABLES `IntelCabinets` WRITE;
/*!40000 ALTER TABLE `IntelCabinets` DISABLE KEYS */;
/*!40000 ALTER TABLE `IntelCabinets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Members`
--

DROP TABLE IF EXISTS `Members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Members` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `from` varchar(255) DEFAULT '',
  `tags` varchar(255) DEFAULT '',
  `belong` varchar(255) DEFAULT '',
  `RFID` varchar(255) DEFAULT '',
  `scords` varchar(255) DEFAULT '',
  `integral` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pdmemberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `pdmemberid` (`pdmemberid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `members_ibfk_1` FOREIGN KEY (`pdmemberid`) REFERENCES `pdmembers` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `members_ibfk_2` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Members`
--

LOCK TABLES `Members` WRITE;
/*!40000 ALTER TABLE `Members` DISABLE KEYS */;
/*!40000 ALTER TABLE `Members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MSignins`
--

DROP TABLE IF EXISTS `MSignins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `MSignins` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(255) DEFAULT '',
  `signin` varchar(255) DEFAULT '',
  `signdate` varchar(255) DEFAULT NULL,
  `handcardid` varchar(255) DEFAULT '',
  `noreturncardid` varchar(255) DEFAULT '',
  `returntime` varchar(255) DEFAULT '',
  `status` int(2) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `vipcardmapid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `vipcardmapid` (`vipcardmapid`),
  CONSTRAINT `msignins_ibfk_1` FOREIGN KEY (`vipcardmapid`) REFERENCES `vipcardmaps` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MSignins`
--

LOCK TABLES `MSignins` WRITE;
/*!40000 ALTER TABLE `MSignins` DISABLE KEYS */;
/*!40000 ALTER TABLE `MSignins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NotifyMsgs`
--

DROP TABLE IF EXISTS `NotifyMsgs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `NotifyMsgs` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `msg` varchar(255) DEFAULT '',
  `storeid` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `notifymsgs_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NotifyMsgs`
--

LOCK TABLES `NotifyMsgs` WRITE;
/*!40000 ALTER TABLE `NotifyMsgs` DISABLE KEYS */;
/*!40000 ALTER TABLE `NotifyMsgs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderGroups`
--

DROP TABLE IF EXISTS `OrderGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `OrderGroups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `memberId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `status` int(2) DEFAULT '0',
  `vipCardMapId` varchar(255) DEFAULT '',
  `signType` int(2) DEFAULT '0',
  `storeid` varchar(255) DEFAULT '',
  `userScore` int(11) DEFAULT '0',
  `userReview` varchar(255) DEFAULT '',
  `orderdate` varchar(255) DEFAULT '',
  `signdate` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `groupLessonId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `groupLessonId` (`groupLessonId`),
  CONSTRAINT `ordergroups_ibfk_1` FOREIGN KEY (`groupLessonId`) REFERENCES `grouplessons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderGroups`
--

LOCK TABLES `OrderGroups` WRITE;
/*!40000 ALTER TABLE `OrderGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Orders` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `ordernumber` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '',
  `type` int(2) DEFAULT '0',
  `money` decimal(10,2) DEFAULT '0.00',
  `method` int(2) DEFAULT '0',
  `payment` int(2) DEFAULT '0',
  `ascription` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '',
  `deal` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `status` int(2) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `vcmlid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `pmlid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `wlid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `vcmlid` (`vcmlid`),
  KEY `pmlid` (`pmlid`),
  KEY `wlid` (`wlid`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`vcmlid`) REFERENCES `vipcardmaplogs` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`pmlid`) REFERENCES `privatemaplogs` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`wlid`) REFERENCES `waterlogs` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PDMembers`
--

DROP TABLE IF EXISTS `PDMembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `PDMembers` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT '',
  `cellphone` varchar(255) DEFAULT '',
  `sex` int(2) DEFAULT '0',
  `idcard` varchar(255) DEFAULT '',
  `birthday` varchar(255) DEFAULT '',
  `city` varchar(255) DEFAULT '',
  `avatar` varchar(255) DEFAULT '',
  `wxunionid` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  UNIQUE KEY `cellphone` (`cellphone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PDMembers`
--

LOCK TABLES `PDMembers` WRITE;
/*!40000 ALTER TABLE `PDMembers` DISABLE KEYS */;
/*!40000 ALTER TABLE `PDMembers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrivateMapLogs`
--

DROP TABLE IF EXISTS `PrivateMapLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `PrivateMapLogs` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `opencardtime` varchar(255) DEFAULT '',
  `expirytime` varchar(255) DEFAULT '',
  `coach` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '',
  `orderid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '',
  `totalbuy` int(11) DEFAULT '0',
  `curbuy` int(11) DEFAULT '0',
  `cardstatus` int(2) DEFAULT '0',
  `operation` int(2) DEFAULT '0',
  `remark` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `vipcardid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `privatemapid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `privateid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  KEY `vipcardid` (`vipcardid`),
  KEY `privatemapid` (`privatemapid`),
  KEY `privateid` (`privateid`),
  CONSTRAINT `privatemaplogs_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `privatemaplogs_ibfk_2` FOREIGN KEY (`vipcardid`) REFERENCES `vipcards` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `privatemaplogs_ibfk_3` FOREIGN KEY (`privatemapid`) REFERENCES `privatemaps` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `privatemaplogs_ibfk_4` FOREIGN KEY (`privateid`) REFERENCES `privates` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrivateMapLogs`
--

LOCK TABLES `PrivateMapLogs` WRITE;
/*!40000 ALTER TABLE `PrivateMapLogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `PrivateMapLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PrivateMaps`
--

DROP TABLE IF EXISTS `PrivateMaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `PrivateMaps` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `opencardtime` varchar(255) DEFAULT '',
  `expirytime` varchar(255) DEFAULT '',
  `leavestarttime` varchar(255) DEFAULT '',
  `leaveendtime` varchar(255) DEFAULT '',
  `totalbuy` int(11) DEFAULT '0',
  `curbuy` int(11) DEFAULT '0',
  `cardstatus` int(2) DEFAULT '0',
  `remark` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `privateid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `coach` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  KEY `privateid` (`privateid`),
  KEY `coach` (`coach`),
  CONSTRAINT `privatemaps_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `privatemaps_ibfk_2` FOREIGN KEY (`privateid`) REFERENCES `privates` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `privatemaps_ibfk_3` FOREIGN KEY (`coach`) REFERENCES `coaches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PrivateMaps`
--

LOCK TABLES `PrivateMaps` WRITE;
/*!40000 ALTER TABLE `PrivateMaps` DISABLE KEYS */;
/*!40000 ALTER TABLE `PrivateMaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Privates`
--

DROP TABLE IF EXISTS `Privates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Privates` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `privatename` varchar(255) DEFAULT '',
  `validity` int(11) DEFAULT '0',
  `param` int(11) DEFAULT '0',
  `price` decimal(10,2) DEFAULT '0.00',
  `onsale` int(2) DEFAULT '1',
  `purchase` int(2) DEFAULT '1',
  `remark` varchar(255) DEFAULT '',
  `recommendWeight` int(11) DEFAULT '0',
  `images` varchar(2048) DEFAULT '',
  `cover` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `privates_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Privates`
--

LOCK TABLES `Privates` WRITE;
/*!40000 ALTER TABLE `Privates` DISABLE KEYS */;
/*!40000 ALTER TABLE `Privates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RoleMaps`
--

DROP TABLE IF EXISTS `RoleMaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `RoleMaps` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `isSuperAdmin` tinyint(1) DEFAULT '0',
  `owner` int(2) DEFAULT '1',
  `isEnable` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `compositeIndex` (`name`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `rolemaps_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoleMaps`
--

LOCK TABLES `RoleMaps` WRITE;
/*!40000 ALTER TABLE `RoleMaps` DISABLE KEYS */;
/*!40000 ALTER TABLE `RoleMaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rooms`
--

DROP TABLE IF EXISTS `Rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Rooms` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT '',
  `number` int(11) DEFAULT '0',
  `type` int(2) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rooms`
--

LOCK TABLES `Rooms` WRITE;
/*!40000 ALTER TABLE `Rooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ShowerLogs`
--

DROP TABLE IF EXISTS `ShowerLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ShowerLogs` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `lof` int(11) DEFAULT '0',
  `etime` int(11) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `showerid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `showerid` (`showerid`),
  CONSTRAINT `showerlogs_ibfk_1` FOREIGN KEY (`showerid`) REFERENCES `showers` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ShowerLogs`
--

LOCK TABLES `ShowerLogs` WRITE;
/*!40000 ALTER TABLE `ShowerLogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `ShowerLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Showers`
--

DROP TABLE IF EXISTS `Showers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Showers` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `singledate` int(11) DEFAULT '0',
  `totaldate` int(11) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `showers_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Showers`
--

LOCK TABLES `Showers` WRITE;
/*!40000 ALTER TABLE `Showers` DISABLE KEYS */;
/*!40000 ALTER TABLE `Showers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SignPrivateLessons`
--

DROP TABLE IF EXISTS `SignPrivateLessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `SignPrivateLessons` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `memberId` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `privateId` varchar(255) NOT NULL,
  `coachId` bigint(20) DEFAULT '0',
  `signDate` varchar(255) DEFAULT NULL,
  `signOkDate` varchar(255) DEFAULT NULL,
  `signType` int(2) DEFAULT '1',
  `signOkType` int(2) DEFAULT '1',
  `status` int(2) DEFAULT '0',
  `signNumber` int(11) unsigned DEFAULT '0',
  `signGiveNumber` int(11) unsigned DEFAULT '0',
  `storeid` varchar(255) DEFAULT '',
  `orderDate` varchar(255) DEFAULT '',
  `orderCoachId` bigint(20) DEFAULT '0',
  `orderTime` varchar(255) DEFAULT '',
  `orderStatus` int(2) DEFAULT '0',
  `userScore` int(11) DEFAULT '0',
  `userReview` varchar(255) DEFAULT '',
  `scoretime` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SignPrivateLessons`
--

LOCK TABLES `SignPrivateLessons` WRITE;
/*!40000 ALTER TABLE `SignPrivateLessons` DISABLE KEYS */;
/*!40000 ALTER TABLE `SignPrivateLessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Statistics`
--

DROP TABLE IF EXISTS `Statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Statistics` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` varchar(255) DEFAULT '',
  `salesvolume` int(11) DEFAULT '0',
  `membernumber` int(11) DEFAULT '0',
  `siginnumber` int(11) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `statistics_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Statistics`
--

LOCK TABLES `Statistics` WRITE;
/*!40000 ALTER TABLE `Statistics` DISABLE KEYS */;
/*!40000 ALTER TABLE `Statistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Stores`
--

DROP TABLE IF EXISTS `Stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Stores` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `storename` varchar(255) DEFAULT '',
  `storephone` varchar(255) DEFAULT '',
  `logourl` varchar(255) DEFAULT '',
  `province` varchar(255) DEFAULT '',
  `city` varchar(255) DEFAULT '',
  `county` varchar(255) DEFAULT '',
  `storeaddr` varchar(255) DEFAULT '',
  `businessarea` varchar(255) DEFAULT '',
  `introduction` varchar(255) DEFAULT '',
  `pictureurl` varchar(2048) DEFAULT '',
  `wechat` varchar(255) DEFAULT '',
  `mail` varchar(255) DEFAULT '',
  `coordinate` varchar(255) DEFAULT '',
  `businessstatus` int(2) DEFAULT '1',
  `businesstime` varchar(255) DEFAULT '1,10:00-18:00;2,10:00-18:00;3,10:00-18:00;',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Stores`
--

LOCK TABLES `Stores` WRITE;
/*!40000 ALTER TABLE `Stores` DISABLE KEYS */;
/*!40000 ALTER TABLE `Stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserMaps`
--

DROP TABLE IF EXISTS `UserMaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `UserMaps` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `rolename` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `userid` (`userid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `usermaps_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `usermaps_ibfk_2` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserMaps`
--

LOCK TABLES `UserMaps` WRITE;
/*!40000 ALTER TABLE `UserMaps` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserMaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Users` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `username` varchar(255) DEFAULT '',
  `password` varchar(255) DEFAULT '',
  `sex` int(2) DEFAULT '0',
  `cellphone` varchar(255) DEFAULT '18888888888',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('5b6f5094-2c4d-4c70-b42b-94db82a77b48','admin','123456',0,'18888888888',0,'2019-07-07 17:56:40','2019-07-07 17:56:40'),('c7aa1c90-bd99-4631-83e8-b16dbd1eb47c','permission','123456',0,'18888888888',0,'2019-07-07 17:56:40','2019-07-07 17:56:40');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VeriCodes`
--

DROP TABLE IF EXISTS `VeriCodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `VeriCodes` (
  `cellphone` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`cellphone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VeriCodes`
--

LOCK TABLES `VeriCodes` WRITE;
/*!40000 ALTER TABLE `VeriCodes` DISABLE KEYS */;
/*!40000 ALTER TABLE `VeriCodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VipCardMapLogs`
--

DROP TABLE IF EXISTS `VipCardMapLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `VipCardMapLogs` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `entitycardid` varchar(255) DEFAULT '',
  `opencardtime` datetime DEFAULT NULL,
  `expirytime` datetime DEFAULT NULL,
  `leavestarttime` datetime DEFAULT NULL,
  `leaveendtime` datetime DEFAULT NULL,
  `totalbuy` int(11) DEFAULT '0',
  `curbuy` int(11) DEFAULT '0',
  `cardstatus` int(2) DEFAULT '0',
  `operation` int(2) DEFAULT '-1',
  `remark` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `vipcardid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `vipcardmapid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  KEY `vipcardid` (`vipcardid`),
  KEY `vipcardmapid` (`vipcardmapid`),
  CONSTRAINT `vipcardmaplogs_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vipcardmaplogs_ibfk_2` FOREIGN KEY (`vipcardid`) REFERENCES `vipcards` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vipcardmaplogs_ibfk_3` FOREIGN KEY (`vipcardmapid`) REFERENCES `vipcardmaps` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VipCardMapLogs`
--

LOCK TABLES `VipCardMapLogs` WRITE;
/*!40000 ALTER TABLE `VipCardMapLogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `VipCardMapLogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VipCardMaps`
--

DROP TABLE IF EXISTS `VipCardMaps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `VipCardMaps` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `entitycardid` varchar(255) DEFAULT '',
  `opencardtime` datetime DEFAULT NULL,
  `expirytime` datetime DEFAULT NULL,
  `leavestarttime` datetime DEFAULT NULL,
  `leaveendtime` datetime DEFAULT NULL,
  `totalbuy` int(11) DEFAULT '0',
  `curbuy` int(11) DEFAULT '0',
  `cardstatus` int(2) DEFAULT '0',
  `operation` int(2) DEFAULT '0',
  `remark` varchar(255) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `vipcardid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  KEY `vipcardid` (`vipcardid`),
  CONSTRAINT `vipcardmaps_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vipcardmaps_ibfk_2` FOREIGN KEY (`vipcardid`) REFERENCES `vipcards` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VipCardMaps`
--

LOCK TABLES `VipCardMaps` WRITE;
/*!40000 ALTER TABLE `VipCardMaps` DISABLE KEYS */;
/*!40000 ALTER TABLE `VipCardMaps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VipCards`
--

DROP TABLE IF EXISTS `VipCards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `VipCards` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `cardtype` int(2) DEFAULT '0',
  `cardsubtype` int(2) DEFAULT '0',
  `cardname` varchar(255) DEFAULT '',
  `validity` int(11) DEFAULT '0',
  `param` int(11) DEFAULT '0',
  `price` decimal(10,2) DEFAULT '0.00',
  `onsale` int(2) DEFAULT '1',
  `purchase` int(2) DEFAULT '1',
  `remark` varchar(255) DEFAULT '',
  `recommendWeight` int(11) DEFAULT '0',
  `images` varchar(255) DEFAULT '',
  `cover` varchar(2048) DEFAULT '',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `storeid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `storeid` (`storeid`),
  CONSTRAINT `vipcards_ibfk_1` FOREIGN KEY (`storeid`) REFERENCES `stores` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VipCards`
--

LOCK TABLES `VipCards` WRITE;
/*!40000 ALTER TABLE `VipCards` DISABLE KEYS */;
/*!40000 ALTER TABLE `VipCards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WaterLogs`
--

DROP TABLE IF EXISTS `WaterLogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `WaterLogs` (
  `uid` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `iid` bigint(20) NOT NULL AUTO_INCREMENT,
  `water` int(11) DEFAULT '0',
  `deleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `memberid` char(36) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `iid` (`iid`),
  KEY `memberid` (`memberid`),
  CONSTRAINT `waterlogs_ibfk_1` FOREIGN KEY (`memberid`) REFERENCES `members` (`uid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WaterLogs`
--

LOCK TABLES `WaterLogs` WRITE;
/*!40000 ALTER TABLE `WaterLogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `WaterLogs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-15  9:12:38
