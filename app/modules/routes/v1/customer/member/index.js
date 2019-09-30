import Router from 'koa-router';
import * as Member from 'modules/members';

// 注册会员
async function registerMember(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Member.registerMember(data, storeid);
  ctx.success({ res }, 'registerMember finish!');
}

// 修改会员信息
async function updateMember(ctx) {
  const data = ctx.request.body;
  const res = await Member.updateMember({ memberid: ctx.params.id, ...data });
  ctx.success({ res }, 'updateMember finish!');
}

// 删除会员
async function deleteMember(ctx) {
  const data = ctx.request.body;
  const res = await Member.deleteMember(data);
  ctx.success({ res }, 'deleteMember finish!');
}

// 查询会员信息
async function queryMemberInfo(ctx) {
  const memberID = ctx.params.memberID;
  const res = await Member.queryMemberInfo(memberID);
  ctx.success({ res }, 'queryMemberInfo finish!');
}

// 押金插入
async function insertDeposit(ctx) {
  const data = ctx.request.body;
  const res = await Member.insertDeposit(data);
  ctx.success({ res }, 'insertDeposit finish!');
}

// 定金插入
async function insertEarnest(ctx) {
  const data = ctx.request.body;
  const res = await Member.InsertEarnest(data);
  ctx.success({ res }, 'insertEarnest finish!');
}

// 押金查询
async function queryDeposit(ctx) {
  const data = ctx.request.body;
  const res = await Member.queryDeposit(data);
  ctx.success({ res }, 'queryDeposit finish!');
}

// 押金查询
async function queryEarnest(ctx) {
  const data = ctx.request.body;
  const res = await Member.queryEarnest({ memberid: ctx.params.id, ...data });
  ctx.success({ res }, 'queryEarnest finish!');
}

// 押金退钱
async function deleteDeposit(ctx) {
  const data = ctx.request.body;
  const res = await Member.deleteDeposit(data);
  ctx.success({ res }, 'deleteDeposit finish!');
}

// 定金退钱
async function deleteEarnest(ctx) {
  const data = ctx.request.body;
  const res = await Member.deleteEarnest(data);
  ctx.success({ res }, 'deleteEarnest finish!');
}

// 查询所有押金
async function getAllDeposits(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Member.getAllDeposits(data, storeid);
  ctx.success({ res }, 'getAllDeposits finish!');
}

// 查询所有定金
async function getAllEarnests(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Member.getAllEarnests(data, storeid);
  ctx.success({ res }, 'getAllEarnests finish!');
}

// 租租柜
async function insertCabinets(ctx) {
  const data = ctx.request.body;
  const res = await Member.insertCabinets(data);
  ctx.success({ res }, 'insertCabinets finish!');
}

// 租柜查询
async function queryCabinets(ctx) {
  const data = ctx.request.body;
  const res = await Member.queryCabinets({ memberid: ctx.params.id, ...data });
  ctx.success({ res }, 'queryCabinets finish!');
}

// 退租柜
async function deleteCabinets(ctx) {
  const data = ctx.request.body;
  const res = await Member.deleteCabinets(data);
  ctx.success({ res }, 'deleteCabinets finish!');
}

// 绑定RFID
async function updateRfid(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Member.updateRfid(data, storeid);
  ctx.success({ res }, 'updateRfid finish!');
}

// 写提醒
async function updateNotifyMsg(ctx) {
  const data = ctx.request.body;
  const res = await Member.updateNotifyMsg(data);
  ctx.success({ res }, 'updateNotifyMsg finish!');
}

// 改变积分
async function updateIntegral(ctx) {
  const data = ctx.request.body;
  const res = await Member.updateIntegral(data);
  ctx.success({ res }, 'updateIntegral finish!');
}

// 近30天训练频率  没有
async function trainingfrequency(ctx) {
  const data = ctx.request.body;
  const res = await Member.trainingfrequency(data);
  ctx.success({ res }, 'trainingfrequency finish!');
}

// 训练时长 没有
async function longTrainingTime(ctx) {
  const data = ctx.request.body;
  const res = await Member.longTrainingTime(data);
  ctx.success({ res }, 'longTrainingTime finish!');
}

// 健身日历  没有
async function fitnessCalendar(ctx) {
  const data = ctx.request.body;
  const res = await Member.fitnessCalendar(data);
  ctx.success({ res }, 'fitnessCalendar finish!');
}

// 获取会员列表
async function getAllMembers(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const allMembers = await Member.getAllMembers(data, storeid);
  ctx.success({ allMembers }, 'getAllMembers finish!');
}

// 会员拥有的会员卡列表
async function queryMemberVipCard(ctx) {
  const data = ctx.request.body;
  const res = await Member.queryMemberVipCard(data);
  ctx.success({ res }, 'queryMemberVipCard finish!');
}

// 会员拥有的私教课列表
async function queryMemberPrivate(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Member.queryMemberPrivate(data, storeid);
  ctx.success({ res }, 'queryMemberPrivate finish!');
}

// 合同订单
async function queryOrderList(ctx) {
  const data = ctx.request.body;
  const res = await Member.queryOrderList(data);
  ctx.success({ res }, 'queryOrderList finish!');
}

// 训练记录
async function querySigninList(ctx) {
  const data = ctx.request.body;
  const res = await Member.querySigninList(data);
  ctx.success({ res }, 'querySigninList finish!');
}

// 跟进记录
async function queryFollowList(ctx) {
  const data = ctx.request.body;
  const res = await Member.queryFollowList(data);
  ctx.success({ res }, 'queryFollowList finish!');
}

// 跟进记录
async function addWaterRate(ctx) {
  const data = ctx.request.body;
  const res = await Member.addWaterRate(data);
  ctx.success({ res }, 'addWaterRate finish!');
}

const router = Router();
const routers = router
  .post('/', registerMember)
  .put('/:id', updateMember)
  .delete('/', deleteMember)
  .get('/', getAllMembers)
  .get('/:id', queryMemberInfo)
  .post('/deposit', insertDeposit)
  .post('/earnest', insertEarnest)
  .get('/deposit/:id', queryDeposit)
  .get('/earnest/:id', queryEarnest)
  .delete('/deposit', deleteDeposit)
  .delete('/earnest', deleteEarnest)
  .get('/deposit', getAllDeposits)
  .get('/earnest', getAllEarnests)
  .post('/cabinets', insertCabinets)
  .get('/cabinets', queryCabinets)
  .delete('/cabinets', deleteCabinets)
  .put('/rfid', updateRfid)
  .put('/notify', updateNotifyMsg)
  .put('/integral', updateIntegral)
  .post('/trainingFrequency', trainingfrequency)
  .post('/longTrainingTime', longTrainingTime)
  .post('/fitnessCalendar', fitnessCalendar)
  .get('/memberVipCard', queryMemberVipCard)
  .get('/memberPrivate', queryMemberPrivate)
  .get('/orderList', queryOrderList)
  .get('/signList', querySigninList)
  .get('/followList', queryFollowList)
  .post('/waterRate', addWaterRate);

module.exports = routers;
