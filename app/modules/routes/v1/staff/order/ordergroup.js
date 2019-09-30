import Router from 'koa-router';
import * as OrderGroup from 'modules/ordergroup';

async function add(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await OrderGroup.add(data, storeid);
  ctx.success(ret, 'add finish!');
}

async function deleteR(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await OrderGroup.deleteR(data, storeid);
  ctx.success(ret, 'delete finish!');
}

async function query(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await OrderGroup.query(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function sign(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await OrderGroup.sign(data, storeid);
  ctx.success(ret, 'sign finish!');
}

const router = Router();
const routers = router
  .post('/', add)
  .delete('/:id', deleteR)
  .post('/sign', sign)
  .get('/:id', query);

module.exports = routers;

/*
预约团课
  ordergroup/add 添加(预约)  返回true,false，错误码
  $required('groupLessonId', data.groupLessonId); 团课id
  $required('vipcardmapid', data.vipcardmapid);  预约使用的卡
  data.memberId || data.uid 会员id或用户id


  ordergroup/delete 删除(取消预约) 返回true,false，错误码
  $required('groupLessonId', data.groupLessonId); 团课id
  $required('uid', data.uid); 用户id

  ordergroup/query 查询 返回ordergroup数据表所有字段.  { count: totalCount, result }
  $required('groupLessonId', data.groupLessonId); 团课id。可选
  $required('uid', data.uid); 用户id。 可选

  ordergroup/sign 签到 返回true,false
  $required('ids', ids); 预约id。数组[id,...]
*/
