import Router from 'koa-router';
import * as Sport from 'modules/services/app/sport';
import * as VipCard from 'modules/vipcard';

async function query(ctx) {
  const data = ctx.request.body;
  const userID = ctx.userInfo ? ctx.userInfo.uid : undefined;
  // data.uid = 'b69e6ab4-d4d3-469b-91aa-59bdc1855b6e';// ctx.userInfo.uid;
  // data.storeid = '2cd792fb-6ccd-4b92-9013-f9c94e10fdec';
  const result = await Sport.query(data, userID);
  ctx.success(result, 'query finish!');
}

async function queryReCourseInfo(ctx) {
  const data = ctx.request.body;
  const userID = ctx.userInfo ? ctx.userInfo.uid : undefined;
  const result = await Sport.queryReCourseInfo(data, userID);
  ctx.success(result, 'queryReCourseInfo finish!');
}

async function queryReCoach(ctx) {
  const data = ctx.request.body;
  const result = await Sport.queryReCoach(data);
  ctx.success(result, 'queryReCoach finish!');
}

async function purchaseReCourse(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const result = await Sport.purchaseReCourse(data, authorization);
  ctx.success(result, 'purchaseReCourse finish!');
}

async function queryStore(ctx) {
  const data = ctx.request.body;
  const result = await Sport.queryStore(data);
  ctx.success(result, 'query finish!');
}

async function queryStoreInfo(ctx) {
  const data = ctx.request.body;
  const result = await Sport.queryStoreInfo(data);
  ctx.success(result, 'query finish!');
}

async function queryGroupLessonInfo(ctx) {
  const data = ctx.request.body;
  const userID = ctx.userInfo ? ctx.userInfo.uid : undefined;
  const result = await Sport.queryGroupLessonInfo(data, userID);
  ctx.success(result, 'query finish!');
}

async function subscribeGroupLesson(ctx) {
  if (ctx.userInfo) {
    const data = ctx.request.body;
    data.uid = ctx.userInfo.uid;
    const result = await Sport.subscribeGroupLesson(data);
    ctx.success(result, 'query finish!');
  } else {
    ctx.success({}, 'no login!');
  }
}

async function subscribePrivate(ctx) {
  if (ctx.userInfo) {
    const data = ctx.request.body;
    data.uid = ctx.userInfo.uid;
    const result = await Sport.subscribePrivate(data);
    ctx.success(result, 'query finish!');
  } else {
    // const data = ctx.request.body;
    // data.uid = '1';// ctx.userInfo.uid;
    // const result = await Sport.subscribePrivate(data);
    // ctx.success(result, 'no login!');
    ctx.success({}, 'no login!');
  }
}

async function queryCoachInfo(ctx) {
  const data = ctx.request.body;
  const result = await Sport.queryCoachInfo(data);
  ctx.success(result, 'query finish!');
}

async function queryMemberStoreInfo(ctx) {
  if (ctx.userInfo) {
    const data = ctx.request.body;
    data.uid = ctx.userInfo.uid;
    const result = await Sport.queryMemberStoreInfo(data);
    ctx.success(result, 'query finish!');
  } else { // test
    // const data = ctx.request.body;
    // data.uid = 'b69e6ab4-d4d3-469b-91aa-59bdc1855b6e';// ctx.userInfo.uid;
    // data.storeid = 'b69e6ab4-d4d3-469b-91aa-59bdc1855b6e';
    // const result = await Sport.queryMemberStoreInfo(data);
    // ctx.success(result, 'no login!');

    ctx.success({}, 'no login!');
  }
}

async function queryPrivateCourseList(ctx) {
  const data = ctx.request.body;
  const result = await Sport.queryPrivateCourseList(data);
  ctx.success(result, 'query finish!');
}

async function queryGroupLessonList(ctx) {
  const data = ctx.request.body;
  const result = await Sport.queryGroupLessonList(data);
  ctx.success(result, 'query finish!');
}

