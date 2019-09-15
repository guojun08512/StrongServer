import Router from 'koa-router';
import * as HardDriver from 'modules/harddriver';

// 门禁 密码
async function pwDoor(ctx) {
  const data = ctx.request.body;
  const res = await HardDriver.pwDoor(data);
  ctx.success({ res }, 'pwDoor finish!');
}

// 门禁 手牌号
async function RfidDoor(ctx) {
  const data = ctx.request.body;
  const res = await HardDriver.RfidDoor(data);
  ctx.success({ res }, 'RfidDoor finish!');
}

// 智能柜
async function cabinet(ctx) {
  const data = ctx.request.body;
  const res = await HardDriver.cabinet(data);
  ctx.success({ res }, 'cabinet finish!');
}

// 淋浴门禁
async function showerAc(ctx) {
  const data = ctx.request.body;
  const res = await HardDriver.showerAc(data);
  ctx.success({ res }, 'showerAc finish!');
}

// 淋浴鉴权
async function showerAuth(ctx) {
  const data = ctx.request.body;
  const res = await HardDriver.showerAuth(data);
  ctx.success({ res }, 'showerAuth finish!');
}

// 淋浴上报
async function showerReport(ctx) {
  const data = ctx.request.body;
  const res = await HardDriver.showerReport(data);
  ctx.success({ res }, 'showerReport finish!');
}


const router = Router();
const routers = router
  .post('/pwDoor', pwDoor)
  .post('/RfidDoor', RfidDoor)
  .post('/cabinet', cabinet)
  .post('/showerAc', showerAc)
  .post('/showerAuth', showerAuth)
  .post('/showerReport', showerReport);

module.exports = routers;
