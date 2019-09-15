
import Router from 'koa-router';
import config from 'modules/config';
import { checkSuperAdmin } from 'modules/middleware/checkpermission';
import apiV1 from './v1';
import adminApi from './admin';

const router = Router();

router.use('/v1', apiV1.routes(), apiV1.allowedMethods());
router.use('/admin', checkSuperAdmin(), adminApi.routes(), adminApi.allowedMethods());

router.get('/version', async (ctx) => {
  ctx.success({}, `node server version: ${config.get('VERSION')}`);
});

/*
// 清理缓存方法
function cleanCache(modulePath) {
  const module = require.cache[modulePath];
  // remove reference in module.parent
  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(module), 1); // 释放老模块的资源
  }
  require.cache[modulePath] = null; // 缓存置空
}
router.post('/hothot', async (ctx) => {
  // console.log(require.resolve('modules/config'));
  cleanCache(require.resolve('modules/config/config')); // 清除该路径模块的缓存
  try {
    require('modules/config/config'); // eslint-disable-line
  } catch (ex) {
    console.error('module update failed');
  }
  ctx.success(true, `node server version: ${config.get('VERSION')}`);
});
*/
module.exports = router;
