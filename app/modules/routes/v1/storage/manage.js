import Router from 'koa-router';
import * as Manage from 'modules/manage';
import { checkRole, checkSuperAdmin } from 'modules/middleware/checkpermission';

// 新增场馆
async function AddStore(ctx) {
  const data = ctx.request.body;
  const userInfo = ctx.userInfo;
  const res = await Manage.AddStore(data, userInfo);
  ctx.success({ res }, 'AddStore finish!');
}

// 编辑场馆
async function UpdateStore(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const res = await Manage.UpdateStore(data, storeid);
  ctx.success({ res }, 'UpdateStore finish!');
}

// 删除场馆
async function DeleteStore(ctx) {
  const storeid = ctx.request.body.storeid;
  const res = await Manage.DeleteStore(storeid);
  ctx.success({ res }, 'DeleteStore finish!');
}

// 查询场馆
async function QueryStore(ctx) {
  const storeid = ctx.headers.storeid;
  const res = await Manage.QueryStore(storeid);
  ctx.success({ res }, 'QueryStore finish!');
}

// 查询区域
async function QueryArea(ctx) {
  const data = ctx.request.body;
  const res = await Manage.queryArea(data);
  ctx.success({ res }, 'queryArea finish!');
}

// 查询所有场馆信息
async function QueryAllStores(ctx) {
  const res = await Manage.queryAllStores(ctx.userInfo.uid);
  ctx.success({ res }, 'queryAllStores finish!');
}

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

// // 请求list
// async function queryHWlist(ctx) {
//   const storeid = ctx.headers.storeid;
//   const res = await Manage.queryHWlist(storeid);
//   ctx.success({ res }, 'queryHWlist finish!');
// }

// // 更新硬件信息
// async function updateHardWare(ctx) {
//   const data = ctx.request.body;
//   const storeid = ctx.headers.storeid;
//   const res = await Manage.updateHardWare(data, storeid);
//   ctx.success({ res }, 'updateHardWare finish!');
// }

// // 查询硬件信息
// async function queryHardWare(ctx) {
//   const storeid = ctx.headers.storeid;
//   const res = await Manage.queryHardWare(storeid);
//   ctx.success({ res }, 'queryHardWare finish!');
// }

const router = Router();
const routers = router
  .post('/', checkSuperAdmin(), AddStore)
  .put('/:id', checkRole(), UpdateStore)
  .delete('/:id', checkRole(), DeleteStore)
  .get('/:id', checkRole(), QueryStore)
  .get('/area', checkRole(), QueryArea)
  .get('/', checkRole(), QueryAllStores)
  .post('/room', checkRole(), AddRoom)
  .put('/room/:id', checkRole(), UpdateRoom)
  .delete('/room:id', checkRole(), DelRoom)
  .get('/room/:id', checkRole(), QueryRoom)
  .get('/room', checkRole(), QueryAllRoom);
  // .post('/queryHWlist', checkRole(), queryHWlist)
  // .post('/updateHardWare', checkRole(), updateHardWare)
  // .post('/queryHardWare', checkRole(), queryHardWare);

module.exports = routers;
