import models from 'modules/db/models';
import * as BuyVipCard from 'modules/buyvipcard';


// 查询私教课信息
export const queryReCourseInfo = async (data, userID) => {
  // const ctype = data.type; // 课程类型。1私课 2团课
  const id = data.id; // 课程id
  const storeid = data.storeid;
  const coachid = data.coachid; // 已购买课程的教练id。

  if (!coachid) {
    const cardInfos = await models.Private.findOne({
      where: { uid: id, storeid },
      include: [
        {
          model: models.Store,
          as: 'stores',
          required: false,
        }],
    });

    if (!cardInfos) return {};
    const retdata = cardInfos.toJSON();
    retdata.images = (retdata.images && JSON.parse(retdata.images)) || [];
    retdata.stores.pictureurl = (retdata.stores.pictureurl && JSON.parse(retdata.stores.pictureurl)) || [];
    return retdata;
  }

  // if (!userID) return null;
  const memberInfo = await models.Member.findOne({ where: { pdmemberid: userID, storeid } });
  if (!memberInfo) return {};
  const memberid = memberInfo.uid;
  const cardInfos = await models.Private.findOne({
    where: { uid: id, storeid },
    include: [{
      model: models.PrivateMap,
      as: 'privatemaps',
      required: false,
      where: { memberid, coach: coachid },
      include: {
        model: models.Coach,
        as: 'coachs',
        required: false,
        where: { id: coachid },
      },
    },
    {
      model: models.Store,
      as: 'stores',
      required: false,
    }],
  });
  if (!cardInfos) return {};
  const retdata = cardInfos.toJSON();
  //  console.log(retdata);
  retdata.pictureurl = (retdata.images && JSON.parse(retdata.images)) || [];
  if (retdata.stores) {
    retdata.stores.pictureurl = (retdata.stores.pictureurl && JSON.parse(retdata.stores.pictureurl)) || [];
  }
  // console.log('retdata.privatemaps.length', retdata.privatemaps.length, retdata.privatemaps[0].coachs);
  if (retdata.privatemaps.length > 0 && retdata.privatemaps[0].coachs) {
    retdata.coachs = retdata.privatemaps[0].coachs;
    retdata.coachs.pictureurl = (retdata.coachs.images && JSON.parse(retdata.coachs.images)) || [];
    delete retdata.coachs.images;
  }
  retdata.privatemaps = null;
  return retdata;
};

  // 查询教练
export const queryReCoach = async (data) => {
  const storeid = data.storeid;
  const coachId = data.coachid;
  const pageCount = parseInt(data.pageCount, 10) || 10;
  let curPage = parseInt(data.curPage, 10) || 1;
  if (curPage < 1) curPage = 1;
  const where = {
    storeid,
  };
  if (coachId) where.id = coachId;
  const count = await models.Coach.count({ where });
  const hasmore = (curPage * pageCount) < count;
  const coachs = await models.Coach.findAll({
    where,
    limit: pageCount,
    offset: (curPage - 1) * pageCount,
    logging: console.log,
  });
  if (!coachs) {
    return { data: [], hasmore: false };
  }
  const infos = [];
  for (let i = 0; i < coachs.length; i += 1) {
    const info = coachs[i].toJSON();
    info.images = (info.images && JSON.parse(info.images)) || [];
    infos.push(info);
  }
  // console.log(infos);
  return { data: infos, hasmore };
};

  // 购买推荐课
export const purchaseReCourse = async (data, authorization) => {
  const storeid = data.storeid;
  const uid = data.uid;
  const vipcardid = data.vipcardid;
  const payment = data.payment;
  const memberInfo = await models.Member.findOne({ attributes: ['memberid'], where: { pdmemberid: uid, storeid } });
  if (!memberInfo) {
    return {};
  }
  const params = {
    memberid: memberInfo.memberid,
    vipcardid,
    payment,
    storeid,
  };

  const result = await BuyVipCard.memberBuyVipCard(params, authorization, storeid);
  return result;
};
