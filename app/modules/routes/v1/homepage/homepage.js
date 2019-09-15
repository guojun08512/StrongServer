import Router from 'koa-router';
import * as HomPage from 'modules/homepage';

async function queryDayCount(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.queryDayCount(storeid);
  ctx.success(ret, 'query finish!');
}

async function queryOrderPrivateLesson(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.queryOrderPrivateLesson(storeid);
  ctx.success(ret, 'query finish!');
}

async function queryGroupLesson(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.queryGroupLesson(storeid);
  ctx.success(ret, 'query finish!');
}

async function queryExprience(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.queryExprience(storeid);
  ctx.success(ret, 'query finish!');
}

async function query30DayCount(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.query30DayCount(storeid);
  ctx.success(ret, 'query finish!');
}

async function queryCardCount(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.queryCardCount(storeid);
  ctx.success(ret, 'queryCardCount finish!');
}

async function memberStatistics(ctx) {
  const storeid = ctx.headers.storeid;
  const authorization = ctx.headers.authorization;
  const ret = await HomPage.memberStatistics(storeid, authorization);
  ctx.success(ret, 'memberStatistics finish!');
}

// 近30天日均销售额
async function query30DayVolume(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.query30DayVolume(storeid);
  ctx.success(ret, 'query30DayVolume finish!');
}

// 近30天日均新增会员
async function query30MemberCount(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.query30MemberCount(storeid);
  ctx.success(ret, 'query30MemberCount finish!');
}

// 近30天日均客流
async function query30flowCount(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await HomPage.query30flowCount(storeid);
  ctx.success(ret, 'query30flowCount finish!');
}

const router = Router();
const routers = router
  .get('/queryDayCount', queryDayCount)
  .get('/queryOrderPrivateLesson', queryOrderPrivateLesson)
  .get('/queryGroupLesson', queryGroupLesson)
  .get('/queryExprience', queryExprience)
  .get('/query30DayCount', query30DayCount)
  .get('/queryCardCount', queryCardCount)
  .get('/memberStatistics', memberStatistics)
  .get('/query30DayVolume', query30DayVolume)
  .get('/query30MemberCount', query30MemberCount)
  .get('/query30flowCount', query30flowCount);

module.exports = routers;

/*

查询数量
  homepage/queryDayCount.
  返回：
  {
    expTodayCount,        //今日到店体验人数
    signPrivateLessonDayCount,    //今日私课消课数量
    signPrivateLesson30DayAvgCount,  //今日私课消渴30天日均数量
  };

查询30天数量
  homepage/query30DayCount 返回：
  {
    privateLesson  //私课消课
  }

今日预约私课信息: homepage/queryOrderPrivateLesson
今日团课排课信息: homepage/queryGroupLesson
今日体验数据: homepage/queryExprience

*/
