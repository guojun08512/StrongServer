import Router from 'koa-router';
import * as Import from 'modules/import';

const multiparty = require('koa2-multiparty');

// 数据导入
async function importData(ctx) {
  const path = ctx.req.files.file.path;
  const storeid = ctx.headers.storeid;
  const res = await Import.importData(path, storeid);
  ctx.success({ res }, 'importData finish!');
}

const router = Router();
const routers = router
  .post('/importData', multiparty(), importData);

module.exports = routers;
