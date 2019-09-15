import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import * as redisModels from 'modules/redisdb';
import Moment from 'moment';
import * as Search from 'modules/search';

export const orderCoach = async (data, authorization, storeid) => {
  $required('coachId', data.coachId);
  $required('cardId', data.cardId);
  $required('time', data.time);
  $required('date', data.date);
  if (!data.membername && !data.uid) { return ERROR.coachInvalid('预约教练错误. 缺少参数 membername or uid'); }

  const uid = data.uid;
  if (!uid) {
    const searchAllInfo = await Search.searchAllData(data.membername, authorization);
    if (searchAllInfo === null) {
      return {};
    }
  }
  const memberInfo = await models.Member.findOne({
    where: {
      pdmemberid: uid,
      storeid: data.storeid || storeid,
    },
  });
  if (!memberInfo) {
    return ERROR.coachInvalid('会员不存在!');
  }
  const memberId = memberInfo.uid;

  const privateId = data.cardId;
  const coachId = data.coachId;

  // 教练
  const coach = await models.Coach.findOne({
    where: { id: coachId, storeid: data.storeid || storeid },
  });

  if (!coach) {
    return ERROR.coachInvalid('约课教练不存在');
  }

  // 是否存在私课
  const privateInfo = await models.PrivateMap.findOne({
    where: {
      uid: privateId,
      memberid: memberId,
    },
  });
  if (!privateInfo || (privateInfo.curbuy + privateInfo.curgive) < 1) {
    return ERROR.orderCoachLessonInvalid(' 卡不存在或次数不足 ');
  }

  // 时间
  const orderDate = Moment(data.date).format('YYYY-MM-DD'); // data.date.split(' ')[0];
  const orderMon = Moment(`${orderDate} ${data.time}`);
  if (orderMon.diff(Moment()) < 0) {
    return ERROR.dateInvalid(' 预约时间错误 ');
  }
  if (coach.weeks) {
    const weeks = coach.weeks.split(',');
    const week = (Moment(data.date).weekday()).toString();
    if (!weeks.includes(week)) {
      return ERROR.dateInvalid(' 预约教练，星期错误 ');
    }
  }

  const timeLimitInfo = await models.CommonConf.findOne({
    attributes: ['priavteLessonOrderTimeLimit', 'privateLessonCancelOrderTimeLimit'],
    where: {
      id: 1, storeid,
    },
  });

  if (timeLimitInfo && timeLimitInfo.priavteLessonOrderTimeLimit) {
    if (orderMon.diff(Moment()) < 0) {
      return ERROR.dateInvalid(` 预约时间错误.限制预约，提前 ${timeLimitInfo.priavteLessonOrderTimeLimit} 分钟预约`);
    }
    const diffsec = Math.floor(orderMon.diff(Moment()) / 1000);
    const limitSec = timeLimitInfo.priavteLessonOrderTimeLimit * 60;
    if (diffsec < limitSec) {
      return ERROR.dateInvalid(` 预约时间错误.限制预约，提前 ${timeLimitInfo.priavteLessonOrderTimeLimit} 分钟预约`);
    }
  }

  if (coach.workTime) {
    const workTimes = coach.workTime.split('-');
    const btime = workTimes[0];
    const etime = workTimes[1];
    if (data.time < btime || etime < data.time) {
      return ERROR.dateInvalid(' order coach.   workTime error');
    }
  }

  // 教练当天课程已满
  let ordercnt = await models.SignPrivateLesson.count({
    where: {
      orderDate,
      orderCoachId: coachId,
      storeid,
      orderStatus: { ne: 3 },
      status: { ne: 3 },
    },
  });

  if (coach.dailyLessonNumLimit <= ordercnt) {
    return ERROR.orderCoachLessonInvalid(' 今日课程数量已达到上限 ');
  }

  // 此时间教练已被预约
  ordercnt = await models.SignPrivateLesson.count({
    where: {
      orderDate,
      orderTime: data.time,
      orderCoachId: coachId,
      storeid,
      orderStatus: { ne: 3 },
      status: { ne: 3 },
    },
  });

  if (ordercnt > 0) {
    return ERROR.orderCoachLessonInvalid(' 此时间教练已被预约 ');
  }

  // 此时间内是否预约其它课程
  ordercnt = await models.SignPrivateLesson.count({
    where: {
      orderStatus: { gt: 0, ne: 3 },
      orderDate,
      orderTime: data.time,
      memberId,
      storeid,
      status: { ne: 3 },
    },
  });
  if (ordercnt > 0) {
    return ERROR.orderCoachLessonInvalid(' 此时间内已预约其它课程 ');
  }

  // 暂停约课
  const bPauseMon = Moment(coach.pauseWorkBeginDate);
  const ePauseMon = Moment(coach.pauseWorkEndDate);
  if (orderMon.diff(bPauseMon) >= 0 && orderMon.diff(ePauseMon) <= 0) {
    return ERROR.orderCoachLessonInvalid(' 暂停约课 ');
  }

  const retdata = await models.SignPrivateLesson.create({
    orderCoachId: coachId,
    orderDate,
    orderTime: data.time,
    orderStatus: 1,
    memberId,
    privateId,
    storeid,
  });

  if (!retdata) return false;

  redisModels.Update(redisModels.tableIndex.huizong, `OrderCoach_${storeid}`, retdata.id, JSON.stringify(retdata));

  return true;
};

