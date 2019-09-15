import Moment from 'moment';
import models from 'modules/db/models';
import { $required } from 'modules/utils';
import Sequelize from 'modules/db/sequelize';
import sequelize from 'sequelize';

export const queryMemberSignInfo = async (data) => {
  $required('memberId', data.memberId);
  const memberId = data.memberId;

  const date30Start = Moment().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss');
  const date30End = Moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const dateStart = Moment(data.date).startOf('month').format('YYYY-MM-DD') || Moment().startOf('month').format('YYYY-MM-DD');
  const dateEnd = Moment(data.date).endOf('month').format('YYYY-MM-DD') || Moment().endOf('month').format('YYYY-MM-DD');

  // 近30天训练频率
  const count = await models.MSignin.count({
    include: [{
      model: models.VipCardMap,
      as: 'vipcardmaps',
      attributes: ['memberid'],
      where: {
        memberid: memberId,
      },
    }],
    where: {
      createdAt: {
        gte: date30Start,
        lte: date30End,
      },
    },
  });
  let trainRate = 0;
  if (count > 0) {
    trainRate = 30 / count;
    trainRate = parseInt(trainRate, 10);
  }

  // 私教签课频率
  const retData = await models.SignPrivateLesson.findAll({ where: { memberId, signDate: { gte: date30Start, lte: date30End } } });
  let privateLessonRate = 0;
  if (retData && retData.length > 0) {
    privateLessonRate = 30 / retData.length;
  }

  // 私教课记录
  const retData1 = await models.SignPrivateLesson.findAll({ attributes: ['signDate'], where: { memberId, signDate: { gte: dateStart, lte: dateEnd } } });
  const privateLessonSignData = [];
  for (let i = 0; i < retData1.length; i += 1) {
    privateLessonSignData.push(Moment(retData1[i].signDate).format('DD'));
  }

  // 会员卡签到记录
  const sql = 'SELECT DISTINCT(signdate) FROM `MSignins` WHERE signdate >= ? AND signdate <= ? AND `vipcardmapid` IN (SELECT uid FROM `VipCardMaps` WHERE memberid = ?)';
  const retData2 = await Sequelize.query(sql, { replacements: [dateStart, dateEnd, memberId], type: sequelize.QueryTypes.SELECT });
  const memberSignData = [];
  for (let i = 0; i < retData2.length; i += 1) {
    memberSignData.push(Moment(retData2[i].signdate).format('DD'));
  }

  // 合同总额
  // 会员卡
  const contract1 = await models.Order.sum('money', {
    include: {
      model: models.VipCardMapLog,
      as: 'vipcardmaplogs',
      attributes: [],
      where: {
        memberid: memberId,
      },
    },
    where: {
      type: 1,
    },
    attributes: [],
  }) || 0.00;
  // 私教课
  const contract2 = await models.Order.sum('money', {
    include: {
      model: models.PrivateMapLog,
      as: 'privatemaplogs',
      attributes: [],
      where: {
        memberid: memberId,
      },
    },
    where: {
      type: 2,
    },
    attributes: [],
    logging: console.log,
  }) || 0.00;

  return {
    trainRate,
    privateLessonRate,
    calendar: {
      count: privateLessonSignData.length + memberSignData.length,
      privateLessonSignData,
      memberSignData,
    },
    contract: parseFloat(contract1 + contract2).toFixed(2),
  };
};

