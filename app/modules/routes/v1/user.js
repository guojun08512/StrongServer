
import Router from 'koa-router';
import * as User from 'modules/users';

async function authenticate(ctx) {
  const data = ctx.request.body;
  const username = data.username;
  const password = data.password;
  const userinfo = await User.authenticate(username, password);
  ctx.success({ ...userinfo }, 'Authenticate success!');
}

async function update(ctx) {
  const id = ctx.userInfo.uid;
  const data = ctx.request.body;
  const user = await User.updateUser(id, data);
  delete user.password;
  ctx.success({ user }, 'Update user success!');
}

const router = Router();
const routers = router
  .post('/login', authenticate)
  .patch('/', update);

module.exports = routers;
