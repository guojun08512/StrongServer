import Router from 'koa-router';
import * as Report from 'modules/report';

// 营业流水
async function OperationFlow(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Report.OperationFlow(data, storeid);
  ctx.success({ res }, 'OperationFlow finish!');
}

// 会员卡销售报表
async function VipCardSaleReport(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Report.VipCardSaleReport(data, storeid);
  ctx.success({ res }, 'VipCardSaleReport finish!');
}

// 私教课销售报表
async function PrivateSaleReport(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Report.PrivateSaleReport(data, storeid);
  ctx.success({ res }, 'PrivateSaleReport finish!');
}

// 私教课消课报表
async function PDisCourseReport(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Report.PDisCourseReport(data, storeid);
  ctx.success({ res }, 'PDisCourseReport finish!');
}

// 总收入
async function GrossIncome(ctx) {
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const res = await Report.GrossIncome(authorization, storeid);
  ctx.success({ res }, 'GrossIncome finish!');
}

const router = Router();
const routers = router
  .get('/OperationFlow', OperationFlow)
  .get('/VipCardSaleReport', VipCardSaleReport)
  .get('/PrivateSaleReport', PrivateSaleReport)
  .get('/PDisCourseReport', PDisCourseReport)
  .get('/GrossIncome', GrossIncome);

module.exports = routers;
