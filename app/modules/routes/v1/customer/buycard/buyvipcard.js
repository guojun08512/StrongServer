import Router from 'koa-router';
import * as BuyVipCard from 'modules/buyvipcard';

// 会员购买会员卡
async function MemberBuyVipCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.MemberBuyVipCard(data);
  ctx.success({ res }, 'MemberBuyVipCard success!');
}

// 会员购买私教课
async function MemberBuyPrivate(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.MemberBuyPrivate(data);
  ctx.success({ res }, 'MemberBuyPrivate success!');
}

// 查询所有会员卡
async function QueryAllBVCard(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await BuyVipCard.QueryAllBVCard(data, storeid);
  ctx.success({ res }, 'QueryAllBVCard success!');
}

// 查询所有私教课
async function QueryAllBPCard(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await BuyVipCard.QueryAllBPCard(data, storeid);
  ctx.success({ res }, 'QueryAllBPCard success!');
}

// 赠送会员卡体验卡
async function GiveExperienceCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.GiveExperienceCard(data);
  ctx.success({ res }, 'GiveExperienceCard success!');
}

// 赠送私教课体验卡
async function GivePrivateCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.GivePrivateCard(data);
  ctx.success({ res }, 'GivePrivateCard success!');
}

// 编辑会员卡
async function EditVipCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.EditVipCard(data);
  ctx.success({ res }, 'EditVipCard success!');
}

// 编辑私教课
async function EditPrivateCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.EditPrivateCard(data);
  ctx.success({ res }, 'EditPrivateCard success!');
}

// 续卡
async function RenewalCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.RenewalCard(data);
  ctx.success({ res }, 'RenewalCard!');
}

// 续私教
async function RenewalPrivate(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.RenewalPrivate(data);
  ctx.success({ res }, 'RenewalPrivate!');
}

// 扣费
async function ChargeCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.ChargeCard(data);
  ctx.success({ res }, 'ChargeCard!');
}

// 停卡
async function StopCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.StopCard(data);
  ctx.success({ res }, 'StopCard!');
}

// 停卡恢复
async function RecoveryCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.RecoveryCard(data);
  ctx.success({ res }, 'RecoveryCard!');
}

// 转卡
async function TransferCard(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await BuyVipCard.TransferCard(data, storeid);
  ctx.success({ res }, 'TransferCard!');
}

// 请假
async function LeaveCard(ctx) {
  const data = ctx.request.body;
  const res = await BuyVipCard.LeaveCard(data);
  ctx.success({ res }, 'LeaveCard!');
}

// 全部会员
async function queryAllMembers(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const allMembers = await BuyVipCard.queryAllMembers(data, authorization, storeid);
  ctx.success({ allMembers }, 'queryAllMembers success!');
}

// 有效会员
async function queryEffective(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const allMembers = await BuyVipCard.queryEffective(data, storeid);
  ctx.success({ allMembers }, 'queryEffective success!');
}

// 潜在会员
async function queryPotential(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const allMembers = await BuyVipCard.queryPotential(data, storeid);
  ctx.success({ allMembers }, 'queryPotential success!');
}

// 过期会员
async function expiredMember(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const allMembers = await BuyVipCard.expiredMember(data, storeid);
  ctx.success({ allMembers }, 'expiredMember success!');
}

// 体验卡会员
async function experienceMember(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const allMembers = await BuyVipCard.experienceMember(data, storeid);
  ctx.success({ allMembers }, 'experienceMember success!');
}

// 耗尽会员
async function depletedMember(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const allMembers = await BuyVipCard.depletedMember(data, authorization, storeid);
  ctx.success({ allMembers }, 'depletedMember success!');
}

// 销卡会员
async function pincardMember(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const allMembers = await BuyVipCard.pincardMember(data, authorization, storeid);
  ctx.success({ allMembers }, 'pincardMember success!');
}

// 租柜会员
async function cabinetMember(ctx) {
  const info = await BuyVipCard.cabinetMember();
  ctx.success({ info }, 'success!');
}

// 过期会员
async function leaveMember(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const info = await BuyVipCard.leaveMember(data, storeid);
  ctx.success({ info }, 'leaveMember success!');
}

// 近期到期
async function nearFutureCard(ctx) {
  const data = ctx.request.body;
  const info = await BuyVipCard.nearFutureCard(data);
  ctx.success({ info }, 'success!');
}

// 次数耗尽
async function frequencyCard(ctx) {
  const data = ctx.request.body;
  const info = await BuyVipCard.frequencyCard(data);
  ctx.success({ info }, 'success!');
}

// 金额耗尽
async function balanceDeplete(ctx) {
  const data = ctx.request.body;
  const info = await BuyVipCard.balanceDeplete(data);
  ctx.success({ info }, 'success!');
}

// 生日提醒
async function birthdayReminding(ctx) {
  const data = ctx.request.body;
  const info = await BuyVipCard.birthdayReminding(data);
  ctx.success({ info }, 'success!');
}

const router = Router();
const routers = router
  .post('/MemberBuyVipCard', MemberBuyVipCard)
  .post('/MemberBuyPrivate', MemberBuyPrivate)
  .get('/QueryAllBVCard', QueryAllBVCard)
  .get('/QueryAllBPCard', QueryAllBPCard)
  .post('/GiveExperienceCard', GiveExperienceCard)
  .post('/GivePrivateCard', GivePrivateCard)
  .post('/EditVipCard', EditVipCard)
  .post('/EditPrivateCard', EditPrivateCard)
  .post('/RenewalCard', RenewalCard)
  .post('/RenewalPrivate', RenewalPrivate)
  .post('/ChargeCard', ChargeCard)
  .put('/StopCard', StopCard)
  .post('/RecoveryCard', RecoveryCard)
  .post('/TransferCard', TransferCard)
  .post('/LeaveCard', LeaveCard)
  .get('/queryAllMembers', queryAllMembers)
  .get('/queryEffective', queryEffective)
  .get('/queryPotential', queryPotential)
  .post('/expiredMember', expiredMember)
  .post('/experienceMember', experienceMember)
  .post('/depletedMember', depletedMember)
  .post('/cabinetMember', cabinetMember)
  .post('/leaveMember', leaveMember)
  .post('/nearFutureCard', nearFutureCard)
  .post('/frequencyCard', frequencyCard)
  .post('/balanceDeplete', balanceDeplete)
  .post('/birthdayReminding', birthdayReminding)
  .post('/pincardMember', pincardMember);

module.exports = routers;
