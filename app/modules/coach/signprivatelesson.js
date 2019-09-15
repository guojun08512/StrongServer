import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import * as redisModels from 'modules/redisdb';
import Moment from 'moment';
import { searchMemberId } from 'modules/search';
import sequelize from 'modules/db/sequelize';

function MMoment(datestr) {
  if (datestr && datestr.length > 0) {
    return Moment(datestr, ['YYYY-MM-DD', 'YYYY-M-D', 'YYYY-MM-D', 'YYYY-M-DD']);
  }
  return Moment(datestr);
}

/* =========================================消课========================================= */
// 签到私教课
export const SignPrivateLesson = async (data, storeid) => {
  $required('memberid', data.memberid);
  $required('cardId', data.cardId);
  $required('coachid', data.coachid);
  $required('number', data.number);

  const uid = data.memberid;

  const memberInfo = await models.Member.findOne({
    where: {
      pdmemberid: uid,
      storeid,
    },
  });
  if (!memberInfo) {
    return ERROR.coachInvalid('会员不存在!');
  }
  const memberId = memberInfo.uid;

  const privateId = data.cardId;
  const coachId = data.coachid;
  const number = parseInt(data.number, 10);
  if (number < 1) return ERROR.orderCoachLessonInvalid(' 签到次数小于1 ');

  // 教练
  const coach = await models.Coach.findOne({
    where: {
      id: coachId,
      storeid,
    },
  });

  if (!coach) {
    return ERROR.coachInvalid(' 教练不存在 ');
  }

  const privateInfo = await models.PrivateMap.findOne({ where: { uid: privateId, memberid: memberId } });
  if (!privateInfo) return ERROR.orderCoachLessonInvalid(' 私教卡错误 ');

  const curbuy = privateInfo.curbuy;
  const totalSection = curbuy;
  if (!privateInfo || totalSection < 1 || totalSection < number || number < 1) {
    return ERROR.orderCoachLessonInvalid(' 私教卡不存在或数量错误 ');
  }

  let leftnum = totalSection - number;
  if (leftnum < 0) leftnum = 0;

  let leftSignNum = curbuy - number;
  if (leftSignNum < 0) {
    leftSignNum = 0;
  }
  // 预约信息 // 先消除已预约的课程
  const orderInfos = await models.SignPrivateLesson.findAll({
    where: {
      memberId,
      orderStatus: 1,
      privateId,
      storeid,
    },
  });
  let orderId = null;
  if (orderInfos.length > 0) {
    const orderInfo = orderInfos[0];
    if (!orderInfo) {
      return ERROR.orderCoachLessonInvalid(` 已约私教课错误. id ${data.orderId} 已完成`);
    }
    orderId = orderInfo.id;
  }

  let retdata = null;
  const signNum = curbuy - leftSignNum;
  await sequelize.transaction().then(t =>
    models.PrivateMap.update(
      { curbuy: leftSignNum },
      { where: { uid: privateId, curbuy }, transaction: t },
    ).then((ret) => {
      if (!ret || ret[0] < 1) throw new Error();
      if (orderId) {
        return models.SignPrivateLesson.update({
          memberId,
          privateId,
          coachId,
          signDate: Moment().format('YYYY-MM-DD'),
          status: 1,
          signType: 1,
          signNumber: signNum,
          signGiveNumber: 0,
          orderStatus: 2,
        }, {
          where: {
            id: orderId, orderStatus: 1, privateId, storeid,
          },
          transaction: t,
        });
      }

      return models.SignPrivateLesson.create({
        memberId,
        privateId,
        coachId,
        signDate: Moment().format('YYYY-MM-DD'),
        status: 1,
        signType: 1,
        signNumber: signNum,
        signGiveNumber: 0,
        storeid,
        // orderDate: Moment().format('YYYY-MM-DD'),
      }, { transaction: t });
    }).then((result) => {
      if (orderId) {
        if (!result || result[0] < 1) throw new Error();
      }
      if (!result) throw new Error();

      retdata = result;
      return t.commit();
    }).catch(_err => t.rollback()));

  if (!retdata) return false;
  if (orderId && retdata[0] < 1) {
    return false;
  } else if (orderId) {
    retdata = await models.SignPrivateLesson.findOne({ where: { id: orderId, storeid } });
  }

  const element = retdata;
  const item = element.toJSON();
  const member = await models.Member.findOne({ where: { uid: item.memberId } });
  if (member) {
    const pdmember = await models.PDMember.findOne({ where: { uid: member.pdmemberid } });
    if (pdmember) {
      item.username = pdmember.username;
      item.avatar = member.avatar;
      item.memberPhone = pdmember.cellphone;
    }
  }

  if (item.coachId > 0) {
    const coachinfo = await models.Coach.findOne({ where: { id: item.coachId, storeid } });
    item.coachname = coachinfo.name;
  }
  const cardInfo = await models.Private.findOne({ where: { uid: privateInfo.privateid, storeid } });
  item.cardName = cardInfo.privatename;
  item.singletime = cardInfo.validity;

  item.leftSignNumber = signNum;
  let totalSignNumber = item.leftSignNumber;
  const allSignData = await models.SignPrivateLesson.findAll({ where: { privateId, storeid } });
  for (let i = 0; i < allSignData.length; i += 1) {
    const d = allSignData[i];
    totalSignNumber = totalSignNumber + d.signNumber + d.signGiveNumber;
  }
  item.totalSignNumber = totalSignNumber;
  item.consumeNumber = number;

  redisModels.Add(redisModels.tableIndex.huizong, `SignPrivateLesson_${storeid}`, element.id, JSON.stringify(element));

  return item;
};

  // 签退私教课
