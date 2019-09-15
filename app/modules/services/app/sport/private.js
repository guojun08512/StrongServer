import models from 'modules/db/models';
import Sequelize from 'modules/db/sequelize';
import Moment from 'moment';
import * as OrderCoach from 'modules/coach/ordercoach';


export const queryCoachPrivateLessonTime = async (data) => {
  const coachId = data.coachId;
  const storeid = data.storeid;
  const date = data.date;

  const coachDate = [];
  const timeScope = [
    ['08:00', '08:30'],
    ['08:30', '09:00'],
    ['09:00', '09:30'],
    ['09:30', '10:00'],
    ['10:00', '10:30'],
    ['10:30', '11:00'],
    ['11:00', '11:30'],
    ['11:30', '12:00'],
    ['13:00', '13:30'],
    ['13:30', '14:00'],
    ['14:00', '14:30'],
    ['14:30', '15:00'],
    ['15:00', '15:30'],
    ['15:30', '16:00'],
    ['16:00', '13:30'],
    ['16:30', '17:00'],
    ['17:00', '17:30'],
    ['17:30', '18:00'],
    ['19:00', '19:30'],
    ['19:30', '20:00'],
    ['20:00', '20:30'],
    ['20:30', '21:00'],
  ];
  const coach = await models.Coach.findOne({
    where: {
      id: coachId,
      storeid,
    },
  });
  if (!coach) {
    return { coachId, coachNotOrderTime: [] };
  }

  const nowtime = Moment().format('HH:mm');
  for (let j = timeScope.length - 1; j >= 0; j -= 1) {
    const tscope = timeScope[j];
    if (tscope[0] < nowtime) {
      timeScope.splice(j, 1);
    }
  }

  const workTime = coach.workTime.split('-');
  const bTime = workTime[0];
  const eTime = workTime[1];
  for (let j = timeScope.length - 1; j >= 0; j -= 1) {
    const tscope = timeScope[j];
    if (eTime < tscope[1]) {
      timeScope.splice(j, 1);
    }
    if (tscope[0] < bTime) {
      timeScope.splice(j, 1);
    }
  }

  const orderCoach = await models.SignPrivateLesson.findAll({
    where: {
      orderDate: Moment(date).format('YYYY-MM-DD'),
      orderCoachId: coachId,
      storeid,
      orderStatus: { lt: 2, gt: 0 },
    },
  });

  if (orderCoach) {
    // console.log('orderCoach', orderCoach.length);
    for (let i = 0; i < orderCoach.length; i += 1) {
      coachDate.push(orderCoach[i].orderTime);
      const orderTime = orderCoach[i].orderTime;
      // console.log('timeScope.length', timeScope.length);
      for (let j = timeScope.length - 1; j >= 0; j -= 1) {
        const tscope = timeScope[j];
        // console.log('tscope', tscope, orderTime);
        if (tscope[0] <= orderTime && orderTime <= tscope[1]) {
          timeScope[j] = null;
        }
      }
    }
  }

  return { coachId, coachNotOrderTime: timeScope };
};


export const queryMemberPrivateInfo = async (data) => {
  const uid = data.uid;
  const storeid = data.storeid;
  // 签到
  const memberInfo = await models.Member.findOne({ where: { pdmemberid: uid, storeid } });
  if (!memberInfo) return { basedata: {}, data: {} };
  const pageCount = parseInt(data.pageCount, 10) || 10;
  let curPage = parseInt(data.curPage, 10) || 1;
  if (curPage < 1) curPage = 1;

  const memberid = memberInfo.uid;
  const cardinfo = await models.PrivateMap.findOne({
    attributes: [
      'memberid',
      [Sequelize.literal('SUM(curbuy)'), 'leftdays'],
      [Sequelize.literal('SUM(totalbuy)'), 'totaldays'],
    ],
    where: { memberid },
    group: ['memberid'],
  });

  let leftdays = 0;
  let totaldays = 0;
  if (cardinfo) {
    const tmp = cardinfo.toJSON();
    leftdays = tmp.leftdays;
    totaldays = tmp.totaldays;
  }

  const basedata = {
    leftdays, totaldays,
  };

  const cardinfos = await models.PrivateMap.findAll({
    where: { memberid },
    include: {
      model: models.Private,
      as: 'privates',
    },
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
  });

  if (!cardinfos) return { basedata, data: {} };

  let storename = '';
  const storeInfo = await models.Store.findOne({ where: { uid: storeid } });
  if (storeInfo) {
    storename = storeInfo.storename;
  }
  const infos = [];
  for (let i = 0; i < cardinfos.length; i += 1) {
    const info = cardinfos[i].toJSON();
    info.storename = storename;
    info.createdAt = Moment(info.createddAt).format('YYYY-MM-DD');
    info.opencardtime = Moment(info.opencardtime).format('YYYY-MM-DD');
    info.expirytime = Moment(info.expirytime).format('YYYY-MM-DD') > Moment('9999-00-00').format('YYYY-MM-DD') ? Moment(info.expirytime).format('YYYY-MM-DD') : '无限期';
    infos.push(info);
  }

  return { basedata, data: infos };
};

// 预定私课
export const subscribePrivate = async (data) => {
  const storeid = data.storeid;
  const param = data;
  param.coachid = data.coachId;
  const ret = await OrderCoach.orderCoach(param, '', storeid);
  return ret;
};


// 查询私教课list
export const queryPrivateCourseList = async (data) => {
  const pageCount = parseInt(data.pageCount, 10) || 10;
  let curPage = parseInt(data.curPage, 10) || 1;
  const storeid = data.storeid;
  if (curPage < 1) curPage = 1;

  const where = {};
  if (storeid) {
    where.storeid = storeid;
  }

  const count = await models.Private.count({
    where,
  });
  const hasmore = (curPage * pageCount) < count;
  const cardInfos = await models.Private.findAll({
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
  });
  if (!cardInfos) return { data: [], hasmore: false };
  const infos = [];
  for (let i = 0; i < cardInfos.length; i += 1) {
    const info = cardInfos[i].toJSON();
    info.images = (info.images && JSON.parse(info.images)) || [];
    infos.push(info);
  }

  return { data: infos, hasmore };
};