async function queryMemberVipCardInfo(ctx) {
  if (ctx.userInfo) {
    const data = ctx.request.body;
    data.uid = ctx.userInfo.uid;
    const result = await Sport.queryMemberVipCardInfo(data);
    ctx.success(result, 'query finish!');
  } else {
    // const data = { storeid: '7d851aac-31dc-4291-9d65-32259ec6677f', uid: 'b69e6ab4-d4d3-469b-91aa-59bdc1855b6e' };
    // const result = await Sport.queryMemberVipCardInfo(data);
    ctx.success({}, 'no login!');
  }
}

async function queryMemberPrivateInfo(ctx) {
  if (ctx.userInfo) {
    const data = ctx.request.body;
    data.uid = ctx.userInfo.uid;
    const result = await Sport.queryMemberPrivateInfo(data);
    ctx.success(result, 'query finish!');
  } else {
    ctx.success({ data: 'no login!' }, 'no login!');
  }
}

async function queryMemberBathInfo(ctx) {
  if (ctx.userInfo) {
    const data = ctx.request.body;
    data.uid = ctx.userInfo.uid;
    const result = await Sport.queryMemberBathInfo(data);
    ctx.success(result, 'query finish!');
  } else {
    ctx.success({}, 'no login!');
  }
}

async function queryMemberStores(ctx) {
  if (ctx.userInfo) {
    const data = ctx.request.body;
    const userID = ctx.userInfo.uid;
    const result = await Sport.queryMemberStores(data, userID);
    ctx.success(result, 'query finish!');
  } else {
    ctx.success({}, 'no login!');
  }
}

async function queryCoachPrivateLessonTime(ctx) {
  const data = ctx.request.body;
  const ret = await Sport.queryCoachPrivateLessonTime(data);
  ctx.success(ret, 'query finish!');
}

async function queryAllCity(ctx) {
  const data = ctx.request.body;
  const ret = await Sport.queryAllCity(data);
  ctx.success(ret, 'query finish!');
}

async function getAllVipCards(ctx) {
  const data = ctx.request.body;
  const storeid = data.storeid;
  const ret = await VipCard.getAllVipCards(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function getVipCardInfo(ctx) {
  const data = ctx.request.body;
  const storeid = data.storeid;
  const ret = await VipCard.queryVipCardDetails(data, storeid);
  let info = null;
  if (ret) {
    info = ret.toJSON();
    info.images = (info.images && JSON.parse(info.images)) || [];
  }
  ctx.success(info, 'query finish!');
}

const router = Router();
const routers = router
  .post('/query', query)
  .post('/queryReCourseInfo', queryReCourseInfo)
  .post('/queryReCoach', queryReCoach)
  .post('/purchaseReCourse', purchaseReCourse)
  .post('/queryStore', queryStore)
  .post('/queryStoreInfo', queryStoreInfo)
  .post('/queryGroupLessonInfo', queryGroupLessonInfo)
  .post('/subscribeGroupLesson', subscribeGroupLesson)
  .post('/queryCoachInfo', queryCoachInfo)
  .post('/queryMemberStoreInfo', queryMemberStoreInfo)
  .post('/queryPrivateCourseList', queryPrivateCourseList)
  .post('/queryGroupLessonList', queryGroupLessonList)
  .post('/subscribePrivate', subscribePrivate)
  .post('/queryMemberVipCardInfo', queryMemberVipCardInfo)
  .post('/queryMemberPrivateInfo', queryMemberPrivateInfo)
  .post('/queryMemberBathInfo', queryMemberBathInfo)
  .post('/queryMemberStores', queryMemberStores)
  .post('/queryCoachPrivateLessonTime', queryCoachPrivateLessonTime)
  .post('/queryAllCity', queryAllCity)
  .post('/getAllVipCards', getAllVipCards)
  .post('/getVipCardInfo', getVipCardInfo);

module.exports = routers;
