/*
SQLyog Ultimate v12.5.0 (64 bit)
MySQL - 5.7.26 : Database - node_server
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`node_server` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `node_server`;

/*Table structure for table `PDMembers` */

DROP TABLE IF EXISTS `PDMembers`;

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `PDMembers` */

insert  into `PDMembers`(`uid`,`iid`,`username`,`cellphone`,`sex`,`idcard`,`birthday`,`city`,`avatar`,`wxunionid`,`deleted`,`createdAt`,`updatedAt`) values 
('1f6afac2-bd44-4483-a74b-0a1fe54bf67a',3,'工作人员一','18837283782',1,'','','','','',0,'2019-07-09 14:32:44','2019-07-09 14:32:44'),
('2b32c33f-8761-4c86-95e4-64d8ab87fcf7',7,'健身用户1562739695499','13718720308',0,'','1970-01-01','','http://47.105.67.223:8888/2e7cea5c-d482-4d8a-882b-7884be7abda2/1563156987378.bmp','',0,'2019-07-10 14:21:35','2019-07-15 10:16:27'),
('5554750d-1423-4541-bbc6-895bda202348',1,'会员一','18887328472',2,'','','','','',0,'2019-07-08 22:01:34','2019-07-08 22:01:34'),
('9eaaac84-dc96-4b77-8f23-13592341eec6',8,'健身用户1562846834901','18611241661',0,'','1970-01-01','','','',0,'2019-07-11 20:07:14','2019-07-11 20:07:14'),
('b0917cf8-8da3-4b94-a8b7-38036b746bca',4,'工作人员二','15437463468',1,'','','','','',0,'2019-07-09 14:32:58','2019-07-09 14:32:58'),
('b69e6ab4-d4d3-469b-91aa-59bdc1855b6e',6,'健身用户1562680069039','17611421661',0,'','1970-01-01','','http://47.105.67.223:8888/5cabbf6a-4218-463f-932a-8d71bc84f2da/1562681856943.bmp','',0,'2019-07-09 21:47:49','2019-07-09 22:17:36'),
('be33b680-5575-47c4-ae22-c289e51a782a',5,'教练二','18868364732',1,'','','','','',0,'2019-07-09 14:42:52','2019-07-09 14:42:52'),
('e27578f0-f8b4-4b80-a3d3-cd296890bf4f',2,'教练一','18888328738',1,'','','','','',0,'2019-07-08 22:23:44','2019-07-08 22:23:44');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
