import Router from 'koa-router';
import * as Signin from 'modules/signin';

// 会员确认页面
async function memberConfirm(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Signin.memberConfirm(data, storeid);
  ctx.success({ res }, 'memberConfirm finish!');
}

// 会员签到
async function memberSignin(ctx) {
  const data = ctx.request.body;
  const res = await Signin.memberSignin(data);
  ctx.success({ res }, 'memberSignin finish!');
}

// 会员签到取消
async function cancelMemSignin(ctx) {
  const data = ctx.request.body;
  const res = await Signin.cancelMemSignin(data);
  ctx.success({ res }, 'cancelMemSignin finish!');
}

// 查询签到列表
async function queryMemSigninList(ctx) {
  const data = ctx.request.body;
  const res = await Signin.queryMemSigninList(data);
  ctx.success({ res }, 'queryMemSigninList finish!');
}

// 全部签到列表
async function getAllSigninList(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Signin.getAllSigninList(data, storeid);
  ctx.success({ res }, 'getAllSigninList finish!');
}

// 领手牌
async function leadingCard(ctx) {
  const data = ctx.request.body;
  const res = await Signin.leadingCard(data);
  ctx.success({ res }, 'leadingCard finish!');
}

// 还手牌
async function returnCard(ctx) {
  const data = ctx.request.body;
  const res = await Signin.returnCard(data);
  ctx.success({ res }, 'returnCard finish!');
}

const router = Router();
const routers = router
  .post('/memberConfirm', memberConfirm)
  .post('/memberSignin', memberSignin)
  .post('/cancelMemSignin', cancelMemSignin)
  .post('/queryMemSigninList', queryMemSigninList)
  .post('/leadingCard', leadingCard)
  .post('/returnCard', returnCard)
  .get('/', getAllSigninList);

module.exports = routers;
