import Router from 'koa-router';
import * as Coach from 'modules/coach';

async function add(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.add(data, storeid);
  ctx.success(ret, 'add finish!');
}

async function update(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.update(data, storeid);
  ctx.success(ret, 'update finish!');
}

async function deleteR(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.deleteR(data, storeid);
  ctx.success(ret, 'delete finish!');
}

async function resumeOffice(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.resumeOffice(data, storeid);
  ctx.success(ret, 'resumeOffice finish!');
}


async function query(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.query(data, storeid);
  ctx.success(ret, 'query finish!');
}
/*
async function positionAdd(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.positionAdd(data, storeid);
  ctx.success(ret, 'add finish!');
}

async function positionUpdate(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.positionUpdate(data, storeid);
  ctx.success(ret, 'update finish!');
}

async function positionDelete(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.positionDelete(data, storeid);
  ctx.success(ret, 'delete finish!');
}
*/

async function positionQuery(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await Coach.positionQuery(storeid);
  ctx.success(ret, 'position query finish!');
}


async function workTimeUpdate(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.workTimeUpdate(data, storeid);
  ctx.success(ret, 'work finish!');
}

async function pauseWorkTimeUpdate(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.pauseWorkTimeUpdate(data, storeid);
  ctx.success(ret, 'pause finish!');
}

async function orderCoach(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.orderCoach(data, authorization, storeid);
  ctx.success(ret, 'order finish!');
}

async function queryOrderCoach(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const authorization = ctx.headers.authorization;
  const ret = await Coach.queryOrderCoach(data, storeid, authorization);
  ctx.success(ret, 'query finish!');
}

async function SignPrivateLesson(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.SignPrivateLesson(data, storeid);
  ctx.success(ret, 'sign finish!');
}

async function SignOkPrivateLesson(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.SignOkPrivateLesson(data, storeid);
  ctx.success(ret, 'sign ok finish!');
}

async function CancelSignPrivateLesson(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.CancelSignPrivateLesson(data, storeid);
  ctx.success(ret, 'cancel sign finish!');
}

