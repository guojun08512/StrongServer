import Router from 'koa-router';
import * as CoachGroup from 'modules/coachgroup';

async function add(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await CoachGroup.add(data, storeid);
  ctx.success(ret, 'add finish!');
}

async function update(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await CoachGroup.update(data, storeid);
  ctx.success(ret, 'Update finish!');
}

async function deleteR(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await CoachGroup.deleteR(data, storeid);
  ctx.success(ret, 'delete finish!');
}

async function query(ctx) {
  const storeid = ctx.headers.storeid;
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const coachGroup = await CoachGroup.query(data, storeid, authorization);
  ctx.success({ coachGroup }, 'query finish!');
}

const router = Router();
const routers = router
  .post('/', add)
  .put('/:id', update)
  .delete('/:id', deleteR)
  .get('/:id', query);

module.exports = routers;

/*
团课预约  coachgroup/query
  pageCount   // 页数
  curPage     // 页码
  uid // 用户id
  membername  //姓名
  phone //电话
  groupLessonId //团课id
  date //日期


*/
