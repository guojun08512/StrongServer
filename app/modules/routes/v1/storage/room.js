
import Router from 'koa-router';
import * as Manage from 'modules/manage';
import { checkRole } from 'modules/middleware/checkpermission';

// 增加场地
async function AddRoom(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Manage.addRoom(data, storeid);
  ctx.success({ res }, 'addRoom finish!');
}

// 更新场地
async function UpdateRoom(ctx) {
  const data = ctx.request.body;
  const res = await Manage.updateRoom(data);
  ctx.success({ res }, 'updateRoom finish!');
}

// 删除场地
async function DelRoom(ctx) {
  const data = ctx.request.body;
  const res = await Manage.delRoom(data);
  ctx.success({ res }, 'delRoom finish!');
}

// 查询场地信息
async function QueryRoom(ctx) {
  // const data = ctx.request.body;
  const uid = ctx.params.id;
  const res = await Manage.queryRoom(uid);
  ctx.success({ res }, 'queryRoom finish!');
}

// 查询场地信息
async function QueryAllRoom(ctx) {
  const storeid = ctx.headers.storeid;
  const res = await Manage.queryAllRoom(storeid);
  ctx.success({ res }, 'queryAllRoom finish!');
}

const router = Router();
const routers = router
  .post('/', checkRole(), AddRoom)
  .put('/:id', checkRole(), UpdateRoom)
  .delete('/:id', checkRole(), DelRoom)
  .get('/:id', checkRole(), QueryRoom)
  .get('/', checkRole(), QueryAllRoom);
  // .post('/queryHWlist', checkRole(), queryHWlist)
  // .post('/updateHardWare', checkRole(), updateHardWare)
  // .post('/queryHardWare', checkRole(), queryHardWare);

module.exports = routers;
