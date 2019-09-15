import Router from 'koa-router';
import * as EmployeeGroup from 'modules/employeegroup';

async function add(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await EmployeeGroup.add(data, storeid);
  ctx.success(ret, 'add finish!');
}

async function update(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await EmployeeGroup.update(data, storeid);
  ctx.success(ret, 'update finish!');
}

async function deleteR(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await EmployeeGroup.deleteR(data, storeid);
  ctx.success(ret, 'delete finish!');
}

async function query(ctx) {
  const storeid = ctx.headers.storeid;
  const employeeGroup = await EmployeeGroup.query(storeid);
  ctx.success({ employeeGroup }, 'query finish!');
}

const router = Router();
const routers = router
  .post('/add', add)
  .post('/update', update)
  .post('/delete', deleteR)
  .post('/query', query);

module.exports = routers;
