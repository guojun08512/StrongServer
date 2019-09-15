// 预约体验

import Router from 'koa-router';
import * as Experience from 'modules/experience';

async function add(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Experience.add(data, storeid);
  ctx.success(ret, 'add finish!');
}

async function update(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Experience.update(data, storeid);
  ctx.success(ret, 'update finish!');
}

async function deleteR(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Experience.deleteR(data, storeid);
  ctx.success(ret, 'delete finish!');
}

async function query(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Experience.getAllData(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function enter(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Experience.enter(data, storeid);
  ctx.success(ret, 'enter finish!');
}

async function leave(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Experience.leave(data, storeid);
  ctx.success(ret, 'leave finish!');
}

async function cancel(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Experience.cancel(data, storeid);
  ctx.success(ret, 'cancel finish!');
}

const router = Router();
const routers = router
  .post('/add', add)
  .post('/update', update)
  .post('/delete', deleteR)
  .post('/query', query)
  .post('/enter', enter)
  .post('/leave', leave)
  .post('/cancel', cancel);

module.exports = routers;

/*
到店预约添加 v1/experience/add
  name    //名字
  phone   //电话
  employeeId   //员工id
  remark       //备注， 可选

到店预约更新 v1/experience/update
  id      //
  name    //名字
  phone   //电话
  employeeId   //员工id
  remark       //备注， 可选

到店预约删除 v1/experience/delete
  id      //

到店预约查询 v1/experience/query. { count: totalCount, result: alldata }
  pageCount     //个数   可选
  curPage       //页号   可选
  name          //姓名   可选
  employeeId    //员工id  可选
  ordertime     //预约时间


进入体验 v1/experience/enter
   id      //

离开体验 v1/experience/leave
   id      //

取消体验 v1/experience/cancel
   id      //


今日到店体验人数： v1/experience/getTodayCount. 返回：数量

*/