// 团课约课记录
export const queryOrderRecord = async (data, storeid) => {
  $required('memberId', data.memberId);
  const pageCount = data.pageCount || 50;
  const curPage = data.curPage || 1;

  const params = {};
  params.limit = pageCount;
  params.offset = (curPage - 1) * pageCount;
  params.where = { memberId: data.memberId, storeid };

  const orderData = await models.OrderGroup.findAll(params);
  const totalCount = await models.OrderGroup.count({ where: params.where });
  const retData = [];
  for (let i = 0; i < orderData.length; i += 1) {
    const item = orderData[i];
    const info = {};
    const groupLessonId = item.groupLessonId;
    const lessonData = await models.GroupLesson.findOne({ where: { id: groupLessonId } });
    if (lessonData) {
      info.openDate = lessonData.courseDate;
      const course = await models.Course.findOne({ where: { uid: lessonData.courseId } });
      if (course) { info.courseName = course.name; }

      const coach = await models.Coach.findOne({ where: { id: lessonData.coachId } });
      if (coach) { info.coachName = coach.name; }
    }

    const cardMapInfo = await models.VipCardMap.findOne({ where: { uid: item.vipCardMapId } });
    if (cardMapInfo) {
      const cardInfo = await models.VipCard.findOne({ where: { uid: cardMapInfo.vipcardid } });
      if (cardInfo) {
        info.cardName = cardInfo.cardname;
      }
    }

    info.orderNumber = await models.OrderGroup.count({ where: { groupLessonId } });
    info.signType = item.signType; // 签到

    retData.push(info);
  }

  return { count: totalCount, data: retData };
};


// 私课消课记录
export const querySignPrivateLessonRecord = async (data, storeid) => {
  $required('memberId', data.memberId);
  const pageCount = data.pageCount || 50;
  const curPage = data.curPage || 1;

  const params = {};
  params.limit = pageCount;
  params.offset = (curPage - 1) * pageCount;
  params.where = { memberId: data.memberId, storeid };

  const privateRecord = await models.SignPrivateLesson.findAll(params);
  const totalCount = await models.SignPrivateLesson.count({ where: params.where });
  const retData = [];
  for (let i = 0; i < privateRecord.length; i += 1) {
    const item = privateRecord[i];
    const info = {};

    const cardInfo = await models.PrivateMap.findOne({
      where: { uid: item.privateId },
      include: [
        {
          model: models.Private,
          as: 'privates',
          where: { storeid },
        },
      ],
    });

    info.cardName = cardInfo.privates.privatename;

    if (item.coachId > 0) {
      const coach = await models.Coach.findOne({ where: { id: item.coachId } });
      info.coachName = coach.name;
    }

    info.totalSignNumber = item.signNumber + item.signGiveNumber;
    info.signDate = item.signDate;
    info.signOkDate = item.signOkDate;


    info.signType = item.signType; // 签到
    info.signOkType = item.signOkType; // 签退方式

    retData.push(info);
  }

  return { count: totalCount, data: retData };
};

// 会员拥有的会员卡列表
// export const queryMemberVipCard = async (data) => {
//   $required('memberId', data.memberId);
//   const memberid = data.memberId;
//   const pageCount = data.pageCount || 10;
//   const curPage = data.curPage || 1;
//   console.log(data);

//   const allVipCards = await models.VipCardMap.findAll({
//     where: {
//       memberid,
//     },
//     limit: pageCount,
//     offset: (curPage - 1) * pageCount,
//     logging: console.log,
//   });
//   const totalCount = await models.VipCardMap.count({ where: { memberid } });
//   const retData = [];
//   for (let i = 0; i < allVipCards.length; i += 1) {
//     const item = converSqlToJson(allVipCards[i]);
//     const info = {};

//     const cardInfo = await models.VipCard.findOne({ where: { uid: item.vipcardid } });
//     let param1 = 0;
//     let param2 = 0;
//     const type = cardInfo.cardsubtype;
//     param1 = item.curbuy;
//     param2 = item.curgive;

//     info.vipcardmapid = item.uid;
//     info.cardname = cardInfo.cardname;
//     info.cardtype = cardInfo.cardtype;
//     info.cardsubtype = cardInfo.cardsubtype;
//     info.param1 = param1;
//     info.param2 = param2;
//     if (type === VipCard.VipCardSubType.PrivateLessonCard) { info.coach = item.coach; }
//     let validity = parseInt(Moment(item.expirytime).diff(Moment().format('YYYY-MM-DD HH:mm:ss'), 'days'), 10);
//     if (validity < 0) {
//       validity = 0;
//     }
//     info.vcmapinfo = item ? {
//       ...item,
//       createdAt: Moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
//       updatedAt: Moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
//       validity: Moment(item.expirytime).format('YYYY') === '9999' ? '' : validity.toString(),
//     } : {};