async function querySignPrivateLesson(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.querySignPrivateLesson(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function deleteOrderCoach(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.deleteOrderCoach(data, storeid);
  ctx.success(ret, 'delete finish!');
}

async function queryPrivateLessonInfo(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.getPrivateLessonInfo(data, authorization, storeid);
  ctx.success(ret, 'query finish!');
}

async function queryCoachPrivateLessonTime(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.getCoachPrivateLessonTime(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function orderTimeSet(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.orderTimeSet(data, storeid);
  ctx.success(ret, 'set finish!');
}

async function orderTimeSetQuery(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Coach.orderTimeSetQuery(data, storeid);
  ctx.success(ret, 'query finish!');
}

const router = Router();
const routers = router
  .post('/add', add)
  .post('/update', update)
  .post('/delete', deleteR)
  .post('/resumeOffice', resumeOffice)
  .post('/query', query)
  .post('/worktimeupdate', workTimeUpdate)
  .post('/pauseworktimeupdate', pauseWorkTimeUpdate)
  .post('/ordercoach', orderCoach)
  .post('/queryordercoach', queryOrderCoach)
  .post('/positionquery', positionQuery)
  .post('/signPrivateLesson', SignPrivateLesson)
  .post('/signOkPrivateLesson', SignOkPrivateLesson)
  .post('/cancelSignPrivateLesson', CancelSignPrivateLesson)
  .post('/querySignPrivateLesson', querySignPrivateLesson)
  .post('/deleteOrderCoach', deleteOrderCoach)
  .post('/queryPrivateLessonInfo', queryPrivateLessonInfo)
  .post('/queryCoachPrivateLessonTime', queryCoachPrivateLessonTime)
  .post('/orderTimeSet', orderTimeSet)
  .post('/orderTimeSetQuery', orderTimeSetQuery);

  /*
  .post('/positionadd', positionAdd)
  .post('/positionupdate', positionUpdate)
  .post('/positiondelete', positionDelete)
  */

module.exports = routers;

/*
  以下参数没有加 required的都是可选参数

  教练查询 coach/query  返回 { count: totalCount, coachs: allCoach }.  约课状态orderStatus  0:可约 1:课满 2:请假
  pageCount   // 页数
  curPage     // 页码
  groupId     // 分类
  coachId     // 教练id
  courseId    // 课程id。uid。
  date        // date 年-月-日
  workType    // 1工作、2请假、3可约
  leaveOffice  // true 离职，false未离职

  添加教练 coach/add 返回 true/false
  $required('name', data.name);    // 名字
  $required('sex', data.sex);      // 性别 1男 2女
  $required('cellphone', data.cellphone);  // 电话
  $required('coachType', data.coachType);   // 教练类型 1团课教练 2私课教练
  $required('allowCourse', data.allowCourseList);  // 允许课程/可教课程。课程表id,...
  // $required('feature', data.feature);      // 特长。可选
  $required('position', data.position);   // 职位

  更新教练 coach/update 返回 true/false
  $required('id', data.id);   // 教练id
  $required('name', data.name);    // 名字
  $required('sex', data.sex);      // 性别 1男 2女
  $required('cellphone', data.cellphone);  // 电话
  $required('coachType', data.coachType);   // 教练类型 1团课教练 2私课教练
  $required('allowCourse', data.allowCourseList);  // 允许课程/可教课程。课程表id,...
  // $required('feature', data.feature);      // 特长。可选
  $required('position', data.position);   // 职位

  删除教练 coach/delete 返回 true/false
  $required('id', data.id);   // 教练id

  恢复教练 coach/resumeOffice 返回 true/false
  $required('id', data.id);   // 教练id


  ************************私教**************************
  私教时间设置 添加 coach/worktimeupdate  返回true,false，错误码
  $required('id', data.id);   教练id
  $required('limit', data.limit);  课时数量限制
  $required('workTime', data.workTime);  工作时间  时:分:秒 数组
  $required('workBeginDate', data.workBeginDate); 工作开始日期  年-月-日
  $required('workEndDate', data.workEndDate);   工作结束日期 年-月-日

  私教暂停设置/恢复约课 添加 coach/pauseworktimeupdate  返回true,false，错误码
  $required('id', data.id);   教练id
  $required('pauseWorkBeginDate', data.pauseWorkBeginDate);  暂停开始日期 年-月-日
  $required('pauseWorkEndDate', data.pauseWorkEndDate);   暂停结束日期 年-月-日

  私教预约 coach/ordercoach  返回true,false，错误码
  $required('coachId', data.coachId);  教练id
  $required('cardId', data.cardId);  //用户购买的私教课id.
  $required('time', data.time);    时间 时:分:秒
  $required('date', data.date);    日期 年-月-日
  uid     用户id     // id、名字至少有一个
  membername   用户名字

  私教预约查询 coach/queryOrderCoach  返回 OrderCoach数据表的所有字段.  { count: totalCount, result: retdata }
  $required('date', data.date);    日期 年-月-日
  data.coachId   教练id
  data.courseId  课程id
  data.uid  用户id
  data.membername 用户姓名

  私教预约取消 coach/deleteOrderCoach  返回true,false
  $required('ids', data.ids);  预约ids，取消一个预约ids=预约id，多个预约ids=[预约id数组]

  查询会员私教课 coach/queryPrivateLessonInfo  返回  { memberId, cardInfo:[{cardName:卡名字,id:卡id}...] }
  $required('uid', data.uid);  // uid

  查询教练已约私教课时间 coach/queryCoachPrivateLessonTime  返回{coachId:卡名字,coachNotOrderTime:[已被约时间...] }
  $required('coachId', data.coachId);  // 模糊搜索 电话/名字...

  --------------------------消课-------------------------
  私教签课 coach/SignPrivateLesson  返回true,false，错误码
  $required('uid', data.uid);    // 用户id
  $required('cardId', data.cardId);  //用户购买的私教课id.
  $required('coachId', data.coachId); //教练id
  $required('number', data.number);  //签课数量

  私教签退 coach/SignOkPrivateLesson  返回true,false，错误码
  $required('id', data.id);      //预约id

  私教取消签课 coach/CancelSignPrivateLesson  返回true,false，错误码
  $required('id', data.id);      //预约id

  私教查询 coach/querySignPrivateLesson  返回 querySignPrivateLesson数据表的所有字段
  $required('date', data.date);    日期 年-月-日
  data.coachId   教练id
  data.courseId  课程id

  今日消课数量 coach/getTodayCount 返回：数量

  30天平均消课数量 coach/get30DaysCount 返回：数量


  预约时间设置 coach/orderTimeSet  返回 true/false。
  $required('orderTime', data.orderTime);  // 预约时间限制
  $required('cancelTime', data.cancelTime); // 取消时间限制

  预约时间设置 coach/orderTimeSetQuery  返回 {
     privateLessonOrderTimeLimit,  // 预约时间限制
     privateLessonCancelOrderTimeLimit    // 取消时间限制
  }
*/
