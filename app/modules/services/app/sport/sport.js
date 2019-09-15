import models from 'modules/db/models';
import lodash from 'lodash';
import Sequelize from 'modules/db/sequelize';
import Moment from 'moment';
import sequelize from 'sequelize';
import { queryGroupLessonList } from 'modules/services/app/sport/grouplesson';

function getDistance(s, d) {
  const xd = s.x - d.x;
  const yd = s.y - d.y;
  const xy = (xd * xd) + (yd * yd);
  // return Math.sqrt(xy);
  return xy;
}

function sortStore(reStores, item) {
  for (let i = 0; i < reStores.length; i += 1) {
    if (item.sortDistance < reStores[i].sortDistance) {
      reStores.splice(i, 0, item);
      return;
    }
  }
  reStores.push(item);
}

export const query = async (data, userID) => {
  const result = {};
  const mcoordinate = data.coordinate ? { x: data.coordinate.x || 0, y: data.coordinate.y || 0 } : { x: 1, y: 1 };
  const countycode = data.cc || 0;

  const baseInfo = {
    dayCount: 0,
    accCount: 0,
    continueCount: 0,
    todaySign: 0,
    signData: [],
    joinStore: 0,
  };
  result.baseInfo = baseInfo;

  if (userID) {
    // 签到
    const memberIds = [];
    const memberInfos = await models.Member.findAll({ attributes: ['uid'], where: { pdmemberid: userID } });
    if (memberInfos) {
      for (let i = 0; i < memberInfos.length; i += 1) {
        memberIds.push(memberInfos[i].uid);
      }
    }

    if (memberIds && memberIds.length > 0) {
    // 会员卡签到记录
      const sql = 'SELECT a.`signdate` FROM `MSignins` a\n' +
          'LEFT JOIN `VipCardMaps` b ON a.`vipcardmapid` = b.`uid`\n' +
          'LEFT JOIN `Members` c ON b.`memberid` = c.`uid`\n' +
          'WHERE c.`pdmemberid` = ?\n' +
          'GROUP BY a.`signdate`\n' +
          'ORDER BY a.`signdate` DESC\n';
      // console.log(sql);
      const signInfo = await Sequelize.query(sql, { replacements: [userID], type: sequelize.QueryTypes.SELECT });
      const signData = [];
      let continueCount = 0;

      let todaySign = 0;
      if (signInfo && signInfo.length > 0) {
        let nday = 0;
        let i = 0;
        if (Moment().format('YY-MM-DD') === signInfo[nday].signdate) {
          todaySign = 1;
          continueCount = 1;
          nday = 0;
          signData.push(Moment(signInfo[i].createdAt).format('X'));
          i = 1;
        } else {
          todaySign = 0;
          nday = 1;
          i = 0;
        }

        let bCnt = true;
        for (; i < signInfo.length; i += 1) {
          if (bCnt) {
            if (Moment().subtract(nday + i, 'day').format('YY-MM-DD') === signInfo[i].signdate) {
              continueCount += 1;
            } else { bCnt = false; }
          }
          signData.push(Moment(signInfo[i].createdAt).format('X'));
        }
      }
      baseInfo.dayCount = signData.length;
      baseInfo.accCount = signData.length;
      baseInfo.continueCount = continueCount;
      baseInfo.todaySign = todaySign;
      baseInfo.signData = signData;
      baseInfo.joinStore = 1;
    }
  }

  // 推荐门店
  const reStores = [];
  const reStoreIds = [];
  const storeId2Distance = {};
  let countyStores;
  let citycode = 0;
  if (countycode === 0) {
    countyStores = await models.Store.findAll({ limit: 50 });
  } else {
    countyStores = await models.Store.findAll({ where: { county: countycode } });
    citycode = Math.floor(countycode / 100);
  }
  // countycode区/县
  if (countyStores && countyStores.length > 0) {
    for (let i = 0; i < countyStores.length; i += 1) {
      const info = countyStores[i].toJSON();
      reStoreIds.push(info.uid);
      const co = info.coordinate.split(',');
      info.pictureurl = (info.pictureurl && JSON.parse(info.pictureurl)) || [];
      info.sortDistance = getDistance(mcoordinate, { x: co[0], y: co[1] });
      sortStore(reStores, info);
      storeId2Distance[info.uid] = info.sortDistance;
    }
    if (citycode === 0) {
      citycode = Math.floor(countyStores[0].county);
    }
  }

  // 当前市
  const cityStores = await models.Store.findAll({ where: { city: citycode, uid: { $notIn: reStoreIds } } });
  if (cityStores) {
    for (let i = 0; i < cityStores.length; i += 1) {
      const info = cityStores[i].toJSON();
      reStoreIds.push(info.uid);
      const co = info.coordinate.split(',');
      info.sortDistance = getDistance(mcoordinate, { x: co[0] || 0, y: co[1] || 0 });
      info.pictureurl = (info.pictureurl && JSON.parse(info.pictureurl)) || [];
      sortStore(reStores, info);
      storeId2Distance[info.uid] = info.sortDistance;
    }
  }
  result.reCityCode = citycode;
  result.reDefaultCityCode = 1101;
  result.reDefaultCityName = '北京市';
  result.reStores = reStores;
  // 推荐课程。私教课。
  const cardInfos = await models.Private.findAll({
    where: { storeid: Object.keys(storeId2Distance) },
    order: [['storeid', 'desc'], ['recommendWeight', 'desc']],
  });

  const rePrivateCourses = [];
  if (cardInfos) {
    for (let i = 0; i < cardInfos.length; i += 1) {
      const item = cardInfos[i].toJSON();
      item.storeDistance = storeId2Distance[item.storeid];
      item.pictureurl = (item.images && JSON.parse(item.images)) || [];
      delete item.images;
      rePrivateCourses.push(item);
    }
  }
  result.rePrivateCourses = lodash.orderBy(rePrivateCourses, ['storeDistance', 'recommendWeight'], ['asc', 'desc']);

  return result;
};