export const deleteOrderCoach = async (data, storeid) => {
  $required('ids', data.ids);
  let ids = data.ids;
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  const timeLimitInfo = await models.CommonConf.findOne({
    attributes: ['priavteLessonOrderTimeLimit', 'privateLessonCancelOrderTimeLimit'],
    where: {
      id: 1, storeid,
    },
  });

  if (timeLimitInfo && timeLimitInfo.privateLessonCancelOrderTimeLimit) {
    const infos = await models.SignPrivateLesson.findAll({
      where: {
        id: ids,
        orderStatus: {
          lt: 2,
        },
        storeid,
        status: {
          lt: 1,
        },
      },
    });
    if (infos) {
      for (let i = 0; i < infos.length; i += 1) {
        const info = infos[i];
        const orderMon = Moment(`${info.orderDate} ${info.time}`);
        const diffmsec = orderMon.diff(Moment());
        if (diffmsec < 0) {
          return ERROR.dateInvalid(` 预约时间错误.限制取消预约，提前 ${timeLimitInfo.privateLessonCancelOrderTimeLimit} 分钟取消预约`);
        }
        const diffsec = Math.floor(diffmsec / 1000);
        const limitSec = timeLimitInfo.privateLessonCancelOrderTimeLimit * 60;
        if (diffsec < limitSec) {
          return ERROR.dateInvalid(` 预约时间错误.限制取消预约，提前 ${timeLimitInfo.privateLessonCancelOrderTimeLimit} 分钟取消预约`);
        }
      }
    }
  }

  const retdata = await models.SignPrivateLesson.update({
    orderStatus: 3,
  }, {
    where: {
      id: ids,
      orderStatus: {
        lt: 2,
      },
      storeid,
      status: {
        lt: 1,
      },
    },
  });
  if (!retdata) return false;
  return true;
};

export const queryOrderCoach = async (data, storeid, authorization) => {
  // $required('date', data.date);
  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const coachId = data.coachId;
  const uid = data.uid;

  // console.log(pageCount, curPage);
  const where = { storeid };
  if (coachId && coachId !== 0) {
    where.orderCoachId = coachId;
  }

  if (uid) {
    const memberInfo = await models.Member.findOne({
      where: {
        pdmemberid: uid,
        storeid,
      },
    });
    if (!memberInfo) {
      return ERROR.coachInvalid('会员不存在!');
    }
    where.memberId = memberInfo.uid;
  } else if (data.membername) {
    const searchAllInfo = await Search.searchAllData(data.membername, authorization);
    if (searchAllInfo === null) {
      return ERROR.coachInvalid('会员不存在!');
    }
    const hitInfo = searchAllInfo.hitInfo;
    const mInfo = await models.Member.findAll({
      where: {
        pdmemberid: {
          $in: hitInfo,
        },
        storeid,
      },
    });
    if (!mInfo || mInfo.length < 1) {
      return ERROR.coachInvalid('会员不存在!');
    }
    where.memberId = mInfo[0].uid;
  }

  if (data.date) {
    where.$or = [
      { orderDate: Moment(data.date).format('YYYY-MM-DD') },
      { signDate: Moment(data.date).format('YYYY-MM-DD') },
    ];
  }

  const totalCount = await models.SignPrivateLesson.count({ where });

  const allItems = await models.SignPrivateLesson.findAll({
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    where,
  });

  const retdata = [];

  for (let i = 0; i < allItems.length; i += 1) {
    const element = allItems[i];
    const item = element.toJSON();

    item.username = '';
    const member = await models.Member.findOne({ where: { uid: item.memberId } });
    if (member) {
      const pdmember = await models.PDMember.findOne({ where: { uid: member.pdmemberid } });
      if (pdmember) {
        item.username = pdmember.username;
        item.avatar = member.avatar;
      }
      item.pdmemberid = member.pdmemberid;
    }

    if (item.coachId > 0) {
      const coach = await models.Coach.findOne({ where: { id: item.coachId } });
      if (coach) {
        item.coachname = coach.name;
      }
    }

    if (item.orderCoachId > 0) {
      const coach = await models.Coach.findOne({ where: { id: item.orderCoachId } });
      if (coach) {
        item.ordercoachname = coach.name;
      }
    }

    const cardInfo = await models.PrivateMap.findOne({
      where: { uid: item.privateId },
      include: [
        {
          model: models.Private,
          as: 'privates',
        },
      ],
    });
    if (cardInfo && cardInfo.privates) {
      item.cardName = cardInfo.privates.privatename;
      item.singletime = cardInfo.privates.validity;
      item.totalSignNumber = item.signNumber + item.signGiveNumber;
      item.timelength = cardInfo.privates.param;
    } else {
      console.log('cardInfo', item.privateId);
    }
    retdata.push(item);
  }

  return { count: totalCount, result: retdata };
};


export const orderTimeSet = async (data, storeid) => {
  $required('orderTime', data.orderTime);
  $required('cancelTime', data.cancelTime);

  const ret = await models.CommonConf.upsert({
    id: 1,
    priavteLessonOrderTimeLimit: data.orderTime,
    privateLessonCancelOrderTimeLimit: data.cancelTime,
    storeid,
  }, { where: { storeid, id: 1 } });

  if (!ret) {
    return false;
  }

  return true;
};

export const orderTimeSetQuery = async (data, storeid) => {
  const ret = await models.CommonConf.findOne({
    attributes: ['priavteLessonOrderTimeLimit', 'privateLessonCancelOrderTimeLimit'],
    where: {
      id: 1, storeid,
    },
  });

  return ret;
};
