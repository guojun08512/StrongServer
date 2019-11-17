import models from 'modules/db/models';
import ERROR, { $required } from 'modules/utils';
import { register } from 'modules/users/user';
import acl from 'modules/acl';
import Sequelize from 'modules/db/sequelize';
import * as Search from 'modules/search';

const NameLengthMin = 2;
const NameLengthMax = 24;
// 手机号正则
const phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;

export const add = async (data, storeid) => {
  $required('name', data.name);
  $required('sex', data.sex);
  $required('cellphone', data.cellphone);
  $required('position', data.position);
  $required('storeid', storeid);

  const name = data.name;
  const sex = parseInt(data.sex, 10);
  const cellphone = data.cellphone;
  const isMember = data.isMember || 0;
  const groupId = data.groupId || 0;
  const position = data.position;
  const dataAuth = data.dataAuth || 0;
  let images = null;
  if (data.images) {
    images = JSON.stringify(data.images);
  }

  // let ret = 0;
  if (name.length < NameLengthMin || NameLengthMax < name.length) {
    return ERROR.nameInvalid(' 长度限制.');
  }

  if (sex !== 1 && sex !== 2) {
    return ERROR.sexInvalid();
  }

  if (!phoneReg.test(cellphone)) {
    return ERROR.phoneInvalid();
  }

  const roleInfo = await models.RoleMap.findOne({
    where: {
      uid: position,
      storeid,
      owner: 2,
      isAdmin: 0,
    },
  });

  if (!roleInfo) {
    return ERROR.employeePosition(' 职位错误 ');
  }

  const pdmembers = await models.PDMember.findOrCreate({
    where: {
      cellphone,
    },
    defaults: {
      username: name,
      cellphone,
      sex,
      idcard: '',
      birthday: '',
    },
  });
  if (!pdmembers || !pdmembers[0]) return ERROR.employeeError(' 创建 pdmember 失败.');
  const pdmember = pdmembers[0];
  // console.log('pdmember', pdmember);
  const cnt = await models.Employee.count({ where: { pdmemberid: pdmember.uid, storeid } });
  if (cnt > 0) {
    return ERROR.employeeError(' 员工已存在.');
  }

  // console.log('pdmember.uid', pdmember.uid);
  // 手机号作为登陆名
  const loginname = cellphone;
  let user = await models.User.findOne({ where: { username: loginname } });
  const role = `${roleInfo.name}_${roleInfo.uid}`;
  if (!user) {
    const uinfo =
    {
      username: loginname,
      password: loginname,
      role,
    };

    user = await register(uinfo);
  }
  // console.log('pdmember.uid', pdmember.uid);
  const retdata = await Sequelize.transaction(t => models.UserMap.create({
    userid: user.uid,
    storeid,
    rolename: role,
  }, {
    transaction: t,
  }).then((uInfo) => {
    if (!uInfo) throw new Error();
    return models.Employee.create({
      name,
      sex,
      cellphone,
      isMember,
      groupId,
      position,
      dataAuth,
      storeid,
      pdmemberid: pdmember.uid,
      userid: user.uid,
      images,
    }, {
      transaction: t,
    });
  })).then((result) => {
    if (!result) throw new Error();
    return true;
  }).catch(() => false);

  if (!retdata) {
    return ERROR.employeeCreateFail();
  }

  await acl.createAcl().addUserRoles(user.uid, [position]);

  return true;
};

export const update = async (data, storeid) => {
  $required('id', data.id);
  $required('name', data.name);
  $required('sex', data.sex);
  $required('cellphone', data.cellphone);
  // $required('isMember', data.isMember);
  // $required('groupId', data.groupId);
  $required('position', data.position);
  // $required('dataAuth', data.dataAuth);

  const id = data.id;
  const name = data.name;
  const sex = parseInt(data.sex, 10);
  const phone = data.cellphone;
  const isMember = data.isMember || 0;
  const groupId = data.groupId;
  const position = data.position; // array
  const dataAuth = data.dataAuth;
  let images = null;
  if (data.images) {
    images = JSON.stringify(data.images);
  }

  // let ret = 0;
  if (name.length < NameLengthMin || NameLengthMax < name.length) {
    return ERROR.nameInvalid(' 长度限制.');
  }

  if (sex !== 1 && sex !== 2) {
    return ERROR.sexInvalid();
  }

  if (!phoneReg.test(phone)) {
    return ERROR.phoneInvalid();
  }


  const posList = await models.RoleMap.findAll({
    where: {
      uid: position,
      storeid,
      owner: 2,
      isAdmin: 0,
    },
  });

  if (!posList) {
    return ERROR.employeePosition(' 职位错误 ');
  }

  const employeeInfo = await models.Employee.findOne({ where: { id } });
  if (!employeeInfo) {
    return ERROR.employeeCreateFail(' 不存在 ');
  }

  const existed = await acl.createAcl().hasRole(employeeInfo.userid, position);
  if (!existed) {
    await acl.createAcl().removeUserRoles(employeeInfo.userid, [employeeInfo.position]);
    await acl.createAcl().addUserRoles(employeeInfo.userid, [position]);
  }

  const retdata = await models.Employee.update({
    name, sex, cellphone: phone, isMember, groupId, position, dataAuth, images,
  }, { where: { id, storeid } });
  if (!retdata) {
    return ERROR.employeeCreateFail();
  }
  return true;
};

