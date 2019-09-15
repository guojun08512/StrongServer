
import schedule from 'node-schedule';
import moment from 'moment';
import models from 'modules/db/models';
import Sequelize from 'modules/db/sequelize';
import sequelize from 'sequelize';
import * as VipCard from 'modules/vipcard';
import * as BuyVipCard from 'modules/buyvipcard';

// 定时缓存每天数据
function statisticDayInfo() {
  schedule.scheduleJob('5 * * * * *', async () => {
    const stime = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    const etime = moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59');
    const date = moment().subtract(1, 'days').format('YYYY-MM-DD');

    // 分场馆操作
    const sInfo = await models.Store.findAll({
      attributes: ['uid'],
    });
    for (let i = 0; i < sInfo.length; i += 1) {
      const storeid = sInfo[i].uid;

      // 每天销售额
      const total1 = await models.Order.sum('money', {
        include: {
          model: models.VipCardMapLog,
          as: 'vipcardmaplogs',
          attributes: [],
          include: {
            model: models.Member,
            as: 'members',
            attributes: [],
            where: {
              storeid,
            },
          },
        },
        where: {
          createdAt: {
            gte: stime,
            lte: etime,
          },
        },
        attributes: [],
      }) || 0;
      // 每天增加会员数
      const total2 = await models.Member.count({
        where: {
          storeid,
          createdAt: {
            gte: stime,
            lte: etime,
          },
        },
      });
      // 每天会员卡签到人数
      const sql = 'SELECT COUNT(`vipcardmaps->members`.`uid`) AS `count` FROM `MSignins` AS `MSignin` INNER JOIN `VipCardMaps` AS `vipcardmaps` ON `MSignin`.`vipcardmapid` = `vipcardmaps`.`uid` AND `vipcardmaps`.`deleted` = FALSE INNER JOIN `Members` AS `vipcardmaps->members` ON `vipcardmaps`.`memberid` = `vipcardmaps->members`.`uid` AND `vipcardmaps->members`.`storeid` = ? AND `vipcardmaps->members`.`deleted` = FALSE WHERE (`MSignin`.`createdAt` >= ? AND `MSignin`.`createdAt` <= ?) AND `MSignin`.`deleted` = FALSE;';
      const info = await Sequelize.query(sql, { replacements: [storeid, stime, etime], type: sequelize.QueryTypes.SELECT });

      // 插入数据库
      await models.Statistic.findOrCreate({
        where: {
          date,
          storeid,
        },
        defaults: {
          date,
          salesvolume: total1,
          membernumber: total2,
          siginnumber: info[0].count,
          storeid,
        },
      });
    }
  });
}

// 定时更新请假状态
// async function updateCardLeaveStatus() {
//   const rule = new schedule.RecurrenceRule();
//   rule.second = 1;

//   schedule.scheduleJob('0 0 2 * * *', async () => {
//     const curData = moment().format('YYYY-MM-DD');

//     const cardMapInfo = await models.VipCardMap.findAll({
//       where: {
//         cardstatus: {
//           $in: ['正常', '请假'],
//         },
//       },
//       attributes: ['uid', 'leavestarttime', 'leaveendtime', 'cardstatus'],
//     });

//     for (let i = 0; i < cardMapInfo.length; i += 1) {
//       const vipcardmapid = cardMapInfo[i].uid;
//       const ret = await models.VipCardMap.findOne({
//         where: {
//           uid: vipcardmapid,
//         },
//       });

//       const cardstatus = cardMapInfo[i].cardstatus;
//       const leavestarttime = cardMapInfo[i].leavestarttime;
//       const leaveendtime = cardMapInfo[i].leaveendtime;
//       if (cardstatus === '正常') {
//         if (moment(curData).isAfter(moment(leavestarttime).format('YYYY-MM-DD')) && moment(curData).isBefore(moment(leaveendtime).add(1, 'days').format('YYYY-MM-DD'))) {
//           const ret1 = await ret.update({
//             cardstatus: '请假',
//           });
//           if (!ret1) {
//             console.log('updateCardLeaveStatus: update 请假 error');
//           }
//         }
//       } else if (cardstatus === '请假') {
//         if (moment(curData).isAfter(moment(leaveendtime).format('YYYY-MM-DD'))) {
//           const ret2 = await ret.update({
//             cardstatus: '正常',
//           });
//           if (!ret2) {
//             console.log('updateCardLeaveStatus: update 正常 error');
//           }
//         }
//       }
//     }
//   });
// }


