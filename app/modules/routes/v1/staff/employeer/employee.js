import Router from 'koa-router';
import * as Employee from 'modules/employee';

async function add(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Employee.add(data, storeid);
  ctx.success(ret, 'add finish!');
}

async function update(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Employee.update(data, storeid);
  ctx.success(ret, 'update finish!');
}

async function deleteR(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Employee.deleteR(data, storeid);
  ctx.success(ret, 'delete finish!');
}

async function resumeOffice(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Employee.resumeOffice(data, storeid);
  ctx.success(ret, 'resumeOffice finish!');
}


async function query(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Employee.getAllEmployee(data, storeid);
  ctx.success(ret, 'query finish!');
}

async function employeeInfo(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const authorization = ctx.headers.authorization;
  const ret = await Employee.getEmployeeInfo(data, storeid, authorization);
  ctx.success(ret, 'query finish!');
}

async function AdminPositionUpdate(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Employee.AdminPositionUpdate(data, storeid);
  ctx.success(ret, 'update finish!');
}

/*
async function positionAdd(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Employee.positionAdd(data, storeid);
  ctx.success(ret, 'add finish!');
}


async function positionDelete(ctx) {
  const data = ctx.request.body;
  const storeid = ctx.headers.storeid;
  const ret = await Employee.positionDelete(data, storeid);
  ctx.success(ret, 'delete finish!');
}
*/
async function positionQuery(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await Employee.positionQuery(storeid);
  ctx.success(ret, 'query finish!');
}


async function queryEmployeeAndCoach(ctx) {
  const storeid = ctx.headers.storeid;
  const ret = await Employee.queryEmployeeAndCoach(storeid);
  ctx.success(ret, 'query finish!');
}

const router = Router();
const routers = router
  .post('/', add)
  .put('/', update)
  .delete('/', deleteR)
  .post('/resumeOffice', resumeOffice)
  .get('/', query)
  .get('/queryinfo', employeeInfo)
  .get('/positionquery', positionQuery)
  .put('/adminPositionUpdate', AdminPositionUpdate)
  .get('/queryEmployeeAndCoach', queryEmployeeAndCoach);

  // .post('/positionadd', positionAdd)
  //
  // .post('/positiondelete', positionDelete)


module.exports = routers;

/*
  查询 employee/queryinfo  返回 { count: totalCount, employees: allEmployee }
  pageCount   // 页数
  curPage     // 页码
  groupId     // 分类
  position    // 职位
  id          // 人员id, employee id
  uid         // pdmemberid
  name        // 名字
  phone       // 电话
  leaveOffice  // true 查询离职  false查询在职

  查询工作人员与教练 employee/queryEmployeeAndCoach  返回 [ {id,name,isCoach,cellphone} ]

  添加 employee/add  返回 true/false
  $required('name', data.name);   //姓名
  $required('sex', data.sex);     // 性别 1男 2女
  $required('cellphone', data.cellphone); //电话
  $required('position', data.position);  //职位

  更新 employee/update  返回 true/false
  $required('id', data.id);      // 工作人员id
  $required('name', data.name);       //姓名
  $required('sex', data.sex);         // 性别 1男 2女
  $required('cellphone', data.cellphone); //电话
  $required('position', data.position); //职位

  删除/离职 employee/delete  返回 true/false
  $required('id', data.id);      // 工作人员id

  恢复 employee/resumeOffice  返回 true/false
  $required('id', data.id);      // 工作人员id

  管理员权限修改 employee/AdminPositionUpdate
  $required('employeeId', data.employeeId);  // 新ADMIN工作人员id
  $required('positon', data.positon);        // 原ADMIN工作人员的新职位


*/