export const deleteR = async (data, storeid) => {
  $required('id', data.id);
  const id = data.id;

  let ret = await models.Employee.findOne({ where: { id, storeid } });

  if (ret.position === 'ADMIN') {
    return ERROR.employeeError(' 管理员不可删除.');
  }

  const userid = ret.userid;
  const position = ret.position;

  ret = await models.Employee.update({ deleted: true }, { where: { id, storeid } });
  if (!ret || ret[0] < 1) {
    return false;
  }

  if (userid) {
    await acl.createAcl().removeUserRoles(userid, [position]);
  }

  return true;
};

export const resumeOffice = async (data, storeid) => {
  $required('id', data.id);
  const id = data.id;

  const ret = await models.Employee.scope({ method: ['scopeFunction', { id, storeid }] }).update({ deleted: false });
  if (!ret || ret[0] < 1) {
    return false;
  }

  const einfo = await models.Employee.findOne({ where: { id, storeid } });
  if (einfo && einfo.userid) {
    await acl.createAcl().addUserRoles(einfo.userid, [einfo.position]);
  }

  return true;
};

export const getAllEmployee = async (data, storeid) => {
  const allEmployee = await models.Employee.findAll({ where: { storeid } });
  return allEmployee;
};

export const getEmployeeInfo = async (data, storeid, authorization) => {
  const pageCount = parseInt(data.pageCount, 10) || 10;
  const curPage = parseInt(data.curPage, 10) || 1;
  // const groupId = parseInt(data.groupId, 10) || 0;
  const position = parseInt(data.position, 10) || 0;
  // const name = data.name;
  let leaveOffice = data.leaveOffice || false;
  if (!leaveOffice || leaveOffice === 'false') leaveOffice = false;
  if (leaveOffice) leaveOffice = true;

  const where = { storeid, deleted: leaveOffice };

  const uid = data.uid;
  if (uid) {
    where.pdmemberid = uid;
  } else if (data.name || data.phone) {
    const searchAllInfo = await Search.searchAllData(data.name || data.phone, authorization);
    if (searchAllInfo === null) {
      return ERROR.employeeError('员工不存在!');
    }
    const hitInfo = searchAllInfo.hitInfo;
    where.pdmemberid = {
      $in: hitInfo,
    };
  }

  // if (name) {
  // where.name = { like: `%${name}%` };
  // }
  // if (groupId > 0) { where.groupId = groupId; }
  if (data.id && data.id.length > 0) { where.id = data.id; }
  if (position) { where.position = position; }

  // const totalCount = await models.Employee.count({ where });
  const totalCount = await models.Employee.scope({ method: ['scopeFunction', where] }).count();
  // console.log(pageCount, curPage);

  const allEmployee = await models.Employee.scope({ method: ['scopeFunction', where] }).findAll({
    limit: pageCount + 0,
    offset: (curPage - 1) * pageCount,
  });

  if (!allEmployee) { return { count: 0, employees: {} }; }

  const retdata = [];
  for (let i = 0; i < allEmployee.length; i += 1) {
    const item = allEmployee[i].toJSON();
    const posinfo = await models.RoleMap.findOne({ where: { uid: item.position } });
    if (posinfo) {
      item.positionname = posinfo.name;
    }
    item.images = (item.images && JSON.parse(item.images)) || [];
    retdata.push(item);
  }
  // console.log({ count: totalCount, employees: retdata });
  return { count: totalCount, employees: retdata };
};

/** ************************** Position ****************************** */
export const positionAdd = async (data, storeid) => {
  $required('name', data.name);
  const name = data.name;
  let ret = 0;
  if (name.length < NameLengthMin || NameLengthMax < name.length) { return ERROR.nameInvalid('长度限制.'); }
  ret = await models.EmployeePosition.count({ where: { name, storeid } });
  if (ret > 0) {
    return ERROR.nameInvalid('名字已存在.');
  }
  const retdata = await models.EmployeePosition.create({ name, storeid });
  if (!retdata) {
    return false;
  }
  return true;
};