// 定时更新储值卡，次卡状态
async function updateCountCardStatus(vcmInfo, curtime) {
  const curbuy = vcmInfo.curbuy;
  const opencardtime = moment(vcmInfo.opencardtime).format('YYYY-MM-DD HH:mm:ss');
  const expirytime = moment(vcmInfo.expirytime).format('YYYY-MM-DD HH:mm:ss');
  const cardstatus = vcmInfo.cardstatus;
  if (cardstatus === BuyVipCard.CardStatus.UnOpen) {
    if (curtime > opencardtime) {
      await vcmInfo.update({
        cardstatus: BuyVipCard.CardStatus.Normal,
      });
    }
  } else if (cardstatus === BuyVipCard.CardStatus.Normal) {
    if (curbuy <= 0 && curtime <= expirytime) {
      await vcmInfo.update({
        cardstatus: BuyVipCard.CardStatus.Depleted,
      });
    } else if (curbuy > 0 && curtime > expirytime) {
      await vcmInfo.update({
        cardstatus: BuyVipCard.CardStatus.Expired,
      });
    } else if (curbuy <= 0 && curtime > expirytime) {
      await vcmInfo.update({
        cardstatus: BuyVipCard.CardStatus.ExpAndDep,
      });
    }
  } else if (cardstatus === BuyVipCard.CardStatus.Depleted) {
    if (curtime > expirytime) {
      await vcmInfo.update({
        cardstatus: BuyVipCard.CardStatus.ExpAndDep,
      });
    }
  } else if (cardstatus === BuyVipCard.CardStatus.Expired) {
    if (curbuy <= 0) {
      await vcmInfo.update({
        cardstatus: BuyVipCard.CardStatus.ExpAndDep,
      });
    }
  }
}

async function updateTimeCardStatus(vcmInfo, curtime) {
  const opencardtime = moment(vcmInfo.opencardtime).format('YYYY-MM-DD HH:mm:ss');
  const expirytime = moment(vcmInfo.expirytime).format('YYYY-MM-DD HH:mm:ss');
  const cardstatus = vcmInfo.cardstatus;
  if (cardstatus === BuyVipCard.CardStatus.UnOpen) {
    if (curtime > opencardtime) {
      await vcmInfo.update({
        cardstatus: BuyVipCard.CardStatus.Normal,
      });
    }
  }
  if (curtime > expirytime) {
    await vcmInfo.update({
      cardstatus: BuyVipCard.CardStatus.Expired,
    });
  }
  const validity = moment(curtime).diff(expirytime, 'days');
  await vcmInfo.update({
    curbuy: validity <= 0 ? 0 : validity,
  });
}

async function checkCardStatus() {
  schedule.scheduleJob('0 0 * * * *', async () => {
    const allCardCount = await models.VipCardMap.count({
      include: {
        model: models.VipCard,
        as: 'vipcards',
      },
      where: {
        cardstatus: {
          notIn: [BuyVipCard.CardStatus.Expired, BuyVipCard.CardStatus.ExpAndDep, BuyVipCard.CardStatus.Leave, BuyVipCard.CardStatus.Stop],
        },
      },
    });
    for (let index = 0; index < allCardCount; index += 1000) {
      const cardMapInfo = await models.VipCardMap.findAll({
        include: {
          model: models.VipCard,
          as: 'vipcards',
          attributes: ['uid', 'cardsubtype'],
        },
        where: {
          cardstatus: {
            notIn: [BuyVipCard.CardStatus.Expired, BuyVipCard.CardStatus.ExpAndDep, BuyVipCard.CardStatus.Leave, BuyVipCard.CardStatus.Stop],
          },
        },
        attributes: ['uid', 'cardstatus', 'curbuy', 'opencardtime', 'expirytime'],
        limit: 1000,
        offset: index * 1000,
      });
      const curtime = moment().format('YYYY-MM-DD HH:mm:ss');
      for (let i = 0; i < cardMapInfo.length; i += 1) {
        const vcmInfo = cardMapInfo[i];
        if (vcmInfo.cardsubtype === VipCard.VipCardSubType.TimeLimitCard) {
          await updateTimeCardStatus(vcmInfo, curtime);
        } else {
          await updateCountCardStatus(vcmInfo, curtime);
        }
      }
    }
  });
}

async function initSchedule() {
  statisticDayInfo();
  // updateCardLeaveStatus();
  checkCardStatus();
}

export { initSchedule };
