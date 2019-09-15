
import Router from 'koa-router';
import * as Search from 'modules/search';

// 管理员注册
async function searchData(ctx) {
  const data = ctx.request.body;
  const authorization = ctx.headers.authorization;
  const storeid = ctx.headers.storeid;
  const res = await Search.searchData(data.search, authorization, storeid);
  ctx.success({ res }, 'searchData finish!');
}

const router = Router();
const routers = router
  .post('/searchData', searchData);

module.exports = routers;
