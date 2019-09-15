import models from 'modules/db/models';
import * as experience from 'modules/experience';
import * as coach from 'modules/coach';
import * as Signin from 'modules/signin';
import * as VipCardMap from 'modules/buyvipcard';
import * as Member from 'modules/members';
import Moment from 'moment';
import * as redisModels from 'modules/redisdb';
import { $required } from 'modules/utils';

export const queryDayCount = async (storeid) => {
  const memberSigninCount = await Signin.getTodayCount(storeid); // 今日会员签到人数
  let signPrivateLessonDayCount = await coach.getTodayCount(storeid); // 今日消课数
  let expTodayCount = await experience.getTodayCount(storeid); // 今日体验人数
  signPrivateLessonDayCount = signPrivateLessonDayCount || 0;
  expTodayCount = expTodayCount || 0;

  return {
    count: memberSigninCount + signPrivateLessonDayCount + expTodayCount,
    trainCount: memberSigninCount + expTodayCount,
    signPrivateLessonDayCount,
    expTodayCount,
    memberSigninCount,
  };
};

export const query30DayCount = async (storeid) => {
  const privateLesson = await coach.get30DaysCount(storeid); // 30天平均消课数

  return {
    privateLesson,
  };
};

// 今日预约私课信息
export const queryOrderPrivateLesson = async (storeid) => {
  const dayStart = Moment().startOf('day').format('YYYY-MM-DD');
  const dayEnd = Moment().endOf('day').format('YYYY-MM-DD');

  const allItems = await models.SignPrivateLesson.findAll({
    where: {
      storeid,
      $or: [
        { orderDate: { $lte: dayEnd, $gte: dayStart } },
        {
          orderDate: '',
          signDate: { $lte: dayEnd, $gte: dayStart },
        },
      ],
    },
    // logging: console.log,
  });

  let totalCount = 0;
  let unSignCount = 0;
  const retdata = [];
  if (!allItems) return { totalCount, unSignCount, data: retdata };
  totalCount = allItems.length;

  for (let i = 0; i < allItems.length; i += 1) {
    const item = allItems[i].toJSON();
    if (item.status < 1) { unSignCount += 1; }
    if (item.coachId && item.coachId > 0) {
      const citem = await redisModels.Get(redisModels.tableIndex.base, `Coach_${storeid}`, item.coachId);
      if (citem) {
        const tmp = JSON.parse(citem);
        item.coachName = tmp.name;
      }
    } else {
      const citem = await redisModels.Get(redisModels.tableIndex.base, `Coach_${storeid}`, item.orderCoachId);
      if (citem) {
        const tmp = JSON.parse(citem);
        item.coachName = tmp.name;
      }
    }
    retdata.push(item);
  }

  return { totalCount, unSignCount, data: retdata };
};

// 今日团课排课信息
export const queryGroupLesson = async (storeid) => {
  const dayStart = Moment().startOf('day').format('YYYY-MM-DD');
  const dayEnd = Moment().endOf('day').format('YYYY-MM-DD');

  const grouplessons = await redisModels.GetAll(redisModels.tableIndex.huizong, `GroupLesson_${storeid}`);
  let totalCount = 0;
  let unSignCount = 0;
  const retdata = [];
  if (!grouplessons) return { totalCount, unSignCount, data: retdata };

  const keys = Object.keys(grouplessons);
  for (let i = 0; i < keys.length; i += 1) {
    const item = JSON.parse(grouplessons[keys[i]]);
    if (dayStart <= item.courseDate && item.courseDate <= dayEnd) {
      totalCount += 1;
      if (item.status === 1) {
        unSignCount += 1;
      }

      const sItem = await redisModels.Get(redisModels.tableIndex.base, 'Course', item.courseId);
      if (sItem) {
        const tmp = JSON.parse(sItem);
        item.courseName = tmp.coursename;
      }
      if (item.coachId && item.coachId > 0) {
        const citem = await redisModels.Get(redisModels.tableIndex.base, `Coach_${storeid}`, item.coachId);
        if (citem) {
          const tmp = JSON.parse(citem);
          item.coachName = tmp.name;
        }
      }

      retdata.push(item);
    }
  }
  return { totalCount, unSignCount, data: retdata };
};

// 今日体验数据
export const queryExprience = async (storeid) => {
  const dayStart = Moment().startOf('day').format('YYYY-MM-DD');
  const dayEnd = Moment().endOf('day').format('YYYY-MM-DD');

  const where = {
    storeid,
    ordertime: { $lte: dayEnd, $gte: dayStart },
  };
  const experiences = await models.Experience.findAll({ where, logging: console.log });
  let totalCount = 0;
  let unSignCount = 0;
  const retdata = [];

  if (!experiences) return { totalCount, unSignCount, data: retdata };

  totalCount = experiences.length;

  for (let i = 0; i < experiences.length; i += 1) {
    const item = experiences[i].toJSON();
    if (!item) break;
    item.status = 0; // 未到店

    if (item.enterTime) {
      item.status = 1; // 已到店
    }
    if (item.leavetime) {
      item.status = 2; // 已离店
    }
    if (!item.enterTime && !item.leavetime) { unSignCount += 1; }
    retdata.push(item);
  }

  return { totalCount, unSignCount, data: retdata };
};

