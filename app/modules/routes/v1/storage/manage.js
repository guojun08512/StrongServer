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
  const storeID = ctx.params.id;
  const res = await Manage.DeleteStore(storeID);
  ctx.success({ res }, 'DeleteStore finish!');
}

// 查询场馆
async function QueryStore(ctx) {
  const storeid = ctx.headers.storeid;
  const res = await Manage.QueryStore(storeid);
  ctx.success({ res }, 'QueryStore finish!');
}

// 查询all场馆
async function QueryAllStore(ctx) {
  const res = await Manage.queryAllStores(ctx.userInfo.uid);
  ctx.success({ res }, 'QueryStore finish!');
}

// 查询区域
async function QueryArea(ctx) {
  const parentID = ctx.params.parentID;
  const res = await Manage.queryArea(parentID);
  ctx.success({ res }, 'queryArea finish!');
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
  .get('/', checkRole(), QueryAllStore)
  .get('/area/:parentID', checkRole(), QueryArea);
  // .post('/queryHWlist', checkRole(), queryHWlist)
  // .post('/updateHardWare', checkRole(), updateHardWare)
  // .post('/queryHardWare', checkRole(), queryHardWare);

module.exports = routers;