//     retData.push(info);
//   }

//   return { count: totalCount, data: retData };
// };

// 训练记录列表
// export const trainingRecordList = async (data) => {
//   $required('memberId', data.memberId);
//   const memberid = data.memberId;
//   const pageCount = data.pageCount || 10;
//   const curPage = data.curPage || 1;
//   console.log(data);

//   const trainInfo = await models.MSignin.findAll({
//     include: [{
//       model: models.VipCardMap,
//       as: 'vipcardmaps',
//       attributes: ['memberid', 'vipcardid'],
//       where: {
//         memberid,
//       },
//     }],
//     order: [['iid', 'DESC']],
//     limit: pageCount,
//     offset: (curPage - 1) * pageCount,
//     logging: console.log,
//   });

//   const infoVec = [];
//   for (let i = 0; i < trainInfo.length; i += 1) {
//     const info = {};
//     const tempTrainInfo = trainInfo[i];

//     const vInfo = await models.VipCard.findOne({
//       where: {
//         uid: tempTrainInfo.vipcardmaps.vipcardid,
//       },
//     });

//     info.uid = tempTrainInfo.uid;
//     info.createdAt = Moment(tempTrainInfo.signdate).format('YYYY-MM-DD');
//     info.vipcardid = tempTrainInfo.vipcardid;
//     info.vipcardname = vInfo.cardname;
//     info.number = tempTrainInfo.number;
//     info.signin = tempTrainInfo.signin;
//     info.handcardid = tempTrainInfo.handcardid;
//     info.returntime = tempTrainInfo.returntime;
//     info.status = tempTrainInfo.status;
//     infoVec.push(info);
//   }

//   return {
//     count: infoVec.length,
//     infoVec,
//   };
// };

// 合同订单列表
// export const contractList = async (data, authorization, storeid) => {
//   $required('memberId', data.memberId);
//   const memberid = data.memberId;
//   const vipcardid = data.vipcardid;
//   const pageCount = data.pageCount || 10;
//   const curPage = data.curPage || 1;
//   console.log(data);

//   const memberids = [];
//   memberids.push(memberid);
//   const json = {
//     memberids,
//     vipcardid,
//     storeid,
//     pageCount,
//     curPage,
//   };

//   const ret2 = await Order.queryPayOrder(json, authorization);
//   const count = ret2.ret.count;
//   const total = ret2.ret.total;
//   const orderInfo = ret2.ret.orderVec;
//   const orderVec = [];
//   for (let i = 0; i < orderInfo.length; i += 1) {
//     let name = '';
//     if (orderInfo[i].ascription !== '') {
//       const ecInfo = await Employee.querySingleEmpAndCoach(orderInfo[i].ascription, storeid);
//       name = ecInfo.name;
//     }
//     orderVec.push({
//       ordernumber: orderInfo[i].ordernumber,
//       createdAt: orderInfo[i].createdAt,
//       money: orderInfo[i].money,
//       method: orderInfo[i].method,
//       operation: orderInfo[i].operation,
//       remark: orderInfo[i].remark,
//       name,
//     });
//   }

//   return {
//     count,
//     total,
//     orderVec,
//   };
// };

// 跟进记录列表
// export const followList = async (data) => {
//   $required('memberId', data.memberId);
//   const memberid = data.memberId;
//   const pageCount = data.pageCount || 10;
//   const curPage = data.curPage || 1;
//   console.log(data);

//   const allInfos = converSqlToJson(await models.Follow.findAll({
//     include: [{
//       model: models.Member,
//       as: 'members',
//       attributes: [],
//       where: {
//         uid: memberid,
//       },
//     }],
//     attributes: ['uid', 'personnel', 'mode', 'remark', 'createdAt', 'memberid'],
//     limit: pageCount,
//     offset: (curPage - 1) * pageCount,
//     logging: console.log,
//   }));

//   return {
//     count: allInfos.length,
//     allInfos: allInfos.map(info => ({ ...info, createdAt: Moment(info.createdAt).format('YYYY-MM-DD') })),
//   };
// };
