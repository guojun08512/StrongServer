import Router from 'koa-router';
import * as Follow from 'modules/follow';

async function add(ctx) {
  const data = ctx.request.body;
  const ret = await Follow.add(data);
  ctx.success(ret, 'add finish!');
}

async function deleteFollow(ctx) {
  const data = ctx.request.body;
  const ret = await Follow.deleteF(data);
  ctx.success(ret, 'add finish!');
}

const router = Router();
const routers = router
  .post('/', add)
  .delete('/', deleteFollow);

module.exports = routers;
