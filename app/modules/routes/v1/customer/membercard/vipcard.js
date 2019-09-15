import Router from 'koa-router';
import * as VipCard from 'modules/vipcard';

// 增加会员卡
async function addVipCard(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await VipCard.addVipCard(data, storeid);
  ctx.success({ res }, 'success!');
}

// 更新会员卡
async function updateVipCard(ctx) {
  const data = ctx.request.body;
  const res = await VipCard.updateVipCard(data);
  ctx.success({ res }, 'success!');
}

// 删除会员卡
async function deleteVipCard(ctx) {
  const data = ctx.request.body;
  const res = await VipCard.deleteVipCard(data);
  ctx.success({ res }, 'success!');
}

// 查询会员卡详情
async function queryVipCardDetails(ctx) {
  const data = ctx.request.body;
  const res = await VipCard.queryVipCardDetails(data);
  ctx.success({ res }, 'success!');
}

// 获取会员卡列表
async function getAllVipCards(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await VipCard.getAllVipCards(data, storeid);
  ctx.success({ res }, 'success!');
}

// 增加私教课
async function addPrivate(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await VipCard.addPrivate(data, storeid);
  ctx.success({ res }, 'success!');
}

// 更新私教课
async function updatePrivate(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await VipCard.updatePrivate(data, storeid);
  ctx.success({ res }, 'success!');
}

// 删除私教课
async function deletePrivate(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await VipCard.deletePrivate(data, storeid);
  ctx.success({ res }, 'success!');
}

// 查询私教课详情
async function queryPrivateDetails(ctx) {
  const data = ctx.request.body;
  const res = await VipCard.queryPrivateDetails(data);
  ctx.success({ res }, 'success!');
}

// 获取私教课列表
async function getAllPrivates(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await VipCard.getAllPrivates(data, storeid);
  ctx.success({ res }, 'success!');
}

// 修改会员卡在售状态
async function updateVOnsale(ctx) {
  const data = ctx.request.body;
  const res = await VipCard.updateVOnsale(data);
  ctx.success({ res }, 'success!');
}

// 修改私教课在售状态
async function updatePOnsale(ctx) {
  const data = ctx.request.body;
  const res = await VipCard.updatePOnsale(data);
  ctx.success({ res }, 'success!');
}

const router = Router();
const routers = router
  .post('/addvipcard', addVipCard)
  .post('/updateVipCard', updateVipCard)
  .post('/deletevipcard', deleteVipCard)
  .post('/queryvipcarddetails', queryVipCardDetails)
  .post('/getAllVipCards', getAllVipCards)
  .post('/addPrivate', addPrivate)
  .post('/updatePrivate', updatePrivate)
  .post('/deletePrivate', deletePrivate)
  .post('/queryPrivateDetails', queryPrivateDetails)
  .post('/getAllPrivates', getAllPrivates)
  .post('/updateVOnsale', updateVOnsale)
  .post('/updatePOnsale', updatePOnsale);

module.exports = routers;