export const AdminPositionUpdate = async (data, storeid) => {
  $required('employeeId', data.employeeId);
  $required('positon', data.positon);
  const employeeId = data.employeeId;
  const adminPosInfo = await models.RoleMap.findOne({
    where: {
      name: 'ADMIN',
      storeid,
      owner: 2,
      isAdmin: 1,
    },
  });
  if (!adminPosInfo) return false;
  if (adminPosInfo.uid === data.positon) {
    return false;
  }
  const employeInfo = await models.Employee.findOne({
    where: {
      id: employeeId,
      storeid,
    },
  });
  if (!employeInfo) return false;
  const AdminEmployeeInfo = await models.Employee.findOne({
    where: {
      position: adminPosInfo.uid,
      storeid,
    },
  });
  if (!AdminEmployeeInfo) {
    return false;
  }
  if (employeInfo.id === employeeId) {
    return false;
  }
  let ret = await models.Employee.update({
    position: adminPosInfo.uid,
  }, {
    where: {
      id: employeeId,
      storeid,
    },
  });
  if (!ret) {
    return false;
  }
  ret = await models.Employee.update({
    position: data.positon,
  }, {
    where: {
      id: AdminEmployeeInfo.id,
      storeid,
    },
  });
  return true;
};

export const positionDelete = async (data, storeid) => {
  $required('id', data.id);
  $required('name', data.name);
  const id = data.id;

  const ret = await models.Employee.count({ where: { position: id, storeid } });
  if (ret > 0) {
    return ERROR.employeePosition(' 职位已占用 ');
  }

  const retdata = await models.EmployeePosition.destroy({ where: { id, storeid } });
  if (!retdata) {
    return false;
  }
  return true;
};

export const positionQuery = async storeid => models.RoleMap.findAll({ where: { storeid, owner: 2 } });

export const queryEmployeeAndCoach = async (storeid) => {
  const result = [];
  const coachs = await models.Coach.findAll({ where: { storeid } });
  const employees = await models.Employee.findAll({ where: { storeid } });
  for (let i = 0; i < coachs.length; i += 1) {
    const item = coachs[i];
    result.push({
      name: item.name, id: `coach_${item.id}`, isCoach: true, cellphone: item.cellphone, pdmemberid: item.pdmemberid,
    });
  }

  for (let i = 0; i < employees.length; i += 1) {
    const item = employees[i];
    result.push({
      name: item.name, id: `employee_${item.id}`, isCoach: false, cellphone: item.cellphone, pdmemberid: item.pdmemberid,
    });
  }
  return result;
};

export const querySingleEmpAndCoach = async (uid, storeid) => {
  let name = '';
  let cellphone = '';
  let position = '';
  const ids = uid.split('_');
  if (ids.length > 0) {
    if (ids[0] === 'coach') {
      const id = ids[1];
      const coachInfo = await models.Coach.findOne({ where: { id, storeid } });
      if (coachInfo) {
        name = coachInfo.name;
        cellphone = coachInfo.cellphone;
        const coachPosition = await models.RoleMap.findOne({ where: { uid: coachInfo.position, storeid } });
        position = coachPosition && coachPosition.name;
      }
    } else if (ids[0] === 'employee') {
      const employeeInfo = await models.Employee.findOne({ where: { id: uid, storeid } });
      if (employeeInfo) {
        name = employeeInfo.name;
        cellphone = employeeInfo.cellphone;
        const employeePosition = await models.RoleMap.findOne({ where: { uid: employeeInfo.position, storeid } });
        position = employeePosition && employeePosition.name;
      }
    }
  } else {
    // 兼容旧数据
    const coachInfo = await models.Coach.findOne({ where: { id: uid, storeid } });
    if (coachInfo) {
      name = coachInfo.name;
      cellphone = coachInfo.cellphone;
      const coachPosition = await models.RoleMap.findOne({ where: { uid: coachInfo.position, storeid } });
      position = coachPosition && coachPosition.name;
    } else {
      const employeeInfo = await models.Employee.findOne({ where: { id: uid, storeid } });
      if (employeeInfo) {
        name = employeeInfo.name;
        cellphone = employeeInfo.cellphone;
        const employeePosition = await models.RoleMap.findOne({ where: { uid: employeeInfo.position, storeid } });
        position = employeePosition && employeePosition.name;
      }
    }
  }

  return {
    name,
    cellphone,
    position,
  };
};

export const querySingleEmpAndCoachWithPDmemberid = async (pdmemberid, stroeid) => {
  let name = '';
  let cellphone = '';
  let position = '';
  const coachInfo = await models.Coach.findOne({ where: { pdmemberid, stroeid } });
  if (coachInfo) {
    name = coachInfo.name;
    cellphone = coachInfo.cellphone;
    const coachPosition = await models.RoleMap.findOne({ where: { uid: coachInfo.position, stroeid } });
    position = coachPosition && coachPosition.name;
  } else {
    const employeeInfo = await models.Employee.findOne({ where: { pdmemberid, stroeid } });
    if (employeeInfo) {
      name = employeeInfo.name;
      cellphone = employeeInfo.cellphone;
      const employeePosition = await models.RoleMap.findOne({ where: { uid: employeeInfo.position, stroeid } });
      position = employeePosition && employeePosition.name;
    }
  }

  return {
    name,
    cellphone,
    position,
  };
};

