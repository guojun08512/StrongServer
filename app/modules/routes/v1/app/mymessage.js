import Router from 'koa-router';
import * as MyInformation from 'modules/services/app/mymessage';

async function QueryMyInformation(ctx) {
  const userid = ctx.userInfo.uid;
  const res = await MyInformation.QueryMyInformation(userid);
  ctx.success({ res }, 'QueryMyInformation finish!');
}

async function SetupMyInformation(ctx) {
  const data = ctx.request.body;
  const userid = ctx.userInfo.uid;
  const res = await MyInformation.SetupMyInformation(data, userid);
  ctx.success({ res }, 'SetupMyInformation finish!');
}

async function QueryMyCourse(ctx) {
  const data = ctx.request.body;
  const userid = ctx.userInfo.uid;
  const res = await MyInformation.QueryMyCourse(data, userid);
  ctx.success({ res }, 'QueryMyCourse finish!');
}

async function QueryOrderGroup(ctx) {
  const data = ctx.request.body;
  const userid = ctx.userInfo.uid;
  const res = await MyInformation.QueryOrderGroup(data, userid);
  ctx.success({ res }, 'QueryOrderGroup finish!');
}

async function OrderCoach(ctx) {
  const data = ctx.request.body;
  const userid = ctx.userInfo.uid;
  const res = await MyInformation.OrderCoach(data, userid);
  ctx.success({ res }, 'OrderCoach finish!');
}

async function QueryMyCourseStatus(ctx) {
  const data = ctx.request.body;
  const uid = ctx.userInfo.uid;
  const res = await MyInformation.QueryMyCourseStatus(data, uid);
  ctx.success({ res }, 'QueryMyCourseStatus finish!');
}

async function DeleteOrderCoach(ctx) {
  const data = ctx.request.body;
  const res = await MyInformation.DeleteOrderCoach(data);
  ctx.success({ res }, 'DeleteOrderCoach finish!');
}

async function DeleteLeague(ctx) {
  const data = ctx.request.body;
  const uid = ctx.userInfo.uid;
  const res = await MyInformation.DeleteLeague(data, uid);
  ctx.success({ res }, 'DeleteLeague finish!');
}

async function Evaluate(ctx) {
  const data = ctx.request.body;
  const res = await MyInformation.Evaluate(data);
  ctx.success({ res }, 'Evaluate finish!');
}

async function QueryEvaluate(ctx) {
  const data = ctx.request.body;
  const res = await MyInformation.QueryEvaluate(data);
  ctx.success({ res }, 'QueryEvaluate finish!');
}

const router = Router();
const routers = router
  .post('/QueryMyInformation', QueryMyInformation)
  .post('/SetupMyInformation', SetupMyInformation)
  .post('/QueryMyCourse', QueryMyCourse)
  .post('/QueryOrderGroup', QueryOrderGroup)
  .post('/OrderCoach', OrderCoach)
  .post('/QueryMyCourseStatus', QueryMyCourseStatus)
  .post('/DeleteOrderCoach', DeleteOrderCoach)
  .post('/DeleteLeague', DeleteLeague)
  .post('/Evaluate', Evaluate)
  .post('/QueryEvaluate', QueryEvaluate);

module.exports = routers;
