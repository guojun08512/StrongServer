import Router from 'koa-router';
import * as Permissions from 'modules/permissions';

async function add(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Permissions.add(data, storeid);
  ctx.success(ret, 'addRole finish!');
}

async function update(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Permissions.update(data, storeid);
  ctx.success(ret, 'updateRole finish!');
}

async function deleteR(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Permissions.deleteRole(data, storeid);
  ctx.success(ret, 'deleteRole finish!');
}

async function query(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Permissions.queryRole(data, storeid);
  ctx.success(ret, 'queryRole finish!');
}

async function queryResource(ctx) {
  const data = ctx.request.body;
  const ret = await Permissions.queryResource(data);
  ctx.success(ret, 'queryResource finish!');
}

async function copy(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Permissions.copy(data, storeid);
  ctx.success(ret, 'copy finish!');
}

const router = Router();
const routers = router
  .post('/add', add)
  .post('/update', update)
  .post('/delete', deleteR)
  .post('/query', query)
  .post('/copy', copy)
  .post('/queryResource', queryResource);

module.exports = routers;

/*
  添加角色权限 permission/role/add  返回 true/false
  $required('name', data.name);   // 名称
  $required('owner', data.owner);  // 1教练 2工作人员
  data.auths [
    {
      resource:resource //  资源路径，字符串。 例如：'coach/'
      permissions:permissions  // 路径权限 数组。例如 ['add','update']
    }
  ]

  修改角色权限  permission/role/update  返回 true/false
  $required('roleId', data.roleId);
  data.name;
  data.auths [
    {
      resource:resource //  资源路径，字符串。 例如：'coach/'
      permissions:permissions  // 路径权限 数组。例如 ['add','update']
    }
  ]

  删除角色权限 permission/role/delete  返回 true/false
  $required('roleId', data.roleId);

  查询角色权限 permission/role/query  返回 { count: totalCount, data: allData }
  data.pageCount || 10;
  data.curPage || 1;

  查询角色所拥有的权限 permission/role/queryResource  返回  { resources, permissions}

  复制角色权限 role/copy  返回 true/false
  $required('name', data.name);   // 目标名称
  $required('roleId', data.roleId); //源id

*/