// 查询会员卡数量
export const queryCardCount = async (storeid) => {
  const cardCountByDay = await VipCardMap.getCardCountByDay(storeid); // 今日新售卡
  const cardCountByMonth = await VipCardMap.getCardCountByMonth(storeid); // 本月新售卡
  const courseCountByDay = await VipCardMap.getCourseCountByDay(storeid); // 今日新售私教
  const courseCountByMonth = await VipCardMap.getCourseCountByMonth(storeid); // 本月新售私教

  return {
    cardCountByDay,
    cardCountByMonth,
    courseCountByDay,
    courseCountByMonth,
  };
};

// 会员统计
export const memberStatistics = async (storeid) => {
  const birthdayReminder = await Member.birthdayReminder(storeid); // 生日提醒
  const shipReminder = await Member.shipReminder(storeid); // 续会提醒
  const classReminder = await Member.classReminder(storeid); // 续课提醒
  const lazyReminder = await Member.lazyReminder(storeid); // 懒惰提醒
  const json = {
    pageCount: 99999,
    curPage: 1,
  };
  const ret = await VipCardMap.queryPotential(json, storeid); // 潜在会员
  const queryPotential = ret.count;

  return {
    birthdayReminder,
    shipReminder,
    classReminder,
    lazyReminder,
    queryPotential,
  };
};

// 近30天日均销售额
export const query30DayVolume = async (storeid) => {
  $required('storeid', storeid);
  const date30Start = Moment().subtract(30, 'day').format('YYYY-MM-DD');
  const date30End = Moment().endOf('day').format('YYYY-MM-DD');

  const stInfo = await models.Statistic.findAll({
    where: {
      date: {
        gte: date30Start,
        lte: date30End,
      },
      storeid,
    },
    attributes: ['date', 'salesvolume'],
  });

  let total = 0.00;
  const myMap = new Map();
  for (let i = 0; i < stInfo.length; i += 1) {
    myMap[stInfo[i].date] = stInfo[i].salesvolume;
    total += stInfo[i].salesvolume;
  }

  const dateVec = [];
  const dataVec = [];
  for (let i = 0; i < 30; i += 1) {
    const date = Moment(date30Start).add(i, 'days').format('YYYY-MM-DD');
    dateVec.push(date);
    dataVec.push(myMap[date] || 0);
  }

  return {
    average: parseFloat(total / 30).toFixed(2),
    dateVec,
    dataVec,
  };
};

// 近30天日均新增会员
export const query30MemberCount = async (storeid) => {
  $required('storeid', storeid);
  const date30Start = Moment().subtract(30, 'day').format('YYYY-MM-DD');
  const date30End = Moment().endOf('day').format('YYYY-MM-DD');

  const stInfo = await models.Statistic.findAll({
    where: {
      date: {
        gte: date30Start,
        lte: date30End,
      },
      storeid,
    },
    attributes: ['date', 'membernumber'],
  });

  let total = 0;
  const myMap = new Map();
  for (let i = 0; i < stInfo.length; i += 1) {
    myMap[stInfo[i].date] = stInfo[i].membernumber;
    total += stInfo[i].membernumber;
  }

  const dateVec = [];
  const dataVec = [];
  for (let i = 0; i < 30; i += 1) {
    const date = Moment(date30Start).add(i, 'days').format('YYYY-MM-DD');
    dateVec.push(date);
    dataVec.push(myMap[date] || 0);
  }

  return {
    average: parseFloat(total / 30).toFixed(2),
    dateVec,
    dataVec,
  };
};

// 近30天日均客流
export const query30flowCount = async (storeid) => {
  $required('storeid', storeid);
  const date30Start = Moment().subtract(30, 'day').format('YYYY-MM-DD');
  const date30End = Moment().endOf('day').format('YYYY-MM-DD');

  const stInfo = await models.Statistic.findAll({
    where: {
      date: {
        gte: date30Start,
        lte: date30End,
      },
      storeid,
    },
    attributes: ['date', 'siginnumber'],
  });

  let total = 0;
  const myMap = new Map();
  for (let i = 0; i < stInfo.length; i += 1) {
    myMap[stInfo[i].date] = stInfo[i].siginnumber;
    total += stInfo[i].siginnumber;
  }

  const dateVec = [];
  const dataVec = [];
  for (let i = 0; i < 30; i += 1) {
    const date = Moment(date30Start).add(i, 'days').format('YYYY-MM-DD');
    dateVec.push(date);
    dataVec.push(myMap[date] || 0);
  }

  return {
    average: parseFloat(total / 30).toFixed(2),
    dateVec,
    dataVec,
  };
};
