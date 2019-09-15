/*
SQLyog Ultimate v12.5.0 (64 bit)
MySQL - 5.7.21 : Database - node_server
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

/*!50106 set global event_scheduler = 1*/;

/* Event structure for event `EVENT_MEMBERCARD_STATUS` */

/*!50106 DROP EVENT IF EXISTS `EVENT_MEMBERCARD_STATUS`*/;

DELIMITER $$

/*!50106 CREATE DEFINER=`root`@`%` EVENT `EVENT_MEMBERCARD_STATUS` ON SCHEDULE EVERY 10 SECOND STARTS '2018-11-24 14:28:17' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
	DECLARE _timenow TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
	DECLARE _stop INT DEFAULT 0; 
	DECLARE _subtype VARCHAR(32);
	DECLARE _uid CHAR(36);
	DECLARE _cardcid CHAR(36);
	DECLARE _expirytime VARCHAR(32);
	DECLARE _vipcardid CHAR(36);
	DECLARE _cardstatus VARCHAR(32);
	DECLARE _param INT(11);
	DECLARE _give INT(11);
		
	-- 定义光标
	DECLARE _Cur CURSOR FOR SELECT a.uid, a.cardcid, a.expirytime, a.vipcardid, a.cardstatus FROM VipCardMaps a WHERE cardstatus != '已过期' AND cardstatus != '过期耗尽';
			
	-- 在游标循环到最后会将 done 设置为 1
	DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET _stop=1;
	
	-- 打开光标
	OPEN _Cur;
	-- 循环执行
	FETCH _Cur INTO _uid, _cardcid, _expirytime, _vipcardid, _cardstatus;
	SELECT CONCAT('param is ', _uid, ' ', _cardcid, ' ', _expirytime, ' ', _vipcardid, ' ', _cardstatus);
	WHILE (_stop <> 1) DO
		IF (_cardstatus = '正常') THEN
			SELECT CONCAT('param is ', _timenow, ' ', _expirytime);
			IF (_timenow > _expirytime) THEN
				SELECT '1111111111';
				UPDATE `VipCardMaps` SET cardstatus = '已过期' WHERE uid = _uid;
			END IF;
		ELSE
			SELECT cardtype INTO _subtype FROM `VipCards` WHERE uid = _vipcardid;
			IF (_subtype = '期限卡') THEN
				SELECT purchase, give INTO _param, _give FROM `TimeLimitCards` WHERE uid = _cardcid;
			END IF;
			IF (_subtype = '次卡') THEN
				SELECT number, give INTO _param, _give FROM `SecondaryCards` WHERE uid = _cardcid;
			END IF;
			IF (_subtype = '储值卡') THEN
				SELECT amount, give INTO _param, _give FROM `StoredValueCards` WHERE uid = _cardcid;
			END IF;
			IF (_subtype = '私教课') THEN
				SELECT section, give INTO _param, _give FROM `PrivateLessonCards` WHERE uid = _cardcid;
			END IF;
			IF (_param = 0 AND _give = 0) THEN
				UPDATE `VipCardMaps` SET cardstatus = '已耗尽' WHERE uid = _uid;
			END IF;
		END IF;
		IF (_cardstatus = '已耗尽') THEN
			IF (_timenow > _expirytime) THEN
				UPDATE `VipCardMaps` SET cardstatus = '过期耗尽' WHERE uid = _uid;
			END IF;
		END IF;
	FETCH _Cur INTO _uid, _cardcid, _expirytime, _vipcardid, _cardstatus;
	END WHILE;
	-- 关闭光标
	CLOSE _Cur;
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