export const SignOkPrivateLesson = async (data, storeid) => {
  $required('id', data.id);
  const id = data.id;
  const ordercnt = await models.SignPrivateLesson.count({
    where: { id, status: 1, storeid },
  });

  if (ordercnt < 1) {
    return ERROR.orderCoachLessonInvalid(' 签退错误 .');
  }

  const ret = await models.SignPrivateLesson.update(
    { status: 2, signOkType: 1, signOkDate: Moment().format('YYYY-MM-DD HH:mm:ss') },
    { where: { id, storeid } },
  );
  if (!ret || ret[0] < 1) return false;

  const row = await models.SignPrivateLesson.findOne({ where: { id, storeid } });
  await redisModels.Update(redisModels.tableIndex.huizong, `SignPrivateLesson_${storeid}`, row.id, JSON.stringify(row));

  return true;
};

  // 取消签课
export const CancelSignPrivateLesson = async (data, storeid, _signstatus) => {
  $required('id', data.id);

  const id = data.id;

  let signstatus = 3;
  if (_signstatus) signstatus = _signstatus;
  if (signstatus < 1 || signstatus > 3) {
    return ERROR.orderCoachLessonInvalid(' 取消签到错误，状态错误。 ');
  }
  const signInfo = await models.SignPrivateLesson.findOne({
    where: { id, status: { lt: signstatus }, storeid },
  });

  if (!signInfo) {
    return ERROR.orderCoachLessonInvalid(' 取消签到错误 .');
  }

  const signNumber = signInfo.signNumber;
  // const signGiveNumber = signInfo.signGiveNumber;
  const privateId = signInfo.privateId;
  let ret = false;

  sequelize.transaction().then(t =>
    models.PrivateMap.findOne({
      where: {
        uid: privateId,
      },
      transaction: t,
      logging: console.log,
    }).then((result) => {
      if (!result) throw new Error();

      const snum = result.curbuy + signNumber;
      // const gnum = result.curgive + signGiveNumber;
      return models.PrivateMap.update({ curbuy: snum }, { where: { uid: privateId, curbuy: result.curbuy }, transaction: t });
    }).then((result) => {
      if (!result || result[0] < 1) throw new Error();

      return models.SignPrivateLesson.update({ status: 3, orderStatus: 3 }, { where: { id, storeid }, transaction: t });
    }).then((result) => {
      if (!result || result[0] < 1) throw new Error();
      ret = true;
      return t.commit();
    })
      .catch(_err => t.rollback()));

  if (ret) {
    const row = await models.PrivateMap.findOne({ where: { uid: privateId } });
    if (row) { await redisModels.Update(redisModels.tableIndex.huizong, `SignPrivateLesson_${storeid}`, row.uid, JSON.stringify(row)); }
  }

  return ret;
};

