import Router from 'koa-router';
import * as Login from 'modules/services/app/login';

async function GetCode(ctx) {
  const data = ctx.request.body;
  const result = await Login.GetCode(data);
  ctx.success(result, 'GetCode finish!');
}

async function Connect(ctx) {
  const data = ctx.request.body;
  const result = await Login.Connect(data);
  ctx.success(result, 'Connect finish!');
}

async function WxLogin(ctx) {
  const data = ctx.request.body;
  const result = await Login.WxLogin(data);
  ctx.success(result, 'WxLogin finish!');
}

async function WxBindPhone(ctx) {
  const data = ctx.request.body;
  const result = await Login.WxBindPhone(data);
  ctx.success(result, 'WxBindPhone finish!');
}

const router = Router();
const routers = router
  .post('/GetCode', GetCode)
  .post('/Connect', Connect)
  .post('/WxLogin', WxLogin)
  .post('/WxBindPhone', WxBindPhone);

module.exports = routers;
