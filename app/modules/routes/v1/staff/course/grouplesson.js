import Router from 'koa-router';
import * as GroupLesson from 'modules/grouplesson';

async function add(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.add(data, storeid);
  ctx.success(ret, 'add finish!');
}

async function update(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.update(data, storeid);
  ctx.success(ret, 'update finish!');
}

async function deleteR(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.deleteR(data, storeid);
  ctx.success(ret, 'delete finish!');
}

async function copy(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.copy(data, storeid);
  ctx.success(ret, 'copy finish!');
}

async function copyOne(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.copyOne(data, storeid);
  ctx.success(ret, 'copy one finish!');
}

async function query(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.query(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function clear(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.clear(data, storeid);
  ctx.success(ret, 'clear finish!');
}

async function sign(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.sign(data, storeid);
  ctx.success(ret, 'sign finish!');
}

async function cancelSign(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.cancelSign(data, storeid);
  ctx.success(ret, 'cancelSign finish!');
}

async function signOk(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.signOk(data, storeid);
  ctx.success(ret, 'sign finish!');
}

async function orderTimeSet(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.orderTimeSet(data, storeid);
  ctx.success(ret, 'set finish!');
}

async function orderTimeSetQuery(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await GroupLesson.orderTimeSetQuery(data, storeid);
  ctx.success(ret, 'query finish!');
}

const router = Router();
const routers = router
  .post('/add', add)
  .post('/update', update)
  .post('/delete', deleteR)
  .post('/copy', copy)
  .post('/copyOne', copyOne)
  .post('/clear', clear)
  .post('/sign', sign)
  .post('/cancelSign', cancelSign)
  .post('/query', query)
  .post('/signOk', signOk)
  .post('/orderTimeSet', orderTimeSet)
  .post('/orderTimeSetQuery', orderTimeSetQuery);

module.exports = routers;


/*
团课
  添加  grouplesson/add  返回true,false，错误码
  $required('courseId', data.courseId); 课程id
  $required('coachId', data.coachId); 教练id
  $required('roomId', data.roomId);  房间id
  $required('allowCards', data.allowCards);  允许使用的卡，数组[uid,...]。
  $required('minNum', data.minNum);  //最少人数
  $required('maxNum', data.maxNum);  //最多人数

  // 排课时间:
  $required('beginDate'); // 开始日期 年-月-日
  $required('endDate'); // 结束日期 年-月-日
  $required('dates', data.dates);  // 排课周期
  data.dates = { [
      $required('beginTime'); // 开始时间  时:分 。 时/分必须是两数字 01:02  10:01
      $required('endTime');   // 结束时间  时:分 。 时/分必须是两数字 01:02  10:01
      $required('weeks'); // 星期[0,1,2,3,4,5,6]
    ],...
  }


  更新  grouplesson/update  返回true,false，错误码
  $required('id', data.id);      团课id
  $required('courseId', data.courseId); 课程id
  $required('courseDate', data.courseDate);       日期 年-月-日
  $required('beginTime', data.beginTime); 开始时间  时:分 。 时/分必须是两数字 01:02  10:01
  $required('endTime', data.endTime);  结束时间  时:分 。 时/分必须是两数字 01:02  10:01
  $required('coachId', data.coachId); 教练id
  $required('roomId', data.roomId);  房间id
  $required('minNum', data.minNum);  //最少人数
  $required('maxNum', data.maxNum);  //最多人数
  $required('allowCards', data.allowCards);  允许使用的卡，数组[uid,...]。

  删除  grouplesson/delete  返回true,false，错误码
  $required('id', data.id);      团课id

  复制  grouplesson/copy  返回true,false，错误码
  $required('sourceDate', data.sourceDate);   源日期 年-月-日
  $required('targetDate', data.targetDate);   目标日期 年-月-日。 数组

  复制一次  grouplesson/copyOne  返回true,false，错误码
  $required('sourceDate', data.sourceDate);   源日期 年-月-日
  $required('targetDate', data.targetDate);   目标日期 年-月-日。

  清除 grouplesson/clear  返回true,false，错误码
  $required('date', data.date); 日期 年-月-日

  查询 grouplesson/query  返回 grouplesson的数据库表所有字段. { count: totalCount, result }。
  date 日期，查询当天课程 年-月-日 '2018-10-28'
  weekdate  日期,这个会查询当周课程 年-月-日 '2018-10-28'
  coachId  //教练id
  courseId //课程id
  roomId  //场地id

  签到 grouplesson/sign  返回 true/false。
  $required('id', data.id); 团课预约id
  $required('currentNumber', data.currentNumber);  // 实到人数
  $required('recordPersonId', data.recordPersonId); //记录人id
  data.remark   //备注

  取消签到 grouplesson/cancelSign  返回 true/false。
  $required('id', data.id); 团课预约id

  签到 grouplesson/signOk  返回 true/false。
  $required('id', data.id); 团课预约id
  $required('currentNumber', data.currentNumber);  // 实到人数
  $required('recordPersonId', data.recordPersonId); //记录人id
  data.remark   //备注

  预约时间设置 grouplesson/orderTimeSet  返回 true/false。
  $required('orderTime', data.orderTime);  // 预约时间限制
  $required('cancelTime', data.cancelTime); // 取消时间限制

  预约时间设置 grouplesson/orderTimeSetQuery  返回 {
     groupLessonOrderTimeLimit,  // 预约时间限制
     groupLessonCancelOrderTimeLimit    // 取消时间限制
  }


*/
