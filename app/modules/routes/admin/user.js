
import Router from 'koa-router';
import * as User from 'modules/users';

async function register(ctx) {
  const data = ctx.request.body;
  const user = await User.register(data);
  ctx.success({ user: { id: user.uid, username: user.username } }, 'Register success!');
}

async function update(ctx) {
  const id = ctx.params.id;
  const data = ctx.request.body;
  const user = await User.updateUser(id, data);
  ctx.success({ user }, 'Update user success!');
}

async function listAll(ctx) {
  const users = await User.getUsers();
  ctx.success({ users }, 'List users success!');
}

async function deleteUser(ctx) {
  const id = ctx.params.id;
  const result = await User.deleteUser(id);
  ctx.success({ result }, 'Delete user success!');
}

const router = Router();
const routers = router
  .get('/', listAll)
  .post('/', register)
  .patch('/:id', update)
  .delete('/:id', deleteUser);
module.exports = routers;
