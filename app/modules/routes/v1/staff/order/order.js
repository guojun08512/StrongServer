import Router from 'koa-router';
import * as Order from 'modules/order';

// 查询订单列表
async function queryOrderList(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const ret = await Order.queryOrderList(data, authorization, storeid);
  ctx.success(ret, 'queryOrderList finish!');
}

// 教练查询业绩查询
async function queryCoachAchi(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const ret = await Order.queryCoachAchi(data, authorization, storeid);
  ctx.success(ret, 'queryCoachAchi finish!');
}

// 工作人员业绩查询
async function queryEmployeeAchi(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const ret = await Order.queryEmployeeAchi(data, authorization, storeid);
  ctx.success(ret, 'queryEmployeeAchi finish!');
}

const router = Router();
const routers = router
  .get('/queryOrderList', queryOrderList)
  .get('/queryCoachAchi', queryCoachAchi)
  .get('/queryEmployeeAchi', queryEmployeeAchi);

module.exports = routers;