export const querySignPrivateLesson = async (data, storeid) => {
  // $required('datestart', data.datestart);
  // $required('dateend', data.dateend);

  const curTimeStr = Moment().format('YYYY-MM-DD');
  const dateStart = MMoment(data.datestart).format('YYYY-MM-DD') || curTimeStr;
  const dateEnd = MMoment(data.dateend).format('YYYY-MM-DD') || curTimeStr;

  const pageCount = data.pageCount || 10;
  const curPage = data.curPage || 1;
  const coachId = data.coachId;
  const privateId = data.privateId;
  const memberId = data.memberId;

  // console.log(pageCount, curPage);
  const where = { storeid };
  if (coachId && coachId !== 0) {
    where.coachId = coachId;
  }

  if (privateId && privateId !== 0) {
    where.privateId = privateId;
  }

  if (memberId) {
    where.memberId = memberId;
  }

  where.signDate = {
    gte: dateStart,
    lte: dateEnd,
  };

  const totalCount = await models.SignPrivateLesson.count({
    where,
  });

  const allItems = await models.SignPrivateLesson.findAll({
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    where,
  });
  const retdata = [];

  for (let i = 0; i < allItems.length; i += 1) {
    const element = allItems[i];
    const item = element.toJSON();

    const member = await models.Member.findOne({ where: { uid: item.memberId } });
    if (member) {
      const pdmember = await models.PDMember.findOne({ where: { uid: member.pdmemberid } });
      if (pdmember) {
        item.username = pdmember.username;
        item.avatar = member.avatar;
      }
    }

    if (item.coachId > 0) {
      const coach = await models.Coach.findOne({ where: { id: item.coachId, storeid } });
      item.coachname = coach.name;
    }

    const cardInfo = await models.Private.findOne({ where: { uid: item.privateid, storeid } });
    item.cardName = cardInfo.privatename;
    item.singletime = cardInfo.validity;
    item.totalSignNumber = item.signNumber + item.signGiveNumber;
    retdata.push(item);
  }

  return { count: totalCount, jsonVec: retdata };
};


export const get30DaysCount = async (storeid) => {
  // Moment().format('YYYY-MM-DD');
  const dayStart = Moment().subtract(29, 'day').format('YYYY-MM-DD');
  const dayEnd = Moment().endOf('day').format('YYYY-MM-DD');

  const where = { signDate: { gte: dayStart, lte: dayEnd }, storeid };

  let totalCnt = 0;
  const retData = await models.SignPrivateLesson.findAll({ where });

  const dateMap = {};
  for (let i = 0; i < retData.length; i += 1) {
    const item = retData[i];
    const key = item.signDate;
    if (!dateMap[key]) { dateMap[key] = 0; }
    dateMap[key] += item.signNumber + item.signGiveNumber;
    totalCnt += item.signNumber + item.signGiveNumber;
  }

  if (retData.length < 30) {
    for (let i = 0; i < 30; i += 1) {
      const key = Moment().subtract(i, 'day').format('YYYY-MM-DD');
      if (!dateMap[key]) { dateMap[key] = 0; }
    }
  }

  const keys = Object.keys(dateMap);
  let avgCount = 0;
  if (keys.length > 0) { avgCount = Math.ceil(totalCnt / keys.length); }

  return { keys, values: Object.values(dateMap), avgCount };
};

export const getPrivateLessonInfo = async (data, authorization, storeid) => {
  // console.log('getPrivateLessonInfo 000 ', data.uid);
  $required('uid', data.uid);
  const uid = data.uid; // 姓名/电话/实体卡号
  const memberId = await searchMemberId(uid, storeid);

  const privateCardInfo = await models.Private.findAll({ where: { memberid: memberId, storeid } });
  if (!privateCardInfo) return ERROR.orderCoachLessonInvalid(' 私教卡不存在 ');

  const retdata = [];
  for (let i = 0; i < privateCardInfo.length; i += 1) {
    const item = privateCardInfo[i];
    const info = {};
    info.cardName = item.privatename;
    info.id = item.uid;
    retdata.push(info);
  }

  return { memberId, cardInfo: retdata };
};


export const getCoachPrivateLessonTime = async (data, storeid) => {
  $required('coachId', data.coachId);
  const coachId = data.coachId;
  const dayStart = Moment().startOf('day').format('YYYY-MM-DD');
  // const dayEnd = Moment().endOf('day').format('YYYY-MM-DD');

  const coachDate = [];
  // 教练课程已满
  const orderCoach = await models.SignPrivateLesson.findAll({
    where: {
      orderDate: dayStart,
      orderCoachId: coachId,
      storeid,
      orderStatus: { lt: 2, gt: 0 },
    },
  });

  for (let i = 0; i < orderCoach.length; i += 1) {
    coachDate.push(orderCoach[i].orderTime);
  }

  return { coachId, coachNotOrderTime: coachDate };
};

