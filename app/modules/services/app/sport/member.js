import models from 'modules/db/models';
import Sequelize from 'modules/db/sequelize';
import Moment from 'moment';
import sequelize from 'sequelize';
import * as redisModels from 'modules/redisdb';
import { queryStoreInfo } from 'modules/services/app/sport/sport';

export const queryMemberStoreInfo = async (data) => {
  const result = {};
  const uid = data.uid;
  const storeid = data.storeid;

  const baseInfo = {
    dayCount: 0,
    accCount: 0,
    continueCount: 0,
    todaySign: 0,
    signData: 0,
    joinStore: 0,
    vipcardCount: 0,
    privateCourseCount: 0,
  };
  result.baseInfo = baseInfo;

  const storeInfo = await queryStoreInfo({ id: storeid });
  // 签到
  const memberInfo = await models.Member.findOne({ where: { pdmemberid: uid, storeid } });
  if (!memberInfo) return { baseInfo, storeInfo };
  const memberIds = [memberInfo.uid];

  // 会员卡签到记录
  const sql = 'SELECT DISTINCT(signdate) FROM `MSignins` WHERE `vipcardmapid` IN (SELECT uid FROM `VipCardMaps` WHERE memberid in (?) order by signdate desc)';
  // console.log(sql);
  const signInfo = await Sequelize.query(sql, { replacements: [memberIds.join(',')], type: sequelize.QueryTypes.SELECT });
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

  const groupcnt = 0; // await models.OrderGroup.count({ where: { status: { gt: 0 }, memberId: memberIds, storeid } });
  let privateSignNumber = await models.SignPrivateLesson.sum('signNumber', { where: { status: 2, memberId: memberIds, storeid } });
  if (!privateSignNumber) {
    privateSignNumber = 0;
  }
  // 已上课次数
  baseInfo.courseCount = groupcnt + privateSignNumber;

  let bathCount = await models.Shower.sum('totaldate', { where: { memberid: memberIds } });
  if (!bathCount) {
    bathCount = 0;
  }
  baseInfo.bathCount = bathCount;

  let privateNum = await models.PrivateMap.sum('curbuy', { where: { memberId: memberIds } });
  if (!privateNum) {
    privateNum = 0;
  }
  baseInfo.privateCourseCount = privateNum;

  const vipcards = await models.VipCard.findAll({ where: { cardsubtype: 1, storeid } });
  const vipcardIds = [];
  if (vipcards) {
    for (let i = 0; i < vipcards.length; i += 1) {
      vipcardIds.push(vipcards[i].uid);
    }
  }

  // 期限卡剩余次数
  const cardinfos = await models.VipCardMap.findAll({
    attributes: [
      'vipcardid',
      'memberid',
      [Sequelize.literal('SUM((unix_timestamp(expirytime)-unix_timestamp(now()))/86400)'), 'leftdays'],
      [Sequelize.literal('SUM((unix_timestamp(expirytime)-unix_timestamp(opencardtime))/86400)'), 'totaldays'],
    ],

    where: { memberid: memberIds, vipcardid: vipcardIds, cardstatus: { ne: 3 } },
    group: ['vipcardid', 'memberid'],
  });

  let leftdays = 0;
  if (cardinfos) {
    for (let i = 0; i < cardinfos.length; i += 1) {
      const info = cardinfos[i].toJSON();
      leftdays += Math.ceil(info.leftdays);
    }
  }
  baseInfo.vipcardCount = leftdays;

  const ret = { baseInfo, storeInfo };

  redisModels.Add(redisModels.tableIndex.base, 'Last_Sport', uid, storeid);
  return ret;
};


export const queryMemberVipCardInfo = async (data) => {
  const uid = data.uid;
  const storeid = data.storeid;
  const pageCount = parseInt(data.pageCount, 10) || 10;
  let curPage = parseInt(data.curPage, 10) || 1;
  if (curPage < 1) curPage = 1;

  const memberInfo = await models.Member.findOne({ where: { pdmemberid: uid, storeid } });
  if (!memberInfo) return { basedata: {}, data: {} };
  const memberid = memberInfo.uid;

  // 只有期限卡
  const vipcards = await models.VipCard.findAll({ where: { cardsubtype: 1, storeid } });
  const vipcardIds = [];
  if (vipcards) {
    for (let i = 0; i < vipcards.length; i += 1) {
      vipcardIds.push(vipcards[i].uid);
    }
  }

  let leftdays = 0;
  let totaldays = 0;
  const cardinfo = await models.VipCardMap.findOne({
    attributes: [
      'memberid',
      [Sequelize.literal('SUM((unix_timestamp(expirytime)-unix_timestamp(now()))/86400)'), 'leftdays'],
      [Sequelize.literal('SUM((unix_timestamp(expirytime)-unix_timestamp(opencardtime))/86400)'), 'totaldays'],
    ],
    where: { memberid, vipcardid: vipcardIds, cardstatus: { ne: 3 } },
    group: ['memberid'],
  });
  if (cardinfo) {
    const tmp = cardinfo.toJSON();
    leftdays = Math.ceil(tmp.leftdays);
    totaldays = Math.ceil(tmp.totaldays);
  }
  const basedata = {
    leftdays, totaldays,
  };

  const cardinfos = await models.VipCardMap.findAll({
    include: {
      model: models.VipCard,
      as: 'vipcards',
    },
    where: { memberid, vipcardid: vipcardIds, cardstatus: { ne: 3 } },
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
    info.expirytime = Moment(info.expirytime).format('YYYY-MM-DD');
    info.vipcards.images = info.vipcards ? JSON.parse(info.vipcards.images) : [];
    const cardleftday = ((new Date(info.expirytime)).getTime() - (new Date()).getTime()) / 86400 / 1000; // eslint-disable-line
    info.curbuy = cardleftday > 0 ? Math.ceil(cardleftday) : 0;
    infos.push(info);
  }

  return { basedata, data: infos };
};


export const queryMemberBathInfo = async (data) => {
  const storeid = data.storeid;
  const uid = data.uid;
  const basedata = { leftminute: 0 };
  const retdata = [];
  const memberInfo = await models.Member.findOne({ where: { pdmemberid: uid, storeid } });
  if (!memberInfo) return { basedata, data: retdata };
  const showerInfo = await models.Shower.findOne({ where: { memberid: memberInfo.uid } });
  if (!showerInfo) return { basedata, data: retdata };

  basedata.leftminute = showerInfo.totaldate;
  return { basedata, data: retdata };
};


export const queryMemberStores = async (data, userID) => {
  const members = await models.Member.findAll({
    include: [{
      model: models.PDMember,
      as: 'pdmembers',
    },
    {
      model: models.Store,
      as: 'stores',
    },
    ],
    where: { pdmemberid: userID },
  });
  if (!members) return [];

  const stores = [];
  for (let i = 0; i < members.length; i += 1) {
    const item = members[i].stores.toJSON();
    item.pictureurl = (item.pictureurl && JSON.parse(item.pictureurl)) || [];
    stores.push(item);
  }
  return stores;
};