export const queryStore = async (data) => {
  const citycode = data.citycode || data.cc;
  const pageCount = parseInt(data.pageCount, 10) || 10;
  let curPage = parseInt(data.curPage, 10) || 1;
  if (curPage < 1) curPage = 1;
  // 门店
  const where = {};
  if (citycode) {
    where.city = citycode;
  }
  const count = await models.Store.count({ where });
  const hasmore = (curPage * pageCount) < count;
  const stores = await models.Store.findAll({
    include: {
      model: models.VipCard,
      as: 'vipcards',
      required: false,
      order: [['price', 'asc']],
      limit: 1,
      attributes: ['price', 'storeid'],
    },
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    // logging: console.log,
  });
  if (!stores) {
    return { data: [], hasmore: false };
  }

  const res = stores.map((s) => {
    const sJson = s.toJSON(); // eslint-disbale-line
    sJson.pictureurl = (sJson.pictureurl && JSON.parse(sJson.pictureurl)) || [];
    const r = {
      minprice: s.vipcards[0] ? s.vipcards[0].price : 0,
      ...sJson,
    };
    delete r.vipcards;
    return r;
  });
  return { data: res, hasmore };
};

export const queryStoreInfo = async (data) => {
  const storeInfo = await models.Store.findOne({
    where: { uid: data.id },
  });

  if (!storeInfo) return [];

  const grouplessonInfos = await queryGroupLessonList({ storeid: data.id });

  const infos = storeInfo.toJSON();
  if (grouplessonInfos) {
    infos.grouplesson = [];
    const courses = grouplessonInfos.data;
    for (let i = 0; i < courses.length; i += 1) {
      infos.grouplesson.push({ course: courses[i], courseId: courses[i].uid, storeid: courses[i].storeid });
    }
  }

  const tmpCoachInfos = await models.Coach.findAll({
    where: { storeid: data.id },
    limit: 15,
  });

  const coachInfos = [];
  if (tmpCoachInfos) {
    for (let i = 0; i < tmpCoachInfos.length; i += 1) {
      const info = tmpCoachInfos[i].toJSON();
      info.images = (info.images && JSON.parse(info.images)) || [];
      coachInfos.push(info);
    }
  }
  infos.coach = coachInfos;

  const tmpVipCardInfos = await models.VipCard.findAll({
    where: { storeid: data.id },
    limit: 15,
  });

  const vipCardInfos = [];
  if (tmpVipCardInfos) {
    for (let i = 0; i < tmpVipCardInfos.length; i += 1) {
      const info = tmpVipCardInfos[i].toJSON();
      info.images = (info.images && JSON.parse(info.images)) || [];
      info.storename = storeInfo.storename;
      vipCardInfos.push(info);
    }
  }
  infos.vipcards = vipCardInfos;
  infos.pictureurl = (infos.pictureurl && JSON.parse(infos.pictureurl)) || [];

  return infos;
};


// 查询教练
export const queryCoachInfo = async (data) => {
  const storeid = data.storeid;
  const id = data.id;
  const where = {
    storeid,
    id,
  };

  let coachInfo = await models.Coach.findOne({
    where,
    include: [
      {
        model: models.Store,
        as: 'store',
        required: false,
        where: { uid: storeid },
      },
    ],
  });
  if (!coachInfo) return {};
  coachInfo = coachInfo.toJSON();
  coachInfo.images = (coachInfo.images && JSON.parse(coachInfo.images)) || [];

  const courses = await models.Course.findAll({
    where: { uid: coachInfo.allowCourse.split(',') },
  });

  const coursesInfos = [];
  coachInfo.courses = coursesInfos;
  if (courses) {
    for (let i = 0; i < courses.length; i += 1) {
      const item = courses[i].toJSON();
      item.images = (item.images && JSON.parse(item.images)) || [];
      coursesInfos.push(item);
    }
  }

  const sum = await models.CoachScore.sum('score', {
    where: { coachId: coachInfo.id, storeid },
  });

  const count = await models.CoachScore.count({
    where: { coachId: coachInfo.id, storeid },
  });

  coachInfo.score = 5;
  if (count > 0) { coachInfo.score = Math.floor(sum / count); }

  return coachInfo;
};


// eslint-disable-next-line no-unused-vars
export const queryAllCity = async (data) => {
  const countys = await models.Store.findAll({
    attributes: [[sequelize.literal('distinct(city)'), 'city']],
    raw: true,
  });
  if (!countys) return { defaultCityCode: 1101, areans: [] };
  const codeids = [];
  for (let i = 0; i < countys.length; i += 1) {
    codeids.push(parseInt(countys[i].city, 10));
  }
  const areans = await models.Area.findAll({
    attributes: ['codeid', 'cityname'],
    where: {
      codeid: codeids,
    },
  });
  return { defaultCityCode: 1101, areans };
};
